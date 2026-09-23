import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Mail } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import { PageIntro } from "@/components/site/PageIntro";
import { SocialLinks } from "@/components/site/SocialLinks";
import {
  CONTACT_METHODS,
  HEARD_ABOUT,
  INTEREST_LEVELS,
  MISC_PRICING,
  SHOOT_TYPES,
  SITE,
  upcomingMonths,
} from "@/lib/site";
import { getSiteContentMap } from "@/lib/content.functions";

export const Route = createFileRoute("/contact")({
  validateSearch: (s: Record<string, unknown>): { type?: string } => {
    const t = s["type"];
    return typeof t === "string" ? { type: t } : {};
  },
  loader: async () => {
    const content = await getSiteContentMap().catch(() => ({}) as Record<string, unknown>);
    return { content };
  },
  head: () => ({
    meta: [
      { title: "Contact & Booking — Kylie's Camera" },
      {
        name: "description",
        content:
          "Book a portrait, couple, family, wedding, dance, sports, or homecoming session with Kylie's Camera in Utah County.",
      },
      { property: "og:title", content: "Contact & Booking — Kylie's Camera" },
      { property: "og:description", content: "Tell me your vision and let's plan your session." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

const MONTHS = upcomingMonths();

function ContactPage() {
  const { type } = Route.useSearch();
  const { content } = Route.useLoaderData();
  const shootTypes = (content["shoot_types"] as typeof SHOOT_TYPES | undefined) ?? SHOOT_TYPES;
  const miscPricing = (content["misc_pricing"] as typeof MISC_PRICING | undefined) ?? MISC_PRICING;
  const shootOptions = [...shootTypes.map((t) => t.name), ...miscPricing.items.map((i) => i.name)];
  const [done, setDone] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const get = (k: string) => String(fd.get(k) ?? "").trim();

    const body = [
      `Name: ${get("name")}`,
      `Email: ${get("email")}`,
      `Phone number: ${get("phone")}`,
      `Interest in booking: ${get("interest_level")}`,
      `How they heard about me: ${get("heard_about")}`,
      `Desired month: ${get("desired_month")}`,
      `Shoot type: ${get("shoot_type")}`,
      `Preferred contact: ${get("preferred_contact")}`,
      `Socials: ${get("socials") || "—"}`,
      "",
      "Vision for the shoot:",
      get("vision") || "—",
    ].join("\n");

    const mailto = `mailto:${SITE.email}?subject=${encodeURIComponent(
      `New booking inquiry from ${get("name")}`,
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
    setDone(true);
  }

  if (done) {
    return (
      <section className="container-site flex min-h-[70vh] max-w-xl flex-col items-center justify-center text-center">
        <Heart className="size-10 text-primary" />
        <h1 className="mt-6 text-5xl">Almost done!</h1>
        <p className="font-script mt-2 text-3xl text-primary">one more click</p>
        <p className="mt-6 leading-relaxed text-muted-foreground">
          Your email app should have opened with your message ready to go — just hit send. If it
          didn't open, email me directly at{" "}
          <a href={`mailto:${SITE.email}`} className="text-primary underline underline-offset-4">
            {SITE.email}
          </a>
          .
        </p>
        <Link to="/" className="btn-outline mt-8">
          Back home
        </Link>
      </section>
    );
  }

  return (
    <>
      <PageIntro
        eyebrow="Contact & Booking"
        title="Let's Craft Memories That Last a Lifetime"
        script="tell me your vision"
      >
        Fill out the form below and I'll get back to you within 3 days with availability and next
        steps.
      </PageIntro>

      <form onSubmit={onSubmit} className="container-site max-w-2xl space-y-10">
        <Fieldset legend="About you">
          <Field label="Name" required>
            <input name="name" required className="field" autoComplete="name" />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Email" required>
              <input name="email" type="email" required className="field" autoComplete="email" />
            </Field>
            <Field label="Phone number" required>
              <input name="phone" type="tel" required className="field" autoComplete="tel" />
            </Field>
          </div>
          <Field label="Your socials (optional)">
            <input name="socials" className="field" placeholder="@yourhandle" />
          </Field>
        </Fieldset>

        <Fieldset legend="Where are you at?">
          <RadioGroup
            name="interest_level"
            options={INTEREST_LEVELS}
            defaultValue={INTEREST_LEVELS[0]}
          />
          <Field label="How did you hear about me?">
            <select name="heard_about" className="field" defaultValue="">
              <option value="" disabled>
                Choose one
              </option>
              {HEARD_ABOUT.map((h) => (
                <option key={h}>{h}</option>
              ))}
            </select>
          </Field>
        </Fieldset>

        <Fieldset legend="The shoot">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="What kind of shoot?" required>
              <select
                name="shoot_type"
                required
                className="field"
                defaultValue={shootTypes.find((t) => t.slug === type)?.name ?? ""}
              >
                <option value="" disabled>
                  Choose one
                </option>
                {shootOptions.map((name) => (
                  <option key={name}>{name}</option>
                ))}
              </select>
            </Field>
            <Field label="Desired month" required>
              <select name="desired_month" required className="field" defaultValue="">
                <option value="" disabled>
                  Choose a month
                </option>
                {MONTHS.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Tell me your vision for the shoot">
            <textarea
              name="vision"
              rows={5}
              className="field"
              placeholder="Locations you love, the vibe you're going for, who's coming, anything special…"
            />
          </Field>
        </Fieldset>

        <Fieldset legend="Email or text?">
          <RadioGroup
            name="preferred_contact"
            options={CONTACT_METHODS}
            defaultValue="Email"
            inline
          />
        </Fieldset>

        <div className="rounded-lg bg-blush/60 p-6">
          <label className="flex cursor-pointer items-start gap-3 text-sm">
            <input type="checkbox" name="agree" required className="mt-0.5 accent-primary" />
            <span>I agree: if I haven't seen a response in 3 days, I will check my junk mail.</span>
          </label>
          <button type="submit" className="btn-primary mt-5 w-full sm:w-auto">
            Send my inquiry
          </button>
        </div>
      </form>

      <section className="container-site mt-24 max-w-xl space-y-12 pb-20 text-center">
        <div>
          <Mail className="mx-auto size-8 text-primary" />
          <a
            href={`mailto:${SITE.email}`}
            className="mt-4 block font-serif text-3xl underline-offset-4 hover:text-primary hover:underline"
          >
            {SITE.email}
          </a>
        </div>

        <div>
          <p className="eyebrow mb-6">Or find me on social</p>
          <SocialLinks size="lg" />
        </div>
      </section>
    </>
  );
}

function Fieldset({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-5">
      <legend className="mb-5 font-serif text-2xl">{legend}</legend>
      {children}
    </fieldset>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block min-h-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {label}
        {required && <span className="text-primary"> *</span>}
      </span>
      {children}
    </label>
  );
}

function RadioGroup({
  name,
  options,
  defaultValue,
  inline,
}: {
  name: string;
  options: readonly string[];
  defaultValue: string;
  inline?: boolean;
}) {
  return (
    <div className={inline ? "flex flex-wrap gap-3" : "grid gap-3"}>
      {options.map((o) => (
        <label
          key={o}
          className="flex cursor-pointer items-center gap-3 rounded-md border border-border bg-card px-4 py-3 text-sm transition-colors has-[:checked]:border-primary has-[:checked]:bg-blush/50"
        >
          <input
            type="radio"
            name={name}
            value={o}
            defaultChecked={o === defaultValue}
            required
            className="accent-primary"
          />
          {o}
        </label>
      ))}
    </div>
  );
}
