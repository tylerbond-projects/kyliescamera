import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { PageIntro } from "@/components/site/PageIntro";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [{ title: "Admin Sign In — Kylie's Camera" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim();
    const password = String(fd.get("password") ?? "");
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    navigate({ to: "/admin/photos" });
  }

  return (
    <>
      <PageIntro eyebrow="Admin" title="Sign In" />
      <form onSubmit={onSubmit} className="container-site max-w-sm space-y-5 pb-20">
        <label className="block">
          <span className="mb-1.5 block text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Email
          </span>
          <input name="email" type="email" required className="field" autoComplete="email" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Password
          </span>
          <input
            name="password"
            type="password"
            required
            className="field"
            autoComplete="current-password"
          />
        </label>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <Link
          to="/"
          className="block text-center text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
        >
          Back to site
        </Link>
      </form>
    </>
  );
}
