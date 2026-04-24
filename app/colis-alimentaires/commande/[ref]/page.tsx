import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatEUR } from "@/lib/baskets";

export const metadata: Metadata = {
  title: "Ta commande — Colis alimentaires",
  robots: { index: false, follow: false },
};

type Props = {
  params: Promise<{ ref: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function OrderDetailPage({ params, searchParams }: Props) {
  const { ref } = await params;
  const sp = await searchParams;
  const justCreated = sp.pending === "1";

  const order = await prisma.order.findUnique({
    where: { reference: ref },
    include: {
      basket: { include: { items: { orderBy: [{ order: "asc" }] } } },
    },
  });
  if (!order) notFound();

  const isPending = order.paymentStatus === "PENDING";

  return (
    <article className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <nav className="text-sm text-ink-muted">
        <Link href="/colis-alimentaires" className="hover:text-ink">
          ← Colis alimentaires
        </Link>
      </nav>

      <header className="mt-6">
        <span className="inline-flex items-center gap-2 rounded-full bg-clay px-3 py-1 text-xs font-medium uppercase tracking-wider text-ivory">
          Commande {order.reference}
        </span>
        {justCreated ? (
          <p className="mt-5 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Ta commande est bien enregistrée.
          </p>
        ) : (
          <p className="mt-5 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Détail de ta commande.
          </p>
        )}
      </header>

      {isPending ? (
        <section className="mt-6 rounded-2xl border border-gold/30 bg-gold-soft p-5 sm:p-6">
          <p className="text-xs font-medium uppercase tracking-wider text-ink">
            Paiement en attente
          </p>
          <p className="mt-1 font-display text-lg font-semibold text-ink">
            Le module de paiement arrive très bientôt.
          </p>
          <p className="mt-2 text-sm text-ink-muted">
            Ta commande <strong>{order.reference}</strong> est enregistrée.
            En attendant que Stripe soit branché, contacte-nous pour
            finaliser le paiement et déclencher la livraison.
          </p>
        </section>
      ) : null}

      <section className="mt-8 rounded-2xl border border-sand bg-ivory-deep p-5 sm:p-6">
        <p className="text-xs font-medium uppercase tracking-wider text-ink-muted">
          Panier {order.basket.name}
        </p>
        <div className="mt-2 flex items-baseline justify-between">
          <p className="font-display text-xl font-semibold tracking-tight">
            {order.basket.tagline}
          </p>
          <p className="font-display text-2xl font-semibold text-clay">
            {formatEUR(order.amountEUR)}
          </p>
        </div>
        <ul className="mt-4 space-y-1.5 text-sm text-ink">
          {order.basket.items.map((it) => (
            <li key={it.id} className="flex items-baseline justify-between">
              <span>{it.name}</span>
              <span className="font-medium">{it.quantity}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Panel title="Expéditeur">
          <p className="font-medium text-ink">{order.senderName}</p>
          <p className="text-sm text-ink-muted">{order.senderEmail}</p>
          {order.senderPhone ? (
            <p className="text-sm text-ink-muted">{order.senderPhone}</p>
          ) : null}
        </Panel>
        <Panel title="Destinataire">
          <p className="font-medium text-ink">{order.recipientName}</p>
          <p className="text-sm text-ink-muted">{order.recipientPhone}</p>
          <p className="mt-1 text-sm text-ink-muted">
            {order.recipientAddress}
          </p>
          {order.recipientNotes ? (
            <p className="mt-1 text-xs text-ink-muted">
              Repère : {order.recipientNotes}
            </p>
          ) : null}
        </Panel>
      </section>

      {order.messageToFamily ? (
        <section className="mt-6 rounded-2xl border border-sand bg-white p-5 sm:p-6">
          <p className="text-xs font-medium uppercase tracking-wider text-ink-muted">
            Ton mot, lu à la livraison
          </p>
          <p className="mt-2 whitespace-pre-wrap text-ink">
            « {order.messageToFamily} »
          </p>
        </section>
      ) : null}

      <p className="mt-8 text-xs text-ink-muted">
        Une confirmation t'est envoyée par e-mail. Garde ta référence{" "}
        <strong>{order.reference}</strong> pour toute question.
      </p>
    </article>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-sand bg-white p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-ink-muted">
        {title}
      </p>
      <div className="mt-2">{children}</div>
    </div>
  );
}
