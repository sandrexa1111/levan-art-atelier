CREATE TABLE public.period_settings (
  period public.art_period PRIMARY KEY,
  image_path text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.period_settings TO anon, authenticated;
GRANT ALL ON public.period_settings TO service_role;

ALTER TABLE public.period_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "period_settings public read" ON public.period_settings
  FOR SELECT USING (true);

CREATE POLICY "period_settings admin insert" ON public.period_settings
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "period_settings admin update" ON public.period_settings
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "period_settings admin delete" ON public.period_settings
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.period_settings (period, image_path) VALUES
  ('georgian', NULL), ('french', NULL), ('abstract', NULL)
ON CONFLICT (period) DO NOTHING;