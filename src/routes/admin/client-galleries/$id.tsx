import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Trash2, Upload } from "lucide-react";
import { PageIntro } from "@/components/site/PageIntro";
import { adminLogout, getAdminStatus } from "@/lib/admin.functions";
import {
  deleteClientGalleryPhoto,
  getAdminClientGallery,
  updateClientGalleryDetails,
  uploadClientGalleryPhoto,
  type ClientGallery,
  type ClientGalleryPhoto,
} from "@/lib/client-galleries.functions";

export const Route = createFileRoute("/admin/client-galleries/$id")({
  beforeLoad: async () => {
    const { isAdmin } = await getAdminStatus();
    if (!isAdmin) throw redirect({ to: "/admin/login" });
  },
  head: () => ({
    meta: [
      { title: "Manage Client Gallery — Kylie's Camera Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminClientGalleryPage,
});

function AdminClientGalleryPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const getGallery = useServerFn(getAdminClientGallery);
  const saveDetails = useServerFn(updateClientGalleryDetails);
  const uploadPhoto = useServerFn(uploadClientGalleryPhoto);
  const deletePhoto = useServerFn(deleteClientGalleryPhoto);
  const logout = useServerFn(adminLogout);

  const [gallery, setGallery] = useState<ClientGallery | null | undefined>(undefined);
  const [photos, setPhotos] = useState<ClientGalleryPhoto[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const result = await getGallery({ data: { id: Number(id) } });
      setGallery(result.gallery);
      setPhotos(result.photos);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load gallery.");
    }
  }, [getGallery, id]);

  useEffect(() => {
    load();
  }, [load]);

  async function onSaveDetails(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!gallery) return;
    setSaving(true);
    setSaveStatus("idle");
    const fd = new FormData(e.currentTarget);
    try {
      await saveDetails({
        data: {
          id: gallery.id,
          client_name: String(fd.get("client_name") ?? "").trim(),
          title: String(fd.get("title") ?? "").trim(),
          message: String(fd.get("message") ?? "").trim(),
        },
      });
      setSaveStatus("saved");
      await load();
    } catch {
      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  }

  async function onUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !gallery) return;
    setError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.set("galleryId", String(gallery.id));
      fd.set("file", file);
      await uploadPhoto({ data: fd });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function onDeletePhoto(p: ClientGalleryPhoto) {
    if (!confirm("Delete this photo?")) return;
    setError(null);
    try {
      await deletePhoto({ data: { id: p.id, url: p.url } });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed. Please try again.");
    }
  }

  async function signOut() {
    await logout();
    navigate({ to: "/admin/login" });
  }

  if (gallery === undefined) {
    return (
      <section className="container-site flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Loading…</p>
      </section>
    );
  }

  if (gallery === null) {
    return (
      <section className="container-site flex min-h-[50vh] flex-col items-center justify-center text-center">
        <p className="text-muted-foreground">Gallery not found.</p>
        <Link to="/admin/client-galleries" className="btn-outline mt-6">
          Back to client galleries
        </Link>
      </section>
    );
  }

  return (
    <>
      <PageIntro eyebrow="Admin" title={gallery.client_name}>
        Link: /client/{gallery.slug}
      </PageIntro>

      <div className="container-site flex items-center justify-center gap-6">
        <Link
          to="/admin/client-galleries"
          className="text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
        >
          ← Back to client galleries
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
          <h2 className="mb-4 font-serif text-2xl">Details</h2>
          <form onSubmit={onSaveDetails} className="space-y-4 rounded-lg border border-border p-5">
            <label className="block">
              <span className="mb-1.5 block text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Client name
              </span>
              <input
                name="client_name"
                required
                defaultValue={gallery.client_name}
                className="field"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Gallery title
              </span>
              <input name="title" defaultValue={gallery.title ?? ""} className="field" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Message to client
              </span>
              <textarea
                name="message"
                rows={3}
                defaultValue={gallery.message ?? ""}
                className="field"
              />
            </label>
            <div className="flex items-center gap-3">
              <button type="submit" disabled={saving} className="btn-primary text-xs">
                {saving ? "Saving…" : "Save details"}
              </button>
              {saveStatus === "saved" && <span className="text-xs text-primary">Saved</span>}
              {saveStatus === "error" && (
                <span className="text-xs text-destructive">Save failed</span>
              )}
            </div>
          </form>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-2xl">Photos</h2>
            <label className="btn-outline cursor-pointer text-xs">
              {uploading ? (
                "Uploading…"
              ) : (
                <>
                  <Upload className="mr-2 inline size-4" /> Upload photo
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={onUpload}
              />
            </label>
          </div>
          {photos.length === 0 ? (
            <p className="text-sm text-muted-foreground">No photos uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
              {photos.map((p) => (
                <div key={p.id} className="group relative overflow-hidden rounded-md">
                  <img
                    src={p.url}
                    alt={p.caption ?? ""}
                    className="aspect-square w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => onDeletePhoto(p)}
                    aria-label="Delete photo"
                    className="absolute right-1 top-1 flex size-7 items-center justify-center rounded-full bg-ink/70 text-primary-foreground opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
