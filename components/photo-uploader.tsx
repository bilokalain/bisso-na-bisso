"use client";

import { upload } from "@vercel/blob/client";
import Image from "next/image";
import { useRef, useState } from "react";

type UploadedPhoto = { id: string; url: string };
type InFlight = { id: string; name: string; progress: number; preview: string };

const MAX_PHOTOS = 6;
const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = /^image\/(jpeg|png|webp|heic|heif)$/i;

type Props = {
  /** Pre-existing photo URLs (edit flow). Empty on create. */
  initial?: string[];
  /** Form field name that gets repeated once per photo URL. */
  name?: string;
};

export function PhotoUploader({ initial = [], name = "photos" }: Props) {
  const [uploaded, setUploaded] = useState<UploadedPhoto[]>(
    initial.map((url, i) => ({ id: `init-${i}`, url })),
  );
  const [inFlight, setInFlight] = useState<InFlight[]>([]);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const total = uploaded.length + inFlight.length;
  const remaining = Math.max(0, MAX_PHOTOS - total);

  async function handleFiles(files: FileList) {
    setError(null);
    const accepted: File[] = [];
    for (const file of Array.from(files).slice(0, remaining)) {
      if (!ALLOWED_TYPES.test(file.type)) {
        setError(`"${file.name}" n'est pas une image supportée.`);
        continue;
      }
      if (file.size > MAX_BYTES) {
        setError(`"${file.name}" dépasse 10 MB.`);
        continue;
      }
      accepted.push(file);
    }

    const flights: InFlight[] = accepted.map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random()}`,
      name: file.name,
      progress: 0,
      preview: URL.createObjectURL(file),
    }));
    setInFlight((prev) => [...prev, ...flights]);

    await Promise.all(
      accepted.map(async (file, i) => {
        const flight = flights[i];
        try {
          const blob = await upload(file.name, file, {
            access: "public",
            handleUploadUrl: "/api/upload-photo",
            onUploadProgress: ({ percentage }) => {
              setInFlight((prev) =>
                prev.map((f) =>
                  f.id === flight.id ? { ...f, progress: percentage } : f,
                ),
              );
            },
          });
          setUploaded((prev) => [...prev, { id: flight.id, url: blob.url }]);
        } catch (e) {
          setError(
            `Échec de l'upload de "${file.name}" : ${
              e instanceof Error ? e.message : "erreur inconnue"
            }`,
          );
        } finally {
          setInFlight((prev) => prev.filter((f) => f.id !== flight.id));
          URL.revokeObjectURL(flight.preview);
        }
      }),
    );
  }

  function remove(id: string) {
    setUploaded((prev) => prev.filter((p) => p.id !== id));
  }

  function move(id: string, direction: "up" | "down") {
    setUploaded((prev) => {
      const i = prev.findIndex((p) => p.id === id);
      if (i < 0) return prev;
      const j = direction === "up" ? i - 1 : i + 1;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  return (
    <div className="space-y-3">
      {uploaded.map((p) => (
        <input key={p.id} type="hidden" name={name} value={p.url} />
      ))}

      {uploaded.length > 0 || inFlight.length > 0 ? (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {uploaded.map((p, i) => (
            <ThumbUploaded
              key={p.id}
              url={p.url}
              isFirst={i === 0}
              isLast={i === uploaded.length - 1}
              onRemove={() => remove(p.id)}
              onMoveUp={() => move(p.id, "up")}
              onMoveDown={() => move(p.id, "down")}
              primary={i === 0}
            />
          ))}
          {inFlight.map((f) => (
            <ThumbFlight key={f.id} preview={f.preview} progress={f.progress} />
          ))}
        </div>
      ) : null}

      {remaining > 0 ? (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
            multiple
            className="sr-only"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                void handleFiles(e.target.files);
                e.target.value = "";
              }
            }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="block w-full rounded-xl border-2 border-dashed border-sand bg-ivory-deep/40 px-4 py-6 text-center transition hover:border-ink/30 hover:bg-ivory-deep/70"
          >
            <p className="text-sm font-medium text-ink">
              {total === 0
                ? "Ajouter des photos"
                : "Ajouter d'autres photos"}
            </p>
            <p className="mt-1 text-xs text-ink-muted">
              Appareil photo ou galerie · JPEG, PNG, WebP, HEIC · 10 MB max ·{" "}
              {remaining} emplacement{remaining > 1 ? "s" : ""} restant
              {remaining > 1 ? "s" : ""}
            </p>
          </button>
        </>
      ) : (
        <p className="text-xs text-ink-muted">
          Maximum {MAX_PHOTOS} photos atteint. Enlève-en une pour en ajouter
          d'autres.
        </p>
      )}

      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </div>
  );
}

function ThumbUploaded({
  url,
  primary,
  isFirst,
  isLast,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  url: string;
  primary: boolean;
  isFirst: boolean;
  isLast: boolean;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  return (
    <div className="group relative aspect-square overflow-hidden rounded-xl border border-sand bg-sand">
      <Image
        src={url}
        alt=""
        fill
        sizes="(min-width: 640px) 25vw, 33vw"
        className="object-cover"
      />
      {primary ? (
        <span className="absolute left-1.5 top-1.5 rounded-full bg-ink/70 px-2 py-0.5 text-[10px] font-medium text-ivory">
          Principale
        </span>
      ) : null}
      <div className="absolute right-1.5 top-1.5 flex gap-1">
        <button
          type="button"
          onClick={onRemove}
          aria-label="Supprimer"
          className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-ivory/90 text-ink shadow-sm hover:bg-danger hover:text-ivory"
        >
          ×
        </button>
      </div>
      <div className="absolute bottom-1.5 left-1.5 flex gap-1 opacity-0 transition group-hover:opacity-100">
        <button
          type="button"
          onClick={onMoveUp}
          disabled={isFirst}
          aria-label="Monter"
          className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-ivory/90 text-ink shadow-sm disabled:opacity-40"
        >
          ←
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={isLast}
          aria-label="Descendre"
          className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-ivory/90 text-ink shadow-sm disabled:opacity-40"
        >
          →
        </button>
      </div>
    </div>
  );
}

function ThumbFlight({
  preview,
  progress,
}: {
  preview: string;
  progress: number;
}) {
  return (
    <div className="relative aspect-square overflow-hidden rounded-xl border border-sand bg-sand">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={preview}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-50"
      />
      <div className="absolute inset-x-2 bottom-2 h-1.5 overflow-hidden rounded-full bg-ivory/60">
        <div
          className="h-full rounded-full bg-navy transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-medium text-ink">
        {progress}%
      </span>
    </div>
  );
}
