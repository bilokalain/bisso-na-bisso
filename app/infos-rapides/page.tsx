import Link from "next/link";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ModuleIcon } from "@/components/module-icon";
import { listPublishedGuides } from "@/lib/guides";
import { COLOR_TOKEN, getModuleByKey } from "@/lib/modules";
import {
  GUIDE_CATEGORIES,
  guideCategory,
  type GuideCategory,
} from "@/lib/guides-catalog";

export const metadata: Metadata = {
  title: "Infos rapides — démarches expliquées clairement",
  description:
    "Fiscalité, allocations, premier achat, nationalité, études. Des guides clairs, sans jargon, écrits pour la diaspora en Belgique.",
};

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function InfosRapidesIndex({ searchParams }: Props) {
  const module = await getModuleByKey("infos-rapides");
  if (!module || module.status === "DISABLED") notFound();
  if (module.status === "COMING_SOON") redirect(`/bientot/${module.key}`);

  const sp = await searchParams;
  const cat =
    typeof sp.cat === "string" && GUIDE_CATEGORIES.some((c) => c.value === sp.cat)
      ? sp.cat
      : undefined;

  const guides = await listPublishedGuides(cat);
  const active = cat ? guideCategory(cat) : undefined;
  const tokens = COLOR_TOKEN[module.color];

  return (
    <>
      <section className="relative overflow-hidden border-b border-sand">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse at top, var(--color-cobalt-soft) 0%, transparent 60%)",
          }}
        />
        <div className="mx-auto max-w-5xl px-4 py-14 sm:py-20">
          <span
            className={`inline-flex items-center gap-2 rounded-full border border-ink/10 bg-ivory px-3 py-1 text-xs font-medium uppercase tracking-wider ${tokens.text}`}
          >
            <ModuleIcon name="compass" size={14} />
            Infos rapides
          </span>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            Les démarches,{" "}
            <span className={`italic ${tokens.text}`}>expliquées clairement.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-muted">
            Fiscalité, allocations, premier achat, nationalité, études. Écrits
            par des membres de la communauté, sans jargon, relus régulièrement.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
        <p className="text-xs font-medium uppercase tracking-wider text-ink-muted">
          Par thème
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <CategoryChip active={!cat} href="/infos-rapides" label="Tout" />
          {GUIDE_CATEGORIES.map((c) => (
            <CategoryChip
              key={c.value}
              active={cat === c.value}
              href={`/infos-rapides?cat=${c.value}`}
              label={c.label}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16">
        {active ? (
          <header className="mb-6">
            <p
              className={`text-xs font-medium uppercase tracking-wider ${COLOR_TOKEN[active.color].text}`}
            >
              {active.label}
            </p>
            <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              {active.blurb}
            </h2>
          </header>
        ) : null}

        {guides.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {guides.map((g) => {
              const category = guideCategory(g.category);
              return (
                <GuideCard
                  key={g.id}
                  slug={g.slug}
                  title={g.title}
                  tldr={g.tldr}
                  readingMinutes={g.readingMinutes}
                  category={category}
                />
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}

function CategoryChip({
  active,
  href,
  label,
}: {
  active: boolean;
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center rounded-full border px-4 py-1.5 text-sm transition ${
        active
          ? "border-ink bg-ink text-ivory"
          : "border-sand bg-ivory text-ink-muted hover:border-ink/20 hover:text-ink"
      }`}
    >
      {label}
    </Link>
  );
}

function GuideCard({
  slug,
  title,
  tldr,
  readingMinutes,
  category,
}: {
  slug: string;
  title: string;
  tldr: string;
  readingMinutes: number;
  category?: GuideCategory;
}) {
  const tokens = category ? COLOR_TOKEN[category.color] : null;

  return (
    <Link
      href={`/infos-rapides/${slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-sand bg-ivory p-5 transition hover:-translate-y-0.5 hover:shadow-card sm:p-6"
    >
      {category && tokens ? (
        <div className={`mb-4 ${tokens.text}`}>
          <ModuleIcon name={category.iconName} size={28} />
        </div>
      ) : null}
      <p
        className={`text-xs font-medium uppercase tracking-wider ${tokens?.text ?? "text-ink-muted"}`}
      >
        {category?.label ?? "Guide"}
      </p>
      <h3 className="mt-2 font-display text-xl font-semibold leading-snug tracking-tight text-ink">
        {title}
      </h3>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-muted">
        {tldr}
      </p>
      <p className="mt-4 text-xs text-ink-muted">
        {readingMinutes} min de lecture
      </p>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-sand bg-ivory-deep/50 px-6 py-16 text-center">
      <p className="font-display text-xl font-semibold">Aucun guide ici</p>
      <p className="max-w-md text-sm text-ink-muted">
        On en écrit en ce moment. Reviens dans quelques jours, ou choisis un
        autre thème.
      </p>
    </div>
  );
}
