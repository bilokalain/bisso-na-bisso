import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BasketForm } from "@/components/basket-form";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Admin — Éditer un panier",
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ id: string }> };

export default async function EditBasketPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;
  const basket = await prisma.basket.findUnique({
    where: { id },
    include: { items: { orderBy: [{ order: "asc" }] } },
  });
  if (!basket) notFound();

  return (
    <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <nav className="text-sm text-ink-muted">
        <Link href="/admin/paniers" className="hover:text-ink">
          ← Catalogue
        </Link>
      </nav>
      <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        Modifier {basket.name}.
      </h1>
      <p className="mt-2 text-sm text-ink-muted">
        Tes changements sont en ligne immédiatement.{" "}
        <Link
          href={`/colis-alimentaires/${basket.slug}`}
          target="_blank"
          className="underline hover:text-ink"
        >
          Voir la page publique
        </Link>
        .
      </p>
      <div className="mt-8">
        <BasketForm
          mode="edit"
          basketId={basket.id}
          defaults={{
            name: basket.name,
            tagline: basket.tagline,
            heroImage: basket.heroImage,
            destination: basket.destination,
            priceEUR: basket.priceEUR,
            active: basket.active,
            order: basket.order,
            items: basket.items.map((it) => ({
              name: it.name,
              quantity: it.quantity,
            })),
          }}
        />
      </div>
    </section>
  );
}
