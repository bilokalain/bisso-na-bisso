"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import {
  CATEGORIES_EVENEMENTIEL,
  MATIERES,
  MODALITES,
  NIVEAUX,
  VILLES_SUGGEREES,
} from "@/lib/constants";

type Props = {
  formProfile: string;
};

export function FiltersBar({ formProfile }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function update(key: string, value: string) {
    const next = new URLSearchParams(params?.toString() ?? "");
    if (value) next.set(key, value);
    else next.delete(key);
    startTransition(() => {
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    });
  }

  const clearAll = () => {
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  };

  const hasAnyFilter = Array.from(params?.keys() ?? []).length > 0;

  return (
    <div className="sticky top-[57px] z-20 border-b border-sand bg-ivory/85 backdrop-blur md:top-[65px]">
      <div
        className={`mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 py-3 transition ${
          isPending ? "opacity-60" : ""
        }`}
      >
        {formProfile === "evenementiel" && (
          <>
            <Select
              label="Catégorie"
              name="categorie"
              value={params?.get("categorie") ?? ""}
              onChange={(v) => update("categorie", v)}
              options={CATEGORIES_EVENEMENTIEL}
            />
            <VilleInput
              name="ville"
              value={params?.get("ville") ?? ""}
              onChange={(v) => update("ville", v)}
            />
          </>
        )}

        {formProfile === "colis" && (
          <>
            <VilleInput
              name="depart"
              placeholder="Ville de départ"
              value={params?.get("depart") ?? ""}
              onChange={(v) => update("depart", v)}
            />
            <VilleInput
              name="arrivee"
              placeholder="Ville d'arrivée"
              value={params?.get("arrivee") ?? ""}
              onChange={(v) => update("arrivee", v)}
            />
          </>
        )}

        {formProfile === "repetiteur" && (
          <>
            <Select
              label="Matière"
              name="matiere"
              value={params?.get("matiere") ?? ""}
              onChange={(v) => update("matiere", v)}
              options={MATIERES}
            />
            <Select
              label="Niveau"
              name="niveau"
              value={params?.get("niveau") ?? ""}
              onChange={(v) => update("niveau", v)}
              options={NIVEAUX}
            />
            <Select
              label="Modalité"
              name="modalite"
              value={params?.get("modalite") ?? ""}
              onChange={(v) => update("modalite", v)}
              options={MODALITES}
            />
          </>
        )}

        {formProfile === "standard" && (
          <VilleInput
            name="ville"
            value={params?.get("ville") ?? ""}
            onChange={(v) => update("ville", v)}
          />
        )}

        {hasAnyFilter && (
          <button
            type="button"
            onClick={clearAll}
            className="ml-auto text-xs text-ink-muted underline underline-offset-4 hover:text-ink"
          >
            Effacer les filtres
          </button>
        )}
      </div>
    </div>
  );
}

function Select({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly { value: string; label: string }[];
}) {
  return (
    <label className="inline-flex h-10 items-center gap-2 rounded-full border border-sand bg-ivory px-3 text-sm text-ink">
      <span className="sr-only">{label}</span>
      <select
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent pr-1 text-sm focus:outline-none"
      >
        <option value="">{label}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function VilleInput({
  name,
  value,
  placeholder = "Ville",
  onChange,
}: {
  name: string;
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
}) {
  const listId = `villes-${name}`;
  return (
    <label className="inline-flex h-10 items-center gap-2 rounded-full border border-sand bg-ivory px-3 text-sm">
      <span className="sr-only">{placeholder}</span>
      <input
        name={name}
        type="text"
        value={value}
        list={listId}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-36 bg-transparent text-sm placeholder:text-ink-subtle focus:outline-none"
      />
      <datalist id={listId}>
        {VILLES_SUGGEREES.map((v) => (
          <option key={v} value={v} />
        ))}
      </datalist>
    </label>
  );
}
