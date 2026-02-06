import { useQuery } from '@tanstack/react-query';
import {
  fetchGlobalStocks,
  getStockByTicker,
  getStocksByTickers,
  N8nStockQuote,
} from '@/services/n8nStocks';

export function useGlobalStocks() {
  return useQuery<N8nStockQuote[]>({
    queryKey: ['globalStocks'],
    queryFn: () => fetchGlobalStocks(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useStockByTicker(ticker: string) {
  return useQuery<N8nStockQuote | null>({
    queryKey: ['stockByTicker', ticker],
    queryFn: () => getStockByTicker(ticker),
    enabled: !!ticker,
    staleTime: 5 * 60 * 1000,
  });
}

export function useStocksByTickers(tickers: string[]) {
  return useQuery<N8nStockQuote[]>({
    queryKey: ['stocksByTickers', tickers.sort().join(',')],
    queryFn: () => getStocksByTickers(tickers),
    enabled: tickers.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}
