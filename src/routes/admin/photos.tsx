import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useState, type ChangeEvent } from "react";
import { Trash2, Upload } from "lucide-react";
import { PageIntro } from "@/components/site/PageIntro";
import { supabase } from "@/integrations/supabase/client";
import {
  adminLogout,
  createGalleryUploadUrl,
  deleteGalleryPhoto,
  getAdminStatus,
  recordGalleryPhoto,
} from "@/lib/admin.functions";
import { SHOOT_TYPES, MISC_PRICING } from "@/lib/site";

export const Route = createFileRoute("/admin/photos")({
  beforeLoad: async () => {
    const { isAdmin } = await getAdminStatus();
    if (!isAdmin) throw redirect({ to: "/admin/login" });
  },
  head: () => ({
    meta: [
      { title: "Manage Photos — Kylie's Camera Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPhotosPage,
});

const CATEGORIES = [
  ...SHOOT_TYPES.map((t) => ({ slug: t.slug, name: t.name })),
  ...MISC_PRICING.items.map((i) => ({ slug: i.slug, name: i.name })),
];

type GalleryPhoto = { id: string; category: string; url: string; caption: string | null };

function AdminPhotosPage() {
  const navigate = useNavigate();
  const createUploadUrl = useServerFn(createGalleryUploadUrl);
  const recordPhoto = useServerFn(recordGalleryPhoto);
  const deletePhoto = useServerFn(deleteGalleryPhoto);
  const logout = useServerFn(adminLogout);

  const [photos, setPhotos] = useState<GalleryPhoto[] | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadPhotos = useCallback(async () => {
    const { data, error: fetchError } = await supabase
      .from("gallery_photos")
      .select("id, category, url, caption")
      .order("sort_order", { ascending: true });
    if (fetchError) {
      setError(fetchError.message);
      return;
    }
    setPhotos(data ?? []);
  }, []);

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
      const { path, token } = await createUploadUrl({ data: { category, filename: file.name } });
      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .uploadToSignedUrl(path, token, file);
      if (uploadError) throw uploadError;
      await recordPhoto({ data: { category, path } });
      await loadPhotos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setUploading(null);
    }
  }

  async function onDelete(photo: GalleryPhoto) {
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
      <PageIntro eyebrow="Admin" title="Manage Photos">
        Upload photos for each session type. They'll show up on the public gallery right away.
      </PageIntro>

      <div className="container-site max-w-4xl space-y-16 pb-24">
        <div className="text-center">
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
