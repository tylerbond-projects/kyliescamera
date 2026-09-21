import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageIntro } from "@/components/site/PageIntro";
import { SHOOT_TYPES, type ShootSlug } from "@/lib/site";
import { CATEGORY_IMAGES } from "@/lib/images";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Kylie Photography" },
      { name: "description", content: "A look at recent portrait, couple, family, wedding, dance, sports, and homecoming sessions around Utah County." },
      { property: "og:title", content: "Gallery — Kylie Photography" },
      { property: "og:description", content: "Recent sessions around Utah County." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GalleryPage,
});

// Placeholder gallery: each category repeats its sample image a few times.
const ITEMS = SHOOT_TYPES.flatMap((t) =>
  [0, 1, 2].map((n) => ({ id: `${t.slug}-${n}`, slug: t.slug as ShootSlug, name: t.name, src: CATEGORY_IMAGES[t.slug] })),
);

function GalleryPage() {
  const [active, setActive] = useState<ShootSlug | "all">("all");
  const items = active === "all" ? ITEMS : ITEMS.filter((i) => i.slug === active);

  return (
    <>
      <PageIntro eyebrow="Portfolio" title="The Gallery" script="a few favorites">
        Browse by session type. These are placeholder samples for now — real sessions coming soon.
      </PageIntro>

      <div className="container-site">
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {[{ slug: "all" as const, name: "All" }, ...SHOOT_TYPES].map((t) => (
            <button
              key={t.slug}
              type="button"
              onClick={() => setActive(t.slug)}
              className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.18em] transition-colors ${
                active === t.slug
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.slug === "missionary" ? "Homecoming & Misc" : t.name.replace(" Session", "")}
            </button>
          ))}
        </div>

        <div className="columns-2 gap-4 md:columns-3 [&>*]:mb-4">
          {items.map((item, i) => (
            <figure key={item.id} className="group relative break-inside-avoid overflow-hidden rounded-md">
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
