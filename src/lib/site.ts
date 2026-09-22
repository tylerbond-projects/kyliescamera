export const SITE = {
  name: "Kylie's Camera",
  motto: "Authentic, Heartfelt Photography.",
  tagline: "Capturing moments since 2024.",
  location: "Utah County, UT",
  email: "hello@kyliephotography.com",
  socials: [
    { label: "Instagram", handle: "@kylie.photography", href: "https://instagram.com/kylie.photography" },
    { label: "Facebook", handle: "Kylie's Camera", href: "https://facebook.com/kyliephotography" },
    { label: "TikTok", handle: "@kylie.photography", href: "https://tiktok.com/@kylie.photography" },
    { label: "Pinterest", handle: "@kylie.photography", href: "https://pinterest.com/kylie.photography" },
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

// Add a `photo: { src: yourImport, alt: "..." }` to any testimonial below to use
// that photo as the card's background instead of the plain card style.
export type TestimonialPhoto = { src: string; alt: string };

export const TESTIMONIALS: {
  name: string;
  session: string;
  quote: string;
  photo?: TestimonialPhoto;
}[] = [
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
  { title: "Started my business", text: "April 2024" },
  { title: "Favorite color", text: "Yellow" },
  { title: "Go-to fast food", text: "Freddy's" },
  { title: "Favorite food", text: "Steak or ribs" },
  { title: "Favorite drink", text: "Dr. Pepper" },
  { title: "Dream vacation", text: "Switzerland" },
];

export const FAQS = [
  {
    q: "Do you travel for photoshoots?",
    a: "Yes I do! I am located in Utah county, and travel everywhere and anywhere beyond that with all travel/transportation fees covered. If it is 20 miles away from my residency a travel fee will be included :)",
  },
  {
    q: "Do you help with posing?",
    a: "Yes! I have so many poses and prompts that we will run through during your session! Feel free to bring any inspo, or photos you are wanting to recreate!",
  },
  {
    q: "What is your cancellation/rescheduling fee?",
    a: "When booking, there is a non-refundable deposit. Shoots can be canceled at no additional cost, but the deposit will not be refunded. Rescheduling must be done 1 week in advance, or an additional deposit will be required.",
  },
  {
    q: "Can I get the RAW files?",
    a: "My editing style is what connects me to my brand so, when you hire me you hire me for my style. With that being said I do not give out RAW files :)",
  },
];
