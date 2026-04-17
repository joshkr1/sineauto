
-- =========================
-- ENUMS
-- =========================
CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TYPE public.vehicle_status AS ENUM ('available', 'sold', 'reserved', 'coming_soon');
CREATE TYPE public.vehicle_condition AS ENUM ('new', 'used', 'certified_pre_owned', 'classic');
CREATE TYPE public.inquiry_status AS ENUM ('new', 'in_progress', 'closed');
CREATE TYPE public.auction_status AS ENUM ('scheduled', 'live', 'ended', 'cancelled');
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

-- =========================
-- UTILITY: updated_at trigger
-- =========================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =========================
-- PROFILES
-- =========================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================
-- USER ROLES (separate table for security)
-- =========================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =========================
-- AUTO-CREATE profile + default role on signup
-- =========================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================
-- SERVICES
-- =========================
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT NOT NULL,
  long_description TEXT,
  icon TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Services are viewable by everyone"
  ON public.services FOR SELECT USING (active = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage services"
  ON public.services FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================
-- VEHICLES
-- =========================
CREATE TABLE public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  price NUMERIC(12, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  mileage INTEGER,
  fuel_type TEXT,
  transmission TEXT,
  body_type TEXT,
  exterior_color TEXT,
  interior_color TEXT,
  vin TEXT,
  condition public.vehicle_condition NOT NULL DEFAULT 'used',
  status public.vehicle_status NOT NULL DEFAULT 'available',
  location TEXT,
  description TEXT,
  features TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  thumbnail_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_vehicles_status ON public.vehicles(status);
CREATE INDEX idx_vehicles_featured ON public.vehicles(featured) WHERE featured = true;
CREATE INDEX idx_vehicles_make_model ON public.vehicles(make, model);

CREATE POLICY "Vehicles are viewable by everyone"
  ON public.vehicles FOR SELECT USING (true);
CREATE POLICY "Admins can manage vehicles"
  ON public.vehicles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_vehicles_updated_at
  BEFORE UPDATE ON public.vehicles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================
-- INQUIRIES
-- =========================
CREATE TABLE public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  service_type TEXT,
  status public.inquiry_status NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit an inquiry"
  ON public.inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view their own inquiries"
  ON public.inquiries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all inquiries"
  ON public.inquiries FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update inquiries"
  ON public.inquiries FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete inquiries"
  ON public.inquiries FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_inquiries_updated_at
  BEFORE UPDATE ON public.inquiries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================
-- AUCTIONS
-- =========================
CREATE TABLE public.auctions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  starting_bid NUMERIC(12, 2) NOT NULL,
  current_bid NUMERIC(12, 2),
  bid_increment NUMERIC(12, 2) NOT NULL DEFAULT 500,
  status public.auction_status NOT NULL DEFAULT 'scheduled',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.auctions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Auctions are viewable by everyone"
  ON public.auctions FOR SELECT USING (true);
CREATE POLICY "Admins can manage auctions"
  ON public.auctions FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_auctions_updated_at
  BEFORE UPDATE ON public.auctions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================
-- BIDS
-- =========================
CREATE TABLE public.bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auction_id UUID NOT NULL REFERENCES public.auctions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC(12, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_bids_auction ON public.bids(auction_id, created_at DESC);

CREATE POLICY "Bids are viewable by everyone"
  ON public.bids FOR SELECT USING (true);
CREATE POLICY "Authenticated users can place bids"
  ON public.bids FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage bids"
  ON public.bids FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =========================
-- RENTAL BOOKINGS
-- =========================
CREATE TABLE public.rental_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  pickup_date DATE NOT NULL,
  return_date DATE NOT NULL,
  pickup_location TEXT,
  notes TEXT,
  status public.booking_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.rental_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can request a booking"
  ON public.rental_bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view their own bookings"
  ON public.rental_bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all bookings"
  ON public.rental_bookings FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage bookings"
  ON public.rental_bookings FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete bookings"
  ON public.rental_bookings FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_rental_bookings_updated_at
  BEFORE UPDATE ON public.rental_bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================
-- STORAGE BUCKETS
-- =========================
INSERT INTO storage.buckets (id, name, public) VALUES ('vehicle-images', 'vehicle-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('site-assets', 'site-assets', true);

CREATE POLICY "Vehicle images are publicly viewable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'vehicle-images');
CREATE POLICY "Admins can upload vehicle images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'vehicle-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update vehicle images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'vehicle-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete vehicle images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'vehicle-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Site assets are publicly viewable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'site-assets');
CREATE POLICY "Admins can upload site assets"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update site assets"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete site assets"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'));

-- =========================
-- SEED SERVICES
-- =========================
INSERT INTO public.services (title, slug, short_description, long_description, icon, sort_order) VALUES
  ('Vehicle Sales', 'vehicle-sales', 'Premium vehicles from vintage classics to modern luxury, sourced globally.', 'Curated inventory of cars matched to your taste, lifestyle, and budget — every car inspected, documented, and ready for the road.', 'Car', 1),
  ('Global Shipping', 'global-shipping', 'Door-to-door international vehicle shipping with full documentation.', 'We handle customs, freight, and delivery to over 40 countries — your car arrives ready to drive, paperwork complete.', 'Ship', 2),
  ('Auctions', 'auctions', 'Live and online auctions for collectors and dealers.', 'Bid on rare classics, exotics, and limited editions in our verified auction events.', 'Gavel', 3),
  ('Luxury Rentals', 'rentals', 'Short-term and long-term luxury vehicle rentals.', 'From weekend supercars to executive transport, drive the icon you want, when you want it.', 'Key', 4),
  ('Vehicle Sourcing', 'sourcing', 'Find the exact car you want — anywhere in the world.', 'Tell us the year, make, model, and trim. Our sourcing team locates and secures it on your behalf.', 'Search', 5),
  ('Trade-in & Consignment', 'trade-in', 'Sell or trade your current vehicle with full transparency.', 'Honest valuations, fast offers, and consignment options for higher-value vehicles.', 'Repeat', 6);
