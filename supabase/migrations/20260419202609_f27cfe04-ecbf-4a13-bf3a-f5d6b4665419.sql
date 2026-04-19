DROP POLICY IF EXISTS "Bids are viewable by everyone" ON public.bids;

CREATE POLICY "Authenticated users can view bids"
ON public.bids
FOR SELECT
TO authenticated
USING (true);