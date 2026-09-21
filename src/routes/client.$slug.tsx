import { createFileRoute, notFound } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { getClientGallery } from "@/lib/booking.functions";

export const Route = createFileRoute("/client/$slug")({
  loader: async ({ params }) => {
    const gallery = await getClientGallery({ data: { slug: params.slug } });
    if (!gallery) throw notFound();
    return gallery;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.title} — Kylie Photography` : "Gallery — Kylie Photography" },
      { name: "description", content: "Private client gallery from Kylie Photography." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: loaderData?.title ?? "Client Gallery" },
      { property: "og:description", content: "Private client gallery from Kylie Photography." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  notFoundComponent: GalleryNotFound,
  component: ClientGalleryPage,
});

function GalleryNotFound() {
  return (
    <section className="container-site py-32 text-center">
      <h1 className="text-4xl">Gallery not found</h1>
      <p className="mt-3 text-muted-foreground">Double-check the link Kylie sent you.</p>
    </section>
  );
}

function ClientGalleryPage() {
  const gallery = Route.useLoaderData();
  return (
    <>
      <section className="container-site pt-16 pb-10 text-center md:pt-24">
        <p className="eyebrow">A gallery for {gallery.client_name}</p>
        <h1 className="mt-4 text-5xl md:text-6xl">{gallery.title}</h1>
        {gallery.message && (
          <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-muted-foreground">{gallery.message}</p>
        )}
        <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {gallery.photos.length} photos · click any photo to download
        </p>
      </section>

      <div className="container-site columns-2 gap-4 md:columns-3 [&>*]:mb-4">
        {gallery.photos.map((p, i) => (
          <a
            key={i}
            href={p.url}
            download
            target="_blank"
            rel="noreferrer"
            className="group relative block break-inside-avoid overflow-hidden rounded-md"
          >
            <img src={p.url} alt={p.caption ?? `Photo ${i + 1}`} loading="lazy" className="w-full" />
            <span className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-between bg-card/90 px-4 py-2 text-xs uppercase tracking-[0.18em] transition-transform group-hover:translate-y-0">
              {p.caption ?? `Photo ${i + 1}`}
              <Download className="size-4" />
            </span>
          </a>
        ))}
      </div>
    </>
  );
}
