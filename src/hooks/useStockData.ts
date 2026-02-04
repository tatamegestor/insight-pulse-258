import { useQuery } from '@tanstack/react-query';
import {
  getStockQuote,
  getDailyTimeSeries,
  searchStocks,
  StockQuote,
  TimeSeriesData,
  SearchResult,
} from '@/services/alphaVantage';

export function useStockQuote(symbol: string) {
  return useQuery<StockQuote | null>({
    queryKey: ['stockQuote', symbol],
    queryFn: () => getStockQuote(symbol),
    enabled: !!symbol,
    staleTime: 5 * 60 * 1000, // 5 minutos (cache)
  });
}

export function useDailyTimeSeries(
  symbol: string,
  outputSize: 'compact' | 'full' = 'compact'
) {
  return useQuery<TimeSeriesData[]>({
    queryKey: ['dailyTimeSeries', symbol, outputSize],
    queryFn: () => getDailyTimeSeries(symbol, outputSize),
    enabled: !!symbol,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

export function useStockSearch(keywords: string) {
  return useQuery<SearchResult[]>({
    queryKey: ['stockSearch', keywords],
    queryFn: () => searchStocks(keywords),
    enabled: keywords.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}
