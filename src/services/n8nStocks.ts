const N8N_WEBHOOK_URL = 'https://projeto-final.app.n8n.cloud/webhook/buscar-acoes-globais';

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

/**
 * Busca todas as ações globais do webhook n8n
 */
export async function fetchGlobalStocks(): Promise<N8nStockQuote[]> {
  const cached = getCached();
  if (cached) return cached;

  try {
    console.log('Fetching global stocks from n8n webhook...');
    const response = await fetch(N8N_WEBHOOK_URL, { method: 'GET' });

    if (!response.ok) {
      throw new Error(`n8n webhook error: ${response.status}`);
    }

    const data = await response.json();

    // O webhook pode retornar um array diretamente ou dentro de um objeto
    const quotes: N8nStockQuote[] = Array.isArray(data) ? data : (data?.quotes || data?.data || []);

    setCache(quotes);
    return quotes;
  } catch (error) {
    console.error('Failed to fetch from n8n webhook:', error);
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
