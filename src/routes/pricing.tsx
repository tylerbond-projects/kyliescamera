import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { PageIntro } from "@/components/site/PageIntro";
import { SHOOT_TYPES } from "@/lib/site";
import { CATEGORY_IMAGES } from "@/lib/images";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Info & Pricing — Kylie's Camera" },
      { name: "description", content: "Session details and pricing for portrait, couple, family, wedding, dance, sports, and missionary homecoming photography in Utah County." },
      { property: "og:title", content: "Info & Pricing — Kylie's Camera" },
      { property: "og:description", content: "Session details and pricing for every shoot type." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <>
      <PageIntro eyebrow="Info & Pricing" title="Sessions & Investment" script="simple, honest pricing">
        Every session includes a pre-shoot planning call, a style guide, professional editing, and a
        private online gallery with a print release. Pricing ranges reflect session length and location.
      </PageIntro>

      <div className="container-site flex flex-col gap-20 pb-10">
        {SHOOT_TYPES.map((t, i) => (
          <article
            key={t.slug}
            id={t.slug}
            className={`grid items-center gap-8 md:grid-cols-2 md:gap-16 ${i % 2 ? "md:[&>div:first-child]:order-2" : ""}`}
          >
            <div className="relative mx-auto w-full max-w-md">
              <div className={`absolute -inset-3 rounded-lg bg-blush ${i % 2 ? "rotate-2" : "-rotate-2"}`} />
              <img
                src={CATEGORY_IMAGES[t.slug]}
                alt={t.name}
                width={1024}
                height={1280}
                loading="lazy"
                className="relative aspect-[4/5] w-full rounded-md object-cover shadow-soft"
              />
            </div>
            <div>
              <p className="eyebrow">{String(i + 1).padStart(2, "0")}</p>
              <h2 className="mt-3 text-4xl md:text-5xl">{t.name}</h2>
              <p className="font-script mt-1 text-3xl text-primary">{t.price}</p>
              <p className="mt-5 leading-relaxed text-muted-foreground">{t.blurb}</p>
              <ul className="mt-6 space-y-2 text-sm">
                {t.details.map((d) => (
                  <li key={d} className="flex items-center gap-2">
                    <Check className="size-4 text-primary" /> {d}
                  </li>
                ))}
              </ul>
              <Link to="/contact" search={{ type: t.slug }} className="btn-outline mt-8">
                Inquire about {t.name.split(" ")[0]}
              </Link>
            </div>
          </article>
        ))}
      </div>

      <section className="container-site mt-16 rounded-lg bg-sand/70 p-10 text-center md:p-16">
        <h2 className="text-3xl md:text-4xl">Not sure which session fits?</h2>
        <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
          Send me a note and tell me your vision. We'll figure out the perfect fit together.
        </p>
        <Link to="/contact" className="btn-primary mt-8">
          Get in touch
        </Link>
      </section>
    </>
  );
}
