import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { GuideForm } from "@/components/guide-form";
import { requireAdmin } from "@/lib/admin";
import { getGuideById } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Admin — Éditer un guide",
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ id: string }> };

export default async function EditGuidePage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;
  const guide = await getGuideById(id);
  if (!guide) notFound();

  return (
    <section className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <nav className="text-sm text-ink-muted">
        <Link href="/admin/guides" className="hover:text-ink">
          ← Guides
        </Link>
      </nav>
      <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
        Modifier le guide.
      </h1>
      <p className="mt-2 text-ink-muted">
        Les changements sont visibles immédiatement sur{" "}
        <Link
          href={`/infos-rapides/${guide.slug}`}
          target="_blank"
          className="underline hover:text-ink"
        >
          la page publique
        </Link>
        .
      </p>
      <div className="mt-10">
        <GuideForm
          mode="edit"
          guideId={guide.id}
          defaults={{
            title: guide.title,
            tldr: guide.tldr,
            content: guide.content,
            category: guide.category,
            heroImage: guide.heroImage,
            readingMinutes: guide.readingMinutes,
            authorName: guide.authorName,
          }}
        />
      </div>
    </section>
  );
}
