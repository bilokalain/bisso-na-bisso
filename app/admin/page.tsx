import type { Metadata } from "next";
import { logoutAdmin } from "@/app/actions/admin-auth";
import { moveModule, setModuleStatus } from "@/app/actions/admin-modules";
import { ModuleIcon } from "@/components/module-icon";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import {
  COLOR_TOKEN,
  getAllModules,
  type ModuleStatus,
  type ModuleWithState,
} from "@/lib/modules";

export const metadata: Metadata = {
  title: "Admin — Modules",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  await requireAdmin();

  const modules = await getAllModules();

  const [activeCount, annonceCount, interestCount] = await Promise.all([
    modules.filter((m) => m.status === "ENABLED").length,
    prisma.annonce.count({ where: { status: "ACTIVE" } }),
    prisma.moduleInterest.count(),
  ]);

  // Count annonces per module and interests per module in one pass.
  const annonceByType = await prisma.annonce.groupBy({
    by: ["type"],
    _count: { _all: true },
    where: { status: "ACTIVE" },
  });
  const annonceCountMap = new Map<string, number>(
    annonceByType.map((r) => [r.type, r._count._all]),
  );

  const interestsByModule = await prisma.moduleInterest.groupBy({
    by: ["moduleId"],
    _count: { _all: true },
  });
  const interestCountMap = new Map<string, number>(
    interestsByModule.map((r) => [r.moduleId, r._count._all]),
  );

  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-ink-muted">
            Admin
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Modules.
          </h1>
          <p className="mt-2 text-ink-muted">
            Active, retire ou programme chaque catégorie. Les changements sont
            visibles immédiatement sur le site public.
          </p>
        </div>
        <form action={logoutAdmin}>
          <button
            type="submit"
            className="rounded-full border border-ink/15 bg-ivory px-4 py-2 text-sm text-ink-muted transition hover:border-ink/30 hover:text-ink"
          >
            Déconnexion
          </button>
        </form>
      </header>

      <div className="mt-8 grid grid-cols-3 gap-3 rounded-2xl border border-sand bg-ivory-deep p-4 text-center sm:gap-6 sm:p-6">
        <Stat label="Modules actifs" value={`${activeCount}/${modules.length}`} />
        <Stat label="Annonces actives" value={annonceCount.toString()} />
        <Stat label="Inscrits « bientôt »" value={interestCount.toString()} />
      </div>

      <div className="mt-10 flex flex-col gap-3">
        {modules.map((m, idx) => (
          <ModuleRow
            key={m.key}
            module={m}
            position={idx + 1}
            isFirst={idx === 0}
            isLast={idx === modules.length - 1}
            annonceCount={annonceCountMap.get(m.key) ?? 0}
            interestCount={interestCountMap.get(m.id) ?? 0}
          />
        ))}
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-display text-3xl font-semibold tracking-tight">
        {value}
      </p>
      <p className="mt-1 text-xs text-ink-muted">{label}</p>
    </div>
  );
}

function ModuleRow({
  module,
  position,
  isFirst,
  isLast,
  annonceCount,
  interestCount,
}: {
  module: ModuleWithState;
  position: number;
  isFirst: boolean;
  isLast: boolean;
  annonceCount: number;
  interestCount: number;
}) {
  const tokens = COLOR_TOKEN[module.color];

  return (
    <div className="flex flex-col gap-4 overflow-hidden rounded-2xl border border-sand bg-ivory sm:flex-row sm:items-center">
      <div
        className={`flex items-center gap-4 px-5 py-4 sm:w-72 sm:flex-shrink-0 ${tokens.soft}`}
      >
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${tokens.bg} text-ivory`}
        >
          <ModuleIcon name={module.iconName} size={22} />
        </div>
        <div className="min-w-0">
          <p
            className={`text-[10px] font-medium uppercase tracking-wider ${tokens.text}`}
          >
            #{position} · {module.formProfile}
          </p>
          <p className="mt-0.5 truncate font-display text-base font-semibold tracking-tight text-ink">
            {module.label}
          </p>
          <p className="truncate text-xs text-ink-muted">
            {module.tagline}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-wrap items-center gap-x-6 gap-y-3 px-5 py-4">
        <Counts
          annonceCount={annonceCount}
          interestCount={interestCount}
          status={module.status}
        />

        <StatusSwitch moduleKey={module.key} current={module.status} />

        <OrderButtons
          moduleKey={module.key}
          isFirst={isFirst}
          isLast={isLast}
        />
      </div>
    </div>
  );
}

function Counts({
  annonceCount,
  interestCount,
  status,
}: {
  annonceCount: number;
  interestCount: number;
  status: ModuleStatus;
}) {
  if (status === "COMING_SOON") {
    return (
      <div className="text-xs text-ink-muted">
        <span className="font-medium text-ink">{interestCount}</span>{" "}
        inscrit{interestCount > 1 ? "s" : ""} en attente
      </div>
    );
  }
  return (
    <div className="text-xs text-ink-muted">
      <span className="font-medium text-ink">{annonceCount}</span>{" "}
      annonce{annonceCount > 1 ? "s" : ""}
    </div>
  );
}

function StatusSwitch({
  moduleKey,
  current,
}: {
  moduleKey: string;
  current: ModuleStatus;
}) {
  const options: { value: ModuleStatus; label: string; color: string }[] = [
    { value: "ENABLED", label: "Actif", color: "bg-forest text-ivory" },
    {
      value: "COMING_SOON",
      label: "Bientôt",
      color: "bg-gold text-ivory",
    },
    { value: "DISABLED", label: "Off", color: "bg-graphite text-ivory" },
  ];
  return (
    <div className="inline-flex rounded-full border border-sand bg-ivory p-1">
      {options.map((o) => {
        const active = o.value === current;
        return (
          <form
            key={o.value}
            action={setModuleStatus.bind(null, moduleKey, o.value)}
          >
            <button
              type="submit"
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                active
                  ? o.color
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              {o.label}
            </button>
          </form>
        );
      })}
    </div>
  );
}

function OrderButtons({
  moduleKey,
  isFirst,
  isLast,
}: {
  moduleKey: string;
  isFirst: boolean;
  isLast: boolean;
}) {
  return (
    <div className="ml-auto inline-flex gap-1">
      <form action={moveModule.bind(null, moduleKey, "up")}>
        <button
          type="submit"
          disabled={isFirst}
          aria-label="Monter"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-sand bg-ivory text-ink-muted transition hover:border-ink/30 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
        >
          ↑
        </button>
      </form>
      <form action={moveModule.bind(null, moduleKey, "down")}>
        <button
          type="submit"
          disabled={isLast}
          aria-label="Descendre"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-sand bg-ivory text-ink-muted transition hover:border-ink/30 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
        >
          ↓
        </button>
      </form>
    </div>
  );
}
