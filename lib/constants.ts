/**
 * Field-level configs reused across modules. Module identity, colors and
 * status live in lib/modules.ts — this file is only for the option lists
 * that feed dropdowns and label lookups.
 */

export const CATEGORIES_EVENEMENTIEL = [
  { value: "coiffure", label: "Coiffure" },
  { value: "traiteur", label: "Traiteur" },
  { value: "dj", label: "DJ" },
  { value: "photo", label: "Photographe" },
  { value: "video", label: "Vidéaste" },
  { value: "decoration", label: "Décoration" },
  { value: "salle", label: "Salle" },
  { value: "brasseur", label: "Brasseur" },
  { value: "autre", label: "Autre" },
] as const;

export const MATIERES = [
  { value: "maths", label: "Mathématiques" },
  { value: "francais", label: "Français" },
  { value: "neerlandais", label: "Néerlandais" },
  { value: "anglais", label: "Anglais" },
  { value: "chimie", label: "Chimie" },
  { value: "physique", label: "Physique" },
  { value: "autre", label: "Autre" },
] as const;

export const NIVEAUX = [
  { value: "primaire", label: "Primaire" },
  { value: "secondaire", label: "Secondaire" },
  { value: "superieur", label: "Supérieur" },
] as const;

export const MODALITES = [
  { value: "en_ligne", label: "En ligne" },
  { value: "presentiel", label: "Présentiel" },
  { value: "les_deux", label: "Les deux" },
] as const;

export const VILLES_SUGGEREES = [
  "Bruxelles",
  "Liège",
  "Anvers",
  "Gand",
  "Charleroi",
  "Namur",
  "Mons",
  "Louvain",
  "Paris",
  "Kinshasa",
  "Brazzaville",
];

export function labelFor(
  list: readonly { value: string; label: string }[],
  value: string | null | undefined,
): string | null {
  if (!value) return null;
  return list.find((i) => i.value === value)?.label ?? value;
}
