export const SITE = {
  name: "Kylie Photography",
  motto: "Authentic, Heartfelt Photography.",
  tagline: "Capturing moments since 2024.",
  location: "Utah County, UT",
  email: "hello@kyliephotography.com",
  socials: [
    { label: "Instagram", handle: "@kylie.photography", href: "https://instagram.com/kylie.photography" },
    { label: "Facebook", handle: "Kylie Photography", href: "https://facebook.com/kyliephotography" },
    { label: "TikTok", handle: "@kylie.photography", href: "https://tiktok.com/@kylie.photography" },
  ],
};

export const SHOOT_TYPES = [
  {
    slug: "portrait",
    name: "Portrait Session",
    price: "$150 – $250",
    blurb:
      "Seniors, headshots, milestones, or just because. A relaxed session focused entirely on you.",
    details: ["45–60 minutes", "1 location", "25+ edited images"],
  },
  {
    slug: "couple",
    name: "Couple",
    price: "$200 – $300",
    blurb: "Engagements, anniversaries, and everyday love. Candid, close, and full of feeling.",
    details: ["60 minutes", "1–2 locations", "40+ edited images"],
  },
  {
    slug: "family",
    name: "Family",
    price: "$250 – $350",
    blurb: "Playful, unposed sessions that capture your family exactly as they are right now.",
    details: ["60 minutes", "Up to 8 people", "40+ edited images"],
  },
  {
    slug: "wedding",
    name: "Wedding",
    price: "$1,500 – $3,500",
    blurb: "From getting ready to the last dance. Full-day coverage with an heirloom gallery.",
    details: ["6–10 hours", "Engagement session included", "500+ edited images"],
  },
  {
    slug: "dance",
    name: "Dance",
    price: "$150 – $250",
    blurb: "Movement, light, and grace. Studio or outdoor sessions for dancers of all ages.",
    details: ["45–60 minutes", "Multiple costume changes", "25+ edited images"],
  },
  {
    slug: "sports",
    name: "Sports",
    price: "$125 – $225",
    blurb: "Individual athlete portraits and action shots that celebrate the grind.",
    details: ["45 minutes", "Uniform + casual looks", "20+ edited images"],
  },
  {
    slug: "missionary",
    name: "Missionary Homecoming & Misc",
    price: "$100 – $200",
    blurb:
      "Airport homecomings, farewells, graduations, maternity, and anything else worth remembering.",
    details: ["30–60 minutes", "Flexible location", "20+ edited images"],
  },
] as const;

export type ShootSlug = (typeof SHOOT_TYPES)[number]["slug"];

export const INTEREST_LEVELS = [
  "I want to book with you",
  "You're one of our main contenders",
  "Still looking around",
] as const;

export const HEARD_ABOUT = [
  "Instagram",
  "Facebook",
  "TikTok",
  "Friend or family",
  "Google search",
  "Saw you at an event",
  "Other",
] as const;

export const CONTACT_METHODS = ["Email", "Text"] as const;

export function upcomingMonths(count = 14): string[] {
  const out: string[] = [];
  const d = new Date();
  d.setDate(1);
  for (let i = 0; i < count; i++) {
    out.push(d.toLocaleString("en-US", { month: "long", year: "numeric" }));
    d.setMonth(d.getMonth() + 1);
  }
  return out;
}

export const TESTIMONIALS = [
  {
    name: "Madison R.",
    session: "Family Session",
    quote:
      "Kylie made our kids feel so comfortable that they forgot the camera was even there. Every single photo feels like us.",
  },
  {
    name: "Tanner & Brooke",
    session: "Wedding",
    quote:
      "We cried looking through our gallery. She caught moments we didn't even know happened. Worth every penny and then some.",
  },
  {
    name: "Elise M.",
    session: "Senior Portraits",
    quote:
      "I'm usually so awkward in photos, but Kylie somehow made it fun. My mom has already printed like twenty of them.",
  },
  {
    name: "The Christensen Family",
    session: "Missionary Homecoming",
    quote:
      "She was at the airport before us, tucked out of the way, and captured the exact second our son came around the corner.",
  },
];

export const FUN_FACTS = [
  { title: "Golden hour devotee", text: "I plan my whole week around sunset times. Yes, really." },
  { title: "Film at heart", text: "I shoot digital but edit everything to feel like a roll of Portra 400." },
  { title: "Utah County local", text: "Born and raised. I know every hidden field and canyon pullout." },
  { title: "Snack provider", text: "I always bring fruit snacks for the kids. And sometimes the parents." },
  { title: "Dog person", text: "Bring your pup to the session. I will 100% take extra photos of them." },
];

export const FAQS = [
  {
    q: "How long until I get my photos?",
    a: "Sneak peeks land in your inbox within 48 hours. Your full edited gallery is delivered in 2–3 weeks for sessions and 6–8 weeks for weddings.",
  },
  {
    q: "Do you require a deposit?",
    a: "Yes. A non-refundable 25% retainer reserves your date, and the remaining balance is due the day of your session.",
  },
  {
    q: "What should we wear?",
    a: "Soft, neutral, and earthy tones photograph beautifully. Once you book, I'll send a full style guide with color palettes and outfit ideas.",
  },
  {
    q: "Do you travel? Are there travel fees?",
    a: "Anywhere in Utah County is included. Beyond that, a small travel fee of $0.65 per mile applies. Destination sessions and weddings are always welcome — just ask!",
  },
];
