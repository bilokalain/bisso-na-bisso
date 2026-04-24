import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { PublierForm } from "@/components/publier-form";
import { COLOR_TOKEN, getModuleByKey } from "@/lib/modules";

type Props = {
  params: Promise<{ type: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params;
  const module = await getModuleByKey(type);
  if (!module) return {};
  return {
    title: `Publier — ${module.labelLong}`,
    description: `Publier une annonce ${module.labelLong.toLowerCase()} sur Bisso na Bisso.`,
  };
}

export default async function PublierTypePage({ params }: Props) {
  const { type } = await params;
  const module = await getModuleByKey(type);
  if (!module) notFound();
  if (module.contentType !== "annonce") notFound();
  if (module.status === "DISABLED") notFound();
  if (module.status === "COMING_SOON") redirect(`/bientot/${module.key}`);

  const tokens = COLOR_TOKEN[module.color];

  return (
    <section className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <nav className="text-sm text-ink-muted">
        <Link href="/publier" className="hover:text-ink">
          ← Changer de catégorie
        </Link>
      </nav>

      <header className="mt-6">
        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wider text-ivory ${tokens.bg}`}
        >
          {module.label}
        </span>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Nouvelle annonce.
        </h1>
        <p className="mt-3 text-ink-muted">{module.tagline}</p>
      </header>

      <div className="mt-10">
        <PublierForm
          type={module.key}
          formProfile={module.formProfile}
          color={module.color}
        />
      </div>
    </section>
  );
}
