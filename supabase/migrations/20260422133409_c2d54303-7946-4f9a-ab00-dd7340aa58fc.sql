-- Restrict SELECT on bids to owner-only (admins already covered by separate ALL policy)
DROP POLICY IF EXISTS "Authenticated users can view bids" ON public.bids;

CREATE POLICY "Users can view their own bids"
  ON public.bids
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Strengthen INSERT validation: must be live auction, valid amount, meets increment
DROP POLICY IF EXISTS "Authenticated users can place bids" ON public.bids;

CREATE POLICY "Authenticated users can place valid bids"
  ON public.bids
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND amount > 0
    AND EXISTS (
      SELECT 1 FROM public.auctions a
      WHERE a.id = auction_id
        AND a.status = 'live'
        AND now() >= a.starts_at
        AND now() < a.ends_at
        AND amount >= a.starting_bid
        AND (a.current_bid IS NULL OR amount >= a.current_bid + a.bid_increment)
    )
  );
