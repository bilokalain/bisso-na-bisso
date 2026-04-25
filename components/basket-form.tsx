"use client";

import { useActionState } from "react";
import {
  createBasket,
  updateBasket,
  type BasketFormState,
} from "@/app/actions/admin-baskets";

const initialState: BasketFormState = {};

type Props = {
  mode: "create" | "edit";
  basketId?: string;
  defaults?: {
    name?: string;
    tagline?: string;
    heroImage?: string | null;
    destination?: string;
    priceEUR?: number;
    active?: boolean;
    order?: number;
    items?: { name: string; quantity: string }[];
  };
};

export function BasketForm({ mode, basketId, defaults = {} }: Props) {
  const action =
    mode === "edit" && basketId
      ? updateBasket.bind(null, basketId)
      : createBasket;
  const [state, formAction, pending] = useActionState(action, initialState);
  const err = state.fieldErrors ?? {};

  const itemsRaw = (defaults.items ?? [])
    .map((it) => `${it.quantity} | ${it.name}`)
    .join("\n");
  const priceDefault =
    defaults.priceEUR != null
      ? (defaults.priceEUR / 100).toFixed(2)
      : "";

  return (
    <form action={formAction} className="space-y-8">
      {state.error ? (
        <div className="rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          {state.error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Nom" error={err.name?.[0]} required>
          <input
            type="text"
            name="name"
            required
            defaultValue={defaults.name}
            minLength={2}
            maxLength={80}
            className={inputCls}
            placeholder="Famille"
          />
        </Field>
        <Field label="Destination" error={err.destination?.[0]} required>
          <input
            type="text"
            name="destination"
            required
            defaultValue={defaults.destination ?? "kinshasa"}
            maxLength={40}
            className={inputCls}
            placeholder="kinshasa"
          />
        </Field>
      </div>

      <Field
        label="Tagline"
        hint="Une phrase courte pour vendre le panier."
        error={err.tagline?.[0]}
        required
      >
        <input
          type="text"
          name="tagline"
          required
          defaultValue={defaults.tagline}
          minLength={8}
          maxLength={200}
          className={inputCls}
          placeholder="5 personnes, 2 semaines."
        />
      </Field>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Field
          label="Prix (EUR TTC)"
          hint="Décimales acceptées."
          error={err.priceEUR?.[0]}
          required
        >
          <input
            type="text"
            name="priceEUR"
            inputMode="decimal"
            required
            defaultValue={priceDefault}
            className={inputCls}
            placeholder="85"
          />
        </Field>
        <Field
          label="Ordre d'affichage"
          hint="Plus petit = plus haut."
          error={err.order?.[0]}
        >
          <input
            type="number"
            name="order"
            min={0}
            max={9999}
            defaultValue={defaults.order ?? 999}
            className={inputCls}
          />
        </Field>
        <Field label="Statut">
          <label className="inline-flex h-12 items-center gap-2 rounded-xl border border-sand bg-white px-4 text-base text-ink">
            <input
              type="checkbox"
              name="active"
              defaultChecked={defaults.active ?? true}
              className="h-4 w-4 rounded border-sand text-navy focus:ring-navy"
            />
            <span>Actif</span>
          </label>
        </Field>
      </div>

      <Field
        label="Image d'en-tête (URL)"
        hint="Unsplash, Imgur, Vercel Blob."
        error={err.heroImage?.[0]}
      >
        <input
          type="url"
          name="heroImage"
          defaultValue={defaults.heroImage ?? ""}
          className={inputCls}
          placeholder="https://images.unsplash.com/..."
        />
      </Field>

      <Field
        label="Contenu du panier"
        hint='Une ligne par produit, format : « quantité | nom » (ex. "5 kg | Riz parfumé")'
        error={err.itemsRaw?.[0]}
      >
        <textarea
          name="itemsRaw"
          defaultValue={itemsRaw}
          rows={10}
          maxLength={2000}
          className={`${inputCls} resize-y font-mono text-sm`}
          placeholder={`5 kg | Riz parfumé\n5 kg | Farine de blé\n4×1 L | Huile végétale\n2 kg | Sucre`}
        />
      </Field>

      <div className="flex flex-col items-stretch gap-3 border-t border-sand pt-6 sm:flex-row sm:items-center sm:justify-end">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-full bg-navy px-6 py-3 text-base font-medium text-ivory shadow-card transition hover:bg-navy-deep active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending
            ? "Enregistrement…"
            : mode === "edit"
              ? "Enregistrer"
              : "Créer le panier"}
        </button>
      </div>
    </form>
  );
}

const inputCls =
  "block w-full rounded-xl border border-sand bg-white px-4 py-3 text-base text-ink placeholder:text-ink-subtle focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20";

function Field({
  label,
  hint,
  error,
  required,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between text-sm font-medium text-ink">
        <span>
          {label}
          {required ? <span className="ml-0.5 text-clay">*</span> : null}
        </span>
        {hint && !error ? (
          <span className="text-xs font-normal text-ink-muted">{hint}</span>
        ) : null}
      </span>
      {children}
      {error ? (
        <span className="mt-1.5 block text-xs text-danger">{error}</span>
      ) : null}
    </label>
  );
}
