import Image from "next/image";
import Link from "next/link";
import type { Annonce } from "@/lib/annonces";
import {
  CATEGORIES_EVENEMENTIEL,
  MATIERES,
  MODALITES,
  NIVEAUX,
  VERTICALES,
  labelFor,
  type AnnonceType,
} from "@/lib/constants";

type Props = {
  annonce: Annonce;
};

export function AnnonceCard({ annonce }: Props) {
  const type = annonce.type as AnnonceType;
  const vertical = VERTICALES[type];
  const href = `/${type}/${annonce.slug}`;

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-2xl border border-sand bg-ivory transition hover:-translate-y-0.5 hover:shadow-card"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand">
        {annonce.photo ? (
          <Image
            src={annonce.photo}
            alt={annonce.titre}
            fill
            sizes="(min-width: 640px) 33vw, 100vw"
            className="object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <PlaceholderArt type={type} />
        )}
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-ivory ${vertical.accentBg}`}
        >
          {vertical.eyebrow}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="line-clamp-2 font-display text-lg font-semibold leading-snug tracking-tight text-ink">
          {annonce.titre}
        </h3>
        <Meta annonce={annonce} />
      </div>
    </Link>
  );
}

function Meta({ annonce }: Props) {
  const type = annonce.type as AnnonceType;

  if (type === "colis") {
    const d = annonce.dateVoyage
      ? new Date(annonce.dateVoyage).toLocaleDateString("fr-BE", {
          day: "numeric",
          month: "short",
        })
      : null;
    return (
      <div className="mt-auto space-y-2 text-sm">
        <div className="flex items-center gap-2 text-ink">
          <span className="truncate font-medium">{annonce.villeDepart}</span>
          <Arrow />
          <span className="truncate font-medium">{annonce.villeArrivee}</span>
        </div>
        <div className="flex items-center gap-3 text-ink-muted">
          {d && <span>{d}</span>}
          {annonce.kgDispo != null && <span>{annonce.kgDispo} kg dispo</span>}
          {annonce.prixParKg != null && (
            <span className="ml-auto font-medium text-ink">
              {annonce.prixParKg} €/kg
            </span>
          )}
        </div>
      </div>
    );
  }

  if (type === "repetiteur") {
    const matiere = labelFor(MATIERES, annonce.matiere);
    const niveau = labelFor(NIVEAUX, annonce.niveau);
    const modalite = labelFor(MODALITES, annonce.modalite);
    return (
      <div className="mt-auto space-y-2 text-sm">
        <div className="flex flex-wrap items-center gap-1.5">
          {matiere && <Pill>{matiere}</Pill>}
          {niveau && <Pill>{niveau}</Pill>}
          {modalite && <Pill muted>{modalite}</Pill>}
        </div>
        <div className="flex items-center gap-3 text-ink-muted">
          {annonce.ville && <span>{annonce.ville}</span>}
          {annonce.prix != null && (
            <span className="ml-auto font-medium text-ink">
              {annonce.prix} €/h
            </span>
          )}
        </div>
      </div>
    );
  }

  // evenementiel
  const categorie = labelFor(CATEGORIES_EVENEMENTIEL, annonce.categorie);
  return (
    <div className="mt-auto space-y-2 text-sm">
      <div className="flex flex-wrap items-center gap-1.5">
        {categorie && <Pill>{categorie}</Pill>}
        {annonce.ville && <Pill muted>{annonce.ville}</Pill>}
      </div>
      {annonce.prix != null && (
        <div className="flex items-center justify-end text-ink">
          <span className="text-xs text-ink-muted">à partir de</span>
          <span className="ml-1 font-medium">
            {annonce.prix} {annonce.devise === "EUR" ? "€" : annonce.devise}
          </span>
        </div>
      )}
    </div>
  );
}

function Pill({
  children,
  muted = false,
}: {
  children: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${
        muted
          ? "border-sand bg-ivory-deep text-ink-muted"
          : "border-ink/10 bg-ivory text-ink"
      }`}
    >
      {children}
    </span>
  );
}

function Arrow() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-ink-subtle"
      aria-hidden
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function PlaceholderArt({ type }: { type: AnnonceType }) {
  // Subtle gradient fallback keyed on the vertical, so no-photo cards stay
  // on-brand rather than looking broken.
  const bg =
    type === "evenementiel"
      ? "linear-gradient(135deg, #1B5E3F 0%, #123F2A 100%)"
      : type === "colis"
        ? "linear-gradient(135deg, #C85A3B 0%, #A44529 100%)"
        : "linear-gradient(135deg, #EFE6D6 0%, #D4A62A 100%)";
  return (
    <div
      className="flex h-full w-full items-center justify-center text-ivory"
      style={{ background: bg }}
      aria-hidden
    >
      <span className="font-display text-4xl opacity-70">
        B<span className="opacity-80">.</span>
      </span>
    </div>
  );
}
