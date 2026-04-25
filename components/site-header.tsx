import Link from "next/link";
import { isAdmin } from "@/lib/admin";

export async function SiteHeader() {
  // Conditionally render the admin entry only when the admin cookie is
  // valid — this keeps the surface invisible to normal visitors while
  // giving the signed-in admin a one-tap link from anywhere on the site.
  const authed = await isAdmin();

  return (
    <header className="sticky top-0 z-30 border-b border-sand bg-ivory/85 backdrop-blur safe-top">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:py-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight md:text-xl"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-[0.625rem] bg-navy font-display text-base text-ivory">
            B<span className="text-gold">.</span>
          </span>
          <span>
            Bisso <span className="text-ink-muted">na</span> Bisso
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {authed ? (
            <Link
              href="/admin"
              aria-label="Accès admin"
              className="inline-flex items-center gap-1.5 rounded-full border border-navy/30 bg-navy-soft px-3 py-2 text-sm font-medium text-navy-deep transition hover:border-navy hover:bg-navy hover:text-ivory"
            >
              <GearIcon />
              <span>Admin</span>
            </Link>
          ) : null}
          <Link
            href="/publier"
            className="inline-flex items-center rounded-full bg-navy px-4 py-2 text-sm font-medium text-ivory transition hover:bg-navy-deep active:scale-[0.98]"
          >
            Publier
          </Link>
        </div>
      </div>
    </header>
  );
}

function GearIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
