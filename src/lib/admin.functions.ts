import { createServerFn } from "@tanstack/react-start";
import { useSession, getRequest } from "@tanstack/react-start/server";
import { z } from "zod";

// The admin gate doesn't use Supabase Auth (its email provider is disabled
// on this project with no dashboard access to turn it on) -- it's a single
// shared password, checked here, backing an encrypted/signed session cookie.
// The session-sealing key is derived from ADMIN_PASSWORD so only one secret
// needs to be configured. Uses the Web Crypto API rather than node:crypto so
// it doesn't depend on Cloudflare's Node compatibility shim.
async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeStringEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

async function adminSession() {
  const adminPassword = process.env["ADMIN_PASSWORD"];
  if (!adminPassword) throw new Error("Admin login isn't configured yet (missing ADMIN_PASSWORD).");
  // Not a React hook -- it's @tanstack/react-start/server's server-side session
  // helper, which just happens to be named useSession.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useSession<{ admin?: boolean }>({
    password: await sha256Hex(adminPassword),
    name: "kylie-admin",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    cookie: { httpOnly: true, secure: true, sameSite: "lax" },
  });
}

async function requireAdmin() {
  const session = await adminSession();
  if (session.data.admin !== true) throw new Error("Unauthorized");
}

export const adminLogin = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ password: z.string().min(1) }).parse(data))
  .handler(async ({ data }) => {
    const adminPassword = process.env["ADMIN_PASSWORD"];
    if (!adminPassword) throw new Error("Admin login isn't configured yet.");
    if (!timingSafeStringEqual(data.password, adminPassword))
      throw new Error("Incorrect password.");
    const session = await adminSession();
    await session.update({ admin: true });
    return { ok: true as const };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const session = await adminSession();
  await session.clear();
  return { ok: true as const };
});

export const getAdminStatus = createServerFn({ method: "GET" }).handler(async () => {
  const session = await adminSession();
  return { isAdmin: session.data.admin === true };
});

// --- Cloudflare bindings (R2 + D1) -----------------------------------------
// Set by the cloudflare-module Nitro preset on every request (see
// _module-handler.mjs in the `nitro` package). Bindings are the same static
// configuration on every invocation, so a shared global is safe here even
// under concurrent requests.
type CloudflareEnv = {
  DB: {
    prepare: (sql: string) => {
      bind: (...args: unknown[]) => {
        run: () => Promise<unknown>;
        all: <T = unknown>() => Promise<{ results: T[] }>;
        first: <T = unknown>() => Promise<T | null>;
      };
    };
  };
  GALLERY_BUCKET: {
    put: (
      key: string,
      value: ArrayBuffer,
      options?: { httpMetadata?: { contentType?: string } },
    ) => Promise<unknown>;
    delete: (key: string) => Promise<void>;
  };
};

function getCloudflareEnv(): CloudflareEnv {
  const globalEnv = (globalThis as { __env__?: CloudflareEnv }).__env__;
  const requestEnv = (
    getRequest() as unknown as { runtime?: { cloudflare?: { env?: CloudflareEnv } } }
  ).runtime?.cloudflare?.env;
  const env = requestEnv ?? globalEnv;
  if (!env?.DB || !env?.GALLERY_BUCKET) {
    throw new Error(
      "Cloudflare bindings (DB, GALLERY_BUCKET) aren't available in this environment.",
    );
  }
  return env;
}

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
    await requireAdmin();
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
    await requireAdmin();
    const env = getCloudflareEnv();
    await env.DB.prepare("DELETE FROM gallery_photos WHERE id = ?1").bind(data.id).run();
    const key = data.url.split(`${GALLERY_PUBLIC_URL_BASE}/`)[1];
    if (key) await env.GALLERY_BUCKET.delete(key);
    return { ok: true as const };
  });
