import Link from "next/link";
import type { Metadata } from "next";
import { COLOR_TOKEN, getEnabledModules } from "@/lib/modules";

export const metadata: Metadata = {
  title: "Publier une annonce",
  description:
    "Publie une annonce sur Bisso na Bisso — gratuit, sans compte, contact direct.",
};

export default async function PublierPage() {
  const enabled = await getEnabledModules();

  return (
    <section className="mx-auto max-w-3xl px-4 py-10 sm:py-16">
      <header>
        <p className="text-xs font-medium uppercase tracking-wider text-ink-muted">
          Publier
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Tu proposes quoi&nbsp;?
        </h1>
        <p className="mt-3 max-w-xl text-ink-muted">
          Choisis la catégorie. On te guide ensuite avec les champs qui
          comptent pour ton type d'annonce.
        </p>
      </header>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:gap-5">
        {enabled.map((m) => {
          const tokens = COLOR_TOKEN[m.color];
          return (
            <Link
              key={m.key}
              href={`/publier/${m.key}`}
              className={`group flex items-center justify-between gap-4 rounded-2xl ${tokens.bg} p-5 text-ivory shadow-card transition hover:shadow-float sm:p-6`}
            >
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wider opacity-80">
                  {m.label}
                </p>
                <p className="mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                  {m.labelLong}
                </p>
                <p className="mt-1 text-sm opacity-85">{m.tagline}</p>
              </div>
              <span className="shrink-0 opacity-90 transition group-hover:translate-x-1">
                <svg
                  width="22"
                  height="22"
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
              </span>
            </Link>
          );
        })}
      </div>

      <p className="mt-8 text-xs text-ink-muted">
        Gratuit · sans compte · 60 jours en ligne.
      </p>
    </section>
  );
}
