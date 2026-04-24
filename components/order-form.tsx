"use client";

import { useActionState } from "react";
import {
  createOrder,
  type CreateOrderState,
} from "@/app/actions/create-order";

const initialState: CreateOrderState = {};

type Props = {
  basketId: string;
  basketName: string;
  basketPriceEUR: number;
};

export function OrderForm({
  basketId,
  basketName,
  basketPriceEUR,
}: Props) {
  const [state, formAction, pending] = useActionState(
    createOrder,
    initialState,
  );
  const err = state.fieldErrors ?? {};
  const priceLabel = (basketPriceEUR / 100).toLocaleString("fr-BE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });

  return (
    <form action={formAction} className="space-y-10">
      <input type="hidden" name="basketId" value={basketId} />

      {state.error ? (
        <div className="rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          {state.error}
        </div>
      ) : null}

      <Section
        title="Toi, l'expéditeur"
        subtitle="Pour t'envoyer la confirmation et la photo de livraison."
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Ton nom" error={err.senderName?.[0]} required>
            <input
              type="text"
              name="senderName"
              required
              minLength={2}
              maxLength={80}
              className={inputCls}
              placeholder="Prénom Nom"
            />
          </Field>
          <Field label="Ton e-mail" error={err.senderEmail?.[0]} required>
            <input
              type="email"
              name="senderEmail"
              required
              className={inputCls}
              placeholder="nom@exemple.be"
            />
          </Field>
        </div>
        <Field
          label="Ton téléphone (optionnel)"
          hint="Pour qu'on puisse te joindre vite en cas de souci."
          error={err.senderPhone?.[0]}
        >
          <input
            type="tel"
            name="senderPhone"
            className={inputCls}
            placeholder="+32 470 12 34 56"
          />
        </Field>
      </Section>

      <Section
        title="Ta famille, le destinataire"
        subtitle="Celui ou celle qui va recevoir le panier à Kinshasa."
      >
        <Field
          label="Nom du destinataire"
          hint="Comme tu l'appelles habituellement."
          error={err.recipientName?.[0]}
          required
        >
          <input
            type="text"
            name="recipientName"
            required
            minLength={2}
            maxLength={80}
            className={inputCls}
            placeholder="Maman Céline"
          />
        </Field>
        <Field
          label="Téléphone du destinataire"
          hint="On l'appelle pour confirmer l'adresse avant livraison."
          error={err.recipientPhone?.[0]}
          required
        >
          <input
            type="tel"
            name="recipientPhone"
            required
            className={inputCls}
            placeholder="+243 81 234 56 78"
          />
        </Field>
        <Field
          label="Adresse à Kinshasa"
          hint="Commune + quartier + avenue + numéro. Précise si tu peux."
          error={err.recipientAddress?.[0]}
          required
        >
          <textarea
            name="recipientAddress"
            required
            minLength={10}
            maxLength={300}
            rows={3}
            className={`${inputCls} resize-y`}
            placeholder="Ngaliema, Binza-Pigeon, avenue Matongé n°12"
          />
        </Field>
        <Field
          label="Repères pour le livreur (optionnel)"
          hint="« À côté de la pharmacie X », « portail bleu », etc."
          error={err.recipientNotes?.[0]}
        >
          <input
            type="text"
            name="recipientNotes"
            maxLength={200}
            className={inputCls}
            placeholder="À côté de l'église catholique"
          />
        </Field>
      </Section>

      <Section
        title="Ton mot, lu à la livraison"
        subtitle="Optionnel. Le livreur le lit à voix haute en remettant le panier."
      >
        <Field label="Message" error={err.messageToFamily?.[0]}>
          <textarea
            name="messageToFamily"
            maxLength={400}
            rows={4}
            className={`${inputCls} resize-y`}
            placeholder="Maman, j'espère que ta jambe va mieux. Je t'embrasse. — Paul"
          />
        </Field>
      </Section>

      <div className="sticky bottom-4 flex flex-col items-stretch gap-3 rounded-2xl border border-sand bg-white p-4 shadow-float sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <p className="text-xs text-ink-muted">Tu envoies</p>
          <p className="font-display text-lg font-semibold tracking-tight">
            Panier {basketName} · {priceLabel}
          </p>
        </div>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-terracotta px-6 py-3 text-base font-medium text-ivory shadow-card transition hover:brightness-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Traitement…" : "Confirmer la commande"}
        </button>
      </div>
      <p className="text-xs text-ink-muted">
        En confirmant, tu t'engages sur le contenu du panier. Le paiement
        sera pris à l'étape suivante.
      </p>
    </form>
  );
}

const inputCls =
  "block w-full rounded-xl border border-sand bg-white px-4 py-3 text-base text-ink placeholder:text-ink-subtle focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20";

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
