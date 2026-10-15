import { createFileRoute } from "@tanstack/react-router";
import { GALLERY_PUBLIC_URL_BASE, photoFilename } from "@/lib/r2";

// Serves one client-gallery photo from R2 through the site's own origin.
// The r2.dev bucket has no CORS rules, so the client page can't fetch() photos
// from it directly to build the "Download all" zip -- this route streams the
// object instead (no buffering, so it costs next to no Worker CPU). With
// ?download=1 it's sent as an attachment, for the lightbox's Download button.
export const Route = createFileRoute("/api/client-photo/$slug/$photoId")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const photoId = Number(params.photoId);
        if (!Number.isInteger(photoId)) return new Response("Not found", { status: 404 });

        const { getCloudflareEnv } = await import("@/lib/cloudflare.server");
        const env = getCloudflareEnv();
        // Join on the slug so a photo is only reachable through its own
        // gallery's link, not by guessing ids.
        const row = await env.DB.prepare(
          `SELECT p.url FROM client_gallery_photos p
           JOIN client_galleries g ON g.id = p.gallery_id
           WHERE p.id = ?1 AND g.slug = ?2`,
        )
          .bind(photoId, params.slug)
          .first<{ url: string }>();
        const key = row?.url.split(`${GALLERY_PUBLIC_URL_BASE}/`)[1];
        const object = key ? await env.GALLERY_BUCKET.get(key) : null;
        if (!key || !object) return new Response("Not found", { status: 404 });

        const filename = photoFilename(key);
        const download = new URL(request.url).searchParams.has("download");
        return new Response(object.body, {
          headers: {
            "Content-Type": object.httpMetadata?.contentType || "application/octet-stream",
            "Content-Length": String(object.size),
            "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${filename}"`,
            "Cache-Control": "private, max-age=3600",
          },
        });
      },
    },
  },
});
