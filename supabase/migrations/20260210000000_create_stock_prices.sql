-- Create stock_prices table with all necessary columns
CREATE TABLE IF NOT EXISTS public.stock_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol VARCHAR(20) NOT NULL,
  name VARCHAR(255) NOT NULL,
  current_price NUMERIC NOT NULL,
  market_time TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  open_price NUMERIC,
  high_price NUMERIC,
  low_price NUMERIC,
  previous_close NUMERIC,
  volume BIGINT,
  variation_daily NUMERIC,
  variation_monthly NUMERIC,
  volatility_intraday NUMERIC,
  fifty_two_week_high NUMERIC,
  fifty_two_week_low NUMERIC,
  trend VARCHAR(50),
  trend_emoji VARCHAR(10),
  auto_insight TEXT,
  logo_url TEXT,
  currency VARCHAR(10),
  brapi_change NUMERIC,
  brapi_change_percent NUMERIC,
  distance_from_52week_high NUMERIC,
  distance_from_52week_low NUMERIC,
  position_52week_range NUMERIC,
  range_position VARCHAR(50),
  volatility_level VARCHAR(50),
  market_cap BIGINT,
  price_earnings NUMERIC,
  earnings_per_share NUMERIC,
  long_name VARCHAR(255),
  short_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_stock_prices_symbol ON public.stock_prices(symbol);
CREATE INDEX IF NOT EXISTS idx_stock_prices_created_at ON public.stock_prices(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stock_prices_symbol_created_at ON public.stock_prices(symbol, created_at DESC);

-- Enable RLS
ALTER TABLE public.stock_prices ENABLE ROW LEVEL SECURITY;

-- Create policies for public read/write (will be used by edge functions)
DROP POLICY IF EXISTS "Anyone can read stock_prices" ON public.stock_prices;
CREATE POLICY "Anyone can read stock_prices"
  ON public.stock_prices
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Anyone can insert stock_prices" ON public.stock_prices;
CREATE POLICY "Anyone can insert stock_prices"
  ON public.stock_prices
  FOR INSERT
  WITH CHECK (true);
