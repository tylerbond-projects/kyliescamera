CREATE TABLE public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  interest_level TEXT NOT NULL,
  heard_about TEXT,
  desired_month TEXT,
  shoot_type TEXT NOT NULL,
  vision TEXT,
  socials TEXT,
  preferred_contact TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.contact_submissions TO service_role;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.client_galleries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  client_name TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  photos JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.client_galleries TO service_role;
ALTER TABLE public.client_galleries ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  client_name TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  signed_name TEXT,
  agreed BOOLEAN NOT NULL DEFAULT false,
  signed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.contracts TO service_role;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

INSERT INTO public.client_galleries (slug, client_name, title, message, photos) VALUES (
  'demo-family',
  'The Anderson Family',
  'Anderson Family Session — Fall 2026',
  'Thank you so much for letting me capture your family! Click any photo to download the full-resolution file.',
  '[
    {"url": "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1600&q=80", "caption": "Golden hour"},
    {"url": "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=1600&q=80", "caption": "Together"},
    {"url": "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=1600&q=80", "caption": "Little moments"},
    {"url": "https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?w=1600&q=80", "caption": "Laughter"},
    {"url": "https://images.unsplash.com/photo-1484665754804-74b091211472?w=1600&q=80", "caption": "Walking home"},
    {"url": "https://images.unsplash.com/photo-1581952976147-5a2d15560349?w=1600&q=80", "caption": "Snuggles"}
  ]'::jsonb
);

INSERT INTO public.contracts (slug, client_name, title, body) VALUES (
  'demo-contract',
  'The Anderson Family',
  'Photography Session Agreement',
  E'This Photography Session Agreement ("Agreement") is made between Kylie Photography ("Photographer") and the Client named above.\n\n1. Session Details\nThe Photographer agrees to provide photography services for the session type, date, and location agreed upon by both parties.\n\n2. Retainer & Payment\nA non-refundable retainer of 25% is due at booking to reserve the session date. The remaining balance is due on or before the session date.\n\n3. Rescheduling & Cancellations\nSessions may be rescheduled once at no charge with at least 48 hours notice. Weather-related rescheduling is always free.\n\n4. Delivery\nEdited images will be delivered through a private online gallery within 2–4 weeks of the session date.\n\n5. Copyright & Usage\nThe Photographer retains copyright of all images. The Client receives a personal-use print release. The Photographer may use images for portfolio and marketing purposes unless the Client opts out in writing.\n\n6. Liability\nIn the unlikely event of illness, emergency, or equipment failure, the Photographer will make every effort to reschedule or provide a suitable replacement.\n\nBy typing your name below and checking the box, you agree to the terms of this Agreement.'
);