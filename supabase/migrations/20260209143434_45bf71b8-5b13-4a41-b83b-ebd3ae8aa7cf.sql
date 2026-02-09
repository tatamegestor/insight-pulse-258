-- Drop the restrictive SELECT policy and create a permissive one
DROP POLICY IF EXISTS "Allow public select on stock_prices" ON public.stock_prices;

CREATE POLICY "Anyone can read stock_prices"
  ON public.stock_prices
  FOR SELECT
  USING (true);

-- Also fix the INSERT policy (same issue)
DROP POLICY IF EXISTS "Allow public insert on stock_prices" ON public.stock_prices;

CREATE POLICY "Anyone can insert stock_prices"
  ON public.stock_prices
  FOR INSERT
  WITH CHECK (true);