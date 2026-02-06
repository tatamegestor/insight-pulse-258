import { supabase } from "@/integrations/supabase/client";

const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

export interface N8nStockQuote {
  ticker: string;
  nome: string;
  preco: number;
  variacao_diaria: number;
  variacao_mensal: number;
}

// Cache local
let cachedData: { quotes: N8nStockQuote[]; timestamp: number } | null = null;

function getCached(): N8nStockQuote[] | null {
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
    console.log('Cache hit for n8n stocks');
    return cachedData.quotes;
  }
  return null;
}

function setCache(quotes: N8nStockQuote[]): void {
  cachedData = { quotes, timestamp: Date.now() };
}

/** Remove prefixos monetários e converte para número */
function parsePrice(value: any): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const cleaned = value.replace(/[A-Za-z$\s]/g, '').replace(',', '.');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  }
  return 0;
}

/** Remove "%" e converte para número */
function parsePercent(value: any): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const cleaned = value.replace('%', '').replace(',', '.').trim();
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  }
  return 0;
}

/**
 * Busca todas as ações globais via Edge Function (proxy do n8n)
 */
export async function fetchGlobalStocks(): Promise<N8nStockQuote[]> {
  const cached = getCached();
  if (cached) return cached;

  try {
    console.log('Fetching global stocks via edge function proxy...');
    const { data, error } = await supabase.functions.invoke('fetch-global-stocks');

    if (error) {
      console.error('Edge function error:', error);
      return [];
    }

    const rawQuotes = data?.quotes || [];

    const quotes: N8nStockQuote[] = rawQuotes.map((item: any) => ({
      ticker: item.ticker,
      nome: item.nome || item.ticker,
      preco: parsePrice(item.preco),
      variacao_diaria: parsePercent(item.variacao_diaria),
      variacao_mensal: parsePercent(item.variacao_mensal),
    }));

    if (quotes.length > 0) {
      setCache(quotes);
    }
    console.log(`Got ${quotes.length} global stock quotes`);
    return quotes;
  } catch (error) {
    console.error('Failed to fetch global stocks:', error);
    return [];
  }
}


/**
 * Busca ações específicas por ticker
 */
export async function getStocksByTickers(tickers: string[]): Promise<N8nStockQuote[]> {
  const allStocks = await fetchGlobalStocks();
  const tickerSet = new Set(tickers.map(t => t.toUpperCase()));
  return allStocks.filter(q => tickerSet.has(q.ticker.toUpperCase()));
}

/**
 * Busca uma única ação por ticker
 */
export async function getStockByTicker(ticker: string): Promise<N8nStockQuote | null> {
  const results = await getStocksByTickers([ticker]);
  return results[0] || null;
}

/**
 * Limpa o cache
 */
export function clearN8nCache(): void {
  cachedData = null;
}
