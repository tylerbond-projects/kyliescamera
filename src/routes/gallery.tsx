import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageIntro } from "@/components/site/PageIntro";
import { SHOOT_TYPES, MISC_PRICING } from "@/lib/site";
import { DEFAULT_GALLERY_PHOTOS } from "@/lib/images";
import { listGalleryPhotos } from "@/lib/admin.functions";

export const Route = createFileRoute("/gallery")({
  loader: async () => {
    const dbPhotos = await listGalleryPhotos().catch(() => []);
    return { dbPhotos };
  },
  head: () => ({
    meta: [
      { title: "Gallery — Kylie's Camera" },
      {
        name: "description",
        content:
          "A look at recent portrait, couple, family, and wedding sessions around Utah County.",
      },
      { property: "og:title", content: "Gallery — Kylie's Camera" },
      { property: "og:description", content: "Recent sessions around Utah County." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GalleryPage,
});

const CATEGORIES = [
  ...SHOOT_TYPES.map((t) => ({ slug: t.slug as string, name: t.name })),
  ...MISC_PRICING.items.map((i) => ({ slug: i.slug, name: i.name })),
];

function GalleryPage() {
  const { dbPhotos } = Route.useLoaderData();
  const [active, setActive] = useState<string>("all");

  const items = useMemo(() => {
    return CATEGORIES.flatMap((cat) => {
      const real = dbPhotos.filter((p) => p.category === cat.slug);
      if (real.length > 0) {
        return real.map((p) => ({ id: String(p.id), slug: cat.slug, name: cat.name, src: p.url }));
      }
      return (DEFAULT_GALLERY_PHOTOS[cat.slug] ?? []).map((src, n) => ({
        id: `${cat.slug}-${n}`,
        slug: cat.slug,
        name: cat.name,
        src,
      }));
    });
  }, [dbPhotos]);

  const filtered = active === "all" ? items : items.filter((i) => i.slug === active);

  return (
    <>
      <PageIntro eyebrow="Portfolio" title="The Gallery" script="a few favorites">
        Browse by session type.
      </PageIntro>

      <div className="container-site">
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {[
            { slug: "all", name: "All" },
            ...CATEGORIES.filter((c) => items.some((i) => i.slug === c.slug)),
          ].map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => setActive(c.slug)}
              className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.18em] transition-colors ${
                active === c.slug
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="columns-2 gap-4 md:columns-3 [&>*]:mb-4">
          {filtered.map((item, i) => (
            <figure
              key={item.id}
              className="group relative break-inside-avoid overflow-hidden rounded-md"
            >
              <img
                src={item.src}
                alt={item.name}
                width={1024}
                height={1280}
                loading="lazy"
                className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                  i % 3 === 1 ? "aspect-square" : "aspect-[4/5]"
                }`}
              />
              <figcaption className="absolute inset-x-0 bottom-0 translate-y-full bg-card/90 px-4 py-2 text-xs uppercase tracking-[0.18em] transition-transform group-hover:translate-y-0">
                {item.name}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </>
  );
}
