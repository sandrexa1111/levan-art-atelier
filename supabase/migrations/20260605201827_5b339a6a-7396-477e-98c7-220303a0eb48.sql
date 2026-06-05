
CREATE POLICY "Public read artworks bucket" ON storage.objects FOR SELECT USING (bucket_id = 'artworks');
CREATE POLICY "Admins upload artworks" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'artworks' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update artworks" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'artworks' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete artworks" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'artworks' AND public.has_role(auth.uid(), 'admin'));
