import { prisma } from "@/lib/prisma";
import {
  MODULE_CATALOG,
  getSpec,
  isValidModuleKey,
  type ModuleStatus,
  type ModuleWithState,
} from "@/lib/modules-catalog";

// Re-export everything from the catalog so existing server-side imports
// from `@/lib/modules` keep working without a wider refactor.
export * from "@/lib/modules-catalog";

type ModuleRow = {
  id: string;
  key: string;
  status: string;
  order: number;
};

function hydrate(row: ModuleRow): ModuleWithState | null {
  const spec = getSpec(row.key);
  if (!spec) return null; // orphan DB row — catalog changed
  return {
    ...spec,
    id: row.id,
    status: row.status as ModuleStatus,
    order: row.order,
  };
}

/** All modules known to the DB, in admin order. Includes DISABLED ones. */
export async function getAllModules(): Promise<ModuleWithState[]> {
  const rows = await prisma.module.findMany({
    orderBy: [{ order: "asc" }, { key: "asc" }],
  });
  return rows
    .map(hydrate)
    .filter((m): m is ModuleWithState => m !== null);
}

/** Modules visible to the public (ENABLED + COMING_SOON), in display order. */
export async function getPublicModules(): Promise<ModuleWithState[]> {
  const all = await getAllModules();
  return all.filter((m) => m.status !== "DISABLED");
}

export async function getEnabledModules(): Promise<ModuleWithState[]> {
  const all = await getAllModules();
  return all.filter((m) => m.status === "ENABLED");
}

export async function getModuleByKey(
  key: string,
): Promise<ModuleWithState | null> {
  if (!isValidModuleKey(key)) return null;
  const row = await prisma.module.findUnique({ where: { key } });
  if (!row) return null;
  return hydrate(row);
}

// Keep the catalog export available at module level for callers that expect
// it (seed script etc. import directly from "@/lib/modules").
export { MODULE_CATALOG };
