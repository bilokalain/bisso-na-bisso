import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-sand bg-ivory/85 backdrop-blur safe-top">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:py-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight md:text-xl"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-[0.625rem] bg-forest font-display text-base text-ivory">
            B<span className="text-gold">.</span>
          </span>
          <span>
            Bisso <span className="text-ink-muted">na</span> Bisso
          </span>
        </Link>

        <Link
          href="/publier"
          className="inline-flex items-center rounded-full bg-forest px-4 py-2 text-sm font-medium text-ivory transition hover:bg-forest-deep active:scale-[0.98]"
        >
          Publier
        </Link>
      </div>
    </header>
  );
}
