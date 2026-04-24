"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { isValidModuleKey, type ModuleStatus } from "@/lib/modules-catalog";

const ALLOWED_STATUSES: ModuleStatus[] = [
  "ENABLED",
  "COMING_SOON",
  "DISABLED",
];

export async function setModuleStatus(
  key: string,
  status: ModuleStatus,
): Promise<void> {
  await requireAdmin();
  if (!isValidModuleKey(key)) return;
  if (!ALLOWED_STATUSES.includes(status)) return;
  await prisma.module.update({
    where: { key },
    data: { status },
  });
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/publier");
  revalidatePath(`/${key}`);
  revalidatePath(`/bientot/${key}`);
}

export async function moveModule(
  key: string,
  direction: "up" | "down",
): Promise<void> {
  await requireAdmin();
  if (!isValidModuleKey(key)) return;

  const rows = await prisma.module.findMany({
    orderBy: [{ order: "asc" }, { key: "asc" }],
    select: { id: true, key: true, order: true },
  });
  const idx = rows.findIndex((r) => r.key === key);
  if (idx < 0) return;

  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= rows.length) return;

  const a = rows[idx];
  const b = rows[swapIdx];
  await prisma.$transaction([
    prisma.module.update({
      where: { id: a.id },
      data: { order: b.order },
    }),
    prisma.module.update({
      where: { id: b.id },
      data: { order: a.order },
    }),
  ]);
  revalidatePath("/");
  revalidatePath("/admin");
}
