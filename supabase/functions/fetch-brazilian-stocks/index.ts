import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Cache em memória com TTL de 5 minutos
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000;

interface BrapiQuote {
  symbol: string;
  shortName: string;
  longName: string;
  currency: string;
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  regularMarketDayHigh: number;
  regularMarketDayLow: number;
  regularMarketVolume: number;
  regularMarketOpen: number;
  regularMarketPreviousClose: number;
  regularMarketTime: string;
}

interface MarketQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
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
    console.log(`Cache hit for: ${key}`);
    return entry.data;
  }
  return null;
}

function setCache(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() });
}

function transformBrapiToMarketQuote(quote: BrapiQuote): MarketQuote {
  return {
    symbol: quote.symbol,
    name: quote.shortName || quote.longName || quote.symbol,
    price: quote.regularMarketPrice || 0,
    change: quote.regularMarketChange || 0,
    changePercent: quote.regularMarketChangePercent || 0,
    volume: quote.regularMarketVolume || 0,
    high: quote.regularMarketDayHigh || 0,
    low: quote.regularMarketDayLow || 0,
    open: quote.regularMarketOpen || 0,
    previousClose: quote.regularMarketPreviousClose || 0,
    market: 'BR',
    currency: quote.currency === 'USD' ? 'USD' : 'BRL',
    updatedAt: quote.regularMarketTime || new Date().toISOString(),
  };
}

serve(async (req) => {
  // Handle CORS preflight
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

    // Verificar cache
    const cacheKey = `brapi:${symbols.sort().join(',')}`;
    const cached = getCached(cacheKey);
    if (cached) {
      return new Response(
        JSON.stringify({ quotes: cached, source: 'cache' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fazer requisição para brapi.dev
    const symbolsParam = symbols.join(',');
    let url = `https://brapi.dev/api/quote/${symbolsParam}`;
    
    // Adicionar token se disponível (permite mais ações além das 4 gratuitas)
    if (BRAPI_TOKEN) {
      url += `?token=${BRAPI_TOKEN}`;
    }

    console.log(`Fetching from brapi.dev: ${symbols.join(', ')}`);
    
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok || data.error) {
      console.error('Brapi error:', data);
      return new Response(
        JSON.stringify({ error: data.message || 'Failed to fetch from brapi.dev' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Transformar dados para formato padronizado
    const quotes: MarketQuote[] = (data.results || []).map(transformBrapiToMarketQuote);
    
    // Salvar no cache
    setCache(cacheKey, quotes);

    return new Response(
      JSON.stringify({ quotes, source: 'api' }),
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
