"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { buildAnnonceSlug } from "@/lib/slug";
import { GUIDE_CATEGORIES } from "@/lib/guides-catalog";

const guideSchema = z.object({
  title: z.string().trim().min(4, "Titre trop court.").max(160),
  tldr: z.string().trim().min(20, "TL;DR trop court (20 caractères min).").max(400),
  content: z
    .string()
    .trim()
    .min(80, "Contenu trop court (80 caractères min).")
    .max(40_000),
  category: z
    .enum(GUIDE_CATEGORIES.map((c) => c.value) as [string, ...string[]], {
      message: "Catégorie invalide.",
    }),
  heroImage: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? v : undefined))
    .pipe(z.string().url("URL invalide.").optional()),
  readingMinutes: z
    .string()
    .optional()
    .transform((v) => {
      if (!v) return 5;
      const n = Number(v);
      return Number.isFinite(n) && n > 0 ? Math.round(n) : 5;
    }),
  authorName: z
    .string()
    .trim()
    .max(80)
    .optional()
    .transform((v) => (v ? v : undefined)),
});

export type GuideFormState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export async function createGuide(
  _prev: GuideFormState,
  formData: FormData,
): Promise<GuideFormState> {
  await requireAdmin();
  const parsed = guideSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const flat = z.flattenError(parsed.error);
    return {
      error: "Vérifie les champs.",
      fieldErrors: flat.fieldErrors,
    };
  }
  const data = parsed.data;
  const created = await prisma.guide.create({
    data: {
      title: data.title,
      tldr: data.tldr,
      content: data.content,
      category: data.category,
      heroImage: data.heroImage ?? null,
      readingMinutes: data.readingMinutes,
      authorName: data.authorName ?? null,
      slug: "__pending__",
    },
  });
  await prisma.guide.update({
    where: { id: created.id },
    data: { slug: buildAnnonceSlug(data.title, created.id) },
  });
  revalidatePath("/admin/guides");
  revalidatePath("/infos-rapides");
  redirect("/admin/guides");
}

export async function updateGuide(
  id: string,
  _prev: GuideFormState,
  formData: FormData,
): Promise<GuideFormState> {
  await requireAdmin();
  const parsed = guideSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const flat = z.flattenError(parsed.error);
    return {
      error: "Vérifie les champs.",
      fieldErrors: flat.fieldErrors,
    };
  }
  const data = parsed.data;
  const existing = await prisma.guide.findUnique({ where: { id } });
  if (!existing) return { error: "Guide introuvable." };
  await prisma.guide.update({
    where: { id },
    data: {
      title: data.title,
      tldr: data.tldr,
      content: data.content,
      category: data.category,
      heroImage: data.heroImage ?? null,
      readingMinutes: data.readingMinutes,
      authorName: data.authorName ?? null,
    },
  });
  revalidatePath("/admin/guides");
  revalidatePath("/infos-rapides");
  if (existing.slug) revalidatePath(`/infos-rapides/${existing.slug}`);
  redirect("/admin/guides");
}

export async function setGuideStatus(
  id: string,
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED",
): Promise<void> {
  await requireAdmin();
  const existing = await prisma.guide.findUnique({ where: { id } });
  if (!existing) return;
  await prisma.guide.update({
    where: { id },
    data: {
      status,
      publishedAt:
        status === "PUBLISHED" && !existing.publishedAt
          ? new Date()
          : existing.publishedAt,
    },
  });
  revalidatePath("/admin/guides");
  revalidatePath("/infos-rapides");
  if (existing.slug) revalidatePath(`/infos-rapides/${existing.slug}`);
}

export async function markGuideReviewed(id: string): Promise<void> {
  await requireAdmin();
  await prisma.guide.update({
    where: { id },
    data: { lastReviewedAt: new Date() },
  });
  revalidatePath("/admin/guides");
  revalidatePath("/infos-rapides");
}

export async function deleteGuide(id: string): Promise<void> {
  await requireAdmin();
  const existing = await prisma.guide.findUnique({ where: { id } });
  if (!existing) return;
  await prisma.guide.delete({ where: { id } });
  revalidatePath("/admin/guides");
  revalidatePath("/infos-rapides");
  if (existing.slug) revalidatePath(`/infos-rapides/${existing.slug}`);
}
