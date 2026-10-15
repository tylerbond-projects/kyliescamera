import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Download, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { getClientGalleryBySlug, type ClientGalleryPhoto } from "@/lib/client-galleries.functions";
import { photoFilename } from "@/lib/r2";
import { SITE } from "@/lib/site";
import { buildZip, uniqueNames } from "@/lib/zip";

export const Route = createFileRoute("/client/$slug")({
  loader: async ({ params }) => {
    const result = await getClientGalleryBySlug({ data: { slug: params.slug } }).catch(() => null);
    return { result };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.result?.gallery.client_name ?? "Client Gallery"} — Kylie's Camera` },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ClientGalleryPage,
});

// Same-origin copy of a photo (see routes/api.client-photo.$slug.$photoId.ts).
function photoRoute(slug: string, photo: ClientGalleryPhoto, download = false) {
  return `/api/client-photo/${slug}/${photo.id}${download ? "?download=1" : ""}`;
}

function ClientGalleryPage() {
  const { result } = Route.useLoaderData();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [zipProgress, setZipProgress] = useState<{ done: number; total: number } | null>(null);

  if (!result) {
    return (
      <section className="container-site flex min-h-[70vh] flex-col items-center justify-center text-center">
        <h1 className="text-4xl">Gallery not found</h1>
        <p className="mt-4 text-muted-foreground">
          This link may have expired or been typed incorrectly. Reach out to {SITE.email} if you
          think that's a mistake.
        </p>
        <Link to="/" className="btn-outline mt-8">
          Back home
        </Link>
      </section>
    );
  }

  const { gallery, photos } = result;

  async function downloadAll() {
    setZipProgress({ done: 0, total: photos.length });
    try {
      const names = uniqueNames(photos.map((p) => photoFilename(p.url)));
      const files: { name: string; data: Uint8Array<ArrayBuffer> }[] = [];
      for (const [i, photo] of photos.entries()) {
        const res = await fetch(photoRoute(gallery.slug, photo));
        if (!res.ok) throw new Error(`Photo ${i + 1} failed to download.`);
        files.push({ name: names[i]!, data: new Uint8Array(await res.arrayBuffer()) });
        setZipProgress({ done: i + 1, total: photos.length });
      }
      const url = URL.createObjectURL(buildZip(files));
      const a = document.createElement("a");
      a.href = url;
      a.download = `${gallery.slug}-photos.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch {
      toast.error("The download didn't finish", {
        description: "Please try again, or download photos one at a time.",
      });
    } finally {
      setZipProgress(null);
    }
  }

  return (
    <>
      <section className="container-site pb-10 pt-16 text-center md:pt-24">
        <p className="eyebrow">Your Gallery</p>
        <h1 className="mt-4 text-5xl md:text-6xl">{gallery.title || gallery.client_name}</h1>
        {gallery.message && (
          <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-muted-foreground">
            {gallery.message}
          </p>
        )}
        {photos.length > 0 && (
          <>
            <button
              type="button"
              onClick={downloadAll}
              disabled={zipProgress !== null}
              className="btn-primary mt-8 text-xs"
            >
              <Download className="mr-2 inline size-4" />
              {zipProgress
                ? `Preparing ${zipProgress.done} of ${zipProgress.total}…`
                : `Download all (${photos.length})`}
            </button>
            <p className="mt-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Click any photo to view it larger and download it.
            </p>
          </>
        )}
      </section>

      <div className="container-site pb-24">
        {photos.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No photos have been uploaded yet — check back soon!
          </p>
        ) : (
          <div className="columns-2 gap-4 md:columns-3 [&>*]:mb-4">
            {photos.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setOpenIndex(i)}
                className="group relative block w-full break-inside-avoid overflow-hidden rounded-md"
                aria-label={`View photo ${i + 1}`}
              >
                <img
                  src={p.url}
                  alt={p.caption ?? ""}
                  loading="lazy"
                  className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {openIndex !== null && (
        <Lightbox
          photos={photos}
          index={Math.min(openIndex, photos.length - 1)}
          slug={gallery.slug}
          onIndexChange={setOpenIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </>
  );
}

function Lightbox({
  photos,
  index,
  slug,
  onIndexChange,
  onClose,
}: {
  photos: ClientGalleryPhoto[];
  index: number;
  slug: string;
  onIndexChange: (i: number) => void;
  onClose: () => void;
}) {
  const photo = photos[index]!;
  const hasMany = photos.length > 1;
  const prev = useCallback(
    () => onIndexChange((index - 1 + photos.length) % photos.length),
    [index, photos.length, onIndexChange],
  );
  const next = useCallback(
    () => onIndexChange((index + 1) % photos.length),
    [index, photos.length, onIndexChange],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft" && hasMany) prev();
      else if (e.key === "ArrowRight" && hasMany) next();
    }
    window.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose, prev, next, hasMany]);

  const iconButton =
    "flex size-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${index + 1} of ${photos.length}`}
      className="fixed inset-0 z-50 flex flex-col bg-black/90 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="flex items-center justify-between gap-3 p-4 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-xs uppercase tracking-[0.18em] text-white/70">
          {index + 1} / {photos.length}
        </span>
        <div className="flex items-center gap-3">
          <a
            href={photoRoute(slug, photo, true)}
            download={photoFilename(photo.url)}
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs uppercase tracking-[0.18em] text-black transition-colors hover:bg-white/85"
          >
            <Download className="size-4" /> Download
          </a>
          <button type="button" onClick={onClose} aria-label="Close" className={iconButton}>
            <X className="size-5" />
          </button>
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6 md:px-20">
        <img
          key={photo.id}
          src={photo.url}
          alt={photo.caption ?? ""}
          className="max-h-full max-w-full object-contain animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        />
        {hasMany && (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className={`${iconButton} absolute left-2 top-1/2 -translate-y-1/2 md:left-6`}
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className={`${iconButton} absolute right-2 top-1/2 -translate-y-1/2 md:right-6`}
            >
              <ChevronRight className="size-6" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
