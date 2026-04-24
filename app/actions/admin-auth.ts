"use server";

import { redirect } from "next/navigation";
import {
  clearAdminCookie,
  grantAdminCookie,
  verifyPassword,
} from "@/lib/admin";

export type LoginState = { error?: string };

export async function loginAdmin(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = formData.get("password");
  if (typeof password !== "string" || password.length === 0) {
    return { error: "Mot de passe requis." };
  }
  if (!verifyPassword(password)) {
    return { error: "Mot de passe invalide." };
  }
  await grantAdminCookie();
  redirect("/admin");
}

export async function logoutAdmin(): Promise<void> {
  await clearAdminCookie();
  redirect("/admin/login");
}
