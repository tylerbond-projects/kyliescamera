import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { PageIntro } from "@/components/site/PageIntro";
import { adminLogout, getAdminStatus } from "@/lib/admin.functions";
import {
  createClientGallery,
  deleteClientGallery,
  listClientGalleries,
  type ClientGallery,
} from "@/lib/client-galleries.functions";

export const Route = createFileRoute("/admin/client-galleries/")({
  beforeLoad: async () => {
    const { isAdmin } = await getAdminStatus();
    if (!isAdmin) throw redirect({ to: "/admin/login" });
  },
  head: () => ({
    meta: [
      { title: "Client Galleries — Kylie's Camera Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminClientGalleriesPage,
});

type Row = ClientGallery & { photo_count: number };

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function AdminClientGalleriesPage() {
  const navigate = useNavigate();
  const listGalleries = useServerFn(listClientGalleries);
  const createGallery = useServerFn(createClientGallery);
  const deleteGallery = useServerFn(deleteClientGallery);
  const logout = useServerFn(adminLogout);

  const [galleries, setGalleries] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);

  const load = useCallback(async () => {
    try {
      setGalleries(await listGalleries());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load client galleries.");
    }
  }, [listGalleries]);

  useEffect(() => {
    load();
  }, [load]);

  async function onCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setCreating(true);
    const fd = new FormData(e.currentTarget);
    try {
      await createGallery({
        data: {
          slug: String(fd.get("slug") ?? "").trim(),
          client_name: String(fd.get("client_name") ?? "").trim(),
          title: String(fd.get("title") ?? "").trim(),
          message: String(fd.get("message") ?? "").trim(),
        },
      });
      (e.target as HTMLFormElement).reset();
      setSlug("");
      setSlugEdited(false);
      await load();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Couldn't create the gallery. Please try again.",
      );
    } finally {
      setCreating(false);
    }
  }

  async function onDelete(g: Row) {
    if (!confirm(`Delete ${g.client_name}'s gallery and all its photos? This can't be undone.`))
      return;
    setError(null);
    try {
      await deleteGallery({ data: { id: g.id } });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't delete the gallery.");
    }
  }

  async function signOut() {
    await logout();
    navigate({ to: "/admin/login" });
  }

  function copyLink(gallerySlug: string) {
    const url = `${window.location.origin}/client/${gallerySlug}`;
    navigator.clipboard.writeText(url).catch(() => {});
  }

  return (
    <>
      <PageIntro eyebrow="Admin" title="Client Galleries">
        Create a private link for a client to view and download their photos.
      </PageIntro>

      <div className="container-site flex items-center justify-center gap-6">
        <Link
          to="/admin"
          className="text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
        >
          ← Back to admin
        </Link>
        <button
          type="button"
          onClick={signOut}
          className="text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
        >
          Sign out
        </button>
      </div>

      <div className="container-site max-w-3xl space-y-16 pb-24">
        {error && (
          <p className="rounded-md bg-destructive/10 p-4 text-center text-sm text-destructive">
            {error}
          </p>
        )}

        <section>
          <h2 className="mb-4 font-serif text-2xl">New Gallery</h2>
          <form onSubmit={onCreate} className="space-y-4 rounded-lg border border-border p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Client name
                </span>
                <input
                  name="client_name"
                  required
                  className="field"
                  onChange={(e) => {
                    if (!slugEdited) setSlug(slugify(e.target.value));
                  }}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Link (yoursite.com/client/…)
                </span>
                <input
                  name="slug"
                  required
                  className="field"
                  value={slug}
                  onChange={(e) => {
                    setSlugEdited(true);
                    setSlug(slugify(e.target.value));
                  }}
                />
              </label>
            </div>
            <label className="block">
              <span className="mb-1.5 block text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Gallery title (optional)
              </span>
              <input
                name="title"
                className="field"
                placeholder="e.g. Anderson Family — Fall 2026"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Message to client (optional)
              </span>
              <textarea name="message" rows={3} className="field" />
            </label>
            <button type="submit" disabled={creating} className="btn-primary text-xs">
              {creating ? "Creating…" : "Create gallery"}
            </button>
          </form>
        </section>

        <section>
          <h2 className="mb-4 font-serif text-2xl">Existing Galleries</h2>
          {galleries === null ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : galleries.length === 0 ? (
            <p className="text-sm text-muted-foreground">No client galleries yet.</p>
          ) : (
            <div className="space-y-3">
              {galleries.map((g) => (
                <div
                  key={g.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border p-4"
                >
                  <div>
                    <p className="font-medium">{g.client_name}</p>
                    <p className="text-xs text-muted-foreground">
                      /client/{g.slug} · {g.photo_count} photo{g.photo_count === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => copyLink(g.slug)}
                      className="text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
                    >
                      Copy link
                    </button>
                    <Link
                      to="/admin/client-galleries/$id"
                      params={{ id: String(g.id) }}
                      className="text-xs uppercase tracking-[0.18em] text-primary hover:underline"
                    >
                      Manage photos
                    </Link>
                    <button
                      type="button"
                      onClick={() => onDelete(g)}
                      className="text-xs uppercase tracking-[0.18em] text-destructive hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
