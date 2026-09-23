import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useState, type ChangeEvent } from "react";
import { Trash2, Upload } from "lucide-react";
import { PageIntro } from "@/components/site/PageIntro";
import {
  adminLogout,
  deleteGalleryPhoto,
  getAdminStatus,
  listGalleryPhotos,
  uploadGalleryPhoto,
  type GalleryPhotoRow,
} from "@/lib/admin.functions";
import { SHOOT_TYPES, MISC_PRICING } from "@/lib/site";

export const Route = createFileRoute("/admin/photos")({
  beforeLoad: async () => {
    const { isAdmin } = await getAdminStatus();
    if (!isAdmin) throw redirect({ to: "/admin/login" });
  },
  head: () => ({
    meta: [
      { title: "Manage Gallery Photos — Kylie's Camera Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPhotosPage,
});

const CATEGORIES = [
  ...SHOOT_TYPES.map((t) => ({ slug: t.slug, name: t.name })),
  ...MISC_PRICING.items.map((i) => ({ slug: i.slug, name: i.name })),
];

function AdminPhotosPage() {
  const navigate = useNavigate();
  const listPhotos = useServerFn(listGalleryPhotos);
  const uploadPhoto = useServerFn(uploadGalleryPhoto);
  const deletePhoto = useServerFn(deleteGalleryPhoto);
  const logout = useServerFn(adminLogout);

  const [photos, setPhotos] = useState<GalleryPhotoRow[] | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadPhotos = useCallback(async () => {
    try {
      setPhotos(await listPhotos());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load photos.");
    }
  }, [listPhotos]);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  async function onUpload(category: string, e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError(null);
    setUploading(category);
    try {
      const fd = new FormData();
      fd.set("category", category);
      fd.set("file", file);
      await uploadPhoto({ data: fd });
      await loadPhotos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setUploading(null);
    }
  }

  async function onDelete(photo: GalleryPhotoRow) {
    if (!confirm("Delete this photo?")) return;
    setError(null);
    try {
      await deletePhoto({ data: { id: photo.id, url: photo.url } });
      await loadPhotos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed. Please try again.");
    }
  }

  async function signOut() {
    await logout();
    navigate({ to: "/admin/login" });
  }

  return (
    <>
      <PageIntro eyebrow="Admin" title="Manage Gallery Photos">
        Upload photos for each session type. They'll show up on the public gallery right away.
      </PageIntro>

      <div className="container-site max-w-4xl space-y-16 pb-24">
        <div className="flex items-center justify-center gap-6">
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

        {error && (
          <p className="rounded-md bg-destructive/10 p-4 text-center text-sm text-destructive">
            {error}
          </p>
        )}

        {CATEGORIES.map((cat) => {
          const catPhotos = photos?.filter((p) => p.category === cat.slug) ?? [];
          return (
            <section key={cat.slug}>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-serif text-2xl">{cat.name}</h2>
                <label className="btn-outline cursor-pointer text-xs">
                  {uploading === cat.slug ? (
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
                    disabled={uploading !== null}
                    onChange={(e) => onUpload(cat.slug, e)}
                  />
                </label>
              </div>
              {catPhotos.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No uploaded photos yet — the public gallery is showing a placeholder for this
                  category.
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
                  {catPhotos.map((p) => (
                    <div key={p.id} className="group relative overflow-hidden rounded-md">
                      <img
                        src={p.url}
                        alt={p.caption ?? cat.name}
                        className="aspect-square w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => onDelete(p)}
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
          );
        })}
      </div>
    </>
  );
}
