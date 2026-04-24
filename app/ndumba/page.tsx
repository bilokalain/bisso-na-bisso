import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ModuleIcon } from "@/components/module-icon";
import { formatEUR, listActiveBaskets } from "@/lib/baskets";
import { COLOR_TOKEN, getModuleByKey } from "@/lib/modules";

export const metadata: Metadata = {
  title: "Ndumba — paniers de denrées livrés à Kinshasa",
  description:
    "Envoie un panier de riz, farine, haricots, huile à ta famille à Kinshasa. Paie ici, on livre chez eux, photo + vidéo à l'arrivée.",
};

export default async function NdumbaIndex() {
  const module = await getModuleByKey("ndumba");
  if (!module || module.status === "DISABLED") notFound();
  if (module.status === "COMING_SOON") redirect(`/bientot/${module.key}`);

  const baskets = await listActiveBaskets("kinshasa");
  const tokens = COLOR_TOKEN[module.color];

  return (
    <>
      <section className={`relative overflow-hidden ${tokens.soft}`}>
        <div className="mx-auto max-w-5xl px-4 py-14 sm:py-20">
          <Link href="/" className="text-sm text-ink-muted hover:text-ink">
            ← Accueil
          </Link>
          <span
            className={`mt-6 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-3 py-1 text-xs font-medium uppercase tracking-wider ${tokens.text}`}
          >
            <ModuleIcon name="basket" size={14} />
            Ndumba · Kinshasa
          </span>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            Un panier à ta famille,{" "}
            <span className={`italic ${tokens.text}`}>livré chez elle.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-muted">
            Tu choisis un panier. Tu paies ici. On achète au marché et on
            livre à Kinshasa sous 5 jours. Ton message personnel lu à
            l'arrivée, photo et courte vidéo envoyées en retour.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <span className="inline-flex items-center gap-1.5 text-ink-muted">
              <CheckMark /> Paiement sécurisé
            </span>
            <span className="inline-flex items-center gap-1.5 text-ink-muted">
              <CheckMark /> Photo + vidéo de livraison
            </span>
            <span className="inline-flex items-center gap-1.5 text-ink-muted">
              <CheckMark /> Message lu à ta famille
            </span>
            <span className="inline-flex items-center gap-1.5 text-ink-muted">
              <CheckMark /> Prix tout compris
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
        <p className="text-xs font-medium uppercase tracking-wider text-ink-muted">
          Trois paniers au choix
        </p>
        <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Combien tu veux couvrir ?
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
          {baskets.map((b) => (
            <BasketCard key={b.id} basket={b} />
          ))}
        </div>

        <p className="mt-10 max-w-2xl text-sm text-ink-muted">
          Les prix incluent les denrées, le transport local, la livraison à
          domicile dans Kinshasa, et l'envoi de la photo/vidéo par WhatsApp.
          Aucun frais caché.
        </p>
      </section>

      <section className="border-t border-sand">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
          <p className="text-xs font-medium uppercase tracking-wider text-ink-muted">
            Comment ça se passe
          </p>
          <h2 className="mt-2 max-w-2xl font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            4 étapes, 5 jours ouvrés.
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-4 sm:gap-8">
            <Step
              n="1"
              title="Tu commandes"
              body="Choisis un panier, donne l'adresse de ta famille à Kinshasa, écris un mot, paie."
            />
            <Step
              n="2"
              title="On confirme"
              body="Ta famille reçoit un SMS pour confirmer l'adresse et prévenir qu'un panier arrive."
            />
            <Step
              n="3"
              title="On livre"
              body="Notre partenaire sur place achète les denrées et livre à la porte."
            />
            <Step
              n="4"
              title="Tu reçois la preuve"
              body="Photo et courte vidéo par WhatsApp. Ton message est lu à la livraison."
            />
          </div>
        </div>
      </section>
    </>
  );
}

function BasketCard({
  basket,
}: {
  basket: Awaited<ReturnType<typeof listActiveBaskets>>[number];
}) {
  return (
    <Link
      href={`/ndumba/${basket.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-sand bg-ivory transition hover:-translate-y-0.5 hover:shadow-card"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand">
        {basket.heroImage ? (
          <Image
            src={basket.heroImage}
            alt={basket.name}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-2xl font-semibold tracking-tight text-ink">
            {basket.name}
          </h3>
          <span className="whitespace-nowrap rounded-full bg-terracotta px-3 py-1 text-sm font-semibold text-ivory">
            {formatEUR(basket.priceEUR)}
          </span>
        </div>
        <p className="text-sm text-ink-muted">{basket.tagline}</p>
        <ul className="mt-auto space-y-1 text-sm text-ink">
          {basket.items.slice(0, 4).map((it) => (
            <li key={it.id} className="flex items-center gap-2">
              <Bullet />
              <span className="font-medium">{it.quantity}</span>
              <span className="text-ink-muted">{it.name}</span>
            </li>
          ))}
          {basket.items.length > 4 ? (
            <li className="pl-5 text-xs text-ink-muted">
              + {basket.items.length - 4} autre
              {basket.items.length - 4 > 1 ? "s" : ""}
            </li>
          ) : null}
        </ul>
        <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-terracotta">
          Choisir ce panier →
        </span>
      </div>
    </Link>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div>
      <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 font-display text-lg font-semibold text-terracotta">
        {n}
      </div>
      <h3 className="font-display text-lg font-semibold tracking-tight">
        {title}
      </h3>
      <p className="mt-1 text-sm leading-relaxed text-ink-muted">{body}</p>
    </div>
  );
}

function Bullet() {
  return (
    <span className="inline-flex h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta" />
  );
}

function CheckMark() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-terracotta"
      aria-hidden
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
