import Link from "next/link";
import type { Metadata } from "next";
import { deleteAnnonce, setAnnonceStatus } from "@/app/actions/admin-annonces";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { MODULE_CATALOG, COLOR_TOKEN } from "@/lib/modules";

export const metadata: Metadata = {
  title: "Admin — Annonces",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const TYPES = MODULE_CATALOG.filter((m) => m.contentType === "annonce");
const STATUSES = ["ACTIVE", "ARCHIVED", "REJECTED"] as const;

export default async function AdminAnnoncesPage({ searchParams }: Props) {
  await requireAdmin();
  const sp = await searchParams;

  const typeFilter = typeof sp.type === "string" ? sp.type : undefined;
  const statusFilter = typeof sp.status === "string" ? sp.status : undefined;

  const where = {
    ...(typeFilter ? { type: typeFilter } : {}),
    ...(statusFilter && (STATUSES as readonly string[]).includes(statusFilter)
      ? { status: statusFilter as (typeof STATUSES)[number] }
      : {}),
  };

  const [annonces, totals] = await Promise.all([
    prisma.annonce.findMany({
      where,
      orderBy: [{ createdAt: "desc" }],
      take: 100,
    }),
    prisma.annonce.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
  ]);

  const totalsMap = new Map<string, number>(
    totals.map((t) => [t.status, t._count._all]),
  );

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <header>
        <p className="text-xs font-medium uppercase tracking-wider text-ink-muted">
          Admin · Annonces
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Toutes les annonces.
        </h1>
        <p className="mt-2 max-w-xl text-sm text-ink-muted">
          Filtre par type ou statut. Les changements sont visibles
          immédiatement sur le site public.
        </p>
      </header>

      <div className="mt-8 grid grid-cols-3 gap-3 rounded-2xl border border-sand bg-white p-4 text-center sm:p-5">
        <Stat
          label="Actives"
          value={(totalsMap.get("ACTIVE") ?? 0).toString()}
        />
        <Stat
          label="Archivées"
          value={(totalsMap.get("ARCHIVED") ?? 0).toString()}
        />
        <Stat
          label="Rejetées"
          value={(totalsMap.get("REJECTED") ?? 0).toString()}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <FilterChip
          label="Tous les types"
          href="/admin/annonces"
          active={!typeFilter}
          preserveStatus={statusFilter}
        />
        {TYPES.map((m) => (
          <FilterChip
            key={m.key}
            label={m.label}
            href={`/admin/annonces?type=${m.key}${
              statusFilter ? `&status=${statusFilter}` : ""
            }`}
            active={typeFilter === m.key}
            color={m.color}
          />
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <FilterChip
          label="Tous les statuts"
          href={typeFilter ? `/admin/annonces?type=${typeFilter}` : "/admin/annonces"}
          active={!statusFilter}
        />
        {STATUSES.map((s) => (
          <FilterChip
            key={s}
            label={s.charAt(0) + s.slice(1).toLowerCase()}
            href={`/admin/annonces?${typeFilter ? `type=${typeFilter}&` : ""}status=${s}`}
            active={statusFilter === s}
          />
        ))}
      </div>

      <div className="mt-8">
        {annonces.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-sand bg-white p-10 text-center">
            <p className="font-display text-lg font-semibold">
              Aucune annonce ne correspond.
            </p>
            <p className="mt-1 text-sm text-ink-muted">
              Lève un filtre pour élargir la liste.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-sand bg-white">
            <ul className="divide-y divide-sand">
              {annonces.map((a) => {
                const spec = MODULE_CATALOG.find((m) => m.key === a.type);
                return (
                  <li
                    key={a.id}
                    className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:gap-4 sm:px-5 sm:py-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-2">
                        {spec ? (
                          <span
                            className={`text-[10px] font-medium uppercase tracking-wider ${COLOR_TOKEN[spec.color].text}`}
                          >
                            {spec.label}
                          </span>
                        ) : null}
                        <span className="text-xs text-ink-muted">
                          {formatDate(a.createdAt)}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-1 font-medium text-ink">
                        {a.titre}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-ink-muted">
                        {a.contactNom}
                        {a.ville ? ` · ${a.ville}` : ""}
                      </p>
                    </div>

                    <StatusBadge status={a.status} />

                    <div className="flex flex-wrap items-center gap-2">
                      {a.status === "ACTIVE" ? (
                        <Link
                          href={`/${a.type}/${a.slug}`}
                          target="_blank"
                          className="text-xs text-ink-muted underline-offset-4 hover:text-ink hover:underline"
                        >
                          Voir
                        </Link>
                      ) : null}
                      {a.status !== "ACTIVE" ? (
                        <form
                          action={setAnnonceStatus.bind(null, a.id, "ACTIVE")}
                        >
                          <button
                            type="submit"
                            className="rounded-full bg-forest px-3 py-1 text-xs font-medium text-ivory hover:brightness-95"
                          >
                            Réactiver
                          </button>
                        </form>
                      ) : (
                        <form
                          action={setAnnonceStatus.bind(null, a.id, "ARCHIVED")}
                        >
                          <button
                            type="submit"
                            className="rounded-full border border-sand bg-white px-3 py-1 text-xs font-medium text-ink-muted hover:border-ink/30 hover:text-ink"
                          >
                            Archiver
                          </button>
                        </form>
                      )}
                      <form action={deleteAnnonce.bind(null, a.id)}>
                        <button
                          type="submit"
                          className="rounded-full border border-danger/30 px-3 py-1 text-xs font-medium text-danger hover:bg-danger/10"
                        >
                          Supprimer
                        </button>
                      </form>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {annonces.length === 100 ? (
        <p className="mt-4 text-xs text-ink-muted">
          Affichage limité aux 100 dernières. Affine les filtres pour voir
          des annonces plus anciennes.
        </p>
      ) : null}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-display text-2xl font-semibold tracking-tight">
        {value}
      </p>
      <p className="mt-0.5 text-xs text-ink-muted">{label}</p>
    </div>
  );
}

function FilterChip({
  label,
  href,
  active,
  color,
}: {
  label: string;
  href: string;
  active: boolean;
  color?: keyof typeof COLOR_TOKEN;
  preserveStatus?: string;
}) {
  const activeClass = color
    ? `${COLOR_TOKEN[color].bg} text-ivory`
    : "bg-navy text-ivory";
  return (
    <Link
      href={href}
      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition ${
        active
          ? `border-transparent ${activeClass}`
          : "border-sand bg-white text-ink-muted hover:border-ink/20 hover:text-ink"
      }`}
    >
      {label}
    </Link>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    ACTIVE: "bg-forest text-ivory",
    ARCHIVED: "bg-graphite text-ivory",
    REJECTED: "bg-danger text-ivory",
  };
  const labels: Record<string, string> = {
    ACTIVE: "Active",
    ARCHIVED: "Archivée",
    REJECTED: "Rejetée",
  };
  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${map[status] ?? "bg-sand"}`}
    >
      {labels[status] ?? status}
    </span>
  );
}

function formatDate(d: Date): string {
  return new Intl.DateTimeFormat("fr-BE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}
