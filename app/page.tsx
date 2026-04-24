import Image from "next/image";
import Link from "next/link";
import { ModuleIcon } from "@/components/module-icon";
import {
  COLOR_TOKEN,
  getPublicModules,
  type ModuleWithState,
} from "@/lib/modules";

export default async function Home() {
  const modules = await getPublicModules();

  return (
    <>
      <Hero />
      <Verticales modules={modules} />
      <HowItWorks />
      <Footer />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at top, var(--color-sand) 0%, transparent 55%)",
        }}
      />
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:pb-24 sm:pt-16 md:pt-24">
        <div className="grid items-center gap-10 md:grid-cols-[1.15fr_1fr] md:gap-14">
          <div className="order-1">
            <span className="inline-flex items-center gap-2 rounded-full border border-sand bg-ivory px-3 py-1 text-xs font-medium uppercase tracking-wider text-ink-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-terracotta" />
              Diaspora · Belgique
            </span>
            <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.02] tracking-tight text-ink sm:text-6xl md:text-7xl">
              Entre <span className="italic text-navy">nous.</span>
            </h1>
            {/* Hero image — on mobile it breaks here between title and body
                copy, sitting literally "after" the H1 as requested. On
                desktop it moves to the right column via md:hidden / md:block
                toggles below. */}
            <div className="mt-8 md:hidden">
              <HeroArtwork />
            </div>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-muted sm:text-xl md:mt-10">
              Les bons plans de la communauté, sans friction — événementiel,
              restauration, colis, répétiteurs, petits boulots, et plus à
              venir. Gratuit, sans compte, contact direct.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/publier"
                className="inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3 text-base font-medium text-ivory shadow-card transition hover:bg-navy-deep active:scale-[0.98]"
              >
                Publier une annonce
                <ArrowRight />
              </Link>
              <a
                href="#modules"
                className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-ivory px-6 py-3 text-base font-medium text-ink transition hover:border-ink/30"
              >
                Parcourir
              </a>
            </div>
            <p className="mt-6 flex items-center gap-2 text-sm text-ink-muted">
              <CheckDot /> Gratuit · Sans compte · Contact direct par WhatsApp
            </p>
          </div>
          <div className="order-2 hidden md:block">
            <HeroArtwork />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroArtwork() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      {/* Soft glow behind the white-bg illustration so it blends into the
          ivory page instead of looking like a pasted card. */}
      <div
        aria-hidden
        className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-sand via-transparent to-ivory-deep blur-2xl"
      />
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-white shadow-float ring-1 ring-ink/5">
        <Image
          src="/logo.jpeg"
          alt="Bisso na Bisso — entre nous, tout est possible"
          fill
          priority
          sizes="(min-width: 768px) 28rem, 100vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}

function Verticales({ modules }: { modules: ModuleWithState[] }) {
  return (
    <section
      id="modules"
      className="scroll-mt-24 border-t border-sand bg-ivory-deep"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-ink-muted">
              Ce qu'on propose
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Des catégories pensées pour nous.
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {modules.map((m) => (
            <ModuleCard key={m.key} module={m} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ModuleCard({ module }: { module: ModuleWithState }) {
  const tokens = COLOR_TOKEN[module.color];
  const href =
    module.status === "ENABLED" ? `/${module.key}` : `/bientot/${module.key}`;
  const isComingSoon = module.status === "COMING_SOON";

  return (
    <Link
      href={href}
      className={`group relative flex flex-col overflow-hidden rounded-2xl p-6 shadow-card transition hover:shadow-float sm:p-7 ${
        isComingSoon
          ? `${tokens.soft} text-ink`
          : `${tokens.bg} text-ivory`
      }`}
    >
      <div className="flex items-start justify-between">
        <span
          className={`text-xs font-medium uppercase tracking-wider ${
            isComingSoon ? tokens.text : "opacity-80"
          }`}
        >
          {module.label}
        </span>
        {isComingSoon ? (
          <span className="rounded-full border border-ink/15 bg-ivory px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-ink-muted">
            Bientôt
          </span>
        ) : (
          <span className="opacity-80 transition group-hover:translate-x-1">
            <ArrowRight />
          </span>
        )}
      </div>

      <div className="mt-6 flex flex-1 flex-col">
        <div className={isComingSoon ? tokens.text : "opacity-95"}>
          <ModuleIcon name={module.iconName} size={36} />
        </div>
        <h3 className="mt-3 font-display text-xl font-semibold leading-tight tracking-tight sm:text-2xl">
          {module.labelLong}
        </h3>
        <p
          className={`mt-2 text-sm leading-relaxed ${
            isComingSoon ? "text-ink-muted" : "opacity-90"
          }`}
        >
          {module.tagline}
        </p>
      </div>
    </Link>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "1",
      title: "Publie en 1 minute",
      body: "Pas de compte, pas de vérif. Juste ton annonce, une photo, un numéro.",
    },
    {
      n: "2",
      title: "Partage le lien",
      body: "Chaque annonce a une URL propre, prête à être envoyée en groupe WhatsApp.",
    },
    {
      n: "3",
      title: "Contact direct",
      body: "WhatsApp, téléphone, e-mail. Zéro intermédiaire, zéro commission.",
    },
  ];
  return (
    <section className="border-t border-sand">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <p className="text-xs font-medium uppercase tracking-wider text-ink-muted">
          Comment ça marche
        </p>
        <h2 className="mt-2 max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Simple. Direct. Entre nous.
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-10">
          {steps.map((s) => (
            <div key={s.n}>
              <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 font-display text-lg font-semibold text-navy">
                {s.n}
              </div>
              <h3 className="font-display text-xl font-semibold tracking-tight">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-sand bg-ivory-deep safe-bottom">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-display text-base text-ink-muted">
          Bisso <span className="italic">na</span> Bisso — entre nous, pour nous.
        </p>
        <p className="text-xs text-ink-muted">
          © {new Date().getFullYear()} · Fait avec{" "}
          <span className="text-terracotta">♥</span> pour la diaspora.
        </p>
      </div>
    </footer>
  );
}

function ArrowRight() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function CheckDot() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-navy"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m8 12 3 3 5-6" />
    </svg>
  );
}
