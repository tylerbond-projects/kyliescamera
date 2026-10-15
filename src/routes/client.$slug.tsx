import { createFileRoute, Link } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { getClientGalleryBySlug } from "@/lib/client-galleries.functions";
import { SITE } from "@/lib/site";

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

function ClientGalleryPage() {
  const { result } = Route.useLoaderData();

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
          <p className="mt-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Click any photo to download the full-resolution file.
          </p>
        )}
      </section>

      <div className="container-site pb-24">
        {photos.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No photos have been uploaded yet — check back soon!
          </p>
        ) : (
          <div className="columns-2 gap-4 md:columns-3 [&>*]:mb-4">
            {photos.map((p) => (
              <a
                key={p.id}
                href={p.url}
                className="group relative block break-inside-avoid overflow-hidden rounded-md"
              >
                <img
                  src={p.url}
                  alt={p.caption ?? ""}
                  loading="lazy"
                  className="w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-ink/0 opacity-0 transition-all group-hover:bg-ink/40 group-hover:opacity-100">
                  <Download className="size-8 text-primary-foreground" />
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
