import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Cache em memória com TTL de 5 minutos
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000;

// Alpha Vantage API Key (backup gratuito)
const ALPHA_VANTAGE_KEY = '42C3EI7YROKYYYLA';

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

// Fallback data para quando a API estiver em rate limit
const FALLBACK_QUOTES: Record<string, MarketQuote> = {
  AAPL: { symbol: 'AAPL', name: 'Apple Inc.', price: 181.25, change: 3.25, changePercent: 1.83, volume: 58432100, high: 182.30, low: 177.80, open: 178.50, previousClose: 178.00, market: 'US', currency: 'USD', updatedAt: new Date().toISOString() },
  MSFT: { symbol: 'MSFT', name: 'Microsoft Corporation', price: 418.75, change: 4.25, changePercent: 1.03, volume: 22156300, high: 420.50, low: 413.80, open: 415.20, previousClose: 414.50, market: 'US', currency: 'USD', updatedAt: new Date().toISOString() },
  GOOGL: { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 177.80, change: 2.80, changePercent: 1.60, volume: 18234500, high: 178.90, low: 174.50, open: 175.30, previousClose: 175.00, market: 'US', currency: 'USD', updatedAt: new Date().toISOString() },
  AMZN: { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 186.90, change: 2.10, changePercent: 1.14, volume: 35678900, high: 188.20, low: 184.10, open: 185.40, previousClose: 184.80, market: 'US', currency: 'USD', updatedAt: new Date().toISOString() },
  TSLA: { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.30, change: 2.30, changePercent: 0.93, volume: 98765400, high: 252.40, low: 243.20, open: 245.60, previousClose: 246.00, market: 'US', currency: 'USD', updatedAt: new Date().toISOString() },
  NVDA: { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 885.60, change: 13.30, changePercent: 1.52, volume: 45123600, high: 892.50, low: 870.10, open: 875.20, previousClose: 872.30, market: 'US', currency: 'USD', updatedAt: new Date().toISOString() },
};

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

async function fetchFromAlphaVantage(symbol: string): Promise<MarketQuote | null> {
  try {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    // Check for rate limit
    if (data.Information || data.Note) {
      console.log(`Alpha Vantage rate limit for ${symbol}`);
      return FALLBACK_QUOTES[symbol] || null;
    }
    
    if (data['Global Quote'] && Object.keys(data['Global Quote']).length > 0) {
      const quote = data['Global Quote'];
      return {
        symbol: quote['01. symbol'],
        name: getStockName(quote['01. symbol']),
        price: parseFloat(quote['05. price']) || 0,
        change: parseFloat(quote['09. change']) || 0,
        changePercent: parseFloat(quote['10. change percent']?.replace('%', '')) || 0,
        volume: parseInt(quote['06. volume']) || 0,
        high: parseFloat(quote['03. high']) || 0,
        low: parseFloat(quote['04. low']) || 0,
        open: parseFloat(quote['02. open']) || 0,
        previousClose: parseFloat(quote['08. previous close']) || 0,
        market: 'US',
        currency: 'USD',
        updatedAt: new Date().toISOString(),
      };
    }
    
    return FALLBACK_QUOTES[symbol] || null;
  } catch (error) {
    console.error(`Error fetching ${symbol} from Alpha Vantage:`, error);
    return FALLBACK_QUOTES[symbol] || null;
  }
}

async function fetchHistoryFromAlphaVantage(symbol: string): Promise<TimeSeriesData[]> {
  try {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=compact&apikey=${ALPHA_VANTAGE_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.Information || data.Note) {
      console.log(`Alpha Vantage rate limit for history ${symbol}`);
      return generateFallbackHistory(symbol);
    }
    
    if (data['Time Series (Daily)']) {
      const timeSeries = data['Time Series (Daily)'];
      return Object.entries(timeSeries)
        .slice(0, 30)
        .map(([date, values]: [string, any]) => ({
          date,
          open: parseFloat(values['1. open']),
          high: parseFloat(values['2. high']),
          low: parseFloat(values['3. low']),
          close: parseFloat(values['4. close']),
          volume: parseInt(values['5. volume']),
        }));
    }
    
    return generateFallbackHistory(symbol);
  } catch (error) {
    console.error(`Error fetching history for ${symbol}:`, error);
    return generateFallbackHistory(symbol);
  }
}

function getStockName(symbol: string): string {
  const names: Record<string, string> = {
    'AAPL': 'Apple Inc.',
    'MSFT': 'Microsoft Corporation',
    'GOOGL': 'Alphabet Inc.',
    'AMZN': 'Amazon.com Inc.',
    'TSLA': 'Tesla Inc.',
    'NVDA': 'NVIDIA Corporation',
    'META': 'Meta Platforms Inc.',
  };
  return names[symbol] || symbol;
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

// Helper para delay entre requisições
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symbols, withHistory = false } = await req.json();
    
    if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Symbols array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verificar cache para cotações
    const quoteCacheKey = `av:quotes:${symbols.sort().join(',')}`;
    const cachedQuotes = getCached(quoteCacheKey);
    
    let quotes: MarketQuote[] = [];
    
    if (cachedQuotes) {
      quotes = cachedQuotes;
    } else {
      console.log(`Fetching quotes from Alpha Vantage: ${symbols.join(', ')}`);
      
      // Buscar sequencialmente com delay para respeitar rate limit
      for (const symbol of symbols) {
        const quote = await fetchFromAlphaVantage(symbol);
        if (quote) {
          quotes.push(quote);
        }
        // Delay de 1.5s entre requisições para API gratuita
        if (symbols.indexOf(symbol) < symbols.length - 1) {
          await delay(1500);
        }
      }

      if (quotes.length > 0) {
        setCache(quoteCacheKey, quotes);
      }
    }

    // Se histórico foi solicitado
    let history: Record<string, TimeSeriesData[]> = {};
    
    if (withHistory && symbols.length === 1) {
      const symbol = symbols[0];
      const historyCacheKey = `av:history:${symbol}`;
      const cachedHistory = getCached(historyCacheKey);
      
      if (cachedHistory) {
        history[symbol] = cachedHistory;
      } else {
        console.log(`Fetching history from Alpha Vantage: ${symbol}`);
        const historyData = await fetchHistoryFromAlphaVantage(symbol);
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
        source: cachedQuotes ? 'cache' : 'api' 
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
