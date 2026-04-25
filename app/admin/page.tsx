import Link from "next/link";
import type { Metadata } from "next";
import { logoutAdmin } from "@/app/actions/admin-auth";
import { formatEUR } from "@/lib/baskets";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { getAllModules } from "@/lib/modules";

export const metadata: Metadata = {
  title: "Admin — Tableau de bord",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  await requireAdmin();

  const [
    modules,
    annonceTotal,
    annonceActive,
    annonceArchived,
    annonceLast7d,
    guidePublished,
    guideDraft,
    basketActive,
    orderTotal,
    orderPaid,
    orderPending,
    orderDelivered,
    revenueAgg,
    interestTotal,
    recentOrders,
    recentAnnonces,
  ] = await Promise.all([
    getAllModules(),
    prisma.annonce.count(),
    prisma.annonce.count({ where: { status: "ACTIVE" } }),
    prisma.annonce.count({ where: { status: "ARCHIVED" } }),
    prisma.annonce.count({
      where: {
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    }),
    prisma.guide.count({ where: { status: "PUBLISHED" } }),
    prisma.guide.count({ where: { status: "DRAFT" } }),
    prisma.basket.count({ where: { active: true } }),
    prisma.order.count(),
    prisma.order.count({ where: { paymentStatus: "PAID" } }),
    prisma.order.count({ where: { paymentStatus: "PENDING" } }),
    prisma.order.count({ where: { status: "DELIVERED" } }),
    prisma.order.aggregate({
      where: { paymentStatus: "PAID" },
      _sum: { amountEUR: true },
    }),
    prisma.moduleInterest.count(),
    prisma.order.findMany({
      orderBy: [{ createdAt: "desc" }],
      take: 5,
      include: { basket: true },
    }),
    prisma.annonce.findMany({
      orderBy: [{ createdAt: "desc" }],
      take: 5,
    }),
  ]);

  const moduleEnabled = modules.filter((m) => m.status === "ENABLED").length;
  const moduleSoon = modules.filter((m) => m.status === "COMING_SOON").length;
  const revenue = revenueAgg._sum.amountEUR ?? 0;

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-ink-muted">
            Admin
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Tableau de bord.
          </h1>
          <p className="mt-2 max-w-xl text-sm text-ink-muted">
            Vue d'ensemble de la plateforme. Tout en un coup d'œil.
          </p>
        </div>
        <form action={logoutAdmin}>
          <button
            type="submit"
            className="inline-flex items-center rounded-full border border-ink/15 bg-white px-4 py-2 text-sm text-ink-muted transition hover:border-ink/30 hover:text-ink"
          >
            Déconnexion
          </button>
        </form>
      </header>

      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi
          label="Annonces actives"
          value={annonceActive.toString()}
          delta={`${annonceLast7d} cette semaine`}
          href="/admin/annonces"
          accent="forest"
        />
        <Kpi
          label="Commandes payées"
          value={orderPaid.toString()}
          delta={`${orderPending} en attente`}
          href="/admin/commandes"
          accent="clay"
        />
        <Kpi
          label="Recettes"
          value={formatEUR(revenue)}
          delta={`${orderDelivered} livrées`}
          href="/admin/commandes"
          accent="gold"
        />
        <Kpi
          label="Inscrits « Bientôt »"
          value={interestTotal.toString()}
          delta={`${moduleSoon} modules en attente`}
          href="/admin/inscriptions"
          accent="cobalt"
        />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <SmallStat
          label="Modules actifs"
          value={`${moduleEnabled}/${modules.length}`}
          href="/admin/modules"
        />
        <SmallStat
          label="Annonces totales"
          value={annonceTotal.toString()}
          subtitle={`${annonceArchived} archivées`}
          href="/admin/annonces"
        />
        <SmallStat
          label="Guides publiés"
          value={guidePublished.toString()}
          subtitle={`${guideDraft} brouillons`}
          href="/admin/guides"
        />
        <SmallStat
          label="Paniers au catalogue"
          value={basketActive.toString()}
          subtitle="actifs"
          href="/admin/paniers"
        />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel
          title="Commandes récentes"
          link="/admin/commandes"
          empty="Aucune commande pour l'instant."
          items={recentOrders.map((o) => ({
            id: o.id,
            primary: `${o.basket.name} — ${formatEUR(o.amountEUR)}`,
            secondary: `${o.recipientName} · ${formatRelativeDate(o.createdAt)}`,
            badge: orderBadge(o.paymentStatus, o.status),
          }))}
        />
        <Panel
          title="Annonces récentes"
          link="/admin/annonces"
          empty="Aucune annonce publiée."
          items={recentAnnonces.map((a) => ({
            id: a.id,
            primary: a.titre,
            secondary: `${a.type} · ${a.contactNom} · ${formatRelativeDate(a.createdAt)}`,
            badge: { label: a.status, tone: a.status === "ACTIVE" ? "forest" : "graphite" } as const,
          }))}
        />
      </div>
    </section>
  );
}

function Kpi({
  label,
  value,
  delta,
  href,
  accent,
}: {
  label: string;
  value: string;
  delta: string;
  href: string;
  accent: "forest" | "clay" | "gold" | "cobalt";
}) {
  const accentClass = {
    forest: "text-forest",
    clay: "text-clay",
    gold: "text-gold",
    cobalt: "text-cobalt",
  }[accent];
  return (
    <Link
      href={href}
      className="group flex flex-col gap-1 rounded-2xl border border-sand bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-card"
    >
      <p className={`text-xs font-medium uppercase tracking-wider ${accentClass}`}>
        {label}
      </p>
      <p className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        {value}
      </p>
      <p className="text-xs text-ink-muted">{delta}</p>
    </Link>
  );
}

function SmallStat({
  label,
  value,
  subtitle,
  href,
}: {
  label: string;
  value: string;
  subtitle?: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-sand bg-white p-4 transition hover:border-ink/20"
    >
      <p className="text-[10px] font-medium uppercase tracking-wider text-ink-muted">
        {label}
      </p>
      <p className="mt-1 font-display text-xl font-semibold tracking-tight text-ink">
        {value}
      </p>
      {subtitle ? <p className="text-xs text-ink-muted">{subtitle}</p> : null}
    </Link>
  );
}

type Tone = "forest" | "gold" | "graphite" | "danger" | "navy";
type Item = {
  id: string;
  primary: string;
  secondary: string;
  badge: { label: string; tone: Tone };
};

function Panel({
  title,
  link,
  items,
  empty,
}: {
  title: string;
  link: string;
  items: Item[];
  empty: string;
}) {
  return (
    <div className="rounded-2xl border border-sand bg-white p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold tracking-tight">
          {title}
        </h2>
        <Link
          href={link}
          className="text-xs text-ink-muted underline-offset-4 hover:text-ink hover:underline"
        >
          Tout voir →
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-ink-muted">{empty}</p>
      ) : (
        <ul className="space-y-3">
          {items.map((it) => (
            <li
              key={it.id}
              className="flex items-start justify-between gap-3 border-b border-sand pb-3 last:border-0 last:pb-0"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">
                  {it.primary}
                </p>
                <p className="mt-0.5 truncate text-xs text-ink-muted">
                  {it.secondary}
                </p>
              </div>
              <Badge label={it.badge.label} tone={it.badge.tone} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Badge({ label, tone }: { label: string; tone: Tone }) {
  const className = {
    forest: "bg-forest text-ivory",
    gold: "bg-gold text-ivory",
    graphite: "bg-graphite text-ivory",
    danger: "bg-danger text-ivory",
    navy: "bg-navy text-ivory",
  }[tone];
  return (
    <span
      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${className}`}
    >
      {label}
    </span>
  );
}

function orderBadge(
  paymentStatus: string,
  status: string,
): { label: string; tone: Tone } {
  if (paymentStatus === "PAID" && status === "DELIVERED")
    return { label: "Livrée", tone: "forest" };
  if (paymentStatus === "PAID") return { label: "Payée", tone: "navy" };
  if (paymentStatus === "PENDING") return { label: "En attente", tone: "gold" };
  if (paymentStatus === "FAILED") return { label: "Échouée", tone: "danger" };
  return { label: paymentStatus, tone: "graphite" };
}

function formatRelativeDate(d: Date): string {
  const diffMs = Date.now() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "aujourd'hui";
  if (diffDays === 1) return "hier";
  if (diffDays < 7) return `il y a ${diffDays} j`;
  if (diffDays < 30) return `il y a ${Math.floor(diffDays / 7)} sem`;
  return new Intl.DateTimeFormat("fr-BE", {
    day: "numeric",
    month: "short",
  }).format(d);
}
