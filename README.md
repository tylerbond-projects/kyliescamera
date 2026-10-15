# Kylie's Camera

Here's a Replit-ready prompt:

Build a full-stack photography business website for Kylie Photography, based in Utah County, UT. Motto: "Authentic, Heartfelt Photography." Tagline: "Capturing moments since 2024."

Tech stack: React frontend, Node/Express backend, with a database (Replit DB or PostgreSQL) to store contact form submissions and booking requests. Use a clean, modern component structure.

Core functionality:

Contact/booking form that saves submissions to the database and (if possible) sends an email notification to the site owner

Photo gallery section to showcase example shoots (use placeholder images for now, organized by category matching the session types below)

Client gallery delivery — a simple way for the photographer to share a link/page where a specific client can view/download their finished photos (a basic gallery-per-client page is fine, even if manually set up initially)

Contract page/flow — a page where clients can view and digitally sign a contract (e-signature can be a simple typed-name + checkbox confirmation stored with a timestamp, rather than a full DocuSign integration)

Pages/sections:

Home page

Hero section with the motto and tagline

Intro bio paragraph with a "Contact Me" button/link

"Fun facts about me" section (3-5 short fun facts, placeholder text is fine)

Testimonials carousel/section (3+ placeholder testimonials with client names)

Social media icons/links section (Instagram, Facebook, TikTok — use placeholder handles)

Info & Pricing page

Sections for each shoot type, each with a description and price range (placeholder pricing is fine):

Portrait session

Couple

Family

Wedding

Dance

Sports

Missionary homecoming & other misc shoots

Contact page

Form fields:

Name (text, required)

Email (email, required)

Phone number (tel, required)

Booking interest level (radio buttons): "I want to book with you" / "You're one of our main contenders" / "Still looking around"

How did you hear about me (text or dropdown)

Desired month to book (dropdown or date picker, month-level)

Type of shoot wanted (dropdown matching the pricing categories above)

Tell me your vision for the shoot (textarea)

Your socials (text, optional)

Preferred contact method (radio): Email or Text

A note near the submit button: "If you haven't heard back within 3 days, please check your junk/spam folder."

On submit, save to database and show a confirmation message

FAQ page

4 Q&A items in an accordion/expandable format (use placeholder questions like turnaround time, deposit policy, what to wear, travel fees — I'll customize the real content later)

Design: simple, warm, soft, natural color palette (think blush, cream), large hero imagery, mobile-responsive, elegant serif or script accent font for headings paired with a clean sans-serif for body text.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/344db991-4053-5ee1-827e-325eb17d3bd3).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
