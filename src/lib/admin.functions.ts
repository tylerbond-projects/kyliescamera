import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const adminLogin = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ password: z.string().min(1) }).parse(data))
  .handler(async ({ data }) => {
    const { adminSession, timingSafeStringEqual } = await import("@/lib/admin-session.server");
    const adminPassword = process.env["ADMIN_PASSWORD"];
    if (!adminPassword) throw new Error("Admin login isn't configured yet.");
    if (!timingSafeStringEqual(data.password, adminPassword))
      throw new Error("Incorrect password.");
    const session = await adminSession();
    await session.update({ admin: true });
    return { ok: true as const };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const { adminSession } = await import("@/lib/admin-session.server");
  const session = await adminSession();
  await session.clear();
  return { ok: true as const };
});

export const getAdminStatus = createServerFn({ method: "GET" }).handler(async () => {
  const { adminSession } = await import("@/lib/admin-session.server");
  const session = await adminSession();
  return { isAdmin: session.data.admin === true };
});

const GALLERY_PUBLIC_URL_BASE = "https://pub-e2b6b4f7c151426f98b88d2c72fd9dac.r2.dev";
const categorySchema = z.string().min(1).max(60);

export type GalleryPhotoRow = {
  id: number;
  category: string;
  url: string;
  caption: string | null;
  sort_order: number;
};

export const listGalleryPhotos = createServerFn({ method: "GET" }).handler(async () => {
  const { getCloudflareEnv } = await import("@/lib/cloudflare.server");
  const env = getCloudflareEnv();
  const { results } = await env.DB.prepare(
    "SELECT id, category, url, caption, sort_order FROM gallery_photos ORDER BY category, sort_order ASC",
  )
    .bind()
    .all<GalleryPhotoRow>();
  return results;
});

export const uploadGalleryPhoto = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    if (!(data instanceof FormData)) throw new Error("Expected FormData");
    const category = categorySchema.parse(data.get("category"));
    const file = data.get("file");
    if (!(file instanceof File)) throw new Error("Missing file.");
    return { category, file };
  })
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("@/lib/admin-session.server");
    await requireAdmin();
    const { getCloudflareEnv } = await import("@/lib/cloudflare.server");
    const env = getCloudflareEnv();
    const safeName = data.file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const key = `${data.category}/${Date.now()}-${safeName}`;
    const bytes = await data.file.arrayBuffer();
    await env.GALLERY_BUCKET.put(key, bytes, {
      httpMetadata: { contentType: data.file.type || "application/octet-stream" },
    });
    const url = `${GALLERY_PUBLIC_URL_BASE}/${key}`;
    const { results: countRows } = await env.DB.prepare(
      "SELECT COUNT(*) as n FROM gallery_photos WHERE category = ?1",
    )
      .bind(data.category)
      .all<{ n: number }>();
    const sortOrder = countRows[0]?.n ?? 0;
    await env.DB.prepare(
      "INSERT INTO gallery_photos (category, url, sort_order) VALUES (?1, ?2, ?3)",
    )
      .bind(data.category, url, sortOrder)
      .run();
    return { ok: true as const };
  });

export const deleteGalleryPhoto = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ id: z.number(), url: z.string().min(1) }).parse(data))
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("@/lib/admin-session.server");
    await requireAdmin();
    const { getCloudflareEnv } = await import("@/lib/cloudflare.server");
    const env = getCloudflareEnv();
    await env.DB.prepare("DELETE FROM gallery_photos WHERE id = ?1").bind(data.id).run();
    const key = data.url.split(`${GALLERY_PUBLIC_URL_BASE}/`)[1];
    if (key) await env.GALLERY_BUCKET.delete(key);
    return { ok: true as const };
  });
