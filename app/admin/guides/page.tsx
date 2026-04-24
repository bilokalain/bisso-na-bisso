import Link from "next/link";
import type { Metadata } from "next";
import {
  deleteGuide,
  markGuideReviewed,
  setGuideStatus,
} from "@/app/actions/admin-guides";
import { requireAdmin } from "@/lib/admin";
import { listAllGuides } from "@/lib/guides";
import { guideCategory } from "@/lib/guides-catalog";
import { COLOR_TOKEN } from "@/lib/modules";

export const metadata: Metadata = {
  title: "Admin — Guides",
  robots: { index: false, follow: false },
};

export default async function AdminGuidesPage() {
  await requireAdmin();
  const guides = await listAllGuides();

  const counts = {
    published: guides.filter((g) => g.status === "PUBLISHED").length,
    draft: guides.filter((g) => g.status === "DRAFT").length,
    archived: guides.filter((g) => g.status === "ARCHIVED").length,
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-ink-muted">
            <Link href="/admin" className="hover:text-ink">
              Admin
            </Link>{" "}
            / Guides
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Infos rapides.
          </h1>
          <p className="mt-2 text-ink-muted">
            Rédige, publie, archive. Les guides publiés apparaissent sur{" "}
            <Link href="/infos-rapides" className="underline hover:text-ink">
              /infos-rapides
            </Link>
            .
          </p>
        </div>
        <Link
          href="/admin/guides/new"
          className="inline-flex items-center rounded-full bg-forest px-4 py-2 text-sm font-medium text-ivory shadow-card transition hover:bg-forest-deep"
        >
          + Nouveau guide
        </Link>
      </header>

      <div className="mt-8 grid grid-cols-3 gap-3 rounded-2xl border border-sand bg-ivory-deep p-4 text-center sm:p-6">
        <Stat label="Publiés" value={counts.published.toString()} />
        <Stat label="Brouillons" value={counts.draft.toString()} />
        <Stat label="Archivés" value={counts.archived.toString()} />
      </div>

      <div className="mt-10 flex flex-col gap-3">
        {guides.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-sand bg-ivory p-10 text-center">
            <p className="font-display text-lg font-semibold">
              Aucun guide pour l'instant.
            </p>
            <p className="mt-1 text-sm text-ink-muted">
              Commence par en écrire un — c'est ce qui fera venir les gens.
            </p>
          </div>
        ) : (
          guides.map((g) => (
            <GuideRow
              key={g.id}
              id={g.id}
              slug={g.slug}
              title={g.title}
              category={g.category}
              status={g.status}
              updatedAt={g.updatedAt}
              publishedAt={g.publishedAt}
              lastReviewedAt={g.lastReviewedAt}
            />
          ))
        )}
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-display text-3xl font-semibold tracking-tight">
        {value}
      </p>
      <p className="mt-1 text-xs text-ink-muted">{label}</p>
    </div>
  );
}

function GuideRow({
  id,
  slug,
  title,
  category,
  status,
  updatedAt,
  publishedAt,
  lastReviewedAt,
}: {
  id: string;
  slug: string;
  title: string;
  category: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  updatedAt: Date;
  publishedAt: Date | null;
  lastReviewedAt: Date | null;
}) {
  const cat = guideCategory(category);
  const tokens = cat ? COLOR_TOKEN[cat.color] : null;
  const dateLabel = publishedAt
    ? `Publié le ${formatDate(publishedAt)}`
    : `Modifié le ${formatDate(updatedAt)}`;

  return (
    <div className="flex flex-col gap-4 overflow-hidden rounded-2xl border border-sand bg-ivory sm:flex-row sm:items-center">
      <div
        className={`flex flex-1 items-start gap-3 px-5 py-4 ${tokens?.soft ?? ""}`}
      >
        <div className="min-w-0 flex-1">
          <p
            className={`text-[10px] font-medium uppercase tracking-wider ${tokens?.text ?? "text-ink-muted"}`}
          >
            {cat?.label ?? category}
          </p>
          <p className="mt-0.5 font-display text-base font-semibold tracking-tight text-ink">
            {title}
          </p>
          <p className="mt-1 text-xs text-ink-muted">
            {dateLabel}
            {lastReviewedAt
              ? ` · Revu le ${formatDate(lastReviewedAt)}`
              : ""}
          </p>
        </div>
        <StatusPill status={status} />
      </div>

      <div className="flex flex-wrap items-center gap-2 px-5 py-4">
        {status === "PUBLISHED" ? (
          <Link
            href={`/infos-rapides/${slug}`}
            target="_blank"
            className="text-xs text-ink-muted underline underline-offset-4 hover:text-ink"
          >
            Voir
          </Link>
        ) : null}
        <Link
          href={`/admin/guides/${id}/edit`}
          className="rounded-full border border-sand bg-ivory px-3 py-1.5 text-xs font-medium text-ink transition hover:border-ink/30"
        >
          Modifier
        </Link>
        <StatusActions id={id} current={status} />
        <form action={markGuideReviewed.bind(null, id)}>
          <button
            type="submit"
            className="rounded-full border border-sand bg-ivory px-3 py-1.5 text-xs font-medium text-ink-muted transition hover:text-ink"
          >
            Marquer revu
          </button>
        </form>
        <form action={deleteGuide.bind(null, id)}>
          <button
            type="submit"
            className="rounded-full border border-danger/30 px-3 py-1.5 text-xs font-medium text-danger transition hover:bg-danger/10"
          >
            Supprimer
          </button>
        </form>
      </div>
    </div>
  );
}

function StatusPill({
  status,
}: {
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}) {
  const map = {
    DRAFT: "bg-sand text-ink-muted",
    PUBLISHED: "bg-forest text-ivory",
    ARCHIVED: "bg-graphite text-ivory",
  };
  const labelMap = {
    DRAFT: "Brouillon",
    PUBLISHED: "Publié",
    ARCHIVED: "Archivé",
  };
  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider ${map[status]}`}
    >
      {labelMap[status]}
    </span>
  );
}

function StatusActions({
  id,
  current,
}: {
  id: string;
  current: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}) {
  if (current === "DRAFT") {
    return (
      <form action={setGuideStatus.bind(null, id, "PUBLISHED")}>
        <button
          type="submit"
          className="rounded-full bg-forest px-3 py-1.5 text-xs font-medium text-ivory transition hover:bg-forest-deep"
        >
          Publier
        </button>
      </form>
    );
  }
  if (current === "PUBLISHED") {
    return (
      <>
        <form action={setGuideStatus.bind(null, id, "ARCHIVED")}>
          <button
            type="submit"
            className="rounded-full border border-sand bg-ivory px-3 py-1.5 text-xs font-medium text-ink-muted transition hover:text-ink"
          >
            Archiver
          </button>
        </form>
      </>
    );
  }
  return (
    <form action={setGuideStatus.bind(null, id, "PUBLISHED")}>
      <button
        type="submit"
        className="rounded-full bg-forest px-3 py-1.5 text-xs font-medium text-ivory transition hover:bg-forest-deep"
      >
        Republier
      </button>
    </form>
  );
}

function formatDate(d: Date): string {
  return new Intl.DateTimeFormat("fr-BE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}
