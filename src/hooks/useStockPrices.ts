import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type StockPrice = Tables<'stock_prices'>;

/**
 * Busca os registros mais recentes de cada symbol na tabela stock_prices
 */
async function fetchLatestStockPrices(): Promise<StockPrice[]> {
  // Fetch all records ordered by created_at desc, then deduplicate in JS
  const { data, error } = await supabase
    .from('stock_prices')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Keep only the most recent record per symbol
  const seen = new Set<string>();
  const latest: StockPrice[] = [];
  for (const row of data || []) {
    if (!seen.has(row.symbol)) {
      seen.add(row.symbol);
      latest.push(row);
    }
  }
  return latest;
}

/**
 * Busca dados de um symbol específico
 */
async function fetchStockBySymbol(symbol: string): Promise<StockPrice | null> {
  const { data, error } = await supabase
    .from('stock_prices')
    .select('*')
    .eq('symbol', symbol)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

const STALE_TIME = 5 * 60 * 1000;

export function useStockPrices() {
  return useQuery({
    queryKey: ['stockPrices'],
    queryFn: fetchLatestStockPrices,
    staleTime: STALE_TIME,
    select: (data) => {
      const br = data.filter(s => s.currency === 'BRL');
      const us = data.filter(s => s.currency === 'USD');
      return { all: data, br, us };
    },
  });
}

export function useStockPrice(symbol: string) {
  return useQuery({
    queryKey: ['stockPrice', symbol],
    queryFn: () => fetchStockBySymbol(symbol),
    enabled: !!symbol,
    staleTime: STALE_TIME,
  });
}
