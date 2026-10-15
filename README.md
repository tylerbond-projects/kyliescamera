# Kylie's Camera

The website for **Kylie's Camera**, a portrait and event photographer in Utah County, UT.

> *Authentic, Heartfelt Photography.* Capturing moments since 2024.

Visitors can browse Kylie's work, see sessions and pricing, and send a booking inquiry. Clients get a private link to view and download their finished photos. Kylie updates photos and text herself from a password-protected admin area, with no code changes needed.

## Public pages

| Route | What it is |
| --- | --- |
| `/` | Home: hero, bio, fun facts, session types, testimonials, social links |
| `/gallery` | Sample work, grouped by session type |
| `/pricing` | Info & Pricing: portrait, couple, family and wedding sessions, plus misc. pricing (school dances, friends, game day, missionary homecoming) |
| `/faq` | Common questions |
| `/contact` | Booking inquiry form; each inquiry is emailed to Kylie |
| `/client/:slug` | A client's private gallery; click any photo to download the full-resolution file |

## Admin area

The admin area lives at `/admin`. Sign in at `/admin/login` with the shared admin password. Sessions last one day, and admin pages are hidden from search engines.

| Route | What it does |
| --- | --- |
| `/admin` | Admin home, with links to each tool below and a sign-out button |
| `/admin/photos` | **Manage Gallery Photos**: upload or delete photos for each session type on the Gallery page |
| `/admin/content` | **Edit Site Content**: hero heading and photo, homepage photos, bio, fun facts, FAQ, testimonials (with photos), session pricing (name, price, blurb, checklist, disclaimer, photo) and misc. pricing |
| `/admin/client-galleries` | **Client Galleries**: create a gallery for a client, copy their private link, and manage or delete existing galleries |
| `/admin/client-galleries/:id` | One client's gallery: edit the title and message, upload photos, and delete photos |

Basic site info like the business name and social links is still changed in code (`src/lib/site.ts`).

## Tech stack

- [TanStack Start](https://tanstack.com/start) (React + Vite) with server functions
- Tailwind CSS and shadcn/ui components
- Hosted on **Cloudflare Pages**
- **Cloudflare D1** database (`kylie-admin`) for gallery photos, editable content and client galleries
- **Cloudflare R2** bucket for uploaded photos
- **Resend** to email contact-form inquiries

## Database

The schema is in [`d1/schema.sql`](d1/schema.sql). Run new statements in the Cloudflare D1 console.

- `gallery_photos`: photos on the public Gallery page, by category
- `site_content`: one row per editable section, stored as JSON. If a section has no row, the site shows the default text from `src/lib/site.ts`
- `client_galleries` and `client_gallery_photos`: each client's private gallery and its photos

## Environment

| Name | Purpose |
| --- | --- |
| `ADMIN_PASSWORD` | Password for the admin area |
| `RESEND_API_KEY` | Sends contact-form emails |
| `DB` | D1 database binding |
| `GALLERY_BUCKET` | R2 bucket binding for uploads |

## Running locally

Requires Node.js 22 (see `.node-version`) and npm.

```sh
git clone https://github.com/tylerbond-projects/kyliescamera.git
cd kyliescamera
npm i
npm run dev
```

| Script | Does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run build:pages` | Build for Cloudflare Pages (output in `dist`) |
| `npm run lint` | Run ESLint |

## Branches

- `cloudflare-deploy`: the live site, including the admin area
- `main`: the original Lovable version. It's connected to [Lovable](https://lovable.dev), so don't force-push or rewrite its history.
