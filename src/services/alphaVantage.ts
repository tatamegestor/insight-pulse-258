const ALPHA_VANTAGE_API_KEY = '42C3EI7YROKYYYLA';
const BASE_URL = 'https://www.alphavantage.co/query';

const REQUEST_DELAY = 1500;

export interface StockQuote {
  symbol: string;
  open: number;
  high: number;
  low: number;
  price: number;
  volume: number;
  latestTradingDay: string;
  previousClose: number;
  change: number;
  changePercent: string;
}

export interface TimeSeriesData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface SearchResult {
  symbol: string;
  name: string;
  type: string;
  region: string;
  currency: string;
}

// ============ FALLBACK DATA ============
const FALLBACK_QUOTES: Record<string, StockQuote> = {
  AAPL: { symbol: 'AAPL', open: 178.50, high: 182.30, low: 177.80, price: 181.25, volume: 58432100, latestTradingDay: '2026-02-03', previousClose: 178.00, change: 3.25, changePercent: '+1.83%' },
  MSFT: { symbol: 'MSFT', open: 415.20, high: 420.50, low: 413.80, price: 418.75, volume: 22156300, latestTradingDay: '2026-02-03', previousClose: 414.50, change: 4.25, changePercent: '+1.03%' },
  GOOGL: { symbol: 'GOOGL', open: 175.30, high: 178.90, low: 174.50, price: 177.80, volume: 18234500, latestTradingDay: '2026-02-03', previousClose: 175.00, change: 2.80, changePercent: '+1.60%' },
  AMZN: { symbol: 'AMZN', open: 185.40, high: 188.20, low: 184.10, price: 186.90, volume: 35678900, latestTradingDay: '2026-02-03', previousClose: 184.80, change: 2.10, changePercent: '+1.14%' },
  TSLA: { symbol: 'TSLA', open: 245.60, high: 252.40, low: 243.20, price: 248.30, volume: 98765400, latestTradingDay: '2026-02-03', previousClose: 246.00, change: 2.30, changePercent: '+0.93%' },
  NVDA: { symbol: 'NVDA', open: 875.20, high: 892.50, low: 870.10, price: 885.60, volume: 45123600, latestTradingDay: '2026-02-03', previousClose: 872.30, change: 13.30, changePercent: '+1.52%' },
  META: { symbol: 'META', open: 485.30, high: 495.80, low: 483.20, price: 492.40, volume: 12345600, latestTradingDay: '2026-02-03', previousClose: 484.10, change: 8.30, changePercent: '+1.71%' },
  JPM: { symbol: 'JPM', open: 195.40, high: 198.20, low: 194.50, price: 197.30, volume: 8765400, latestTradingDay: '2026-02-03', previousClose: 194.80, change: 2.50, changePercent: '+1.28%' },
  V: { symbol: 'V', open: 275.60, high: 278.40, low: 274.20, price: 277.10, volume: 6543200, latestTradingDay: '2026-02-03', previousClose: 275.00, change: 2.10, changePercent: '+0.76%' },
  WMT: { symbol: 'WMT', open: 165.80, high: 168.30, low: 164.90, price: 167.20, volume: 5432100, latestTradingDay: '2026-02-03', previousClose: 165.40, change: 1.80, changePercent: '+1.09%' },
};

function generateFallbackTimeSeries(symbol: string): TimeSeriesData[] {
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

// ============ LOCALSTORAGE CACHE ============
const LS_QUOTES_KEY = 'stock_quotes_cache';
const LS_SERIES_KEY = 'stock_series_cache';
const LS_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface LSCacheEntry<T> {
  data: T;
  timestamp: number;
}

function getLSQuote(symbol: string): StockQuote | null {
  try {
    const cache = JSON.parse(localStorage.getItem(LS_QUOTES_KEY) || '{}');
    const entry = cache[symbol] as LSCacheEntry<StockQuote> | undefined;
    if (entry && Date.now() - entry.timestamp < LS_CACHE_DURATION) {
      return entry.data;
    }
  } catch {}
  return null;
}

function setLSQuote(symbol: string, data: StockQuote): void {
  try {
    const cache = JSON.parse(localStorage.getItem(LS_QUOTES_KEY) || '{}');
    cache[symbol] = { data, timestamp: Date.now() };
    localStorage.setItem(LS_QUOTES_KEY, JSON.stringify(cache));
  } catch {}
}

function getLSSeries(key: string): TimeSeriesData[] | null {
  try {
    const cache = JSON.parse(localStorage.getItem(LS_SERIES_KEY) || '{}');
    const entry = cache[key] as LSCacheEntry<TimeSeriesData[]> | undefined;
    if (entry && Date.now() - entry.timestamp < LS_CACHE_DURATION) {
      return entry.data;
    }
  } catch {}
  return null;
}

function setLSSeries(key: string, data: TimeSeriesData[]): void {
  try {
    const cache = JSON.parse(localStorage.getItem(LS_SERIES_KEY) || '{}');
    cache[key] = { data, timestamp: Date.now() };
    localStorage.setItem(LS_SERIES_KEY, JSON.stringify(cache));
  } catch {}
}

// ============ MEMORY CACHE ============
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const CACHE_DURATION = 5 * 60 * 1000;
const quotesCache = new Map<string, CacheEntry<StockQuote>>();
const timeSeriesCache = new Map<string, CacheEntry<TimeSeriesData[]>>();

function getCachedQuote(symbol: string): StockQuote | null {
  const entry = quotesCache.get(symbol);
  if (entry && Date.now() - entry.timestamp < CACHE_DURATION) {
    return entry.data;
  }
  return null;
}

function setCachedQuote(symbol: string, data: StockQuote): void {
  quotesCache.set(symbol, { data, timestamp: Date.now() });
  setLSQuote(symbol, data);
}

function getCachedTimeSeries(key: string): TimeSeriesData[] | null {
  const entry = timeSeriesCache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_DURATION) {
    return entry.data;
  }
  return null;
}

function setCachedTimeSeries(key: string, data: TimeSeriesData[]): void {
  timeSeriesCache.set(key, { data, timestamp: Date.now() });
  setLSSeries(key, data);
}

// ============ REQUEST QUEUE ============
interface QueueItem {
  execute: () => Promise<any>;
  resolve: (value: any) => void;
  reject: (error: any) => void;
}

let requestQueue: QueueItem[] = [];
let isProcessingQueue = false;
let lastRequestTime = 0;
let rateLimitHit = false;

async function processQueue(): Promise<void> {
  if (isProcessingQueue || requestQueue.length === 0) return;
  
  isProcessingQueue = true;
  
  while (requestQueue.length > 0) {
    const item = requestQueue.shift();
    if (!item) continue;
    
    const timeSinceLastRequest = Date.now() - lastRequestTime;
    if (timeSinceLastRequest < REQUEST_DELAY) {
      await delay(REQUEST_DELAY - timeSinceLastRequest);
    }
    
    try {
      lastRequestTime = Date.now();
      const result = await item.execute();
      item.resolve(result);
    } catch (error) {
      item.reject(error);
    }
  }
  
  isProcessingQueue = false;
}

function enqueueRequest<T>(execute: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    requestQueue.push({ execute, resolve, reject });
    processQueue();
  });
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isRateLimitError(data: any): boolean {
  const hasLimit = data?.Information?.includes('Thank you for using Alpha Vantage') || 
         data?.Note?.includes('Thank you for using Alpha Vantage') ||
         data?.Information?.includes('premium') ||
         data?.Information?.includes('rate limit') ||
         data?.Note?.includes('rate limit');
  if (hasLimit) {
    rateLimitHit = true;
  }
  return hasLimit;
}

// ============ API FUNCTIONS ============

export async function getStockQuote(symbol: string): Promise<StockQuote | null> {
  // Check memory cache
  const cached = getCachedQuote(symbol);
  if (cached) {
    console.log(`Memory cache hit for ${symbol}`);
    return cached;
  }
  
  // Check localStorage cache
  const lsCached = getLSQuote(symbol);
  if (lsCached) {
    console.log(`LocalStorage cache hit for ${symbol}`);
    quotesCache.set(symbol, { data: lsCached, timestamp: Date.now() });
    return lsCached;
  }
  
  // If rate limit was already hit, return fallback immediately
  if (rateLimitHit) {
    console.log(`Using fallback for ${symbol} (rate limit)`);
    const fallback = FALLBACK_QUOTES[symbol];
    if (fallback) {
      return fallback;
    }
  }
  
  return enqueueRequest(async () => {
    try {
      const response = await fetch(
        `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
      );
      const data = await response.json();
      
      if (isRateLimitError(data)) {
        console.log(`Rate limit hit for ${symbol}, using fallback`);
        return FALLBACK_QUOTES[symbol] || null;
      }
      
      if (data['Global Quote'] && Object.keys(data['Global Quote']).length > 0) {
        const quote = data['Global Quote'];
        const result: StockQuote = {
          symbol: quote['01. symbol'],
          open: parseFloat(quote['02. open']),
          high: parseFloat(quote['03. high']),
          low: parseFloat(quote['04. low']),
          price: parseFloat(quote['05. price']),
          volume: parseInt(quote['06. volume']),
          latestTradingDay: quote['07. latest trading day'],
          previousClose: parseFloat(quote['08. previous close']),
          change: parseFloat(quote['09. change']),
          changePercent: quote['10. change percent'],
        };
        setCachedQuote(symbol, result);
        return result;
      }
      
      // Return fallback if API returns empty
      return FALLBACK_QUOTES[symbol] || null;
    } catch (error) {
      console.error(`Error fetching ${symbol}:`, error);
      return FALLBACK_QUOTES[symbol] || null;
    }
  });
}

export async function getMultipleStockQuotes(
  symbols: string[],
  onProgress?: (loaded: number, total: number, data: Map<string, StockQuote>) => void
): Promise<Map<string, StockQuote>> {
  const results = new Map<string, StockQuote>();
  
  for (const symbol of symbols) {
    const quote = await getStockQuote(symbol);
    if (quote) {
      results.set(symbol, quote);
      onProgress?.(results.size, symbols.length, results);
    }
  }

  return results;
}

export async function getDailyTimeSeries(
  symbol: string,
  outputSize: 'compact' | 'full' = 'compact'
): Promise<TimeSeriesData[]> {
  const cacheKey = `${symbol}-${outputSize}`;
  
  // Check memory cache
  const cached = getCachedTimeSeries(cacheKey);
  if (cached) {
    console.log(`Memory cache hit for daily series ${symbol}`);
    return cached;
  }
  
  // Check localStorage cache
  const lsCached = getLSSeries(cacheKey);
  if (lsCached) {
    console.log(`LocalStorage cache hit for daily series ${symbol}`);
    timeSeriesCache.set(cacheKey, { data: lsCached, timestamp: Date.now() });
    return lsCached;
  }
  
  // If rate limit was hit, return fallback
  if (rateLimitHit) {
    console.log(`Using fallback series for ${symbol} (rate limit)`);
    return generateFallbackTimeSeries(symbol);
  }
  
  return enqueueRequest(async () => {
    try {
      const response = await fetch(
        `${BASE_URL}?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=${outputSize}&apikey=${ALPHA_VANTAGE_API_KEY}`
      );
      const data = await response.json();
      
      if (isRateLimitError(data)) {
        console.log(`Rate limit for daily series ${symbol}, using fallback`);
        return generateFallbackTimeSeries(symbol);
      }
      
      if (data['Time Series (Daily)']) {
        const timeSeries = data['Time Series (Daily)'];
        const result = Object.entries(timeSeries).map(([date, values]: [string, any]) => ({
          date,
          open: parseFloat(values['1. open']),
          high: parseFloat(values['2. high']),
          low: parseFloat(values['3. low']),
          close: parseFloat(values['4. close']),
          volume: parseInt(values['5. volume']),
        }));
        setCachedTimeSeries(cacheKey, result);
        return result;
      }
      
      return generateFallbackTimeSeries(symbol);
    } catch (error) {
      console.error(`Error fetching daily series for ${symbol}:`, error);
      return generateFallbackTimeSeries(symbol);
    }
  });
}

export async function searchStocks(keywords: string): Promise<SearchResult[]> {
  return enqueueRequest(async () => {
    try {
      const response = await fetch(
        `${BASE_URL}?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(keywords)}&apikey=${ALPHA_VANTAGE_API_KEY}`
      );
      const data = await response.json();
      
      if (isRateLimitError(data)) {
        return [];
      }
      
      if (data['bestMatches']) {
        return data['bestMatches'].map((match: any) => ({
          symbol: match['1. symbol'],
          name: match['2. name'],
          type: match['3. type'],
          region: match['4. region'],
          currency: match['8. currency'],
        }));
      }
      return [];
    } catch (error) {
      console.error('Error searching stocks:', error);
      return [];
    }
  });
}

export function clearCache(): void {
  quotesCache.clear();
  timeSeriesCache.clear();
  rateLimitHit = false;
  try {
    localStorage.removeItem(LS_QUOTES_KEY);
    localStorage.removeItem(LS_SERIES_KEY);
  } catch {}
}

export function getQueueStatus(): { pending: number; isProcessing: boolean; rateLimited: boolean } {
  return {
    pending: requestQueue.length,
    isProcessing: isProcessingQueue,
    rateLimited: rateLimitHit,
  };
}

export function isUsingFallbackData(): boolean {
  return rateLimitHit;
}
