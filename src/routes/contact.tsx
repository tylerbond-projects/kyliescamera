import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { PageIntro } from "@/components/site/PageIntro";
import { submitContact, type ContactInput } from "@/lib/booking.functions";
import { CONTACT_METHODS, HEARD_ABOUT, INTEREST_LEVELS, SHOOT_TYPES, upcomingMonths } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  validateSearch: (s: Record<string, unknown>) => ({
    type: typeof s.type === "string" ? s.type : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Contact & Booking — Kylie Photography" },
      { name: "description", content: "Book a portrait, couple, family, wedding, dance, sports, or homecoming session with Kylie Photography in Utah County." },
      { property: "og:title", content: "Contact & Booking — Kylie Photography" },
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
  const submit = useServerFn(submitContact);
  const [done, setDone] = useState(false);

  const mutation = useMutation({
    mutationFn: (data: ContactInput) => submit({ data }),
    onSuccess: () => setDone(true),
    onError: (e: Error) => toast.error(e.message || "Something went wrong. Please try again."),
  });

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const get = (k: string) => String(fd.get(k) ?? "");
    mutation.mutate({
      name: get("name"),
      email: get("email"),
      phone: get("phone"),
      interest_level: get("interest_level"),
      heard_about: get("heard_about"),
      desired_month: get("desired_month"),
      shoot_type: get("shoot_type"),
      vision: get("vision"),
      socials: get("socials"),
      preferred_contact: get("preferred_contact") as "Email" | "Text",
    });
  }

  if (done) {
    return (
      <section className="container-site flex min-h-[70vh] max-w-xl flex-col items-center justify-center text-center">
        <Heart className="size-10 text-primary" />
        <h1 className="mt-6 text-5xl">Thank you!</h1>
        <p className="font-script mt-2 text-3xl text-primary">I can't wait to hear more</p>
        <p className="mt-6 leading-relaxed text-muted-foreground">
          Your message is on its way. I'll be in touch within 3 days — if you haven't heard back by
          then, please check your junk/spam folder.
        </p>
        <Link to="/" className="btn-outline mt-8">
          Back home
        </Link>
      </section>
    );
  }

  return (
    <>
      <PageIntro eyebrow="Contact & Booking" title="Let's Make Something Beautiful" script="tell me your vision">
        Fill out the form below and I'll get back to you within 3 days with availability and next steps.
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
          <RadioGroup name="interest_level" options={INTEREST_LEVELS} defaultValue={INTEREST_LEVELS[0]} />
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
            <Field label="Type of shoot" required>
              <select
                name="shoot_type"
                required
                className="field"
                defaultValue={SHOOT_TYPES.find((t) => t.slug === type)?.name ?? ""}
              >
                <option value="" disabled>
                  Choose one
                </option>
                {SHOOT_TYPES.map((t) => (
                  <option key={t.slug}>{t.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Desired month">
              <select name="desired_month" className="field" defaultValue="">
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

        <Fieldset legend="Preferred contact method">
          <RadioGroup name="preferred_contact" options={CONTACT_METHODS} defaultValue="Email" inline />
        </Fieldset>

        <div className="rounded-lg bg-blush/60 p-6 text-center">
          <button type="submit" disabled={mutation.isPending} className="btn-primary w-full sm:w-auto">
            {mutation.isPending ? "Sending…" : "Send my inquiry"}
          </button>
          <p className="mt-4 text-xs text-muted-foreground">
            If you haven't heard back within 3 days, please check your junk/spam folder.
          </p>
        </div>
      </form>
    </>
  );
}

function Fieldset({ legend, children }: { legend: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-5">
      <legend className="mb-5 font-serif text-2xl">{legend}</legend>
      {children}
    </fieldset>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-[0.18em] text-muted-foreground">
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
          <input type="radio" name={name} value={o} defaultChecked={o === defaultValue} required className="accent-primary" />
          {o}
        </label>
      ))}
    </div>
  );
}
