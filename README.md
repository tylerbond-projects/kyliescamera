# Kylie's Camera

The website for **Kylie Photography**, a portrait and event photographer in Utah County, UT.

> *Authentic, Heartfelt Photography.* Capturing moments since 2024.

Clients can browse her work, see session types and pricing, send a booking request, and later view their finished photos and sign their contract on private pages.

## Pages

| Route | What it is |
| --- | --- |
| `/` | Home: hero, short bio, fun facts, session types, testimonials, social links |
| `/gallery` | Sample work by category |
| `/pricing` | Info & Pricing: portrait, couple, family, wedding, dance, sports, missionary homecoming and other shoots |
| `/faq` | Common questions (turnaround, deposits, what to wear, travel) |
| `/contact` | Booking form; submissions are saved to the database |
| `/client/:slug` | Private gallery where one client can view and download their photos |
| `/contract/:slug` | A client's contract, signed by typing their name and checking a box (time-stamped) |

## Tech stack

- [TanStack Start](https://tanstack.com/start) (React + Vite) with server functions
- Tailwind CSS and shadcn/ui components
- Supabase (Postgres) through Lovable Cloud
- Deploys to Cloudflare Pages

## Database

Three tables, all with row-level security turned on and accessed only from the server:

- `contact_submissions`: booking requests from the contact form
- `client_galleries`: one row per client, with a URL `slug` and a JSON list of photos
- `contracts`: contract text per client, plus the typed signature and when it was signed

Client galleries and contracts are set up by hand for now: add a row with a unique `slug`, then send the client the `/client/<slug>` or `/contract/<slug>` link.

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

## Editing in Lovable

This project is connected to [Lovable](https://lovable.dev). Changes made in the Lovable editor are committed to this repo, and pushes to `main` sync back to Lovable. Don't force-push or rewrite history that's already pushed.

## Status

The site is built, but it still uses placeholder content: sample photos, pricing, testimonials, fun facts, FAQ answers and social handles need to be replaced with Kylie's real ones, and no client galleries have been uploaded yet.
