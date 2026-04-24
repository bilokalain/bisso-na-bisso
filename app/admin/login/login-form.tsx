"use client";

import { useActionState } from "react";
import { loginAdmin, type LoginState } from "@/app/actions/admin-auth";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(
    loginAdmin,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-ink">
          Mot de passe
        </span>
        <input
          type="password"
          name="password"
          required
          autoFocus
          autoComplete="current-password"
          className="block w-full rounded-xl border border-sand bg-ivory px-4 py-3 text-base text-ink placeholder:text-ink-subtle focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
        />
      </label>

      {state.error ? (
        <p className="text-sm text-danger">{state.error}</p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-navy px-5 py-3 text-base font-medium text-ivory shadow-card transition hover:bg-navy-deep active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
