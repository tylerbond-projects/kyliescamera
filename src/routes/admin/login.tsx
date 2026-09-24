import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, type FormEvent } from "react";
import { PageIntro } from "@/components/site/PageIntro";
import { adminLogin } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [{ title: "Admin Sign In — Kylie's Camera" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const login = useServerFn(adminLogin);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const password = String(fd.get("password") ?? "");
    try {
      await login({ data: { password } });
      navigate({ to: "/admin" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageIntro eyebrow="Admin" title="Sign In" />
      <form onSubmit={onSubmit} className="container-site max-w-sm space-y-5 pb-20">
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
            autoFocus
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
