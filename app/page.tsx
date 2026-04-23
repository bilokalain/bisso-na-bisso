import Link from "next/link";

export default function Home() {
  return (
    <>
      <Hero />
      <Verticales />
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
        <span className="inline-flex items-center gap-2 rounded-full border border-sand bg-ivory px-3 py-1 text-xs font-medium uppercase tracking-wider text-ink-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-terracotta" />
          Diaspora · Belgique
        </span>
        <h1 className="mt-5 max-w-3xl font-display text-5xl font-semibold leading-[1.02] tracking-tight text-ink sm:text-6xl md:text-7xl">
          Entre nous,{" "}
          <span className="italic text-forest">pour nous.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted sm:text-xl">
          Les bons plans de la communauté, sans friction&nbsp;: prestataires de
          fête, co-transport de colis, profs particuliers. Gratuit, sans
          compte, contact direct.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/publier"
            className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-base font-medium text-ivory shadow-card transition hover:bg-forest-deep active:scale-[0.98]"
          >
            Publier une annonce
            <ArrowRight />
          </Link>
          <a
            href="#verticales"
            className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-ivory px-6 py-3 text-base font-medium text-ink transition hover:border-ink/30"
          >
            Parcourir
          </a>
        </div>
        <p className="mt-6 flex items-center gap-2 text-sm text-ink-muted">
          <CheckDot /> Gratuit · Sans compte · Contact direct par WhatsApp
        </p>
      </div>
    </section>
  );
}

function Verticales() {
  return (
    <section id="verticales" className="scroll-mt-24 border-t border-sand bg-ivory-deep">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-ink-muted">
              Trois catégories
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Ce que tu trouveras ici
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
          <VerticaleCard
            href="/evenementiel"
            eyebrow="Événementiel"
            title="Fêtes, mariages, tous styles"
            description="Coiffure, traiteur, DJ, photo, vidéo, déco, salle, brasseur."
            bg="bg-forest"
            fg="text-ivory"
            accent="text-gold"
            icon={<IconParty />}
          />
          <VerticaleCard
            href="/colis"
            eyebrow="Colis"
            title="Co-transport par voyageurs"
            description="Bruxelles, Kin, Brazza, Paris. Kilos dispo, prix au kilo, date du vol."
            bg="bg-terracotta"
            fg="text-ivory"
            accent="text-ivory"
            icon={<IconPlane />}
          />
          <VerticaleCard
            href="/repetiteur"
            eyebrow="Répétiteurs"
            title="Profs particuliers"
            description="Maths, français, néerlandais, anglais. Primaire au supérieur, en ligne ou chez toi."
            bg="bg-sand"
            fg="text-ink"
            accent="text-terracotta"
            icon={<IconBook />}
          />
        </div>
      </div>
    </section>
  );
}

type CardProps = {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  bg: string;
  fg: string;
  accent: string;
  icon: React.ReactNode;
};

function VerticaleCard({
  href,
  eyebrow,
  title,
  description,
  bg,
  fg,
  accent,
  icon,
}: CardProps) {
  return (
    <Link
      href={href}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl ${bg} ${fg} p-6 shadow-card transition hover:shadow-float sm:min-h-[280px] sm:p-7`}
    >
      <div className="flex items-start justify-between">
        <span
          className={`text-xs font-medium uppercase tracking-wider ${accent}`}
        >
          {eyebrow}
        </span>
        <span className="opacity-80 transition group-hover:translate-x-1">
          <ArrowRight />
        </span>
      </div>
      <div className="mt-8">
        <div className={`mb-4 ${accent}`}>{icon}</div>
        <h3 className="font-display text-2xl font-semibold leading-tight tracking-tight sm:text-[1.75rem]">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed opacity-85">{description}</p>
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
              <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 font-display text-lg font-semibold text-forest">
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

/* --- inline icons --- */

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
      className="text-forest"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m8 12 3 3 5-6" />
    </svg>
  );
}

function IconParty() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5.8 11.3 2 22l10.7-3.79" />
      <path d="M4 3h.01" />
      <path d="M22 8h.01" />
      <path d="M15 2h.01" />
      <path d="M22 20h.01" />
      <path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10" />
      <path d="m22 13-1.3.75a2.9 2.9 0 0 1-3.12-.02l-.41-.27a2.87 2.87 0 0 0-3.1 0l-.29.2a2.87 2.87 0 0 1-3.1 0L10 13.5" />
      <path d="m11 2 .33.5a2.9 2.9 0 0 1 0 3l-.34.5a2.87 2.87 0 0 0 0 3l.34.5" />
    </svg>
  );
}

function IconPlane() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M17.8 19.2 16 11l3.5-3.5A2.12 2.12 0 0 0 16.5 4.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
    </svg>
  );
}

function IconBook() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 7v14" />
      <path d="M16 12h2" />
      <path d="M16 8h2" />
      <path d="M3 18a1 1 0 0 0 1 1h3a4 4 0 0 1 4 2V8a3 3 0 0 0-3-3H4a1 1 0 0 0-1 1z" />
      <path d="M21 18a1 1 0 0 1-1 1h-2.5a4 4 0 0 0-3.5 2V8a3 3 0 0 1 3-3h3a1 1 0 0 1 1 1z" />
    </svg>
  );
}
