import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { AnnonceCard } from "@/components/annonce-card";
import { FiltersBar } from "@/components/filters-bar";
import { listAnnonces } from "@/lib/annonces";
import { getModuleByKey, COLOR_TOKEN } from "@/lib/modules";

type Props = {
  params: Promise<{ type: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params;
  const module = await getModuleByKey(type);
  if (!module || module.status === "DISABLED") return {};
  return {
    title: module.labelLong,
    description: module.tagline,
    openGraph: {
      title: `${module.labelLong} — Bisso na Bisso`,
      description: module.tagline,
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
  const module = await getModuleByKey(type);
  if (!module || module.status === "DISABLED") notFound();
  if (module.status === "COMING_SOON") redirect(`/bientot/${module.key}`);

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

  const tokens = COLOR_TOKEN[module.color];

  return (
    <>
      <section className="border-b border-sand">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
          <p
            className={`text-xs font-medium uppercase tracking-wider ${tokens.text}`}
          >
            {module.label}
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            {module.labelLong}
          </h1>
          <p className="mt-3 max-w-xl text-ink-muted">{module.tagline}</p>
        </div>
      </section>

      <FiltersBar formProfile={module.formProfile} />

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
                <AnnonceCard
                  key={a.id}
                  annonce={a}
                  module={{
                    key: module.key,
                    label: module.label,
                    color: module.color,
                    formProfile: module.formProfile,
                  }}
                />
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
