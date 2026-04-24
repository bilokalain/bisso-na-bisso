import { prisma } from "@/lib/prisma";

export async function listPublishedGuides(category?: string) {
  return prisma.guide.findMany({
    where: {
      status: "PUBLISHED",
      ...(category ? { category } : {}),
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });
}

export async function getGuideBySlug(slug: string) {
  return prisma.guide.findUnique({ where: { slug } });
}

export async function listAllGuides() {
  return prisma.guide.findMany({
    orderBy: [{ updatedAt: "desc" }],
  });
}

export async function getGuideById(id: string) {
  return prisma.guide.findUnique({ where: { id } });
}

export type { Guide } from "@/generated/prisma/client";
