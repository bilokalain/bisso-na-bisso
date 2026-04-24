"use client";

import { useActionState } from "react";
import {
  createAnnonce,
  type CreateAnnonceState,
} from "@/app/actions/create-annonce";
import {
  CATEGORIES_EVENEMENTIEL,
  MATIERES,
  MODALITES,
  NIVEAUX,
  VILLES_SUGGEREES,
} from "@/lib/constants";
import { COLOR_TOKEN, type ModuleColor } from "@/lib/modules-catalog";

const initialState: CreateAnnonceState = {};

type Props = {
  type: string;
  formProfile: string;
  color: ModuleColor;
};

export function PublierForm({ type, formProfile, color }: Props) {
  const [state, formAction, pending] = useActionState(
    createAnnonce,
    initialState,
  );
  const err = state.fieldErrors ?? {};
  const tokens = COLOR_TOKEN[color];

  return (
    <form action={formAction} className="space-y-10">
      <input type="hidden" name="type" value={type} />

      {state.error ? (
        <div className="rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          {state.error}
        </div>
      ) : null}

      <Section title="Ton annonce" subtitle="Ce que les gens verront d'abord.">
        <Field
          label="Titre"
          hint="Un titre clair, direct. 6 à 120 caractères."
          error={err.titre?.[0]}
          required
        >
          <input
            type="text"
            name="titre"
            required
            minLength={6}
            maxLength={120}
            className={inputCls}
            placeholder={pickPlaceholder(type, "titre")}
          />
        </Field>

        <Field
          label="Description"
          hint="Donne les détails qu'on te demande toujours en message privé."
          error={err.description?.[0]}
          required
        >
          <textarea
            name="description"
            required
            minLength={20}
            maxLength={2000}
            rows={6}
            className={`${inputCls} resize-y`}
            placeholder={pickPlaceholder(type, "description")}
          />
        </Field>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field
            label="Ville"
            hint="Où tu es / où ça se passe."
            error={err.ville?.[0]}
          >
            <input
              type="text"
              name="ville"
              list="villes-publier"
              maxLength={60}
              className={inputCls}
              placeholder="Bruxelles"
            />
            <datalist id="villes-publier">
              {VILLES_SUGGEREES.map((v) => (
                <option key={v} value={v} />
              ))}
            </datalist>
          </Field>

          <Field
            label={
              formProfile === "colis" ? "Prix total (EUR)" : "Prix (EUR)"
            }
            hint={
              formProfile === "repetiteur"
                ? "Par heure."
                : "Laisse vide si variable."
            }
            error={err.prix?.[0]}
          >
            <input
              type="text"
              inputMode="decimal"
              name="prix"
              className={inputCls}
              placeholder="50"
            />
          </Field>
        </div>

        <Field
          label="Photo (URL)"
          hint="Colle une URL d'image (Instagram, Imgur, Google Photos). L'upload direct arrive bientôt."
          error={err.photo?.[0]}
        >
          <input
            type="url"
            name="photo"
            className={inputCls}
            placeholder="https://…"
          />
        </Field>
      </Section>

      {formProfile === "evenementiel" ? (
        <Section title="Catégorie" subtitle="Pour être trouvé au bon endroit.">
          <Field label="Type de prestation" error={err.categorie?.[0]}>
            <Select name="categorie">
              <option value="">—</option>
              {CATEGORIES_EVENEMENTIEL.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </Select>
          </Field>
        </Section>
      ) : null}

      {formProfile === "colis" ? (
        <Section
          title="Ton voyage"
          subtitle="Le corridor que tu proposes et combien de kilos tu peux prendre."
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field
              label="Ville de départ"
              error={err.villeDepart?.[0]}
              required
            >
              <input
                type="text"
                name="villeDepart"
                list="villes-publier"
                required
                maxLength={60}
                className={inputCls}
                placeholder="Bruxelles"
              />
            </Field>
            <Field
              label="Ville d'arrivée"
              error={err.villeArrivee?.[0]}
              required
            >
              <input
                type="text"
                name="villeArrivee"
                list="villes-publier"
                required
                maxLength={60}
                className={inputCls}
                placeholder="Kinshasa"
              />
            </Field>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <Field label="Date du voyage" error={err.dateVoyage?.[0]}>
              <input type="date" name="dateVoyage" className={inputCls} />
            </Field>
            <Field label="Kg disponibles" error={err.kgDispo?.[0]}>
              <input
                type="text"
                inputMode="decimal"
                name="kgDispo"
                className={inputCls}
                placeholder="20"
              />
            </Field>
            <Field label="Prix par kg (EUR)" error={err.prixParKg?.[0]}>
              <input
                type="text"
                inputMode="decimal"
                name="prixParKg"
                className={inputCls}
                placeholder="12"
              />
            </Field>
          </div>
        </Section>
      ) : null}

      {formProfile === "repetiteur" ? (
        <Section title="Cours" subtitle="Qui tu es et ce que tu enseignes.">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <Field label="Matière" error={err.matiere?.[0]}>
              <Select name="matiere">
                <option value="">—</option>
                {MATIERES.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Niveau" error={err.niveau?.[0]}>
              <Select name="niveau">
                <option value="">—</option>
                {NIVEAUX.map((n) => (
                  <option key={n.value} value={n.value}>
                    {n.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Modalité" error={err.modalite?.[0]}>
              <Select name="modalite">
                <option value="">—</option>
                {MODALITES.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
        </Section>
      ) : null}

      <Section
        title="Comment te contacter"
        subtitle="Affiché sur l'annonce. Le téléphone sert au bouton WhatsApp."
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Ton nom" error={err.contactNom?.[0]} required>
            <input
              type="text"
              name="contactNom"
              required
              minLength={2}
              maxLength={80}
              className={inputCls}
              placeholder="Prénom ou prénom + initiale"
            />
          </Field>
          <Field
            label="Téléphone"
            hint="Format international recommandé (+32…)."
            error={err.contactTelephone?.[0]}
            required
          >
            <input
              type="tel"
              name="contactTelephone"
              required
              className={inputCls}
              placeholder="+32 470 12 34 56"
            />
          </Field>
        </div>
        <Field
          label="E-mail (optionnel)"
          error={err.contactEmail?.[0]}
        >
          <input
            type="email"
            name="contactEmail"
            className={inputCls}
            placeholder="nom@exemple.be"
          />
        </Field>
      </Section>

      <div className="flex flex-col items-stretch gap-3 border-t border-sand pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-ink-muted">
          En publiant, tu confirmes que les infos sont exactes. Tu restes le
          seul interlocuteur — aucun intermédiaire.
        </p>
        <button
          type="submit"
          disabled={pending}
          className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-medium text-ivory shadow-card transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${tokens.bg} hover:brightness-95`}
        >
          {pending ? "Publication…" : "Publier l'annonce"}
        </button>
      </div>
    </form>
  );
}

const inputCls =
  "block w-full rounded-xl border border-sand bg-ivory px-4 py-3 text-base text-ink placeholder:text-ink-subtle focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20";

const PLACEHOLDERS: Record<string, { titre: string; description: string }> = {
  evenementiel: {
    titre: "Ex. DJ congolais — mariages & soirées privées",
    description:
      "Raconte ton expérience, ton style, ce que tu fournis (son, lumières…), tes disponibilités.",
  },
  colis: {
    titre: "Ex. Bruxelles → Kinshasa, 25 kg dispo le 14 mai",
    description:
      "Compagnie, type de vol, lieu de retrait à l'arrivée, conditions (pas d'alcool, pas de denrées périssables…).",
  },
  repetiteur: {
    titre: "Ex. Cours de maths, 3e à 6e secondaire",
    description:
      "Ton parcours, ton expérience, ta méthode, les tranches horaires où tu es disponible.",
  },
  restauration: {
    titre: "Ex. Plats maman du samedi — pondu, poulet moambe",
    description:
      "Ce que tu cuisines, les jours de livraison, la zone couverte, le tarif au plat ou à la portion famille.",
  },
  "petits-boulots": {
    titre: "Ex. Plombier — dépannage 7j/7 sur Bruxelles",
    description:
      "Ton métier, tes zones d'intervention, tes horaires, ton tarif horaire ou forfaitaire.",
  },
};

function pickPlaceholder(
  type: string,
  field: "titre" | "description",
): string {
  return (
    PLACEHOLDERS[type]?.[field] ??
    (field === "titre"
      ? "Ex. Titre clair, direct"
      : "Décris ce que tu proposes, ta disponibilité, ton tarif.")
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="font-display text-xl font-semibold tracking-tight">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

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

function Select({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) {
  return (
    <select name={name} className={`${inputCls} appearance-none pr-10`}>
      {children}
    </select>
  );
}
