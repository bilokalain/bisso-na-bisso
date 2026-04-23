export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function buildAnnonceSlug(titre: string, id: string): string {
  const base = slugify(titre) || "annonce";
  return `${base}-${id.slice(-6)}`;
}
