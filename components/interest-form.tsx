"use client";

import { useActionState } from "react";
import {
  captureInterest,
  type CaptureInterestState,
} from "@/app/actions/module-interest";
import { COLOR_TOKEN, type ModuleColor } from "@/lib/modules-catalog";

const initialState: CaptureInterestState = { status: "idle" };

type Props = {
  moduleKey: string;
  color: ModuleColor;
};

export function InterestForm({ moduleKey, color }: Props) {
  const [state, formAction, pending] = useActionState(
    captureInterest,
    initialState,
  );
  const tokens = COLOR_TOKEN[color];

  if (state.status === "success") {
    return (
      <div className="rounded-2xl border border-forest/20 bg-forest-soft p-5 sm:p-6">
        <p className="font-display text-lg font-semibold text-forest-deep">
          {state.message}
        </p>
        <p className="mt-1 text-sm text-ink-muted">
          Tu seras parmi les premiers informés. D'ici là, pas de spam — promis.
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="flex flex-col gap-3 sm:flex-row sm:items-stretch"
    >
      <input type="hidden" name="moduleKey" value={moduleKey} />
      <label className="flex-1">
        <span className="sr-only">Ton e-mail</span>
        <input
          type="email"
          name="email"
          required
          placeholder="ton@email.be"
          aria-invalid={state.status === "error" || undefined}
          className="block w-full rounded-full border border-sand bg-ivory px-5 py-3 text-base text-ink placeholder:text-ink-subtle focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-medium text-ivory shadow-card transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${tokens.bg} hover:brightness-95`}
      >
        {pending ? "En cours…" : "Préviens-moi"}
      </button>
      {state.status === "error" && state.message ? (
        <p className="text-sm text-danger sm:basis-full">{state.message}</p>
      ) : null}
    </form>
  );
}
