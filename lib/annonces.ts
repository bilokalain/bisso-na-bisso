import { prisma } from "@/lib/prisma";

export type AnnoncesListFilters = {
  ville?: string;
  // evenementiel
  categorie?: string;
  // colis
  villeDepart?: string;
  villeArrivee?: string;
  // repetiteur
  matiere?: string;
  niveau?: string;
  modalite?: string;
};

function ci(value: string | undefined) {
  return value?.trim() ? { contains: value.trim() } : undefined;
}

export async function listAnnonces(
  type: string,
  filters: AnnoncesListFilters = {},
) {
  return prisma.annonce.findMany({
    where: {
      type,
      status: "ACTIVE",
      expiresAt: { gt: new Date() },
      ville: ci(filters.ville),
      ...(type === "evenementiel" && filters.categorie
        ? { categorie: filters.categorie }
        : {}),
      ...(type === "colis"
        ? {
            villeDepart: ci(filters.villeDepart),
            villeArrivee: ci(filters.villeArrivee),
          }
        : {}),
      ...(type === "repetiteur"
        ? {
            matiere: filters.matiere || undefined,
            niveau: filters.niveau || undefined,
            modalite: filters.modalite || undefined,
          }
        : {}),
    },
    orderBy: [{ createdAt: "desc" }],
  });
}

export async function getAnnonceBySlug(slug: string) {
  return prisma.annonce.findUnique({ where: { slug } });
}

export type { Annonce } from "@/generated/prisma/client";
