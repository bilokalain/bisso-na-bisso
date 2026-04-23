import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AnnonceCard } from "@/components/annonce-card";
import { FiltersBar } from "@/components/filters-bar";
import { listAnnonces } from "@/lib/annonces";
import { VERTICALES, isAnnonceType } from "@/lib/constants";

type Props = {
  params: Promise<{ type: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params;
  if (!isAnnonceType(type)) return {};
  const v = VERTICALES[type];
  return {
    title: v.labelLong,
    description: v.tagline,
    openGraph: {
      title: `${v.labelLong} — Bisso na Bisso`,
      description: v.tagline,
    },
  };
}

function pick(
  sp: Record<string, string | string[] | undefined>,
  key: string,
): string | undefined {
  const v = sp[key];
  return typeof v === "string" ? v : undefined;
}

export default async function ListingPage({ params, searchParams }: Props) {
  const { type } = await params;
  if (!isAnnonceType(type)) notFound();
  const sp = await searchParams;

  const annonces = await listAnnonces(type, {
    ville: pick(sp, "ville"),
    categorie: pick(sp, "categorie"),
    villeDepart: pick(sp, "depart"),
    villeArrivee: pick(sp, "arrivee"),
    matiere: pick(sp, "matiere"),
    niveau: pick(sp, "niveau"),
    modalite: pick(sp, "modalite"),
  });

  const v = VERTICALES[type];

  return (
    <>
      <section className="border-b border-sand">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
          <p
            className={`text-xs font-medium uppercase tracking-wider ${v.accentText}`}
          >
            {v.eyebrow}
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            {v.labelLong}
          </h1>
          <p className="mt-3 max-w-xl text-ink-muted">{v.tagline}</p>
        </div>
      </section>

      <FiltersBar type={type} />

      <section className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
        {annonces.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <p className="mb-6 text-sm text-ink-muted">
              {annonces.length} annonce{annonces.length > 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {annonces.map((a) => (
                <AnnonceCard key={a.id} annonce={a} />
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-sand bg-ivory-deep/50 px-6 py-16 text-center">
      <p className="font-display text-xl font-semibold">Rien ne correspond</p>
      <p className="max-w-md text-sm text-ink-muted">
        Essaie de lever un filtre, ou reviens bientôt — la communauté publie
        tous les jours.
      </p>
    </div>
  );
}
