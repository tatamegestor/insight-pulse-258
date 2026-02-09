import { useQuery } from '@tanstack/react-query';
import {
  getBrazilianStocks,
  getUSStocks,
  getStockQuote,
  getStockHistory,
  getMultipleQuotes,
  MarketQuote,
  TimeSeriesData,
  detectMarket,
} from '@/services/marketData';

const STALE_TIME = 5 * 60 * 1000; // 5 minutos

/**
 * Hook para buscar ações brasileiras
 */
export function useBrazilianStocks(symbols: string[]) {
  return useQuery<MarketQuote[]>({
    queryKey: ['brazilianStocks', symbols.sort().join(',')],
    queryFn: () => getBrazilianStocks(symbols),
    enabled: symbols.length > 0,
    staleTime: STALE_TIME,
  });
}

/**
 * Hook para buscar ações americanas
 */
export function useUSStocks(symbols: string[]) {
  return useQuery<MarketQuote[]>({
    queryKey: ['usStocks', symbols.sort().join(',')],
    queryFn: () => getUSStocks(symbols),
    enabled: symbols.length > 0,
    staleTime: STALE_TIME,
  });
}

/**
 * Hook para buscar cotação de uma única ação
 */
export function useStockQuote(symbol: string) {
  return useQuery<MarketQuote | null>({
    queryKey: ['stockQuote', symbol],
    queryFn: () => getStockQuote(symbol),
    enabled: !!symbol,
    staleTime: STALE_TIME,
  });
}

/**
 * Hook para buscar histórico de preços
 */
export function useStockHistory(symbol: string, market?: 'BR' | 'US') {
  return useQuery<TimeSeriesData[]>({
    queryKey: ['stockHistory', symbol, market],
    queryFn: () => getStockHistory(symbol, market),
    enabled: !!symbol,
    staleTime: STALE_TIME,
  });
}

/**
 * Hook para o ticker da navbar
 * Busca PETR4, VALE3, ITUB4, MGLU3, USD, EUR
 */
export function useMarketTicker() {
  const brSymbols = ['PETR4', 'VALE3', 'ITUB4', 'MGLU3', 'USDBRL', 'EURBRL'];
  
  return useQuery<MarketQuote[]>({
    queryKey: ['marketTicker'],
    queryFn: () => getBrazilianStocks(brSymbols),
    staleTime: STALE_TIME,
    refetchInterval: 5 * 60 * 1000, // Atualizar a cada 5 minutos
  });
}

/**
 * Hook para a visão geral do mercado (MarketOverview)
 */
export function useMarketOverview() {
  const brStocksSymbols = ['PETR4', 'VALE3', 'ITUB4', 'BBDC4', 'ABEV3'];
  const usStocksSymbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'];
  const indicesSymbols = ['^BVSP']; // IBOV via brapi

  const brStocks = useBrazilianStocks(brStocksSymbols);
  const usStocks = useUSStocks(usStocksSymbols);

  return {
    brStocks: {
      data: brStocks.data || [],
      isLoading: brStocks.isLoading,
      error: brStocks.error,
    },
    usStocks: {
      data: usStocks.data || [],
      isLoading: usStocks.isLoading,
      error: usStocks.error,
    },
    isLoading: brStocks.isLoading || usStocks.isLoading,
  };
}

/**
 * Hook para KPIs do dashboard
 */
export function useDashboardKPIs() {
  const symbols = ['AAPL', 'MSFT', 'GOOGL'];
  
  return useQuery<MarketQuote[]>({
    queryKey: ['dashboardKPIs', symbols.join(',')],
    queryFn: () => getUSStocks(symbols),
    staleTime: STALE_TIME,
  });
}

/**
 * Hook para gráfico principal do dashboard
 */
export function useMainChartData(symbol: string = 'AAPL') {
  const market = detectMarket(symbol);
  const quote = useStockQuote(symbol);
  const history = useStockHistory(symbol, market);

  return {
    quote: quote.data,
    history: history.data || [],
    isLoading: quote.isLoading || history.isLoading,
    error: quote.error || history.error,
  };
}

export { detectMarket };
