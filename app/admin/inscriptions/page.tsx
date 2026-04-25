import Link from "next/link";
import type { Metadata } from "next";
import { COLOR_TOKEN, getAllModules } from "@/lib/modules";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export const metadata: Metadata = {
  title: "Admin — Inscriptions « Bientôt »",
  robots: { index: false, follow: false },
};

export default async function AdminInscriptionsPage() {
  await requireAdmin();

  const [modules, interests] = await Promise.all([
    getAllModules(),
    prisma.moduleInterest.findMany({
      orderBy: [{ createdAt: "desc" }],
      include: { module: true },
    }),
  ]);

  // Group interests by module key for the summary view.
  const byModule = new Map<
    string,
    { key: string; label: string; count: number; emails: typeof interests }
  >();
  for (const m of modules) {
    if (m.status !== "COMING_SOON") continue;
    byModule.set(m.key, {
      key: m.key,
      label: m.label,
      count: 0,
      emails: [],
    });
  }
  for (const i of interests) {
    const key = i.module.key;
    const bucket = byModule.get(key);
    if (bucket) {
      bucket.count += 1;
      bucket.emails.push(i);
    }
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <header>
        <p className="text-xs font-medium uppercase tracking-wider text-ink-muted">
          Admin · Inscriptions
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Liste d'attente.
        </h1>
        <p className="mt-2 max-w-xl text-sm text-ink-muted">
          E-mails laissés sur les pages « Bientôt ». Quand tu actives un
          module, prévins les inscrits en priorité — c'est ta première
          vague d'utilisateurs qualifiés.
        </p>
      </header>

      <div className="mt-8 grid grid-cols-2 gap-3 rounded-2xl border border-sand bg-white p-4 text-center sm:grid-cols-4 sm:p-5">
        <Stat label="Inscriptions totales" value={interests.length.toString()} />
        <Stat
          label="Modules « Bientôt »"
          value={Array.from(byModule.values()).length.toString()}
        />
        <Stat
          label="Avec inscriptions"
          value={Array.from(byModule.values())
            .filter((b) => b.count > 0)
            .length.toString()}
        />
        <Stat
          label="Top module"
          value={
            Array.from(byModule.values()).sort(
              (a, b) => b.count - a.count,
            )[0]?.label ?? "—"
          }
        />
      </div>

      {interests.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-sand bg-white p-10 text-center">
          <p className="font-display text-lg font-semibold">
            Aucune inscription pour l'instant.
          </p>
          <p className="mt-1 text-sm text-ink-muted">
            Dès qu'un visiteur laisse son e-mail sur une page « Bientôt »,
            il apparaît ici.
          </p>
        </div>
      ) : (
        <div className="mt-10 space-y-6">
          {Array.from(byModule.values())
            .filter((b) => b.count > 0)
            .sort((a, b) => b.count - a.count)
            .map((bucket) => {
              const moduleSpec = modules.find((m) => m.key === bucket.key);
              const tokens = moduleSpec
                ? COLOR_TOKEN[moduleSpec.color]
                : null;
              return (
                <section
                  key={bucket.key}
                  className="overflow-hidden rounded-2xl border border-sand bg-white"
                >
                  <header
                    className={`flex items-center justify-between gap-3 px-5 py-3 ${tokens?.soft ?? ""}`}
                  >
                    <div>
                      <p
                        className={`text-[10px] font-medium uppercase tracking-wider ${tokens?.text ?? "text-ink-muted"}`}
                      >
                        {bucket.label}
                      </p>
                      <p className="mt-0.5 font-display text-base font-semibold tracking-tight">
                        {bucket.count} inscrit{bucket.count > 1 ? "s" : ""}
                      </p>
                    </div>
                    <Link
                      href={`/bientot/${bucket.key}`}
                      target="_blank"
                      className="text-xs text-ink-muted underline-offset-4 hover:text-ink hover:underline"
                    >
                      Voir la page →
                    </Link>
                  </header>
                  <ul className="divide-y divide-sand">
                    {bucket.emails.map((i) => (
                      <li
                        key={i.id}
                        className="flex items-baseline justify-between gap-3 px-5 py-3"
                      >
                        <a
                          href={`mailto:${i.email}`}
                          className="font-mono text-sm text-ink hover:underline"
                        >
                          {i.email}
                        </a>
                        <span className="text-xs text-ink-muted">
                          {formatDate(i.createdAt)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
        </div>
      )}
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

function formatDate(d: Date): string {
  return new Intl.DateTimeFormat("fr-BE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}
