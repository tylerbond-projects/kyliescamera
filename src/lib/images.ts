import couple1 from "@/assets/gallery/couple-1.jpg";
import couple2 from "@/assets/gallery/couple-2.jpg";
import couple3 from "@/assets/gallery/couple-3.jpg";
import couple4 from "@/assets/gallery/couple-4.jpg";
import family1 from "@/assets/gallery/family-1.jpg";
import friends1 from "@/assets/gallery/friends-1.jpg";
import missionary1 from "@/assets/gallery/missionary-1.jpg";
import missionary2 from "@/assets/gallery/missionary-2.jpg";
import portrait1 from "@/assets/gallery/portrait-1.jpg";
import portrait2 from "@/assets/gallery/portrait-2.jpg";
import portrait3 from "@/assets/gallery/portrait-3.jpg";
import wedding1 from "@/assets/gallery/wedding-1.jpg";
import wedding2 from "@/assets/gallery/wedding-2.jpg";
import wedding3 from "@/assets/gallery/wedding-3.jpg";
import type { ShootSlug } from "./site";

// Kylie's own highlight photos, keyed by gallery category slug (the four
// session types plus the Misc. Pricing slugs). These are the defaults --
// any photos uploaded for a category through the admin replace them.
export const DEFAULT_GALLERY_PHOTOS: Record<string, string[]> = {
  portrait: [portrait1, portrait2, portrait3],
  couple: [couple1, couple2, couple3, couple4],
  family: [family1],
  wedding: [wedding1, wedding2, wedding3],
  friends: [friends1],
  missionary: [missionary2, missionary1],
};

export const CATEGORY_IMAGES: Record<ShootSlug, string> = {
  portrait: portrait1,
  couple: couple3,
  family: family1,
  wedding: wedding1,
};
