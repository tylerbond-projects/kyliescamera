import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { GALLERY_PUBLIC_URL_BASE } from "@/lib/r2";

export type ClientGallery = {
  id: number;
  slug: string;
  client_name: string;
  title: string | null;
  message: string | null;
  created_at: string;
};
export type ClientGalleryPhoto = {
  id: number;
  gallery_id: number;
  url: string;
  caption: string | null;
  sort_order: number;
};

const slugSchema = z
  .string()
  .min(1)
  .max(80)
  .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only.");

// -- Admin-only ---------------------------------------------------------

export const listClientGalleries = createServerFn({ method: "GET" }).handler(async () => {
  const { requireAdmin } = await import("@/lib/admin-session.server");
  await requireAdmin();
  const { getCloudflareEnv } = await import("@/lib/cloudflare.server");
  const env = getCloudflareEnv();
  const { results } = await env.DB.prepare(
    `SELECT g.id, g.slug, g.client_name, g.title, g.message, g.created_at,
            (SELECT COUNT(*) FROM client_gallery_photos p WHERE p.gallery_id = g.id) as photo_count
     FROM client_galleries g ORDER BY g.created_at DESC`,
  )
    .bind()
    .all<ClientGallery & { photo_count: number }>();
  return results;
});

export const createClientGallery = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        slug: slugSchema,
        client_name: z.string().min(1),
        title: z.string().optional().default(""),
        message: z.string().optional().default(""),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("@/lib/admin-session.server");
    await requireAdmin();
    const { getCloudflareEnv } = await import("@/lib/cloudflare.server");
    const env = getCloudflareEnv();
    const existing = await env.DB.prepare("SELECT id FROM client_galleries WHERE slug = ?1")
      .bind(data.slug)
      .all();
    if (existing.results.length > 0)
      throw new Error("That link is already taken — pick a different one.");
    await env.DB.prepare(
      "INSERT INTO client_galleries (slug, client_name, title, message) VALUES (?1, ?2, ?3, ?4)",
    )
      .bind(data.slug, data.client_name, data.title || null, data.message || null)
      .run();
    return { ok: true as const };
  });

export const updateClientGalleryDetails = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        id: z.number(),
        client_name: z.string().min(1),
        title: z.string().optional().default(""),
        message: z.string().optional().default(""),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("@/lib/admin-session.server");
    await requireAdmin();
    const { getCloudflareEnv } = await import("@/lib/cloudflare.server");
    const env = getCloudflareEnv();
    await env.DB.prepare(
      "UPDATE client_galleries SET client_name = ?1, title = ?2, message = ?3 WHERE id = ?4",
    )
      .bind(data.client_name, data.title || null, data.message || null, data.id)
      .run();
    return { ok: true as const };
  });

export const deleteClientGallery = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ id: z.number() }).parse(data))
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("@/lib/admin-session.server");
    await requireAdmin();
    const { getCloudflareEnv } = await import("@/lib/cloudflare.server");
    const env = getCloudflareEnv();
    const { results: photos } = await env.DB.prepare(
      "SELECT url FROM client_gallery_photos WHERE gallery_id = ?1",
    )
      .bind(data.id)
      .all<{ url: string }>();
    await env.DB.prepare("DELETE FROM client_gallery_photos WHERE gallery_id = ?1")
      .bind(data.id)
      .run();
    await env.DB.prepare("DELETE FROM client_galleries WHERE id = ?1").bind(data.id).run();
    for (const p of photos) {
      const key = p.url.split(`${GALLERY_PUBLIC_URL_BASE}/`)[1];
      if (key) await env.GALLERY_BUCKET.delete(key);
    }
    return { ok: true as const };
  });

export const getAdminClientGallery = createServerFn({ method: "GET" })
  .validator((data: unknown) => z.object({ id: z.number() }).parse(data))
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("@/lib/admin-session.server");
    await requireAdmin();
    const { getCloudflareEnv } = await import("@/lib/cloudflare.server");
    const env = getCloudflareEnv();
    const gallery = await env.DB.prepare("SELECT * FROM client_galleries WHERE id = ?1")
      .bind(data.id)
      .all<ClientGallery>();
    const photos = await env.DB.prepare(
      "SELECT * FROM client_gallery_photos WHERE gallery_id = ?1 ORDER BY sort_order ASC",
    )
      .bind(data.id)
      .all<ClientGalleryPhoto>();
    return { gallery: gallery.results[0] ?? null, photos: photos.results };
  });

export const uploadClientGalleryPhoto = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    if (!(data instanceof FormData)) throw new Error("Expected FormData");
    const galleryId = Number(data.get("galleryId"));
    if (!Number.isFinite(galleryId)) throw new Error("Missing gallery.");
    const file = data.get("file");
    if (!(file instanceof File)) throw new Error("Missing file.");
    return { galleryId, file };
  })
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("@/lib/admin-session.server");
    await requireAdmin();
    const { getCloudflareEnv } = await import("@/lib/cloudflare.server");
    const env = getCloudflareEnv();
    const safeName = data.file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const key = `client-galleries/${data.galleryId}/${Date.now()}-${safeName}`;
    const bytes = await data.file.arrayBuffer();
    // Content-Disposition: attachment makes a direct link to this file
    // download instead of navigate -- it still displays fine as an <img>
    // thumbnail, since that header only affects top-level navigation.
    await env.GALLERY_BUCKET.put(key, bytes, {
      httpMetadata: {
        contentType: data.file.type || "application/octet-stream",
        contentDisposition: `attachment; filename="${safeName}"`,
      },
    });
    const url = `${GALLERY_PUBLIC_URL_BASE}/${key}`;
    const { results: countRows } = await env.DB.prepare(
      "SELECT COUNT(*) as n FROM client_gallery_photos WHERE gallery_id = ?1",
    )
      .bind(data.galleryId)
      .all<{ n: number }>();
    await env.DB.prepare(
      "INSERT INTO client_gallery_photos (gallery_id, url, sort_order) VALUES (?1, ?2, ?3)",
    )
      .bind(data.galleryId, url, countRows[0]?.n ?? 0)
      .run();
    return { ok: true as const };
  });

export const deleteClientGalleryPhoto = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ id: z.number(), url: z.string().min(1) }).parse(data))
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("@/lib/admin-session.server");
    await requireAdmin();
    const { getCloudflareEnv } = await import("@/lib/cloudflare.server");
    const env = getCloudflareEnv();
    await env.DB.prepare("DELETE FROM client_gallery_photos WHERE id = ?1").bind(data.id).run();
    const key = data.url.split(`${GALLERY_PUBLIC_URL_BASE}/`)[1];
    if (key) await env.GALLERY_BUCKET.delete(key);
    return { ok: true as const };
  });

// -- Public, no auth -- used by the client-facing gallery page ----------

export const getClientGalleryBySlug = createServerFn({ method: "GET" })
  .validator((data: unknown) => z.object({ slug: z.string().min(1) }).parse(data))
  .handler(async ({ data }) => {
    const { getCloudflareEnv } = await import("@/lib/cloudflare.server");
    const env = getCloudflareEnv();
    const gallery = await env.DB.prepare("SELECT * FROM client_galleries WHERE slug = ?1")
      .bind(data.slug)
      .all<ClientGallery>();
    const row = gallery.results[0];
    if (!row) return null;
    const photos = await env.DB.prepare(
      "SELECT * FROM client_gallery_photos WHERE gallery_id = ?1 ORDER BY sort_order ASC",
    )
      .bind(row.id)
      .all<ClientGalleryPhoto>();
    return { gallery: row, photos: photos.results };
  });
