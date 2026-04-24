import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideContent } from "@/components/guide-content";
import { ModuleIcon } from "@/components/module-icon";
import { getGuideBySlug } from "@/lib/guides";
import { guideCategory } from "@/lib/guides-catalog";
import { COLOR_TOKEN, getEnabledModules } from "@/lib/modules";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);
  if (!guide || guide.status !== "PUBLISHED") return {};
  const cat = guideCategory(guide.category);
  return {
    title: guide.title,
    description: guide.tldr,
    openGraph: {
      title: guide.title,
      description: guide.tldr,
      type: "article",
      images: guide.heroImage ? [{ url: guide.heroImage }] : undefined,
      siteName: "Bisso na Bisso",
      locale: "fr_BE",
      section: cat?.label,
    },
    twitter: {
      card: guide.heroImage ? "summary_large_image" : "summary",
      title: guide.title,
      description: guide.tldr,
      images: guide.heroImage ? [guide.heroImage] : undefined,
    },
  };
}

// Map of guide categories to the annonce modules most likely to help the
// reader finish the task. Used for the bottom cross-sell block.
const CATEGORY_TO_MODULES: Record<string, string[]> = {
  fiscalite: ["demarches", "repetiteur"],
  famille: ["demarches", "garde-enfants"],
  logement: ["logement", "petits-boulots", "demarches"],
  citoyennete: ["demarches"],
  etudiant: ["repetiteur", "logement", "petits-boulots"],
  pratique: ["demarches", "petits-boulots"],
};

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);
  if (!guide || guide.status !== "PUBLISHED") notFound();

  const category = guideCategory(guide.category);
  const tokens = category ? COLOR_TOKEN[category.color] : null;

  const relatedKeys = CATEGORY_TO_MODULES[guide.category] ?? [];
  const allEnabled = await getEnabledModules();
  const relatedModules = relatedKeys
    .map((k) => allEnabled.find((m) => m.key === k))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));

  const publishedDate = guide.publishedAt
    ? new Intl.DateTimeFormat("fr-BE", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(guide.publishedAt)
    : null;
  const reviewedDate = guide.lastReviewedAt
    ? new Intl.DateTimeFormat("fr-BE", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(guide.lastReviewedAt)
    : null;

  return (
    <article className="pb-16">
      <nav className="mx-auto max-w-3xl px-4 pt-5 text-sm text-ink-muted">
        <Link href="/" className="hover:text-ink">
          Accueil
        </Link>
        <span className="mx-2 opacity-40">/</span>
        <Link href="/infos-rapides" className="hover:text-ink">
          Infos rapides
        </Link>
        {category ? (
          <>
            <span className="mx-2 opacity-40">/</span>
            <Link
              href={`/infos-rapides?cat=${category.value}`}
              className="hover:text-ink"
            >
              {category.label}
            </Link>
          </>
        ) : null}
      </nav>

      <header className="mx-auto mt-6 max-w-3xl px-4">
        {category && tokens ? (
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wider text-ivory ${tokens.bg}`}
          >
            <ModuleIcon name={category.iconName} size={14} />
            {category.label}
          </span>
        ) : null}
        <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
          {guide.title}
        </h1>
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-muted">
          <span>{guide.readingMinutes} min de lecture</span>
          {guide.authorName ? <span>par {guide.authorName}</span> : null}
          {publishedDate ? <span>Publié le {publishedDate}</span> : null}
        </div>
      </header>

      {guide.heroImage ? (
        <div className="mx-auto mt-8 max-w-3xl px-4">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-sand">
            <Image
              src={guide.heroImage}
              alt={guide.title}
              fill
              priority
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      ) : null}

      <section className="mx-auto mt-10 max-w-3xl px-4">
        <div className="rounded-2xl border border-forest/20 bg-forest-soft p-5 sm:p-6">
          <p className="text-xs font-medium uppercase tracking-wider text-forest-deep">
            En 30 secondes
          </p>
          <p className="mt-2 text-base leading-relaxed text-ink sm:text-lg">
            {guide.tldr}
          </p>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-3xl px-4">
        <GuideContent markdown={guide.content} />
      </section>

      {relatedModules.length > 0 ? (
        <section className="mx-auto mt-14 max-w-3xl px-4">
          <div className="rounded-2xl border border-sand bg-ivory-deep p-6 sm:p-8">
            <p className="text-xs font-medium uppercase tracking-wider text-ink-muted">
              Besoin d'un humain ?
            </p>
            <p className="mt-2 font-display text-2xl font-semibold tracking-tight">
              Ces gens peuvent t'aider concrètement.
            </p>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {relatedModules.map((m) => {
                const mt = COLOR_TOKEN[m.color];
                return (
                  <Link
                    key={m.key}
                    href={`/${m.key}`}
                    className={`group flex items-center justify-between gap-3 rounded-xl p-4 transition hover:-translate-y-0.5 ${mt.soft}`}
                  >
                    <div className="min-w-0">
                      <p
                        className={`text-[10px] font-medium uppercase tracking-wider ${mt.text}`}
                      >
                        {m.label}
                      </p>
                      <p className="mt-0.5 truncate font-display text-base font-semibold tracking-tight text-ink">
                        {m.labelLong}
                      </p>
                      <p className="truncate text-xs text-ink-muted">
                        {m.tagline}
                      </p>
                    </div>
                    <span className={`${mt.text} transition group-hover:translate-x-1`}>
                      →
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      <footer className="mx-auto mt-10 max-w-3xl px-4 text-xs text-ink-muted">
        {reviewedDate ? (
          <p>Dernière vérification : {reviewedDate}.</p>
        ) : publishedDate ? (
          <p>Publié le {publishedDate}.</p>
        ) : null}
        <p className="mt-1">
          Une info est fausse ou obsolète ?{" "}
          <Link href="/infos-rapides" className="underline hover:text-ink">
            Dis-le nous
          </Link>
          .
        </p>
      </footer>
    </article>
  );
}
