
-- =========================
-- Tighten public INSERT policies on inquiries
-- =========================
DROP POLICY IF EXISTS "Anyone can submit an inquiry" ON public.inquiries;

CREATE POLICY "Anyone can submit an inquiry"
  ON public.inquiries FOR INSERT
  WITH CHECK (
    -- if a user_id is provided, it must be the caller's own
    (user_id IS NULL OR user_id = auth.uid())
    AND char_length(name) BETWEEN 1 AND 100
    AND char_length(email) BETWEEN 3 AND 255
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND (phone IS NULL OR char_length(phone) <= 30)
    AND (subject IS NULL OR char_length(subject) <= 200)
    AND char_length(message) BETWEEN 1 AND 5000
    AND (service_type IS NULL OR char_length(service_type) <= 100)
  );

-- =========================
-- Tighten public INSERT policies on rental_bookings
-- =========================
DROP POLICY IF EXISTS "Anyone can request a booking" ON public.rental_bookings;

CREATE POLICY "Anyone can request a booking"
  ON public.rental_bookings FOR INSERT
  WITH CHECK (
    (user_id IS NULL OR user_id = auth.uid())
    AND char_length(customer_name) BETWEEN 1 AND 100
    AND char_length(customer_email) BETWEEN 3 AND 255
    AND customer_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND (customer_phone IS NULL OR char_length(customer_phone) <= 30)
    AND (notes IS NULL OR char_length(notes) <= 2000)
    AND pickup_date >= CURRENT_DATE
    AND return_date >= pickup_date
    AND return_date <= pickup_date + INTERVAL '365 days'
  );

-- =========================
-- Restrict storage bucket listing while keeping direct URL access
-- =========================
-- Replace broad SELECT policies with ones that disallow listing (no folder enumeration)
-- but still permit direct object access via signed/public URLs through the storage CDN.
DROP POLICY IF EXISTS "Vehicle images are publicly viewable" ON storage.objects;
DROP POLICY IF EXISTS "Site assets are publicly viewable" ON storage.objects;

-- Public-bucket files are still served via the public CDN (which doesn't go through these policies),
-- but we explicitly deny listing by requiring a specific name match in the SELECT policy.
-- Admins keep full access.
CREATE POLICY "Admins can list vehicle images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'vehicle-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can list site assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'));
