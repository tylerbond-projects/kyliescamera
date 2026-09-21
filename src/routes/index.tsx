import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Quote } from "lucide-react";
import { SITE, FUN_FACTS, TESTIMONIALS, SHOOT_TYPES } from "@/lib/site";
import { SocialLinks } from "@/components/site/SocialLinks";
import { CATEGORY_IMAGES } from "@/lib/images";
import heroImg from "@/assets/hero.jpg";
import portraitImg from "@/assets/portrait.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kylie Photography — Authentic, Heartfelt Photography in Utah County" },
      {
        name: "description",
        content:
          "Warm, candid portrait, couple, family, wedding, dance, and sports photography in Utah County, UT. Capturing moments since 2024.",
      },
      { property: "og:title", content: "Kylie Photography — Authentic, Heartfelt Photography" },
      { property: "og:description", content: "Warm, candid photography in Utah County, UT. Capturing moments since 2024." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
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
          <p className="eyebrow">Hi, I'm Kylie</p>
          <h2 className="mt-4 text-4xl md:text-5xl">
            I photograph the in-between moments — the ones you'll want to remember forever.
          </h2>
          <p className="mt-6 leading-relaxed text-muted-foreground">
            I'm a Utah County photographer who believes the best photos happen when you forget the
            camera is there. My sessions are relaxed, a little playful, and full of golden light.
            Whether it's your family, your love story, or a homecoming years in the making, I'd be
            honored to capture it.
          </p>
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
            <Link to="/pricing" className="hidden text-xs uppercase tracking-[0.2em] hover:text-primary md:block">
              Info & pricing →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {SHOOT_TYPES.slice(0, 4).map((t) => (
              <Link key={t.slug} to="/gallery" className="group relative overflow-hidden rounded-md">
                <img
                  src={CATEGORY_IMAGES[t.slug]}
                  alt={t.name}
                  width={1024}
                  height={1280}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="hero-overlay absolute inset-0" />
                <p className="absolute bottom-4 left-4 font-serif text-2xl text-primary-foreground">{t.name}</p>
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
        <ol className="mx-auto mt-14 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {FUN_FACTS.map((f, i) => (
            <li key={f.title} className="text-center">
              <span className="font-script text-5xl text-primary">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-2 text-xl">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
            </li>
          ))}
        </ol>
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
                className="min-w-[85%] snap-center rounded-lg bg-card p-8 shadow-card sm:min-w-[60%] lg:min-w-[calc(33.333%-1rem)]"
              >
                <Quote className="size-6 text-primary" />
                <blockquote className="mt-4 font-serif text-xl leading-relaxed italic">"{t.quote}"</blockquote>
                <figcaption className="mt-6 text-sm">
                  <span className="font-medium">{t.name}</span>
                  <span className="text-muted-foreground"> · {t.session}</span>
                </figcaption>
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
