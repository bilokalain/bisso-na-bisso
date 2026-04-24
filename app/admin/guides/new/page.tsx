import Link from "next/link";
import type { Metadata } from "next";
import { GuideForm } from "@/components/guide-form";
import { requireAdmin } from "@/lib/admin";

export const metadata: Metadata = {
  title: "Admin — Nouveau guide",
  robots: { index: false, follow: false },
};

export default async function NewGuidePage() {
  await requireAdmin();
  return (
    <section className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <nav className="text-sm text-ink-muted">
        <Link href="/admin/guides" className="hover:text-ink">
          ← Guides
        </Link>
      </nav>
      <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
        Nouveau guide.
      </h1>
      <p className="mt-2 text-ink-muted">
        Rédige en brouillon. Tu pourras publier d'un clic ensuite.
      </p>
      <div className="mt-10">
        <GuideForm mode="create" />
      </div>
    </section>
  );
}
