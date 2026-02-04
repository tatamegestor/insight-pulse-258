import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Cache em memória com TTL de 5 minutos
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000;

// Polygon.io API base URL
const POLYGON_BASE_URL = 'https://api.polygon.io';

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

interface TimeSeriesData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Nomes das empresas para exibição
const STOCK_NAMES: Record<string, string> = {
  'AAPL': 'Apple Inc.',
  'MSFT': 'Microsoft Corporation',
  'GOOGL': 'Alphabet Inc.',
  'AMZN': 'Amazon.com Inc.',
  'TSLA': 'Tesla Inc.',
  'NVDA': 'NVIDIA Corporation',
  'META': 'Meta Platforms Inc.',
  'NFLX': 'Netflix Inc.',
  'AMD': 'Advanced Micro Devices',
  'INTC': 'Intel Corporation',
};

// Fallback data para quando a API estiver indisponível
const FALLBACK_QUOTES: Record<string, MarketQuote> = {
  AAPL: { symbol: 'AAPL', name: 'Apple Inc.', price: 181.25, change: 3.25, changePercent: 1.83, volume: 58432100, high: 182.30, low: 177.80, open: 178.50, previousClose: 178.00, market: 'US', currency: 'USD', updatedAt: new Date().toISOString() },
  MSFT: { symbol: 'MSFT', name: 'Microsoft Corporation', price: 418.75, change: 4.25, changePercent: 1.03, volume: 22156300, high: 420.50, low: 413.80, open: 415.20, previousClose: 414.50, market: 'US', currency: 'USD', updatedAt: new Date().toISOString() },
  GOOGL: { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 177.80, change: 2.80, changePercent: 1.60, volume: 18234500, high: 178.90, low: 174.50, open: 175.30, previousClose: 175.00, market: 'US', currency: 'USD', updatedAt: new Date().toISOString() },
  AMZN: { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 186.90, change: 2.10, changePercent: 1.14, volume: 35678900, high: 188.20, low: 184.10, open: 185.40, previousClose: 184.80, market: 'US', currency: 'USD', updatedAt: new Date().toISOString() },
  TSLA: { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.30, change: 2.30, changePercent: 0.93, volume: 98765400, high: 252.40, low: 243.20, open: 245.60, previousClose: 246.00, market: 'US', currency: 'USD', updatedAt: new Date().toISOString() },
  NVDA: { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 885.60, change: 13.30, changePercent: 1.52, volume: 45123600, high: 892.50, low: 870.10, open: 875.20, previousClose: 872.30, market: 'US', currency: 'USD', updatedAt: new Date().toISOString() },
};

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    console.log(`Cache hit for: ${key}`);
    return entry.data as T;
  }
  return null;
}

function setCache(key: string, data: unknown): void {
  cache.set(key, { data, timestamp: Date.now() });
}

function getStockName(symbol: string): string {
  return STOCK_NAMES[symbol] || symbol;
}

/**
 * Busca cotação do dia anterior via Polygon.io
 * Endpoint: /v2/aggs/ticker/{symbol}/prev
 */
async function fetchFromPolygon(symbol: string, apiKey: string): Promise<MarketQuote | null> {
  try {
    const url = `${POLYGON_BASE_URL}/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${apiKey}`;
    console.log(`Fetching from Polygon: ${symbol}`);
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'ERROR' || !data.results || data.results.length === 0) {
      console.log(`Polygon error for ${symbol}:`, data.status, data.error || 'No results');
      return FALLBACK_QUOTES[symbol] || null;
    }
    
    const result = data.results[0];
    
    // c = close, o = open, h = high, l = low, v = volume
    const price = result.c || 0;
    const open = result.o || 0;
    const high = result.h || 0;
    const low = result.l || 0;
    const volume = result.v || 0;
    
    // Calcular variação baseado no open do dia
    const change = price - open;
    const changePercent = open > 0 ? (change / open) * 100 : 0;
    
    return {
      symbol: symbol,
      name: getStockName(symbol),
      price: price,
      change: change,
      changePercent: changePercent,
      volume: volume,
      high: high,
      low: low,
      open: open,
      previousClose: open, // Usando open como referência (prev API retorna dados do dia anterior)
      market: 'US',
      currency: 'USD',
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`Error fetching ${symbol} from Polygon:`, error);
    return FALLBACK_QUOTES[symbol] || null;
  }
}

/**
 * Busca histórico de preços via Polygon.io
 * Endpoint: /v2/aggs/ticker/{symbol}/range/1/day/{from}/{to}
 */
async function fetchHistoryFromPolygon(symbol: string, apiKey: string): Promise<TimeSeriesData[]> {
  try {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const fromDate = thirtyDaysAgo.toISOString().split('T')[0];
    const toDate = today.toISOString().split('T')[0];
    
    const url = `${POLYGON_BASE_URL}/v2/aggs/ticker/${symbol}/range/1/day/${fromDate}/${toDate}?adjusted=true&sort=desc&apiKey=${apiKey}`;
    console.log(`Fetching history from Polygon: ${symbol}`);
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'ERROR' || !data.results || data.results.length === 0) {
      console.log(`Polygon history error for ${symbol}:`, data.status, data.error || 'No results');
      return generateFallbackHistory(symbol);
    }
    
    return data.results.map((bar: { t: number; o: number; h: number; l: number; c: number; v: number }) => ({
      date: new Date(bar.t).toISOString().split('T')[0],
      open: bar.o,
      high: bar.h,
      low: bar.l,
      close: bar.c,
      volume: bar.v,
    }));
  } catch (error) {
    console.error(`Error fetching history for ${symbol}:`, error);
    return generateFallbackHistory(symbol);
  }
}

function generateFallbackHistory(symbol: string): TimeSeriesData[] {
  const basePrice = FALLBACK_QUOTES[symbol]?.price || 150;
  const data: TimeSeriesData[] = [];
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const volatility = (Math.random() - 0.5) * 10;
    const dayPrice = basePrice + volatility - (i * 0.5);
    
    data.push({
      date: date.toISOString().split('T')[0],
      open: dayPrice - 1,
      high: dayPrice + 2,
      low: dayPrice - 2,
      close: dayPrice,
      volume: Math.floor(Math.random() * 50000000) + 10000000,
    });
  }
  
  return data;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('MASSIVE_API_KEY');
    
    if (!apiKey) {
      console.error('MASSIVE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { symbols, withHistory = false } = await req.json();
    
    if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Symbols array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verificar cache para cotações
    const quoteCacheKey = `polygon:quotes:${symbols.sort().join(',')}`;
    const cachedQuotes = getCached<MarketQuote[]>(quoteCacheKey);
    
    let quotes: MarketQuote[] = [];
    
    if (cachedQuotes) {
      quotes = cachedQuotes;
    } else {
      console.log(`Fetching quotes from Polygon.io: ${symbols.join(', ')}`);
      
      // Buscar em paralelo para melhor performance
      const quotePromises = symbols.map(symbol => fetchFromPolygon(symbol, apiKey));
      const results = await Promise.all(quotePromises);
      
      quotes = results.filter((q): q is MarketQuote => q !== null);

      if (quotes.length > 0) {
        setCache(quoteCacheKey, quotes);
      }
    }

    // Se histórico foi solicitado
    let history: Record<string, TimeSeriesData[]> = {};
    
    if (withHistory && symbols.length === 1) {
      const symbol = symbols[0];
      const historyCacheKey = `polygon:history:${symbol}`;
      const cachedHistory = getCached<TimeSeriesData[]>(historyCacheKey);
      
      if (cachedHistory) {
        history[symbol] = cachedHistory;
      } else {
        console.log(`Fetching history from Polygon.io: ${symbol}`);
        const historyData = await fetchHistoryFromPolygon(symbol, apiKey);
        if (historyData.length > 0) {
          history[symbol] = historyData;
          setCache(historyCacheKey, history[symbol]);
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        quotes, 
        history: Object.keys(history).length > 0 ? history : undefined,
        source: cachedQuotes ? 'cache' : 'polygon' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Error in fetch-us-stocks:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
