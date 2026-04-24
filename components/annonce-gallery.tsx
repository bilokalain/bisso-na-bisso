import Image from "next/image";

type Props = {
  photos: string[];
  alt: string;
};

/**
 * Horizontally swipeable gallery using CSS scroll-snap — no JS lib, works on
 * iOS/Android natively. A single photo renders as a static hero; 2+ photos
 * snap one by one with a subtle pagination hint (N/total).
 */
export function AnnonceGallery({ photos, alt }: Props) {
  if (photos.length === 0) return null;

  if (photos.length === 1) {
    return (
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-sand">
        <Image
          src={photos[0]}
          alt={alt}
          fill
          priority
          sizes="(min-width: 896px) 896px, 100vw"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto rounded-2xl [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {photos.map((src, i) => (
          <div
            key={src}
            className="relative aspect-[16/10] w-full flex-shrink-0 snap-center overflow-hidden rounded-2xl bg-sand"
          >
            <Image
              src={src}
              alt={`${alt} — ${i + 1}`}
              fill
              priority={i === 0}
              sizes="(min-width: 896px) 896px, 100vw"
              className="object-cover"
            />
            <span className="absolute bottom-3 right-3 rounded-full bg-ink/70 px-2.5 py-1 text-xs font-medium text-ivory backdrop-blur-sm">
              {i + 1} / {photos.length}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
