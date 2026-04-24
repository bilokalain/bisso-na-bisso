"use client";

import { useActionState } from "react";
import {
  createGuide,
  updateGuide,
  type GuideFormState,
} from "@/app/actions/admin-guides";
import { GUIDE_CATEGORIES } from "@/lib/guides-catalog";

const initialState: GuideFormState = {};

type Props = {
  mode: "create" | "edit";
  guideId?: string;
  defaults?: {
    title?: string;
    tldr?: string;
    content?: string;
    category?: string;
    heroImage?: string | null;
    readingMinutes?: number;
    authorName?: string | null;
  };
};

export function GuideForm({ mode, guideId, defaults = {} }: Props) {
  const action =
    mode === "edit" && guideId ? updateGuide.bind(null, guideId) : createGuide;
  const [state, formAction, pending] = useActionState(action, initialState);
  const err = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-8">
      {state.error ? (
        <div className="rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          {state.error}
        </div>
      ) : null}

      <Field
        label="Titre"
        hint="Formulé comme la question que les gens tapent sur Google."
        error={err.title?.[0]}
        required
      >
        <input
          type="text"
          name="title"
          required
          defaultValue={defaults.title}
          minLength={4}
          maxLength={160}
          className={inputCls}
          placeholder="Première déclaration d'impôts en Belgique"
        />
      </Field>

      <Field
        label="Résumé (TL;DR)"
        hint="Affiché sur la carte et en haut du guide. 1 à 3 phrases, 20 à 400 caractères."
        error={err.tldr?.[0]}
        required
      >
        <textarea
          name="tldr"
          required
          defaultValue={defaults.tldr}
          minLength={20}
          maxLength={400}
          rows={3}
          className={`${inputCls} resize-y`}
        />
      </Field>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Field label="Catégorie" error={err.category?.[0]} required>
          <select
            name="category"
            required
            defaultValue={defaults.category ?? ""}
            className={`${inputCls} appearance-none pr-10`}
          >
            <option value="" disabled>
              Choisir…
            </option>
            {GUIDE_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="Temps de lecture"
          hint="En minutes."
          error={err.readingMinutes?.[0]}
        >
          <input
            type="number"
            name="readingMinutes"
            min={1}
            max={60}
            defaultValue={defaults.readingMinutes ?? 5}
            className={inputCls}
          />
        </Field>

        <Field
          label="Auteur (optionnel)"
          hint="Affiché sous le titre. Crédit communauté."
          error={err.authorName?.[0]}
        >
          <input
            type="text"
            name="authorName"
            maxLength={80}
            defaultValue={defaults.authorName ?? ""}
            className={inputCls}
            placeholder="Prénom, métier"
          />
        </Field>
      </div>

      <Field
        label="Image d'en-tête (URL, optionnel)"
        hint="Unsplash, Imgur, Google Photos. Ratio 16/9 idéalement."
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
        label="Contenu"
        hint="Markdown accepté. Structure type : ## Ce qu'il te faut — ## Les étapes — ## Les pièges — ## Liens officiels"
        error={err.content?.[0]}
        required
      >
        <textarea
          name="content"
          required
          defaultValue={defaults.content}
          minLength={80}
          maxLength={40000}
          rows={24}
          className={`${inputCls} resize-y font-mono text-sm`}
        />
      </Field>

      <div className="flex flex-col items-stretch gap-3 border-t border-sand pt-6 sm:flex-row sm:items-center sm:justify-end">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-forest px-6 py-3 text-base font-medium text-ivory shadow-card transition hover:bg-forest-deep active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending
            ? "Enregistrement…"
            : mode === "edit"
              ? "Enregistrer"
              : "Créer le brouillon"}
        </button>
      </div>
    </form>
  );
}

const inputCls =
  "block w-full rounded-xl border border-sand bg-ivory px-4 py-3 text-base text-ink placeholder:text-ink-subtle focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20";

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
          {required ? <span className="ml-0.5 text-terracotta">*</span> : null}
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
