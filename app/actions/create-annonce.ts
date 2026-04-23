"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { buildAnnonceSlug } from "@/lib/slug";
import {
  CATEGORIES_EVENEMENTIEL,
  MATIERES,
  MODALITES,
  NIVEAUX,
  isAnnonceType,
} from "@/lib/constants";

const optionalString = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : undefined));

const optionalNumber = z
  .string()
  .optional()
  .transform((v) => {
    if (!v || !v.trim()) return undefined;
    const n = Number(v.replace(",", "."));
    return Number.isFinite(n) ? n : undefined;
  });

const baseShape = {
  titre: z
    .string()
    .trim()
    .min(6, "Minimum 6 caractères.")
    .max(120, "Maximum 120 caractères."),
  description: z
    .string()
    .trim()
    .min(20, "Décris un peu plus (20 caractères min).")
    .max(2000, "Maximum 2000 caractères."),
  ville: optionalString(60),
  photo: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? v : undefined))
    .pipe(z.string().url("URL de photo invalide.").optional()),
  prix: optionalNumber,
  contactNom: z
    .string()
    .trim()
    .min(2, "Ton nom stp.")
    .max(80, "Trop long."),
  contactTelephone: z
    .string()
    .trim()
    .min(6, "Numéro invalide.")
    .max(30, "Numéro invalide.")
    .refine((v) => /[\d+]/.test(v), "Numéro invalide."),
  contactEmail: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? v : undefined))
    .pipe(z.string().email("E-mail invalide.").optional()),
};

const evenementielSchema = z.object({
  ...baseShape,
  type: z.literal("evenementiel"),
  categorie: z
    .enum(CATEGORIES_EVENEMENTIEL.map((c) => c.value) as [string, ...string[]])
    .optional(),
});

const colisSchema = z.object({
  ...baseShape,
  type: z.literal("colis"),
  villeDepart: z
    .string()
    .trim()
    .min(2, "Ville de départ requise.")
    .max(60),
  villeArrivee: z
    .string()
    .trim()
    .min(2, "Ville d'arrivée requise.")
    .max(60),
  dateVoyage: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? v : undefined))
    .pipe(
      z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Date invalide (AAAA-MM-JJ).")
        .optional(),
    ),
  kgDispo: optionalNumber,
  prixParKg: optionalNumber,
});

const repetiteurSchema = z.object({
  ...baseShape,
  type: z.literal("repetiteur"),
  matiere: z
    .enum(MATIERES.map((m) => m.value) as [string, ...string[]])
    .optional(),
  niveau: z
    .enum(NIVEAUX.map((n) => n.value) as [string, ...string[]])
    .optional(),
  modalite: z
    .enum(MODALITES.map((m) => m.value) as [string, ...string[]])
    .optional(),
});

const schema = z.discriminatedUnion("type", [
  evenementielSchema,
  colisSchema,
  repetiteurSchema,
]);

export type CreateAnnonceState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export async function createAnnonce(
  _prevState: CreateAnnonceState,
  formData: FormData,
): Promise<CreateAnnonceState> {
  const type = formData.get("type");
  if (typeof type !== "string" || !isAnnonceType(type)) {
    return { error: "Type d'annonce inconnu." };
  }

  const raw = Object.fromEntries(formData);
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const flat = z.flattenError(parsed.error);
    return {
      error: "Vérifie les champs marqués en rouge.",
      fieldErrors: flat.fieldErrors,
    };
  }

  const data = parsed.data;
  const expiresAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);

  const created = await prisma.annonce.create({
    data: {
      type: data.type,
      titre: data.titre,
      description: data.description,
      ville: data.ville,
      photo: data.photo,
      prix: data.prix,
      contactNom: data.contactNom,
      contactTelephone: data.contactTelephone,
      contactEmail: data.contactEmail,
      ...(data.type === "evenementiel"
        ? { categorie: data.categorie }
        : {}),
      ...(data.type === "colis"
        ? {
            villeDepart: data.villeDepart,
            villeArrivee: data.villeArrivee,
            dateVoyage: data.dateVoyage ? new Date(data.dateVoyage) : null,
            kgDispo: data.kgDispo,
            prixParKg: data.prixParKg,
          }
        : {}),
      ...(data.type === "repetiteur"
        ? {
            matiere: data.matiere,
            niveau: data.niveau,
            modalite: data.modalite,
          }
        : {}),
      slug: "__pending__",
      expiresAt,
    },
  });

  const slug = buildAnnonceSlug(data.titre, created.id);
  await prisma.annonce.update({ where: { id: created.id }, data: { slug } });

  revalidatePath(`/${data.type}`);
  redirect(`/${data.type}/${slug}?published=1`);
}
