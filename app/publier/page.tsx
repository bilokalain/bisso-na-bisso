import Link from "next/link";
import type { Metadata } from "next";
import { VERTICALES, ANNONCE_TYPES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Publier une annonce",
  description:
    "Publie une annonce sur Bisso na Bisso — gratuit, sans compte, contact direct.",
};

export default function PublierPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:py-20">
      <span className="inline-flex items-center gap-2 rounded-full border border-sand bg-ivory px-3 py-1 text-xs font-medium uppercase tracking-wider text-ink-muted">
        <span className="h-1.5 w-1.5 rounded-full bg-terracotta" />
        Bientôt
      </span>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
        Publier une annonce.
      </h1>
      <p className="mt-4 max-w-xl text-lg text-ink-muted">
        Le formulaire de dépôt arrive dans la prochaine étape. En attendant,
        parcours ce qui est déjà là.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {ANNONCE_TYPES.map((t) => (
          <Link
            key={t}
            href={`/${t}`}
            className="rounded-2xl border border-sand bg-ivory p-5 transition hover:border-ink/20"
          >
            <span
              className={`text-xs font-medium uppercase tracking-wider ${VERTICALES[t].accentText}`}
            >
              {VERTICALES[t].eyebrow}
            </span>
            <p className="mt-2 font-display text-xl font-semibold">
              Voir les annonces
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
