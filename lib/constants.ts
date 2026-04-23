export const ANNONCE_TYPES = ["evenementiel", "colis", "repetiteur"] as const;
export type AnnonceType = (typeof ANNONCE_TYPES)[number];

export function isAnnonceType(v: string): v is AnnonceType {
  return (ANNONCE_TYPES as readonly string[]).includes(v);
}

export const VERTICALES: Record<
  AnnonceType,
  {
    label: string;
    labelLong: string;
    tagline: string;
    eyebrow: string;
    /** Tailwind bg token for accent surfaces. */
    accentBg: string;
    /** Tailwind text token for accent (on ivory). */
    accentText: string;
  }
> = {
  evenementiel: {
    label: "Événementiel",
    labelLong: "Événementiel",
    tagline: "Prestataires pour fêtes, mariages, anniversaires.",
    eyebrow: "Événementiel",
    accentBg: "bg-forest",
    accentText: "text-forest",
  },
  colis: {
    label: "Colis",
    labelLong: "Co-transport de colis",
    tagline: "Bagage partagé entre voyageurs, corridors diaspora.",
    eyebrow: "Colis",
    accentBg: "bg-terracotta",
    accentText: "text-terracotta",
  },
  repetiteur: {
    label: "Répétiteurs",
    labelLong: "Profs particuliers",
    tagline: "Cours particuliers, primaire au supérieur.",
    eyebrow: "Répétiteurs",
    accentBg: "bg-gold",
    accentText: "text-gold",
  },
};

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
