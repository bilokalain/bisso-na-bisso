import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AnnonceGallery } from "@/components/annonce-gallery";
import { ContactButtons } from "@/components/contact-buttons";
import { PublishedBanner } from "@/components/published-banner";
import { getAnnonceBySlug } from "@/lib/annonces";
import { COLOR_TOKEN, getModuleByKey } from "@/lib/modules";
import {
  CATEGORIES_EVENEMENTIEL,
  MATIERES,
  MODALITES,
  NIVEAUX,
  labelFor,
} from "@/lib/constants";

type Props = {
  params: Promise<{ type: string; slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type, slug } = await params;
  const module = await getModuleByKey(type);
  if (!module) return {};
  const annonce = await getAnnonceBySlug(slug);
  if (!annonce || annonce.type !== type) return {};

  const descExcerpt =
    annonce.description.length > 160
      ? `${annonce.description.slice(0, 157)}…`
      : annonce.description;
  const cover = annonce.photos[0];

  return {
    title: annonce.titre,
    description: descExcerpt,
    openGraph: {
      title: annonce.titre,
      description: descExcerpt,
      type: "article",
      images: cover ? [{ url: cover }] : undefined,
      siteName: "Bisso na Bisso",
      locale: "fr_BE",
    },
    twitter: {
      card: cover ? "summary_large_image" : "summary",
      title: `${annonce.titre} — ${module.labelLong}`,
      description: descExcerpt,
      images: cover ? [cover] : undefined,
    },
  };
}

export default async function AnnonceDetailPage({
  params,
  searchParams,
}: Props) {
  const { type, slug } = await params;
  const module = await getModuleByKey(type);
  if (!module) notFound();
  // Defensive: static routes for non-annonce modules (infos-rapides, ndumba)
  // take precedence, but 404 if someone lands here through a stale URL.
  if (module.contentType !== "annonce") notFound();
  const annonce = await getAnnonceBySlug(slug);
  if (!annonce || annonce.type !== type) notFound();

  const sp = await searchParams;
  const justPublished = sp.published === "1";
  const tokens = COLOR_TOKEN[module.color];
  const createdFmt = new Intl.DateTimeFormat("fr-BE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(annonce.createdAt);

  return (
    <article className="pb-28 sm:pb-12">
      <nav className="mx-auto max-w-4xl px-4 pt-5 text-sm text-ink-muted">
        <Link href="/" className="hover:text-ink">
          Accueil
        </Link>
        <span className="mx-2 opacity-40">/</span>
        <Link href={`/${type}`} className="hover:text-ink">
          {module.label}
        </Link>
      </nav>

      {justPublished ? (
        <PublishedBanner path={`/${type}/${slug}`} />
      ) : null}

      <header className="mx-auto mt-6 max-w-4xl px-4">
        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wider text-ivory ${tokens.bg}`}
        >
          {module.label}
        </span>
        <h1 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl md:text-6xl">
          {annonce.titre}
        </h1>
        <MetaRow annonce={annonce} formProfile={module.formProfile} />
      </header>

      {annonce.photos.length > 0 ? (
        <div className="mx-auto mt-8 max-w-4xl px-4">
          <AnnonceGallery photos={annonce.photos} alt={annonce.titre} />
        </div>
      ) : null}

      <section className="mx-auto mt-10 max-w-4xl px-4">
        <div className="prose prose-neutral max-w-none whitespace-pre-wrap font-sans text-lg leading-relaxed text-ink">
          {annonce.description}
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-4xl px-4">
        <div className="rounded-2xl border border-sand bg-ivory-deep p-6 sm:p-8">
          <p className="text-xs font-medium uppercase tracking-wider text-ink-muted">
            Contacter {annonce.contactNom}
          </p>
          <p className="mt-1 font-display text-2xl font-semibold tracking-tight">
            Réponse directe, sans intermédiaire.
          </p>
          <p className="mt-2 text-sm text-ink-muted">
            Mentionne Bisso na Bisso quand tu le contactes, ça aide la
            communauté.
          </p>
          <div className="mt-5 hidden sm:block">
            <ContactButtons
              titre={annonce.titre}
              telephone={annonce.contactTelephone}
              email={annonce.contactEmail}
            />
          </div>
        </div>
      </section>

      <footer className="mx-auto mt-8 max-w-4xl px-4 text-xs text-ink-muted">
        Publiée le {createdFmt}
      </footer>

      {/* Sticky mobile contact bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-sand bg-ivory/95 px-4 py-3 backdrop-blur safe-bottom sm:hidden">
        <ContactButtons
          titre={annonce.titre}
          telephone={annonce.contactTelephone}
          email={annonce.contactEmail}
        />
      </div>
    </article>
  );
}

function MetaRow({
  annonce,
  formProfile,
}: {
  annonce: NonNullable<Awaited<ReturnType<typeof getAnnonceBySlug>>>;
  formProfile: string;
}) {
  if (formProfile === "colis") {
    const d = annonce.dateVoyage
      ? new Intl.DateTimeFormat("fr-BE", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }).format(annonce.dateVoyage)
      : null;
    return (
      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-muted">
        <span className="inline-flex items-center gap-2 font-medium text-ink">
          {annonce.villeDepart}
          <Arrow />
          {annonce.villeArrivee}
        </span>
        {d && <span>Départ le {d}</span>}
        {annonce.kgDispo != null && (
          <span>{annonce.kgDispo} kg disponibles</span>
        )}
        {annonce.prixParKg != null && (
          <span className="font-medium text-ink">
            {annonce.prixParKg} €/kg
          </span>
        )}
      </div>
    );
  }

  if (formProfile === "repetiteur") {
    const matiere = labelFor(MATIERES, annonce.matiere);
    const niveau = labelFor(NIVEAUX, annonce.niveau);
    const modalite = labelFor(MODALITES, annonce.modalite);
    return (
      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-muted">
        {matiere && <span className="font-medium text-ink">{matiere}</span>}
        {niveau && <span>{niveau}</span>}
        {modalite && <span>{modalite}</span>}
        {annonce.ville && <span>{annonce.ville}</span>}
        {annonce.prix != null && (
          <span className="font-medium text-ink">{annonce.prix} €/h</span>
        )}
      </div>
    );
  }

  if (formProfile === "evenementiel") {
    const categorie = labelFor(CATEGORIES_EVENEMENTIEL, annonce.categorie);
    return (
      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-muted">
        {categorie && (
          <span className="font-medium text-ink">{categorie}</span>
        )}
        {annonce.ville && <span>{annonce.ville}</span>}
        {annonce.prix != null && (
          <span className="font-medium text-ink">
            à partir de {annonce.prix}{" "}
            {annonce.devise === "EUR" ? "€" : annonce.devise}
          </span>
        )}
      </div>
    );
  }

  // standard
  return (
    <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-muted">
      {annonce.ville && <span className="font-medium text-ink">{annonce.ville}</span>}
      {annonce.prix != null && (
        <span className="font-medium text-ink">
          {annonce.prix} {annonce.devise === "EUR" ? "€" : annonce.devise}
        </span>
      )}
    </div>
  );
}

function Arrow() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-ink-subtle"
      aria-hidden
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}
