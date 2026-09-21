import { createFileRoute, Link } from "@tanstack/react-router";
import * as Accordion from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import { PageIntro } from "@/components/site/PageIntro";
import { FAQS } from "@/lib/site";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Kylie Photography" },
      { name: "description", content: "Answers about turnaround time, deposits, what to wear, and travel fees for sessions with Kylie Photography." },
      { property: "og:title", content: "FAQ — Kylie Photography" },
      { property: "og:description", content: "Turnaround time, deposits, what to wear, and travel." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <>
      <PageIntro eyebrow="Good to know" title="Frequently Asked Questions" script="before we shoot">
        A few things people usually ask before booking. Still curious? Just reach out.
      </PageIntro>

      <div className="container-site max-w-3xl">
        <Accordion.Root type="single" collapsible className="divide-y divide-border border-y border-border">
          {FAQS.map((f, i) => (
            <Accordion.Item key={f.q} value={`item-${i}`} className="group">
              <Accordion.Header>
                <Accordion.Trigger className="flex w-full items-center justify-between gap-6 py-6 text-left font-serif text-2xl transition-colors hover:text-primary">
                  {f.q}
                  <Plus className="size-5 shrink-0 text-primary transition-transform duration-300 group-data-[state=open]:rotate-45" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                <p className="pb-6 leading-relaxed text-muted-foreground">{f.a}</p>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground">Have a different question?</p>
          <Link to="/contact" className="btn-primary mt-5">
            Ask me anything
          </Link>
        </div>
      </div>
    </>
  );
}
