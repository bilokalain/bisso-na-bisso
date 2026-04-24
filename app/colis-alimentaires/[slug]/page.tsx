import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OrderForm } from "@/components/order-form";
import { formatEUR, getBasketBySlug } from "@/lib/baskets";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const basket = await getBasketBySlug(slug);
  if (!basket || !basket.active) return {};
  return {
    title: `Panier ${basket.name} — Colis alimentaires`,
    description: `${basket.tagline} Livré à Kinshasa pour ${formatEUR(basket.priceEUR)}.`,
    openGraph: {
      title: `Panier ${basket.name} — ${formatEUR(basket.priceEUR)}`,
      description: basket.tagline,
      type: "website",
      images: basket.heroImage ? [{ url: basket.heroImage }] : undefined,
    },
  };
}

export default async function BasketDetailPage({ params }: Props) {
  const { slug } = await params;
  const basket = await getBasketBySlug(slug);
  if (!basket || !basket.active) notFound();

  return (
    <article className="pb-24">
      <nav className="mx-auto max-w-3xl px-4 pt-5 text-sm text-ink-muted">
        <Link href="/colis-alimentaires" className="hover:text-ink">
          ← Tous les paniers
        </Link>
      </nav>

      <header className="mx-auto mt-6 max-w-3xl px-4">
        <span className="inline-flex items-center gap-2 rounded-full bg-clay px-3 py-1 text-xs font-medium uppercase tracking-wider text-ivory">
          Colis alimentaires · Kinshasa
        </span>
        <h1 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Panier {basket.name}
        </h1>
        <p className="mt-3 text-lg text-ink-muted">{basket.tagline}</p>
        <div className="mt-5 inline-flex items-baseline gap-2">
          <span className="font-display text-3xl font-semibold text-ink">
            {formatEUR(basket.priceEUR)}
          </span>
          <span className="text-sm text-ink-muted">tout compris</span>
        </div>
      </header>

      {basket.heroImage ? (
        <div className="mx-auto mt-8 max-w-3xl px-4">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-sand">
            <Image
              src={basket.heroImage}
              alt={basket.name}
              fill
              priority
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      ) : null}

      <section className="mx-auto mt-10 max-w-3xl px-4">
        <div className="rounded-2xl border border-sand bg-ivory-deep p-5 sm:p-6">
          <p className="text-xs font-medium uppercase tracking-wider text-ink-muted">
            Contenu du panier
          </p>
          <p className="mt-1 font-display text-xl font-semibold tracking-tight">
            {basket.items.length} produit{basket.items.length > 1 ? "s" : ""}
          </p>
          <ul className="mt-4 space-y-2">
            {basket.items.map((it) => (
              <li
                key={it.id}
                className="flex items-baseline justify-between gap-3 border-b border-ink/5 pb-2 last:border-0 last:pb-0"
              >
                <span className="text-ink">{it.name}</span>
                <span className="font-medium text-ink">{it.quantity}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-3xl px-4">
        <div className="rounded-2xl border border-clay/25 bg-clay-soft p-5 sm:p-6">
          <p className="text-xs font-medium uppercase tracking-wider text-clay">
            Ce qui rend les colis alimentaires différents
          </p>
          <ul className="mt-3 space-y-2 text-sm text-ink">
            <li className="flex items-start gap-2">
              <Dot /> Ton message est{" "}
              <span className="font-medium">lu à voix haute</span> par le
              livreur à l'arrivée.
            </li>
            <li className="flex items-start gap-2">
              <Dot />{" "}
              <span className="font-medium">SMS à ta famille</span> pour
              confirmer l'adresse avant livraison.
            </li>
            <li className="flex items-start gap-2">
              <Dot />{" "}
              <span className="font-medium">Photo + courte vidéo</span> de la
              remise, envoyées par WhatsApp.
            </li>
            <li className="flex items-start gap-2">
              <Dot /> Prix transparent —{" "}
              <span className="font-medium">aucun frais caché</span>.
            </li>
          </ul>
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-3xl px-4">
        <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Ta commande.
        </h2>
        <p className="mt-2 text-ink-muted">
          Trois minutes, zéro création de compte.
        </p>
        <div className="mt-8">
          <OrderForm
            basketId={basket.id}
            basketName={basket.name}
            basketPriceEUR={basket.priceEUR}
          />
        </div>
      </section>
    </article>
  );
}

function Dot() {
  return (
    <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />
  );
}
