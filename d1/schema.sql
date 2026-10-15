-- Cloudflare D1 schema for the "kylie-admin" database.
-- Run new statements in Cloudflare's D1 Console tab (Workers & Pages > D1 >
-- kylie-admin > Console) -- this is not Supabase, and these are separate
-- databases. Each block below is idempotent (safe to re-run).

-- Gallery photo management (added first, for the admin photo uploader).
CREATE TABLE IF NOT EXISTS gallery_photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL,
  url TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Editable site content (bio, fun facts, FAQ, pricing). One row per section;
-- `data` is that section's value as JSON, matching the shapes in
-- src/lib/site.ts. A section with no row yet means the site is still
-- showing the hardcoded default from that file.
CREATE TABLE IF NOT EXISTS site_content (
  section TEXT PRIMARY KEY,
  data TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Client galleries: a private, shareable link per client (at /client/<slug>)
-- where they can view and download their finished photos -- the feature
-- Pixieset's client galleries provide. Photos are deleted explicitly in
-- application code rather than relying on ON DELETE CASCADE.
CREATE TABLE IF NOT EXISTS client_galleries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  client_name TEXT NOT NULL,
  title TEXT,
  message TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS client_gallery_photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  gallery_id INTEGER NOT NULL,
  url TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
