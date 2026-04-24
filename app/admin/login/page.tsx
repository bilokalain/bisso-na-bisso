import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "./login-form";
import { isAdmin } from "@/lib/admin";

export const metadata: Metadata = {
  title: "Connexion admin",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4 py-12">
      <h1 className="font-display text-3xl font-semibold tracking-tight">
        Espace admin.
      </h1>
      <p className="mt-2 text-sm text-ink-muted">
        Accès réservé. Mot de passe uniquement.
      </p>
      <div className="mt-8">
        <LoginForm />
      </div>
    </section>
  );
}
