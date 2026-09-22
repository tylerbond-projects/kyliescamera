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

      <section className="container-site mb-20 grid gap-8 rounded-lg bg-sand/70 p-8 sm:grid-cols-2 md:p-12">
        <div>
          <h2 className="font-serif text-xl">Travel Fee</h2>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            Located in Utah County. There will be a travel fee if it is more than a 20 mile radius from
            my residency! ($0.75 per mile) Travel fees aren't included in the prices below!
          </p>
        </div>
        <div>
          <h2 className="font-serif text-xl">Deposit When Booking</h2>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            To claim your date, a 25% deposit is due when booking. This goes toward your total — not an
            extra charge! Deposits are non-refundable!
          </p>
        </div>
        <p className="border-t border-border pt-6 text-center text-sm font-medium sm:col-span-2">
          Outfit add-on: $15 per additional outfit
        </p>
      </section>

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
              {t.packages.length > 0 ? (
                <div className="mt-3 space-y-2">
                  {t.packages.map((pkg) => (
                    <div key={pkg.label} className="flex flex-wrap items-baseline gap-x-3">
                      <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        {pkg.label} · {pkg.hours}
                      </span>
                      <span className="font-script text-2xl text-primary">{pkg.price}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="font-script mt-1 text-3xl text-primary">{t.price}</p>
              )}
              <p className="mt-5 leading-relaxed text-muted-foreground">{t.blurb}</p>
              <ul className="mt-6 space-y-2 text-sm">
                {t.details.map((d) => (
                  <li key={d} className="flex items-center gap-2">
                    <Check className="size-4 text-primary" /> {d}
                  </li>
                ))}
              </ul>
              {t.disclaimer && <p className="mt-3 text-xs text-muted-foreground">{t.disclaimer}</p>}
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
