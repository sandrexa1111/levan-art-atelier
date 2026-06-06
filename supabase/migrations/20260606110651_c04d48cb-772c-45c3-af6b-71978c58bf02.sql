
-- 1. Storage: remove permissive public read on private artworks bucket.
-- App uses signed URLs (which bypass RLS), so admins-only direct read is safe.
DROP POLICY IF EXISTS "Public read artworks bucket" ON storage.objects;

CREATE POLICY "Admins read artworks bucket"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'artworks' AND public.has_role(auth.uid(), 'admin'::public.app_role));

-- 2. Revoke direct EXECUTE on SECURITY DEFINER has_role from API roles.
-- RLS policies still evaluate it via the owning role; PostgREST RPC access is blocked.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;

-- 3. Defense-in-depth: explicit restrictive policy blocking non-admin inserts into user_roles.
DROP POLICY IF EXISTS "Only admins insert roles" ON public.user_roles;
CREATE POLICY "Only admins insert roles"
ON public.user_roles AS RESTRICTIVE
FOR INSERT TO anon, authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- 4. Replace always-true WITH CHECK on public submit policies with input validation.
DROP POLICY IF EXISTS "Anyone can submit viewing requests" ON public.private_viewing_requests;
CREATE POLICY "Anyone can submit viewing requests"
ON public.private_viewing_requests FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(btrim(name)) BETWEEN 1 AND 120
  AND (email IS NULL OR length(email) <= 255)
  AND (phone IS NULL OR length(phone) <= 40)
  AND (message IS NULL OR length(message) <= 2000)
  AND (preferred_time IS NULL OR length(preferred_time) <= 40)
  AND coalesce(array_length(selected_artwork_ids, 1), 0) <= 50
);

DROP POLICY IF EXISTS "Anyone can submit tbc requests" ON public.tbc_detail_requests;
CREATE POLICY "Anyone can submit tbc requests"
ON public.tbc_detail_requests FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(btrim(name)) BETWEEN 1 AND 120
  AND (email IS NULL OR length(email) <= 255)
  AND (phone IS NULL OR length(phone) <= 40)
  AND (message IS NULL OR length(message) <= 2000)
);
