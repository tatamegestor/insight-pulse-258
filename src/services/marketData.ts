import { supabase } from "@/integrations/supabase/client";
import { fetchGlobalStocks, N8nStockQuote } from "@/services/n8nStocks";

export interface MarketQuote {
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

export interface TimeSeriesData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Cache local com TTL de 5 minutos
const LOCAL_CACHE_TTL = 5 * 60 * 1000;
const quotesCache = new Map<string, { data: MarketQuote[]; timestamp: number }>();
const historyCache = new Map<string, { data: TimeSeriesData[]; timestamp: number }>();

function getCachedQuotes(key: string): MarketQuote[] | null {
  const entry = quotesCache.get(key);
  if (entry && Date.now() - entry.timestamp < LOCAL_CACHE_TTL) {
    return entry.data;
  }
  return null;
}

function setCachedQuotes(key: string, data: MarketQuote[]): void {
  quotesCache.set(key, { data, timestamp: Date.now() });
}

function getCachedHistory(key: string): TimeSeriesData[] | null {
  const entry = historyCache.get(key);
  if (entry && Date.now() - entry.timestamp < LOCAL_CACHE_TTL) {
    return entry.data;
  }
  return null;
}

function setCachedHistory(key: string, data: TimeSeriesData[]): void {
  historyCache.set(key, { data, timestamp: Date.now() });
}

/**
 * Detecta se um símbolo é brasileiro ou americano
 * Símbolos BR terminam com número (PETR4, VALE3, etc)
 */
export function detectMarket(symbol: string): 'BR' | 'US' {
  // Símbolos brasileiros terminam em número
  if (/\d$/.test(symbol)) {
    return 'BR';
  }
  // Índices e moedas especiais
  const brSymbols = ['IBOV', 'IFIX', 'USD', 'EUR', 'BTC', 'ETH'];
  if (brSymbols.includes(symbol.toUpperCase())) {
    return 'BR';
  }
  return 'US';
}

/**
 * Busca cotações de ações brasileiras via brapi.dev
 */
export async function getBrazilianStocks(symbols: string[]): Promise<MarketQuote[]> {
  const cacheKey = `br:${symbols.sort().join(',')}`;
  const cached = getCachedQuotes(cacheKey);
  if (cached) {
    console.log('Local cache hit for BR stocks');
    return cached;
  }

  try {
    const { data, error } = await supabase.functions.invoke('fetch-brazilian-stocks', {
      body: { symbols }
    });

    if (error) {
      console.error('Error fetching BR stocks:', error);
      throw error;
    }

    const quotes = data?.quotes || [];
    if (quotes.length > 0) {
      setCachedQuotes(cacheKey, quotes);
      return quotes;
    }
  } catch (error) {
    console.error('Failed to fetch Brazilian stocks from Edge Function:', error);
  }

  // Fallback: read from stock_prices table in database
  try {
    console.log('Falling back to stock_prices table for BR stocks');
    const { data, error } = await supabase
      .from('stock_prices')
      .select('*')
      .in('symbol', symbols)
      .eq('currency', 'BRL')
      .order('market_time', { ascending: false });

    if (error) throw error;

    // Deduplicate: keep only the most recent entry per symbol
    const seen = new Set<string>();
    const unique = (data || []).filter(row => {
      if (seen.has(row.symbol)) return false;
      seen.add(row.symbol);
      return true;
    });

    const quotes: MarketQuote[] = unique.map(row => {
      const changePercent = Number(row.variation_daily || row.brapi_change_percent || 0);
      const currentPrice = Number(row.current_price);
      // Calculate absolute change from percentage
      const change = currentPrice > 0 ? (changePercent / 100) * currentPrice : 0;
      
      return {
        symbol: row.symbol,
        name: row.long_name || row.short_name || row.symbol,
        price: currentPrice,
        change: change,
        changePercent: changePercent,
        changeMonthly: Number(row.variation_monthly || 0),
        volume: Number(row.volume || 0),
        high: Number(row.high_price || row.current_price),
        low: Number(row.low_price || row.current_price),
        open: Number(row.open_price || row.current_price),
        previousClose: Number(row.previous_close || row.current_price),
        market: 'BR',
        currency: 'BRL',
        updatedAt: row.market_time || new Date().toISOString(),
      };
    });

    if (quotes.length > 0) {
      setCachedQuotes(cacheKey, quotes);
      return quotes;
    }
    return [];
  } catch (dbError) {
    console.error('DB fallback also failed:', dbError);
    return [];
  }
}

/**
 * Converte uma cotação do n8n para o formato MarketQuote
 */
function n8nToMarketQuote(q: N8nStockQuote): MarketQuote {
  // variacao_diaria is already a percentage (e.g. 0.80 means 0.80%)
  const changePercent = q.variacao_diaria;
  const change = q.preco > 0 ? (changePercent / 100) * q.preco : 0;
  return {
    symbol: q.ticker,
    name: q.nome,
    price: q.preco,
    change,
    changePercent,
    changeMonthly: q.variacao_mensal,
    volume: 0,
    high: q.preco,
    low: q.preco,
    open: q.preco - change,
    previousClose: q.preco - change,
    market: 'US',
    currency: 'USD',
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Busca cotações de ações americanas via webhook n8n
 */
export async function getUSStocks(symbols: string[]): Promise<MarketQuote[]> {
  const cacheKey = `us:${symbols.sort().join(',')}`;
  const cached = getCachedQuotes(cacheKey);
  if (cached) {
    console.log('Local cache hit for US stocks');
    return cached;
  }

  try {
    const allStocks = await fetchGlobalStocks();
    const symbolSet = new Set(symbols.map(s => s.toUpperCase()));
    const filtered = allStocks.filter(q => symbolSet.has(q.ticker.toUpperCase()));
    const quotes = filtered.map(n8nToMarketQuote);

    if (quotes.length > 0) {
      setCachedQuotes(cacheKey, quotes);
      return quotes;
    }
  } catch (error) {
    console.error('Failed to fetch US stocks from n8n:', error);
  }

  // Fallback: read from stock_prices table in database
  try {
    console.log('Falling back to stock_prices table for US stocks');
    const { data, error } = await supabase
      .from('stock_prices')
      .select('*')
      .in('symbol', symbols)
      .order('market_time', { ascending: false });

    if (error) throw error;

    // Deduplicate: keep only the most recent entry per symbol
    const seen = new Set<string>();
    const unique = (data || []).filter(row => {
      if (seen.has(row.symbol)) return false;
      seen.add(row.symbol);
      return true;
    });

    const quotes: MarketQuote[] = unique.map(row => {
      const changePercent = Number(row.variation_daily || row.brapi_change_percent || 0);
      const currentPrice = Number(row.current_price);
      // Calculate absolute change from percentage
      const change = currentPrice > 0 ? (changePercent / 100) * currentPrice : 0;
      
      return {
        symbol: row.symbol,
        name: row.long_name || row.short_name || row.symbol,
        price: currentPrice,
        change: change,
        changePercent: changePercent,
        changeMonthly: Number(row.variation_monthly || 0),
        volume: Number(row.volume || 0),
        high: Number(row.high_price || row.current_price),
        low: Number(row.low_price || row.current_price),
        open: Number(row.open_price || row.current_price),
        previousClose: Number(row.previous_close || row.current_price),
        market: 'US',
        currency: (row.currency as 'USD' | 'BRL') || 'USD',
        updatedAt: row.market_time || new Date().toISOString(),
      };
    });

    if (quotes.length > 0) {
      setCachedQuotes(cacheKey, quotes);
    }
    return quotes;
  } catch (dbError) {
    console.error('DB fallback also failed:', dbError);
    return [];
  }
}

/**
 * Busca histórico de preços de uma ação
 */
export async function getStockHistory(symbol: string, market?: 'BR' | 'US'): Promise<TimeSeriesData[]> {
  const detectedMarket = market || detectMarket(symbol);
  const cacheKey = `history:${symbol}`;
  const cached = getCachedHistory(cacheKey);
  if (cached) {
    console.log('Local cache hit for history');
    return cached;
  }

  try {
    if (detectedMarket === 'US') {
      const { data, error } = await supabase.functions.invoke('fetch-us-stocks', {
        body: { symbols: [symbol], withHistory: true }
      });

      if (error) throw error;
      
      const history = data?.history?.[symbol] || [];
      setCachedHistory(cacheKey, history);
      return history;
    } else {
      // Para BR, buscar histórico via brapi.dev (plano pago com range=1mo)
      const { data, error } = await supabase.functions.invoke('fetch-brazilian-stocks', {
        body: { symbols: [symbol] }
      });

      if (error) throw error;

      const history: TimeSeriesData[] = (data?.history?.[symbol] || []).map((item: any) => ({
        date: new Date(item.date * 1000).toISOString().split('T')[0],
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        volume: item.volume,
      }));

      // Append current quote as latest data point if history is behind today
      const quote = (data?.quotes || []).find((q: any) => q.symbol === symbol);
      if (quote && history.length > 0) {
        const today = new Date().toISOString().split('T')[0];
        const lastHistoryDate = history[history.length - 1]?.date;
        if (lastHistoryDate && lastHistoryDate < today) {
          // Fill gap: add intermediate trading days between last history date and today
          const lastDate = new Date(lastHistoryDate);
          const todayDate = new Date(today);
          const lastClose = history[history.length - 1].close;
          const currentPrice = quote.price;
          const daysBetween: Date[] = [];
          
          const d = new Date(lastDate);
          d.setDate(d.getDate() + 1);
          while (d < todayDate) {
            const dow = d.getDay();
            if (dow !== 0 && dow !== 6) { // skip weekends
              daysBetween.push(new Date(d));
            }
            d.setDate(d.getDate() + 1);
          }
          
          // Interpolate prices for gap days
          const totalSteps = daysBetween.length + 1;
          daysBetween.forEach((gapDate, i) => {
            const ratio = (i + 1) / totalSteps;
            const interpolatedPrice = lastClose + (currentPrice - lastClose) * ratio;
            history.push({
              date: gapDate.toISOString().split('T')[0],
              open: interpolatedPrice,
              high: interpolatedPrice,
              low: interpolatedPrice,
              close: parseFloat(interpolatedPrice.toFixed(2)),
              volume: 0,
            });
          });
          
          // Add today's actual price
          history.push({
            date: today,
            open: quote.price,
            high: quote.high || quote.price,
            low: quote.low || quote.price,
            close: quote.price,
            volume: quote.volume || 0,
          });
        }
      }

      setCachedHistory(cacheKey, history);
      return history;
    }
  } catch (error) {
    console.error('Failed to fetch stock history:', error);
    return [];
  }
}

/**
 * Busca cotação de uma única ação
 */
export async function getStockQuote(symbol: string): Promise<MarketQuote | null> {
  const market = detectMarket(symbol);
  
  try {
    const quotes = market === 'BR' 
      ? await getBrazilianStocks([symbol])
      : await getUSStocks([symbol]);
    
    return quotes[0] || null;
  } catch (error) {
    console.error('Failed to fetch stock quote:', error);
    return null;
  }
}

/**
 * Busca múltiplas cotações com progresso
 */
export async function getMultipleQuotes(
  symbols: string[],
  onProgress?: (loaded: number, total: number, data: MarketQuote[]) => void
): Promise<MarketQuote[]> {
  // Separar símbolos por mercado
  const brSymbols = symbols.filter(s => detectMarket(s) === 'BR');
  const usSymbols = symbols.filter(s => detectMarket(s) === 'US');
  
  let allQuotes: MarketQuote[] = [];
  
  // Buscar BR primeiro (geralmente mais rápido)
  if (brSymbols.length > 0) {
    const brQuotes = await getBrazilianStocks(brSymbols);
    allQuotes = [...allQuotes, ...brQuotes];
    onProgress?.(allQuotes.length, symbols.length, allQuotes);
  }
  
  // Depois buscar US
  if (usSymbols.length > 0) {
    const usQuotes = await getUSStocks(usSymbols);
    allQuotes = [...allQuotes, ...usQuotes];
    onProgress?.(allQuotes.length, symbols.length, allQuotes);
  }
  
  return allQuotes;
}

/**
 * Limpa todos os caches locais
 */
export function clearMarketCache(): void {
  quotesCache.clear();
  historyCache.clear();
}
