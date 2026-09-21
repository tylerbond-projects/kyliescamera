import { createFileRoute, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { getContract, signContract } from "@/lib/booking.functions";

export const Route = createFileRoute("/contract/$slug")({
  loader: async ({ params }) => {
    const contract = await getContract({ data: { slug: params.slug } });
    if (!contract) throw notFound();
    return contract;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.title} — Kylie Photography` : "Contract — Kylie Photography" },
      { name: "description", content: "Review and sign your photography agreement with Kylie Photography." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: loaderData?.title ?? "Contract" },
      { property: "og:description", content: "Review and sign your photography agreement." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  notFoundComponent: ContractNotFound,
  component: ContractPage,
});

function ContractNotFound() {
  return (
    <section className="container-site py-32 text-center">
      <h1 className="text-4xl">Contract not found</h1>
      <p className="mt-3 text-muted-foreground">Double-check the link Kylie sent you.</p>
    </section>
  );
}

function ContractPage() {
  const contract = Route.useLoaderData();
  const sign = useServerFn(signContract);
  const [signed, setSigned] = useState<{ signed_name: string; signed_at: string } | null>(
    contract.signed_at && contract.signed_name
      ? { signed_name: contract.signed_name, signed_at: contract.signed_at }
      : null,
  );

  const mutation = useMutation({
    mutationFn: (signed_name: string) =>
      sign({ data: { slug: contract.slug, signed_name, agreed: true as const } }),
    onSuccess: (res) => setSigned(res),
    onError: (e: Error) => toast.error(e.message),
  });

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    mutation.mutate(String(fd.get("signed_name") ?? ""));
  }

  return (
    <div className="container-site max-w-3xl py-16 md:py-24">
      <p className="eyebrow">Prepared for {contract.client_name}</p>
      <h1 className="mt-4 text-5xl md:text-6xl">{contract.title}</h1>

      <article className="mt-10 rounded-lg border border-border bg-card p-8 shadow-card md:p-12">
        <p className="mb-6 font-serif text-2xl">Kylie Photography · {contract.client_name}</p>
        <div className="space-y-4 text-sm leading-relaxed whitespace-pre-line text-foreground/90">{contract.body}</div>
      </article>

      {signed ? (
        <div className="mt-10 rounded-lg bg-blush/60 p-8 text-center">
          <CheckCircle2 className="mx-auto size-10 text-primary" />
          <h2 className="mt-4 text-3xl">Signed & complete</h2>
          <p className="font-script mt-3 text-4xl text-primary">{signed.signed_name}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {new Date(signed.signed_at).toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" })}
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-10 space-y-6 rounded-lg bg-sand/70 p-8">
          <h2 className="text-3xl">Sign this agreement</h2>
          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Type your full legal name
            </span>
            <input name="signed_name" required minLength={2} className="field font-script text-3xl" autoComplete="name" />
          </label>
          <label className="flex cursor-pointer items-start gap-3 text-sm">
            <input type="checkbox" required className="mt-1 accent-primary" />
            <span>
              I have read and agree to the terms above. I understand that typing my name and checking
              this box constitutes a legally binding electronic signature.
            </span>
          </label>
          <button type="submit" disabled={mutation.isPending} className="btn-primary">
            {mutation.isPending ? "Signing…" : "Sign agreement"}
          </button>
        </form>
      )}
    </div>
  );
}
