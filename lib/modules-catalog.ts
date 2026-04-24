/**
 * Client-safe catalog: types, color tokens, and static specs. No DB access,
 * no Prisma, so this file can be imported from client components without
 * dragging Node-only code into the browser bundle.
 */

export type ModuleColor =
  | "forest"
  | "terracotta"
  | "gold"
  | "cobalt"
  | "plum"
  | "rose"
  | "sky"
  | "clay"
  | "graphite";

export type ModuleFormProfile =
  | "standard"
  | "evenementiel"
  | "colis"
  | "repetiteur";

export type ModuleStatus = "ENABLED" | "COMING_SOON" | "DISABLED";

/**
 * What kind of content a module holds. "annonce" = user-published ads that
 * expire. "guide" = admin-curated, evergreen editorial pieces (Infos rapides).
 */
export type ModuleContentType = "annonce" | "guide" | "basket";

export type ModuleSpec = {
  key: string;
  label: string;
  labelLong: string;
  tagline: string;
  description: string;
  color: ModuleColor;
  iconName: string;
  formProfile: ModuleFormProfile;
  contentType: ModuleContentType;
  defaultStatus: ModuleStatus;
  defaultOrder: number;
};

export type ModuleWithState = ModuleSpec & {
  id: string;
  status: ModuleStatus;
  order: number;
};

export const MODULE_CATALOG: ModuleSpec[] = [
  {
    key: "infos-rapides",
    label: "Infos rapides",
    labelLong: "Infos rapides",
    tagline: "Les démarches, expliquées clairement.",
    description:
      "Fiscalité, allocations, premier achat, nationalité, études — des guides écrits par des membres de la communauté, sans jargon, à jour.",
    color: "cobalt",
    iconName: "compass",
    formProfile: "standard",
    contentType: "guide",
    defaultStatus: "ENABLED",
    defaultOrder: 5,
  },
  {
    key: "ndumba",
    label: "Ndumba",
    labelLong: "Ndumba — paniers pour Kinshasa",
    tagline: "Envoie un panier de denrées à ta famille. Livré chez elle.",
    description:
      "Tu choisis un panier, tu paies ici, on livre à Kinshasa. Photo + vidéo de ta famille qui le reçoit. Ton message personnel lu à la livraison.",
    color: "terracotta",
    iconName: "basket",
    formProfile: "standard",
    contentType: "basket",
    defaultStatus: "ENABLED",
    defaultOrder: 15,
  },
  {
    key: "evenementiel",
    label: "Événementiel",
    labelLong: "Événementiel",
    tagline: "Prestataires pour fêtes, mariages, anniversaires.",
    description:
      "Coiffure, traiteur, DJ, photo, vidéo, déco, salle, brasseur. De la préparation jusqu'à la fin de la soirée.",
    color: "forest",
    iconName: "party",
    formProfile: "evenementiel",
    contentType: "annonce",
    defaultStatus: "ENABLED",
    defaultOrder: 10,
  },
  {
    key: "restauration",
    label: "Restauration",
    labelLong: "Restauration & plats du jour",
    tagline: "Plats africains cuisinés maison, à emporter ou livrés.",
    description:
      "Mamans cuisinières, cantines de quartier, chefs freelances. Commande au plat ou à la semaine.",
    color: "clay",
    iconName: "utensils",
    formProfile: "standard",
    contentType: "annonce",
    defaultStatus: "ENABLED",
    defaultOrder: 20,
  },
  {
    key: "colis",
    label: "Colis",
    labelLong: "Co-transport de colis",
    tagline: "Bagage partagé entre voyageurs, corridors diaspora.",
    description:
      "Bruxelles, Paris, Kinshasa, Brazzaville, Douala, Libreville. Kilos disponibles, prix au kilo, date du vol.",
    color: "terracotta",
    iconName: "plane",
    formProfile: "colis",
    contentType: "annonce",
    defaultStatus: "ENABLED",
    defaultOrder: 30,
  },
  {
    key: "repetiteur",
    label: "Répétiteurs",
    labelLong: "Profs particuliers",
    tagline: "Cours particuliers, primaire au supérieur.",
    description:
      "Maths, français, néerlandais, anglais, chimie, physique. En ligne ou chez toi.",
    color: "gold",
    iconName: "book",
    formProfile: "repetiteur",
    contentType: "annonce",
    defaultStatus: "ENABLED",
    defaultOrder: 40,
  },
  {
    key: "petits-boulots",
    label: "Petits boulots",
    labelLong: "Petits boulots & services",
    tagline: "Plomberie, électricité, déménagement, ménage.",
    description:
      "Trouve quelqu'un de la communauté pour un coup de main ponctuel ou régulier. Tarifs clairs, pas d'intermédiaire.",
    color: "cobalt",
    iconName: "wrench",
    formProfile: "standard",
    contentType: "annonce",
    defaultStatus: "ENABLED",
    defaultOrder: 50,
  },
  {
    key: "logement",
    label: "Logement",
    labelLong: "Logement & sous-location",
    tagline: "Kots étudiants, colocs, sous-loc temporaires.",
    description:
      "Entre membres de la diaspora, en confiance. Pour un mois, un semestre ou plus.",
    color: "plum",
    iconName: "home",
    formProfile: "standard",
    contentType: "annonce",
    defaultStatus: "COMING_SOON",
    defaultOrder: 60,
  },
  {
    key: "beaute",
    label: "Beauté",
    labelLong: "Beauté & bien-être",
    tagline: "Onglerie, massage, esthétique à domicile.",
    description:
      "Prothésistes ongulaires, masseuses, esthéticiennes qui viennent chez toi ou te reçoivent en institut.",
    color: "rose",
    iconName: "sparkles",
    formProfile: "standard",
    contentType: "annonce",
    defaultStatus: "COMING_SOON",
    defaultOrder: 70,
  },
  {
    key: "garde-enfants",
    label: "Garde d'enfants",
    labelLong: "Garde d'enfants",
    tagline: "Babysitting, sortie d'école, garde week-end.",
    description:
      "Des tatas et grandes sœurs de confiance, recommandées par la communauté, qui connaissent les codes.",
    color: "sky",
    iconName: "baby",
    formProfile: "standard",
    contentType: "annonce",
    defaultStatus: "COMING_SOON",
    defaultOrder: 80,
  },
  {
    key: "demarches",
    label: "Démarches",
    labelLong: "Démarches administratives",
    tagline: "Accompagnement banque, mutuelle, FOREM, papiers.",
    description:
      "Remplir un dossier, préparer un rendez-vous, traduire un courrier. Par quelqu'un qui parle ta langue.",
    color: "graphite",
    iconName: "file-document",
    formProfile: "standard",
    contentType: "annonce",
    defaultStatus: "COMING_SOON",
    defaultOrder: 90,
  },
  {
    key: "cultes",
    label: "Cultes",
    labelLong: "Cultes & spiritualité",
    tagline: "Annonces de cultes, retraites, événements paroissiaux.",
    description:
      "Cultes, veillées, retraites, rencontres bibliques. Partage les infos de ton église ou communauté.",
    color: "gold",
    iconName: "church",
    formProfile: "standard",
    contentType: "annonce",
    defaultStatus: "COMING_SOON",
    defaultOrder: 100,
  },
  {
    key: "occasion",
    label: "Occasion",
    labelLong: "Vente d'occasion",
    tagline: "Meubles, électroménager, voitures, matériel.",
    description:
      "Du bon entre membres de la communauté — sans frais de plateforme ni gros intermédiaires.",
    color: "graphite",
    iconName: "tag",
    formProfile: "standard",
    contentType: "annonce",
    defaultStatus: "DISABLED",
    defaultOrder: 110,
  },
  {
    key: "emploi",
    label: "Emploi",
    labelLong: "Emploi",
    tagline: "Missions, petits boulots, opportunities.",
    description:
      "Des offres partagées entre nous, sans passer par les gros réseaux. Activé plus tard, après modération solide.",
    color: "plum",
    iconName: "briefcase",
    formProfile: "standard",
    contentType: "annonce",
    defaultStatus: "DISABLED",
    defaultOrder: 120,
  },
];

export function getSpec(key: string): ModuleSpec | undefined {
  return MODULE_CATALOG.find((m) => m.key === key);
}

export function isValidModuleKey(key: string): boolean {
  return MODULE_CATALOG.some((m) => m.key === key);
}

export const COLOR_TOKEN: Record<
  ModuleColor,
  { bg: string; text: string; soft: string; border: string }
> = {
  forest: {
    bg: "bg-forest",
    text: "text-forest",
    soft: "bg-forest-soft",
    border: "border-forest/30",
  },
  terracotta: {
    bg: "bg-terracotta",
    text: "text-terracotta",
    soft: "bg-terracotta-soft",
    border: "border-terracotta/30",
  },
  gold: {
    bg: "bg-gold",
    text: "text-gold",
    soft: "bg-gold-soft",
    border: "border-gold/30",
  },
  cobalt: {
    bg: "bg-cobalt",
    text: "text-cobalt",
    soft: "bg-cobalt-soft",
    border: "border-cobalt/30",
  },
  plum: {
    bg: "bg-plum",
    text: "text-plum",
    soft: "bg-plum-soft",
    border: "border-plum/30",
  },
  rose: {
    bg: "bg-rose",
    text: "text-rose",
    soft: "bg-rose-soft",
    border: "border-rose/30",
  },
  sky: {
    bg: "bg-sky",
    text: "text-sky",
    soft: "bg-sky-soft",
    border: "border-sky/30",
  },
  clay: {
    bg: "bg-clay",
    text: "text-clay",
    soft: "bg-clay-soft",
    border: "border-clay/30",
  },
  graphite: {
    bg: "bg-graphite",
    text: "text-graphite",
    soft: "bg-graphite-soft",
    border: "border-graphite/30",
  },
};
