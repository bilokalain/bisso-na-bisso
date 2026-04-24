import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "bnb_admin";
const SESSION_MESSAGE = "bnb-admin-session";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getPassword(): string {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) {
    throw new Error(
      "ADMIN_PASSWORD env var is required for /admin access.",
    );
  }
  return pw;
}

function sign(): string {
  return createHmac("sha256", getPassword())
    .update(SESSION_MESSAGE)
    .digest("hex");
}

function safeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
  } catch {
    return false;
  }
}

export function verifyPassword(attempt: string): boolean {
  const expected = getPassword();
  if (attempt.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(attempt), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  const c = store.get(COOKIE_NAME)?.value;
  if (!c) return false;
  return safeEqualHex(c, sign());
}

export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
}

export async function grantAdminCookie(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, sign(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });
}

export async function clearAdminCookie(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
