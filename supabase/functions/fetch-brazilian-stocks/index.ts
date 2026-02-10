import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000;

interface MarketQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  changeMonthly?: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  market: 'BR' | 'US';
  currency: 'BRL' | 'USD';
  updatedAt: string;
}

function getCached(key: string): any | null {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data;
  }
  return null;
}

function setCache(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() });
}

function calculateMonthlyChange(historicalData: any[], currentPrice: number): number | undefined {
  if (!historicalData || historicalData.length === 0) return undefined;
  // The first entry in the 1mo range is approximately 1 month ago
  const oldestPrice = historicalData[0]?.close || historicalData[0]?.open;
  if (!oldestPrice || oldestPrice === 0) return undefined;
  return ((currentPrice - oldestPrice) / oldestPrice) * 100;
}

function transformToMarketQuote(result: any): MarketQuote {
  const price = result.regularMarketPrice || 0;
  const monthlyChange = calculateMonthlyChange(
    result.historicalDataPrice,
    price
  );

  return {
    symbol: result.symbol,
    name: result.longName || result.shortName || result.symbol,
    price,
    change: result.regularMarketChange || 0,
    changePercent: result.regularMarketChangePercent || 0,
    changeMonthly: monthlyChange,
    volume: result.regularMarketVolume || 0,
    high: result.regularMarketDayHigh || 0,
    low: result.regularMarketDayLow || 0,
    open: result.regularMarketOpen || 0,
    previousClose: result.regularMarketPreviousClose || 0,
    market: 'BR',
    currency: result.currency === 'USD' ? 'USD' : 'BRL',
    updatedAt: result.regularMarketTime || new Date().toISOString(),
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const BRAPI_TOKEN = Deno.env.get('BRAPI_TOKEN');
    const { symbols } = await req.json();
    
    if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Symbols array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const cacheKey = `brapi:${symbols.sort().join(',')}`;
    const cached = getCached(cacheKey);
    if (cached) {
      return new Response(
        JSON.stringify({ quotes: cached, source: 'cache' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const symbolsParam = symbols.join(',');
    // Request with 3mo range to ensure at least 30 trading days of history
    let url = `https://brapi.dev/api/quote/${symbolsParam}?range=3mo&interval=1d`;
    
    if (BRAPI_TOKEN) {
      url += `&token=${BRAPI_TOKEN}`;
    }

    console.log(`Fetching from brapi.dev (with history): ${symbols.join(', ')}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Brapi HTTP ${response.status}:`, errorText.substring(0, 200));
      return new Response(
        JSON.stringify({ error: `Brapi returned ${response.status}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let data;
    try {
      data = await response.json();
    } catch (parseErr) {
      console.error('Brapi response is not valid JSON:', parseErr);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON from brapi.dev' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (data.error) {
      console.error('Brapi error field:', data.error);
      return new Response(
        JSON.stringify({ error: data.message || 'Failed to fetch from brapi.dev' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const quotes: MarketQuote[] = (data.results || []).map(transformToMarketQuote);
    
    // Extract raw historical data per symbol for charts
    const history: Record<string, any[]> = {};
    for (const result of (data.results || [])) {
      if (result.historicalDataPrice && result.historicalDataPrice.length > 0) {
        history[result.symbol] = result.historicalDataPrice;
      }
    }
    
    setCache(cacheKey, quotes);

    return new Response(
      JSON.stringify({ quotes, history, source: 'api' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Error in fetch-brazilian-stocks:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
