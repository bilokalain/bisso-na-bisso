import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { InterestForm } from "@/components/interest-form";
import { ModuleIcon } from "@/components/module-icon";
import { prisma } from "@/lib/prisma";
import {
  COLOR_TOKEN,
  getEnabledModules,
  getModuleByKey,
} from "@/lib/modules";

type Props = { params: Promise<{ key: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { key } = await params;
  const module = await getModuleByKey(key);
  if (!module) return {};
  return {
    title: `${module.labelLong} — Bientôt`,
    description: `${module.labelLong} arrive bientôt sur Bisso na Bisso. ${module.tagline}`,
  };
}

export default async function ComingSoonPage({ params }: Props) {
  const { key } = await params;
  const module = await getModuleByKey(key);
  if (!module || module.status === "DISABLED") notFound();
  if (module.status === "ENABLED") redirect(`/${module.key}`);

  const interestCount = await prisma.moduleInterest.count({
    where: { moduleId: module.id },
  });
  const tokens = COLOR_TOKEN[module.color];
  const enabled = (await getEnabledModules()).slice(0, 3);

  return (
    <>
      <section className={`relative overflow-hidden ${tokens.soft}`}>
        <div className="mx-auto max-w-3xl px-4 py-14 sm:py-20">
          <Link
            href="/"
            className="text-sm text-ink-muted hover:text-ink"
          >
            ← Accueil
          </Link>

          <div className={`mt-8 inline-flex items-center gap-3 rounded-full border border-ink/10 bg-ivory px-4 py-1.5 text-xs font-medium uppercase tracking-wider ${tokens.text}`}>
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
            Bientôt dispo
          </div>

          <div className={`mt-8 ${tokens.text}`}>
            <ModuleIcon name={module.iconName} size={56} />
          </div>

          <h1 className="mt-6 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            {module.labelLong} <span className={tokens.text}>arrive bientôt.</span>
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-muted">
            {module.description}
          </p>

          <div className="mt-10 rounded-2xl border border-ink/10 bg-ivory p-5 sm:p-6">
            <p className="font-display text-lg font-semibold">
              Premiers arrivés, premiers servis.
            </p>
            <p className="mt-1 text-sm text-ink-muted">
              Laisse ton e-mail — tu seras informé dès l'ouverture, et tu
              auras la priorité pour publier les premières annonces.
            </p>
            <div className="mt-5">
              <InterestForm moduleKey={module.key} color={module.color} />
            </div>
            {interestCount > 0 ? (
              <p className="mt-4 text-xs text-ink-muted">
                {interestCount} personne{interestCount > 1 ? "s" : ""}{" "}
                attend{interestCount > 1 ? "ent" : ""} déjà.
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="border-t border-sand">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
          <p className="text-xs font-medium uppercase tracking-wider text-ink-muted">
            En attendant
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Ce qui est déjà disponible
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {enabled.map((m) => {
              const t = COLOR_TOKEN[m.color];
              return (
                <Link
                  key={m.key}
                  href={`/${m.key}`}
                  className={`rounded-2xl p-4 transition hover:-translate-y-0.5 ${t.soft}`}
                >
                  <p
                    className={`text-xs font-medium uppercase tracking-wider ${t.text}`}
                  >
                    {m.label}
                  </p>
                  <p className="mt-1 font-display text-base font-semibold tracking-tight text-ink">
                    {m.labelLong}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
