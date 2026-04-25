import Link from "next/link";
import type { Metadata } from "next";
import {
  deleteBasket,
  toggleBasketActive,
} from "@/app/actions/admin-baskets";
import { formatEUR, listAllBaskets } from "@/lib/baskets";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Admin — Paniers",
  robots: { index: false, follow: false },
};

export default async function AdminPaniersPage() {
  await requireAdmin();

  const baskets = await listAllBaskets();
  const orderCounts = await prisma.order.groupBy({
    by: ["basketId"],
    _count: { _all: true },
  });
  const orderCountMap = new Map<string, number>(
    orderCounts.map((r) => [r.basketId, r._count._all]),
  );

  const totalRevenue = await prisma.order.aggregate({
    where: { paymentStatus: "PAID" },
    _sum: { amountEUR: true },
  });

  return (
    <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-ink-muted">
            Admin · Catalogue
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Colis alimentaires.
          </h1>
          <p className="mt-2 max-w-xl text-sm text-ink-muted">
            Le catalogue des paniers. Pour les commandes elles-mêmes,
            va sur{" "}
            <Link
              href="/admin/commandes"
              className="underline hover:text-ink"
            >
              Commandes
            </Link>
            .
          </p>
        </div>
        <Link
          href="/admin/paniers/nouveau"
          className="inline-flex items-center rounded-full bg-navy px-4 py-2 text-sm font-medium text-ivory shadow-card transition hover:bg-navy-deep"
        >
          + Nouveau panier
        </Link>
      </header>

      <div className="mt-8 grid grid-cols-3 gap-3 rounded-2xl border border-sand bg-white p-4 text-center sm:p-5">
        <Stat label="Paniers actifs" value={baskets.filter((b) => b.active).length.toString()} />
        <Stat label="Paniers totaux" value={baskets.length.toString()} />
        <Stat
          label="Recettes totales"
          value={formatEUR(totalRevenue._sum.amountEUR ?? 0)}
        />
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {baskets.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-sand bg-white p-10 text-center">
            <p className="font-display text-lg font-semibold">
              Aucun panier au catalogue.
            </p>
            <p className="mt-1 text-sm text-ink-muted">
              Crée le premier pour activer la vitrine.
            </p>
          </div>
        ) : (
          baskets.map((b) => (
            <div
              key={b.id}
              className="flex flex-col gap-3 rounded-2xl border border-sand bg-white p-4 sm:flex-row sm:items-center sm:gap-5 sm:p-5"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-ink-muted">
                    #{b.order} · {b.destination}
                  </span>
                  <ActiveBadge active={b.active} />
                </div>
                <p className="mt-1 font-display text-lg font-semibold tracking-tight text-ink">
                  {b.name} ·{" "}
                  <span className="text-clay">{formatEUR(b.priceEUR)}</span>
                </p>
                <p className="mt-0.5 truncate text-sm text-ink-muted">
                  {b.tagline}
                </p>
                <p className="mt-1 text-xs text-ink-muted">
                  {b.items.length} produit{b.items.length > 1 ? "s" : ""} ·{" "}
                  {orderCountMap.get(b.id) ?? 0} commande
                  {(orderCountMap.get(b.id) ?? 0) > 1 ? "s" : ""}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/colis-alimentaires/${b.slug}`}
                  target="_blank"
                  className="text-xs text-ink-muted underline-offset-4 hover:text-ink hover:underline"
                >
                  Voir
                </Link>
                <Link
                  href={`/admin/paniers/${b.id}/edit`}
                  className="rounded-full border border-sand bg-white px-3 py-1.5 text-xs font-medium text-ink hover:border-ink/30"
                >
                  Modifier
                </Link>
                <form action={toggleBasketActive.bind(null, b.id)}>
                  <button
                    type="submit"
                    className="rounded-full border border-sand bg-white px-3 py-1.5 text-xs font-medium text-ink-muted hover:border-ink/30 hover:text-ink"
                  >
                    {b.active ? "Désactiver" : "Activer"}
                  </button>
                </form>
                <DeleteBasketButton id={b.id} />
              </div>
            </div>
          ))
        )}
      </div>
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

function ActiveBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
        active ? "bg-forest text-ivory" : "bg-graphite text-ivory"
      }`}
    >
      {active ? "Actif" : "Inactif"}
    </span>
  );
}

function DeleteBasketButton({ id }: { id: string }) {
  return (
    <form action={deleteBasket.bind(null, id)}>
      <button
        type="submit"
        className="rounded-full border border-danger/30 px-3 py-1.5 text-xs font-medium text-danger hover:bg-danger/10"
        title="Refuse si des commandes existent — utilise « Désactiver »"
      >
        Supprimer
      </button>
    </form>
  );
}
