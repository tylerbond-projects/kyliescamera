-- Lovable Cloud's UI doesn't expose an Auth/Users panel to disable public
-- sign-up or manage accounts directly, so "any authenticated user" isn't
-- safe on its own. Replace those policies with ones scoped to a specific
-- admin email — write access no longer depends on whether sign-up can be
-- turned off.
DROP POLICY IF EXISTS "Authenticated users can insert gallery photos" ON public.gallery_photos;
DROP POLICY IF EXISTS "Authenticated users can update gallery photos" ON public.gallery_photos;
DROP POLICY IF EXISTS "Authenticated users can delete gallery photos" ON public.gallery_photos;

CREATE POLICY "Admin can insert gallery photos"
  ON public.gallery_photos FOR INSERT
  WITH CHECK ((auth.jwt() ->> 'email') = 'tylerbond.projects@gmail.com');

CREATE POLICY "Admin can update gallery photos"
  ON public.gallery_photos FOR UPDATE
  USING ((auth.jwt() ->> 'email') = 'tylerbond.projects@gmail.com');

CREATE POLICY "Admin can delete gallery photos"
  ON public.gallery_photos FOR DELETE
  USING ((auth.jwt() ->> 'email') = 'tylerbond.projects@gmail.com');

DROP POLICY IF EXISTS "Authenticated users can upload gallery bucket files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update gallery bucket files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete gallery bucket files" ON storage.objects;

CREATE POLICY "Admin can upload gallery bucket files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'gallery' AND (auth.jwt() ->> 'email') = 'tylerbond.projects@gmail.com');

CREATE POLICY "Admin can update gallery bucket files"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'gallery' AND (auth.jwt() ->> 'email') = 'tylerbond.projects@gmail.com');

CREATE POLICY "Admin can delete gallery bucket files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'gallery' AND (auth.jwt() ->> 'email') = 'tylerbond.projects@gmail.com');
