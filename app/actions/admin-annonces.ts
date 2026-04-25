"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

const ALLOWED_STATUSES = ["ACTIVE", "ARCHIVED", "REJECTED"] as const;
type AnnonceStatus = (typeof ALLOWED_STATUSES)[number];

export async function setAnnonceStatus(
  id: string,
  status: AnnonceStatus,
): Promise<void> {
  await requireAdmin();
  if (!ALLOWED_STATUSES.includes(status)) return;
  const existing = await prisma.annonce.findUnique({ where: { id } });
  if (!existing) return;
  await prisma.annonce.update({ where: { id }, data: { status } });
  revalidatePath("/admin/annonces");
  revalidatePath("/");
  revalidatePath(`/${existing.type}`);
  if (existing.slug) revalidatePath(`/${existing.type}/${existing.slug}`);
}

export async function deleteAnnonce(id: string): Promise<void> {
  await requireAdmin();
  const existing = await prisma.annonce.findUnique({ where: { id } });
  if (!existing) return;
  await prisma.annonce.delete({ where: { id } });
  revalidatePath("/admin/annonces");
  revalidatePath(`/${existing.type}`);
}
