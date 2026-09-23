// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  // Cloudflare bindings for the admin photo-management feature: R2 for the
  // uploaded files, D1 for the gallery_photos table. These have to be
  // declared here (not just added in the Cloudflare dashboard) because
  // `wrangler deploy` treats this generated config as the source of truth
  // and would drop dashboard-only bindings on the next deploy.
  nitro: {
    cloudflare: {
      // The Lovable wrapper's types don't declare `wrangler` under
      // `cloudflare` (only nodeCompat/deployConfig), but the runtime code
      // merges it into the generated config regardless -- confirmed against
      // the actual output wrangler.json.
      wrangler: {
        // Without this, Nitro auto-generates a worker name on every build
        // (e.g. from the repo name), which is what the *.workers.dev URL is
        // based on -- renaming the Cloudflare "project" in the dashboard
        // only relabels it there, it doesn't change this.
        name: "kyliescamera",
        r2_buckets: [{ binding: "GALLERY_BUCKET", bucket_name: "kylie-gallery" }],
        d1_databases: [
          {
            binding: "DB",
            database_name: "kylie-admin",
            database_id: "f5c64a78-71f0-4ee8-bac4-8b2645622ef7",
          },
        ],
      },
    } as { nodeCompat?: boolean; deployConfig?: boolean } & Record<string, unknown>,
  },
});
