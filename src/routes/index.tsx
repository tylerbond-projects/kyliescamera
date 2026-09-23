import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SITE, BIO, FUN_FACTS, TESTIMONIALS, SHOOT_TYPES, MISC_PRICING } from "@/lib/site";
import { SocialLinks } from "@/components/site/SocialLinks";
import { CATEGORY_IMAGES } from "@/lib/images";
import { cn } from "@/lib/utils";
import { getSiteContentMap } from "@/lib/content.functions";
import heroImg from "@/assets/hero.jpg";
import portraitImg from "@/assets/portrait.jpg";
import danceImg from "@/assets/dance.jpg";
import sportsImg from "@/assets/sports.jpg";
import missionaryImg from "@/assets/missionary.jpg";
import familyImg from "@/assets/family.jpg";

// Placeholder — swap for a real photo of Kylie whenever it's ready.
const funFactsImg = portraitImg;

// The four full sessions plus the four Misc. Pricing items — misc items
// don't have gallery photos yet, so these reuse the closest category shot.
const MISC_STRIP_IMAGES: Record<string, string> = {
  "School Dances": danceImg,
  Friends: familyImg,
  "Game Day": sportsImg,
  "Missionary Homecoming & More!": missionaryImg,
};
const SHOOT_STRIP = [
  ...SHOOT_TYPES.map((t) => ({ name: t.name, slug: t.slug, image: CATEGORY_IMAGES[t.slug] })),
  ...MISC_PRICING.items.map((item) => ({
    name: item.name,
    slug: item.slug,
    image: MISC_STRIP_IMAGES[item.name],
  })),
];

export const Route = createFileRoute("/")({
  loader: async () => {
    const content = await getSiteContentMap().catch(() => ({}) as Record<string, unknown>);
    return { content };
  },
  head: () => ({
    meta: [
      { title: "Kylie's Camera — Authentic, Heartfelt Photography in Utah County" },
      {
        name: "description",
        content:
          "Warm, candid portrait, couple, family, wedding, dance, and sports photography in Utah County, UT. Capturing moments since 2024.",
      },
      { property: "og:title", content: "Kylie's Camera — Authentic, Heartfelt Photography" },
      {
        property: "og:description",
        content: "Warm, candid photography in Utah County, UT. Capturing moments since 2024.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { content } = Route.useLoaderData();
  const bio = (content["bio"] as typeof BIO | undefined) ?? BIO;
  const funFacts = (content["fun_facts"] as typeof FUN_FACTS | undefined) ?? FUN_FACTS;

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[88vh] items-end overflow-hidden">
        <img
          src={heroImg}
          alt="Couple embracing in a golden field at sunset"
          width={1920}
          height={1152}
          className="absolute inset-0 size-full object-cover animate-fade-in"
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="container-site relative pb-20 text-primary-foreground md:pb-28">
          <p className="eyebrow text-primary-foreground/80 animate-fade-up">{SITE.location}</p>
          <h1 className="mt-4 max-w-3xl text-5xl leading-[1.05] animate-fade-up md:text-7xl">
            Authentic, Heartfelt <em className="font-normal italic">Photography.</em>
          </h1>
          <p className="font-script mt-4 text-3xl animate-fade-up md:text-4xl">{SITE.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-3 animate-fade-up">
            <Link to="/contact" className="btn-primary">
              Book a session <ArrowRight className="size-4" />
            </Link>
            <Link to="/gallery" className="btn-outline text-primary-foreground">
              View the gallery
            </Link>
          </div>
        </div>
      </section>

      {/* Intro bio */}
      <section className="container-site grid items-center gap-12 py-24 md:grid-cols-2 md:gap-20">
        <div className="relative mx-auto w-full max-w-md">
          <div className="absolute -inset-3 -rotate-2 rounded-lg bg-blush" />
          <img
            src={portraitImg}
            alt="Kylie laughing outdoors"
            width={1024}
            height={1280}
            loading="lazy"
            className="relative aspect-[4/5] w-full rounded-md object-cover shadow-soft"
          />
        </div>
        <div>
          <p className="eyebrow">{bio.eyebrow}</p>
          <h2 className="mt-4 text-4xl md:text-5xl">{bio.header}</h2>
          {bio.paragraphs.map((p, i) => (
            <p
              key={i}
              className={
                i === 0
                  ? "mt-6 leading-relaxed text-muted-foreground"
                  : "mt-4 leading-relaxed text-muted-foreground"
              }
            >
              {p}
            </p>
          ))}
          <Link to="/contact" className="btn-primary mt-8">
            Contact me
          </Link>
        </div>
      </section>

      {/* Session types strip */}
      <section className="bg-sand/60 py-20">
        <div className="container-site">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="eyebrow">What I shoot</p>
              <h2 className="mt-3 text-4xl">Sessions for every season of life</h2>
            </div>
            <Link
              to="/pricing"
              className="hidden text-xs uppercase tracking-[0.2em] hover:text-primary md:block"
            >
              Info & pricing →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {SHOOT_STRIP.map((s) => (
              <Link
                key={s.name}
                to="/pricing"
                hash={s.slug}
                className="group relative overflow-hidden rounded-md"
              >
                <img
                  src={s.image}
                  alt={s.name}
                  width={1024}
                  height={1280}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="hero-overlay absolute inset-0" />
                <p className="absolute bottom-4 left-4 font-serif text-2xl text-primary-foreground">
                  {s.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Fun facts */}
      <section className="container-site py-24">
        <div className="text-center">
          <p className="eyebrow">Get to know me</p>
          <h2 className="mt-3 text-4xl md:text-5xl">Fun facts about me</h2>
        </div>
        <div className="mx-auto mt-14 grid max-w-5xl items-center gap-12 md:grid-cols-[1fr_auto_1fr] md:gap-10">
          <ul className="grid gap-10 text-center sm:grid-cols-2 md:grid-cols-1 md:text-right">
            {funFacts.slice(0, 3).map((f) => (
              <FunFact key={f.title} fact={f} />
            ))}
          </ul>
          <div className="relative order-first mx-auto w-64 shrink-0 sm:w-72 md:order-none md:w-80 lg:w-96">
            <div className="absolute -inset-3 rotate-2 rounded-lg bg-blush" />
            <img
              src={funFactsImg}
              alt="Kylie"
              width={600}
              height={900}
              loading="lazy"
              className="relative aspect-[2/3] w-full rounded-md object-cover shadow-soft"
            />
          </div>
          <ul className="grid gap-10 text-center sm:grid-cols-2 md:grid-cols-1 md:text-left">
            {funFacts.slice(3).map((f) => (
              <FunFact key={f.title} fact={f} />
            ))}
          </ul>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-blush/60 py-24">
        <div className="container-site">
          <div className="text-center">
            <p className="eyebrow">Kind words</p>
            <h2 className="mt-3 text-4xl md:text-5xl">From past clients</h2>
          </div>
          <div className="mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-6 [scrollbar-width:thin]">
            {TESTIMONIALS.map((t) => (
              <figure
                key={t.name}
                className={cn(
                  "relative min-w-[85%] snap-center overflow-hidden rounded-lg p-8 shadow-card sm:min-w-[60%] lg:min-w-[calc(33.333%-1rem)]",
                  !t.photo && "bg-card",
                )}
              >
                {t.photo && (
                  <>
                    <img
                      src={t.photo.src}
                      alt={t.photo.alt}
                      className="absolute inset-0 size-full object-cover"
                    />
                    <div className="absolute inset-0 bg-ink/65" />
                  </>
                )}
                <div className="relative">
                  <blockquote
                    className={cn(
                      "mt-4 font-serif text-xl leading-relaxed italic",
                      t.photo && "text-primary-foreground",
                    )}
                  >
                    "{t.quote}"
                  </blockquote>
                  <figcaption className="mt-6 text-sm">
                    <span className={cn("font-medium", t.photo && "text-primary-foreground")}>
                      {t.name}
                    </span>
                    <span
                      className={t.photo ? "text-primary-foreground/75" : "text-muted-foreground"}
                    >
                      {" "}
                      · {t.session}
                    </span>
                  </figcaption>
                </div>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Socials */}
      <section className="container-site py-24 text-center">
        <p className="eyebrow">Follow along</p>
        <h2 className="mt-3 text-4xl md:text-5xl">Let's be friends</h2>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          Sneak peeks, behind the scenes, and the occasional golden hour sunset.
        </p>
        <div className="mt-10">
          <SocialLinks size="lg" />
        </div>
      </section>
    </>
  );
}

function FunFact({ fact }: { fact: { title: string; text: string } }) {
  return (
    <li>
      <h3 className="text-2xl uppercase tracking-wide md:text-3xl">{fact.title}</h3>
      <p className="mt-2 text-lg uppercase leading-relaxed text-muted-foreground md:text-xl">
        {fact.text}
      </p>
    </li>
  );
}
