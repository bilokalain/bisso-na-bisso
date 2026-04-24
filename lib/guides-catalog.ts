/**
 * Client-safe catalog of guide categories. No DB imports here so client
 * components can use the category list without pulling Prisma.
 */

import type { ModuleColor } from "@/lib/modules-catalog";

export type GuideCategory = {
  value: string;
  label: string;
  blurb: string;
  iconName: string;
  color: ModuleColor;
};

export const GUIDE_CATEGORIES: GuideCategory[] = [
  {
    value: "fiscalite",
    label: "Fiscalité",
    blurb: "Impôts, TVA, non-résidents.",
    iconName: "file-document",
    color: "graphite",
  },
  {
    value: "famille",
    label: "Famille",
    blurb: "Allocations, composition de ménage, famille nombreuse.",
    iconName: "baby",
    color: "rose",
  },
  {
    value: "logement",
    label: "Logement",
    blurb: "Premier achat, prêt, garantie locative, sous-location.",
    iconName: "home",
    color: "plum",
  },
  {
    value: "citoyennete",
    label: "Citoyenneté",
    blurb: "Nationalité, regroupement familial, titre de séjour.",
    iconName: "tag",
    color: "forest",
  },
  {
    value: "etudiant",
    label: "Études",
    blurb: "Bourses, kot, job étudiant, FOREM.",
    iconName: "book",
    color: "gold",
  },
  {
    value: "pratique",
    label: "Au quotidien",
    blurb: "Banque, mutuelle, transports, arrivée en Belgique.",
    iconName: "compass",
    color: "cobalt",
  },
];

export function guideCategoryLabel(value: string): string {
  return GUIDE_CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

export function guideCategory(value: string): GuideCategory | undefined {
  return GUIDE_CATEGORIES.find((c) => c.value === value);
}
