import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { PageIntro } from "@/components/site/PageIntro";
import { adminLogout, getAdminStatus } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/")({
  beforeLoad: async () => {
    const { isAdmin } = await getAdminStatus();
    if (!isAdmin) throw redirect({ to: "/admin/login" });
  },
  head: () => ({
    meta: [{ title: "Admin — Kylie's Camera" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const navigate = useNavigate();
  const logout = useServerFn(adminLogout);

  async function signOut() {
    await logout();
    navigate({ to: "/admin/login" });
  }

  return (
    <>
      <PageIntro eyebrow="Admin" title="Site Admin" />

      <div className="container-site max-w-lg space-y-4 pb-24">
        <Link
          to="/admin/photos"
          className="block rounded-lg border border-border bg-card p-6 shadow-card transition-transform hover:-translate-y-0.5"
        >
          <h2 className="font-serif text-xl">Manage Photos</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload and remove gallery photos for each session type.
          </p>
        </Link>
        <p className="text-xs text-muted-foreground">
          Editing bio, pricing, FAQ, and testimonial text from here is coming next — for now those
          still go through your developer.
        </p>
        <button
          type="button"
          onClick={signOut}
          className="text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
        >
          Sign out
        </button>
      </div>
    </>
  );
}
