import Link from "next/link";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import { formatEUR } from "@/lib/baskets";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Admin — Commandes",
  robots: { index: false, follow: false },
};

const PAYMENT_LABEL: Record<string, string> = {
  PENDING: "En attente",
  PAID: "Payée",
  FAILED: "Échouée",
  REFUNDED: "Remboursée",
};

const STATUS_LABEL: Record<string, string> = {
  RECEIVED: "Reçue",
  CONFIRMED: "Confirmée",
  DISPATCHED: "En route",
  DELIVERED: "Livrée",
  ISSUE: "Problème",
  CANCELED: "Annulée",
};

export default async function AdminOrdersPage() {
  await requireAdmin();

  const orders = await prisma.order.findMany({
    include: { basket: true },
    orderBy: [{ createdAt: "desc" }],
  });

  const paidCount = orders.filter((o) => o.paymentStatus === "PAID").length;
  const pendingCount = orders.filter((o) => o.paymentStatus === "PENDING").length;
  const deliveredCount = orders.filter((o) => o.status === "DELIVERED").length;
  const revenueEURc = orders
    .filter((o) => o.paymentStatus === "PAID")
    .reduce((sum, o) => sum + o.amountEUR, 0);

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-ink-muted">
            <Link href="/admin" className="hover:text-ink">
              Admin
            </Link>{" "}
            / Commandes
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Colis alimentaires.
          </h1>
          <p className="mt-2 text-ink-muted">
            Toutes les commandes de paniers. Tri par date, du plus récent au
            plus ancien.
          </p>
        </div>
      </header>

      <div className="mt-8 grid grid-cols-2 gap-3 rounded-2xl border border-sand bg-ivory-deep p-4 text-center sm:grid-cols-4 sm:gap-6 sm:p-6">
        <Stat label="Payées" value={paidCount.toString()} />
        <Stat label="En attente" value={pendingCount.toString()} />
        <Stat label="Livrées" value={deliveredCount.toString()} />
        <Stat label="Recettes" value={formatEUR(revenueEURc)} />
      </div>

      <div className="mt-10 flex flex-col gap-3">
        {orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-sand bg-ivory p-10 text-center">
            <p className="font-display text-lg font-semibold">
              Aucune commande pour l'instant.
            </p>
            <p className="mt-1 text-sm text-ink-muted">
              Dès la première, elle apparaîtra ici.
            </p>
          </div>
        ) : (
          orders.map((o) => (
            <div
              key={o.id}
              className="flex flex-col gap-3 rounded-2xl border border-sand bg-ivory p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-5"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-xs text-ink-muted">
                    {o.reference}
                  </span>
                  <span className="text-xs text-ink-muted">
                    {formatDate(o.createdAt)}
                  </span>
                </div>
                <p className="mt-1 font-display text-base font-semibold tracking-tight text-ink">
                  {o.basket.name} · {formatEUR(o.amountEUR)}
                </p>
                <p className="mt-0.5 truncate text-sm text-ink-muted">
                  De <strong className="text-ink">{o.senderName}</strong> pour{" "}
                  <strong className="text-ink">{o.recipientName}</strong> ·{" "}
                  {o.recipientPhone}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <PaymentPill status={o.paymentStatus} />
                <StatusPill status={o.status} />
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
      <p className="mt-1 text-xs text-ink-muted">{label}</p>
    </div>
  );
}

function PaymentPill({ status }: { status: string }) {
  const color =
    status === "PAID"
      ? "bg-forest text-ivory"
      : status === "PENDING"
        ? "bg-gold text-ivory"
        : status === "FAILED"
          ? "bg-danger text-ivory"
          : "bg-graphite text-ivory";
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider ${color}`}
    >
      {PAYMENT_LABEL[status] ?? status}
    </span>
  );
}

function StatusPill({ status }: { status: string }) {
  const color =
    status === "DELIVERED"
      ? "bg-forest text-ivory"
      : status === "ISSUE" || status === "CANCELED"
        ? "bg-danger text-ivory"
        : status === "DISPATCHED"
          ? "bg-navy text-ivory"
          : "bg-sand text-ink-muted";
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider ${color}`}
    >
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}

function formatDate(d: Date): string {
  return new Intl.DateTimeFormat("fr-BE", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}
