"use client";

import { useState } from "react";

type Props = {
  /** Path (e.g. "/evenementiel/xxx") — absolute URL built from window.origin. */
  path: string;
};

export function PublishedBanner({ path }: Props) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      const url = `${window.location.origin}${path}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard can be blocked (e.g. insecure context) — no-op, the link
      // is visible so the user can copy it manually.
    }
  }

  return (
    <div className="mx-auto mt-6 max-w-4xl px-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-forest/20 bg-forest-soft p-4 sm:flex-row sm:items-center sm:gap-4 sm:p-5">
        <div className="flex-1">
          <p className="font-display text-lg font-semibold text-forest-deep">
            Ton annonce est en ligne.
          </p>
          <p className="mt-1 text-sm text-ink-muted">
            Partage ce lien sur WhatsApp, Facebook, Insta — c'est comme ça
            qu'on te trouvera.
          </p>
        </div>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-forest px-4 py-2.5 text-sm font-medium text-ivory transition hover:bg-forest-deep active:scale-[0.98]"
        >
          {copied ? "Lien copié ✓" : "Copier le lien"}
        </button>
      </div>
    </div>
  );
}
