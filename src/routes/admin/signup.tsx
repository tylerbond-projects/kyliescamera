import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { PageIntro } from "@/components/site/PageIntro";
import { supabase } from "@/integrations/supabase/client";

// One-time account creation, since Lovable Cloud's panel has no "add user"
// button. Safe to leave in place indefinitely: the database policies are
// scoped to a specific admin email, so signing up here grants no special
// access unless the account's email matches that policy.
export const Route = createFileRoute("/admin/signup")({
  head: () => ({
    meta: [
      { title: "Create Admin Account — Kylie's Camera" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminSignupPage,
});

function AdminSignupPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim();
    const password = String(fd.get("password") ?? "");
    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    if (data.session) {
      navigate({ to: "/admin/photos" });
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <section className="container-site flex min-h-[50vh] max-w-md flex-col items-center justify-center text-center">
        <h1 className="text-3xl">Check your email</h1>
        <p className="mt-4 text-muted-foreground">
          If email confirmation is required, we've sent a link — click it, then come back and sign
          in.
        </p>
        <Link to="/admin/login" className="btn-outline mt-8">
          Go to sign in
        </Link>
      </section>
    );
  }

  return (
    <>
      <PageIntro eyebrow="Admin" title="Create Admin Account" />
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
            minLength={6}
            className="field"
            autoComplete="new-password"
          />
        </label>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Creating…" : "Create account"}
        </button>
        <Link
          to="/admin/login"
          className="block text-center text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
        >
          Already have an account? Sign in
        </Link>
      </form>
    </>
  );
}
