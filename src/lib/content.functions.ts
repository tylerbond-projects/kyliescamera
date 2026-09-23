import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// `unknown` isn't accepted as a server-fn return type (not concretely
// serializable-checkable), so the content map uses this recursive JSON type
// instead -- content sections are always plain JSON-shaped data.
export type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

// Editable site content (bio, fun facts, FAQ, pricing), stored one row per
// section in D1's site_content table as a JSON blob. A section with no row
// yet simply isn't in the returned map -- callers fall back to the
// hardcoded default from site.ts in that case.
export const getSiteContentMap = createServerFn({ method: "GET" }).handler(async () => {
  const { getCloudflareEnv } = await import("@/lib/cloudflare.server");
  const env = getCloudflareEnv();
  const { results } = await env.DB.prepare("SELECT section, data FROM site_content")
    .bind()
    .all<{ section: string; data: string }>();
  const map: Record<string, Json> = {};
  for (const row of results) {
    try {
      map[row.section] = JSON.parse(row.data);
    } catch {
      // Skip a malformed row rather than failing the whole page.
    }
  }
  return map;
});

export const updateSiteContentSection = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z.object({ section: z.string().min(1), data: z.unknown() }).parse(data),
  )
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("@/lib/admin-session.server");
    await requireAdmin();
    const { getCloudflareEnv } = await import("@/lib/cloudflare.server");
    const env = getCloudflareEnv();
    await env.DB.prepare(
      `INSERT INTO site_content (section, data, updated_at) VALUES (?1, ?2, datetime('now'))
       ON CONFLICT(section) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`,
    )
      .bind(data.section, JSON.stringify(data.data))
      .run();
    return { ok: true as const };
  });
