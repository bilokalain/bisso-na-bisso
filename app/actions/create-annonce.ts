"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { buildAnnonceSlug } from "@/lib/slug";
import { getModuleByKey, getSpec } from "@/lib/modules";
import {
  CATEGORIES_EVENEMENTIEL,
  MATIERES,
  MODALITES,
  NIVEAUX,
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

const typeField = z.string().min(1);

const evenementielSchema = z.object({
  ...baseShape,
  type: typeField,
  categorie: z
    .enum(CATEGORIES_EVENEMENTIEL.map((c) => c.value) as [string, ...string[]])
    .optional(),
});

const colisSchema = z.object({
  ...baseShape,
  type: typeField,
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
  type: typeField,
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

const standardSchema = z.object({
  ...baseShape,
  type: typeField,
});

function schemaFor(formProfile: string) {
  if (formProfile === "evenementiel") return evenementielSchema;
  if (formProfile === "colis") return colisSchema;
  if (formProfile === "repetiteur") return repetiteurSchema;
  return standardSchema;
}

export type CreateAnnonceState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export async function createAnnonce(
  _prevState: CreateAnnonceState,
  formData: FormData,
): Promise<CreateAnnonceState> {
  const typeRaw = formData.get("type");
  if (typeof typeRaw !== "string") {
    return { error: "Type d'annonce manquant." };
  }
  const spec = getSpec(typeRaw);
  if (!spec) {
    return { error: "Module inconnu." };
  }
  const module = await getModuleByKey(typeRaw);
  if (!module || module.status !== "ENABLED") {
    return {
      error:
        "Ce module n'accepte pas encore de publication. Reviens quand il sera activé.",
    };
  }

  const schema = schemaFor(spec.formProfile);
  const raw = Object.fromEntries(formData);
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const flat = z.flattenError(parsed.error);
    return {
      error: "Vérifie les champs marqués en rouge.",
      fieldErrors: flat.fieldErrors,
    };
  }

  const data = parsed.data as Record<string, unknown> & {
    type: string;
    titre: string;
    description: string;
    contactNom: string;
    contactTelephone: string;
    ville?: string;
    photo?: string;
    prix?: number;
    contactEmail?: string;
  };
  const type = data.type;
  const expiresAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);

  const profileExtras =
    spec.formProfile === "evenementiel"
      ? { categorie: data.categorie as string | undefined }
      : spec.formProfile === "colis"
        ? {
            villeDepart: data.villeDepart as string,
            villeArrivee: data.villeArrivee as string,
            dateVoyage: data.dateVoyage
              ? new Date(data.dateVoyage as string)
              : null,
            kgDispo: data.kgDispo as number | undefined,
            prixParKg: data.prixParKg as number | undefined,
          }
        : spec.formProfile === "repetiteur"
          ? {
              matiere: data.matiere as string | undefined,
              niveau: data.niveau as string | undefined,
              modalite: data.modalite as string | undefined,
            }
          : {};

  const created = await prisma.annonce.create({
    data: {
      type,
      titre: data.titre,
      description: data.description,
      ville: data.ville,
      photo: data.photo,
      prix: data.prix,
      contactNom: data.contactNom,
      contactTelephone: data.contactTelephone,
      contactEmail: data.contactEmail,
      ...profileExtras,
      slug: "__pending__",
      expiresAt,
    },
  });

  const slug = buildAnnonceSlug(data.titre, created.id);
  await prisma.annonce.update({ where: { id: created.id }, data: { slug } });

  revalidatePath(`/${type}`);
  redirect(`/${type}/${slug}?published=1`);
}
