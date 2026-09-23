import familyImg from "@/assets/family.jpg";
import weddingImg from "@/assets/wedding.jpg";
import portraitImg from "@/assets/portrait.jpg";
import missionaryImg from "@/assets/missionary.jpg";

export const SITE = {
  name: "Kylie's Camera",
  motto: "Authentic, Heartfelt Photography.",
  tagline: "Capturing moments since 2024.",
  location: "Utah County, UT",
  email: "kyliescamera28@gmail.com",
  socials: [
    {
      label: "Instagram",
      handle: "@kyliescamera__",
      href: "https://instagram.com/kyliescamera__",
    },
    {
      label: "Facebook",
      handle: "Kylie Bond",
      href: "https://www.facebook.com/profile.php?id=61591913608239",
    },
    {
      label: "TikTok",
      handle: "@kyliescamera__",
      href: "https://tiktok.com/@kyliescamera__",
    },
    {
      label: "Pinterest",
      handle: "kyliebond08",
      href: "https://pinterest.com/kyliebond08",
    },
  ],
};

export const HERO = {
  heading: "Authentic, Heartfelt Photography.",
};

export const BIO = {
  eyebrow: "Meet the Photographer",
  header: "Hi! I'm Kylie Bond!",
  paragraphs: [
    "A Portrait & Couples Photographer capturing fun, natural moments. I love taking photos of seniors, couples, weddings, etc. I love anything to do with photography and have been doing photography since my sophomore year of high school. It's been such an incredible journey. I love being able to capture life's little moments.",
    "I can't wait to work with you!",
  ],
};

export const SHOOT_TYPES = [
  {
    slug: "portrait",
    name: "Portrait",
    price: "$180",
    blurb: "Perfect for seniors, grads, missionaries, branding or just because!",
    details: [
      "Up to 1 hour of shooting",
      "2 outfits ($15 outfit add-on)",
      "1 location",
      "120+ edited images",
      "1–2 week turnaround",
    ],
    disclaimer: "Travel fee not included*",
    packages: [],
  },
  {
    slug: "couple",
    name: "Couple",
    price: "$200",
    blurb: "Perfect for proposals, couples, announcements, etc!",
    details: [
      "Up to 1 hour of shooting",
      "1 outfit ($15 outfit add-on)",
      "130+ edited images",
      "1 location",
      "1–2 week turnaround",
    ],
    disclaimer: "Travel fee not included*",
    packages: [],
  },
  {
    slug: "family",
    name: "Family",
    price: "Starting at $300",
    blurb: "Perfect for a family up to 6 (message me for quote for a bigger family).",
    details: [
      "Up to 1 hour of shooting",
      "1 location",
      "Multiple group combinations",
      "150+ edited images",
      "1–2 week turnaround",
    ],
    disclaimer: "Travel fee not included*",
    packages: [],
  },
  {
    slug: "wedding",
    name: "Wedding",
    price: "",
    blurb:
      "This moment is for you! Every wedding is unique. If you're planning a wedding that doesn't quite fit these packages, I'd love to create a custom package just for you.",
    details: ["Engagement session included", "4–6 week turnaround", "Sneak peeks within 72 hours"],
    disclaimer: "Travel fee not included*",
    packages: [
      { label: "Package 01", hours: "4 hours", price: "$1,000", images: "300+ edited images" },
      { label: "Package 02", hours: "6 hours", price: "$1,300", images: "400+ edited images" },
      { label: "Package 03", hours: "8 hours", price: "$1,600", images: "500+ edited images" },
    ],
  },
] as const;

export type ShootSlug = (typeof SHOOT_TYPES)[number]["slug"];

// Dance, sports, and homecoming/misc sessions live here as simple line items
// instead of full session cards.
export const MISC_PRICING = {
  title: "Misc. Pricing",
  blurb: "Pricing for school dances, friends, game days, etc.",
  items: [
    {
      slug: "school-dances",
      name: "School Dances",
      price: "$25 per couple",
      note: "5 couples minimum",
    },
    { slug: "friends", name: "Friends", price: "$75 per person", note: "Individual + group shots" },
    {
      slug: "game-day",
      name: "Game Day",
      price: "$175 per game",
      note: "Spotlighting player the whole game",
    },
    {
      slug: "missionary",
      name: "Missionary Homecoming",
      price: "Varied Pricing",
      note: "",
    },
  ],
};

export const INTEREST_LEVELS = [
  "Want to book with you",
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

// Set to a real client photo whenever one's ready; these are theoretical
// stand-ins reusing the category shots from the gallery.
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
    photo: { src: familyImg, alt: "A family session" },
  },
  {
    name: "Tanner & Brooke",
    session: "Wedding",
    quote:
      "We cried looking through our gallery. She caught moments we didn't even know happened. Worth every penny and then some.",
    photo: { src: weddingImg, alt: "A wedding session" },
  },
  {
    name: "Elise M.",
    session: "Senior Portraits",
    quote:
      "I'm usually so awkward in photos, but Kylie somehow made it fun. My mom has already printed like twenty of them.",
    photo: { src: portraitImg, alt: "A senior portrait session" },
  },
  {
    name: "The Christensen Family",
    session: "Missionary Homecoming",
    quote:
      "She was at the airport before us, tucked out of the way, and captured the exact second our son came around the corner.",
    photo: { src: missionaryImg, alt: "A missionary homecoming session" },
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
