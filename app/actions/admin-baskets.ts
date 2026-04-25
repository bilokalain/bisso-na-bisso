"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { buildAnnonceSlug } from "@/lib/slug";

/**
 * Items are entered as a textarea — one item per line, in the format
 * "quantity | name". Empty lines are ignored. This keeps the form
 * server-rendered with no client component for row management.
 */
function parseItems(raw: string): { name: string; quantity: string }[] {
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [qty, ...rest] = line.split(/\s*\|\s*/);
      const name = rest.join(" | ").trim();
      if (!qty || !name) return null;
      return { name, quantity: qty.trim() };
    })
    .filter((x): x is { name: string; quantity: string } => x !== null)
    .slice(0, 30); // hard cap
}

const baseSchema = z.object({
  name: z.string().trim().min(2, "Nom trop court.").max(80),
  tagline: z.string().trim().min(8, "Tagline trop courte.").max(200),
  heroImage: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? v : undefined))
    .pipe(z.string().url("URL invalide.").optional()),
  destination: z
    .string()
    .trim()
    .min(2, "Destination requise.")
    .max(40),
  priceEUR: z
    .string()
    .min(1, "Prix requis.")
    .transform((v) => {
      const cleaned = v.replace(",", ".");
      const n = Number(cleaned);
      return Number.isFinite(n) ? Math.round(n * 100) : NaN;
    })
    .refine((n) => Number.isFinite(n) && n > 0, "Prix invalide."),
  active: z
    .union([z.literal("on"), z.literal("true"), z.literal("")])
    .optional()
    .transform((v) => v === "on" || v === "true"),
  order: z
    .string()
    .optional()
    .transform((v) => {
      if (!v) return 999;
      const n = Number(v);
      return Number.isFinite(n) ? Math.round(n) : 999;
    }),
  itemsRaw: z.string().max(2000).optional(),
});

export type BasketFormState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export async function createBasket(
  _prev: BasketFormState,
  formData: FormData,
): Promise<BasketFormState> {
  await requireAdmin();
  const parsed = baseSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      error: "Vérifie les champs.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }
  const data = parsed.data;
  const items = parseItems(data.itemsRaw ?? "");

  const created = await prisma.basket.create({
    data: {
      slug: "__pending__",
      name: data.name,
      tagline: data.tagline,
      heroImage: data.heroImage ?? null,
      destination: data.destination,
      priceEUR: data.priceEUR,
      active: data.active,
      order: data.order,
      items: {
        create: items.map((it, i) => ({
          name: it.name,
          quantity: it.quantity,
          order: i,
        })),
      },
    },
  });
  await prisma.basket.update({
    where: { id: created.id },
    data: { slug: buildAnnonceSlug(data.name, created.id) },
  });

  revalidatePath("/admin/paniers");
  revalidatePath("/colis-alimentaires");
  redirect("/admin/paniers");
}

export async function updateBasket(
  id: string,
  _prev: BasketFormState,
  formData: FormData,
): Promise<BasketFormState> {
  await requireAdmin();
  const parsed = baseSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      error: "Vérifie les champs.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }
  const data = parsed.data;
  const items = parseItems(data.itemsRaw ?? "");

  const existing = await prisma.basket.findUnique({ where: { id } });
  if (!existing) return { error: "Panier introuvable." };

  await prisma.$transaction([
    prisma.basketItem.deleteMany({ where: { basketId: id } }),
    prisma.basket.update({
      where: { id },
      data: {
        name: data.name,
        tagline: data.tagline,
        heroImage: data.heroImage ?? null,
        destination: data.destination,
        priceEUR: data.priceEUR,
        active: data.active,
        order: data.order,
        items: {
          create: items.map((it, i) => ({
            name: it.name,
            quantity: it.quantity,
            order: i,
          })),
        },
      },
    }),
  ]);

  revalidatePath("/admin/paniers");
  revalidatePath("/colis-alimentaires");
  if (existing.slug) revalidatePath(`/colis-alimentaires/${existing.slug}`);
  redirect("/admin/paniers");
}

export async function toggleBasketActive(id: string): Promise<void> {
  await requireAdmin();
  const existing = await prisma.basket.findUnique({ where: { id } });
  if (!existing) return;
  await prisma.basket.update({
    where: { id },
    data: { active: !existing.active },
  });
  revalidatePath("/admin/paniers");
  revalidatePath("/colis-alimentaires");
}

export async function deleteBasket(id: string): Promise<void> {
  await requireAdmin();
  const orderCount = await prisma.order.count({ where: { basketId: id } });
  if (orderCount > 0) {
    // Silently refuse — admin keeps the row, must use "Désactiver".
    // Detail page already explains this constraint via the helper text.
    return;
  }
  await prisma.basket.delete({ where: { id } });
  revalidatePath("/admin/paniers");
}
