import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
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
  .inputValidator((data: unknown) => z.object({ password: z.string().min(1) }).parse(data))
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

const categorySchema = z.string().min(1).max(60);

export const createGalleryUploadUrl = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ category: categorySchema, filename: z.string().min(1) }).parse(data),
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const safeName = data.filename.replace(/[^a-zA-Z0-9._-]/g, "-");
    const path = `${data.category}/${Date.now()}-${safeName}`;
    const { data: signed, error } = await supabaseAdmin.storage
      .from("gallery")
      .createSignedUploadUrl(path);
    if (error) throw new Error(error.message);
    return { path: signed.path, token: signed.token };
  });

export const recordGalleryPhoto = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ category: categorySchema, path: z.string().min(1) }).parse(data),
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: publicUrl } = supabaseAdmin.storage.from("gallery").getPublicUrl(data.path);
    const { count } = await supabaseAdmin
      .from("gallery_photos")
      .select("id", { count: "exact", head: true })
      .eq("category", data.category);
    const { error } = await supabaseAdmin
      .from("gallery_photos")
      .insert({ category: data.category, url: publicUrl.publicUrl, sort_order: count ?? 0 });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const deleteGalleryPhoto = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ id: z.string().min(1), url: z.string().min(1) }).parse(data),
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("gallery_photos").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    const path = data.url.split("/gallery/")[1];
    if (path) await supabaseAdmin.storage.from("gallery").remove([path]);
    return { ok: true as const };
  });
