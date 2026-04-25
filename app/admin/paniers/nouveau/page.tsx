import Link from "next/link";
import type { Metadata } from "next";
import { BasketForm } from "@/components/basket-form";
import { requireAdmin } from "@/lib/admin";

export const metadata: Metadata = {
  title: "Admin — Nouveau panier",
  robots: { index: false, follow: false },
};

export default async function NewBasketPage() {
  await requireAdmin();
  return (
    <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <nav className="text-sm text-ink-muted">
        <Link href="/admin/paniers" className="hover:text-ink">
          ← Catalogue
        </Link>
      </nav>
      <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        Nouveau panier.
      </h1>
      <p className="mt-2 text-sm text-ink-muted">
        Une fois créé, il apparaît sur{" "}
        <Link href="/colis-alimentaires" className="underline hover:text-ink">
          /colis-alimentaires
        </Link>{" "}
        s'il est actif.
      </p>
      <div className="mt-8">
        <BasketForm mode="create" defaults={{ active: true, order: 999 }} />
      </div>
    </section>
  );
}
