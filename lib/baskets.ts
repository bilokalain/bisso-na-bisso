import { prisma } from "@/lib/prisma";

export async function listActiveBaskets(destination = "kinshasa") {
  return prisma.basket.findMany({
    where: { active: true, destination },
    orderBy: [{ order: "asc" }, { priceEUR: "asc" }],
    include: {
      items: {
        orderBy: [{ order: "asc" }],
      },
    },
  });
}

export async function getBasketBySlug(slug: string) {
  return prisma.basket.findUnique({
    where: { slug },
    include: {
      items: { orderBy: [{ order: "asc" }] },
    },
  });
}

export async function listAllBaskets() {
  return prisma.basket.findMany({
    orderBy: [{ order: "asc" }],
    include: { items: { orderBy: [{ order: "asc" }] } },
  });
}

/**
 * Human-readable reference for orders: BNB-<6 alphanumerics>.
 * Enough entropy for tens of thousands of orders without collision.
 */
export function buildOrderReference(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no I/O/0/1 for readability
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `BNB-${code}`;
}

export function formatEUR(cents: number): string {
  return (cents / 100).toLocaleString("fr-BE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });
}

export type { Basket, BasketItem, Order } from "@/generated/prisma/client";
