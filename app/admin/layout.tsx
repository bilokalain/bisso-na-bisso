import { AdminShell } from "@/components/admin-shell";
import { isAdmin } from "@/lib/admin";

/**
 * Admin layout wraps every /admin/* page with the sidebar/tab nav. The
 * /admin/login page is technically inside this layout too, but it skips
 * the shell when the visitor isn't authed yet (otherwise we'd flash a
 * sidebar with broken cookie context). Each protected page calls
 * requireAdmin() at its top, so the auth check still happens at the
 * page level.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = await isAdmin();
  if (!authed) {
    // Login page handles itself — no chrome around it.
    return <>{children}</>;
  }
  return <AdminShell>{children}</AdminShell>;
}
