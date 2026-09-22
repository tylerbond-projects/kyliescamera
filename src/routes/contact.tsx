import { createFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { PageIntro } from "@/components/site/PageIntro";
import { SocialLinks } from "@/components/site/SocialLinks";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  validateSearch: (s: Record<string, unknown>): { type?: string } => {
    const t = s["type"];
    return typeof t === "string" ? { type: t } : {};
  },
  head: () => ({
    meta: [
      { title: "Contact & Booking — Kylie's Camera" },
      { name: "description", content: "Book a portrait, couple, family, wedding, dance, sports, or homecoming session with Kylie's Camera in Utah County." },
      { property: "og:title", content: "Contact & Booking — Kylie's Camera" },
      { property: "og:description", content: "Tell me your vision and let's plan your session." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <PageIntro eyebrow="Contact & Booking" title="Let's Make Something Beautiful" script="tell me your vision">
        Send me a message with the type of shoot, your ideal month, and your vision, and I'll get back to you within 3
        days with availability and next steps.
      </PageIntro>

      <section className="container-site max-w-xl space-y-12 pb-20 text-center">
        <div>
          <Mail className="mx-auto size-8 text-primary" />
          <a
            href={`mailto:${SITE.email}`}
            className="mt-4 block font-serif text-3xl underline-offset-4 hover:text-primary hover:underline"
          >
            {SITE.email}
          </a>
          <p className="mt-4 text-xs text-muted-foreground">
            If you haven't heard back within 3 days, please check your junk/spam folder.
          </p>
        </div>

        <div>
          <p className="eyebrow mb-6">Or find me on social</p>
          <SocialLinks size="lg" />
        </div>
      </section>
    </>
  );
}
