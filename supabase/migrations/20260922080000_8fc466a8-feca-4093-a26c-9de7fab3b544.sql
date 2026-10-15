-- Supabase Auth's email provider is disabled on this project and there's no
-- dashboard access to turn it on, so the admin gate no longer uses Supabase
-- Auth at all -- it's a single shared password checked by a server function,
-- with a signed session cookie. That server function uses the service-role
-- key, which bypasses RLS entirely, so client-side write policies are no
-- longer needed: drop them and let RLS default-deny handle it. Public read
-- access is unchanged.
DROP POLICY IF EXISTS "Admin can insert gallery photos" ON public.gallery_photos;
DROP POLICY IF EXISTS "Admin can update gallery photos" ON public.gallery_photos;
DROP POLICY IF EXISTS "Admin can delete gallery photos" ON public.gallery_photos;

DROP POLICY IF EXISTS "Admin can upload gallery bucket files" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update gallery bucket files" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete gallery bucket files" ON storage.objects;
