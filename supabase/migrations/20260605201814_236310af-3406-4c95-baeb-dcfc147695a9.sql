
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Enums
CREATE TYPE public.art_period AS ENUM ('georgian', 'french', 'abstract');
CREATE TYPE public.art_status AS ENUM ('available', 'reserved_for_viewing', 'sold');
CREATE TYPE public.request_lang AS ENUM ('ka', 'en');
CREATE TYPE public.viewing_status AS ENUM ('new', 'contacted', 'scheduled', 'closed');
CREATE TYPE public.tbc_status AS ENUM ('new', 'sent', 'closed');

-- Artworks
CREATE TABLE public.artworks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title_ka TEXT NOT NULL,
  title_en TEXT NOT NULL,
  period public.art_period NOT NULL,
  subcategory TEXT,
  year INTEGER,
  medium_ka TEXT,
  medium_en TEXT,
  width_cm NUMERIC,
  height_cm NUMERIC,
  price_gel NUMERIC NOT NULL DEFAULT 0,
  status public.art_status NOT NULL DEFAULT 'available',
  main_image TEXT,
  gallery_images TEXT[] NOT NULL DEFAULT '{}',
  description_ka TEXT,
  description_en TEXT,
  story_ka TEXT,
  story_en TEXT,
  why_see_in_person_ka TEXT,
  why_see_in_person_en TEXT,
  room_types TEXT[] NOT NULL DEFAULT '{}',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.artworks TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.artworks TO authenticated;
GRANT ALL ON public.artworks TO service_role;
ALTER TABLE public.artworks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read published artworks" ON public.artworks FOR SELECT TO anon, authenticated USING (is_published = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage artworks" ON public.artworks FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Private viewing requests
CREATE TABLE public.private_viewing_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  preferred_date DATE,
  preferred_time TEXT,
  selected_artwork_ids UUID[] NOT NULL DEFAULT '{}',
  message TEXT,
  language public.request_lang NOT NULL DEFAULT 'ka',
  status public.viewing_status NOT NULL DEFAULT 'new',
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.private_viewing_requests TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.private_viewing_requests TO authenticated;
GRANT ALL ON public.private_viewing_requests TO service_role;
ALTER TABLE public.private_viewing_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit viewing requests" ON public.private_viewing_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins read viewing requests" ON public.private_viewing_requests FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update viewing requests" ON public.private_viewing_requests FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete viewing requests" ON public.private_viewing_requests FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- TBC detail requests
CREATE TABLE public.tbc_detail_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  artwork_id UUID REFERENCES public.artworks(id) ON DELETE SET NULL,
  message TEXT,
  language public.request_lang NOT NULL DEFAULT 'ka',
  status public.tbc_status NOT NULL DEFAULT 'new',
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.tbc_detail_requests TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.tbc_detail_requests TO authenticated;
GRANT ALL ON public.tbc_detail_requests TO service_role;
ALTER TABLE public.tbc_detail_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit tbc requests" ON public.tbc_detail_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins read tbc requests" ON public.tbc_detail_requests FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update tbc requests" ON public.tbc_detail_requests FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete tbc requests" ON public.tbc_detail_requests FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
CREATE TRIGGER artworks_updated_at BEFORE UPDATE ON public.artworks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
