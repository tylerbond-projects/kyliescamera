-- Gallery photos: lets an authenticated admin (Kylie) manage the public
-- gallery from the site itself, instead of the images being hardcoded
-- build-time assets.
CREATE TABLE public.gallery_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  url TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.gallery_photos TO service_role;
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view gallery photos"
  ON public.gallery_photos FOR SELECT
  USING (true);

-- Any authenticated user can manage photos. This is safe ONLY because sign-up
-- must be disabled in Supabase Auth settings (Authentication -> Settings ->
-- turn off "Allow new users to sign up") with a single admin account created
-- manually for Kylie. Without that, anyone who signs up could edit the
-- gallery.
CREATE POLICY "Authenticated users can insert gallery photos"
  ON public.gallery_photos FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update gallery photos"
  ON public.gallery_photos FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete gallery photos"
  ON public.gallery_photos FOR DELETE
  USING (auth.role() = 'authenticated');

-- Storage bucket for the uploaded files themselves.
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view gallery bucket files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gallery');

CREATE POLICY "Authenticated users can upload gallery bucket files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'gallery' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update gallery bucket files"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'gallery' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete gallery bucket files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'gallery' AND auth.role() = 'authenticated');
