import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { MarketQuote } from '@/services/marketData';

export interface SearchStockResult {
  symbol: string;
  name: string;
  close: number | null;
  change: number | null;
  sector: string | null;
  type: string | null;
}

export interface EnrichedSearchResult {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  changeMonthly?: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  currency: string;
}

async function searchStocks(query: string): Promise<SearchStockResult[]> {
  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/search-stocks?query=${encodeURIComponent(query)}`,
    {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      },
    }
  );

  if (!response.ok) throw new Error('Search failed');
  const result = await response.json();
  return result.results || [];
}

async function fetchDetailedQuotes(symbols: string[]): Promise<EnrichedSearchResult[]> {
  if (symbols.length === 0) return [];

  const { data, error } = await supabase.functions.invoke('fetch-brazilian-stocks', {
    body: { symbols },
  });

  if (error) throw error;

  return (data?.quotes || []).map((q: MarketQuote) => ({
    symbol: q.symbol,
    name: q.name,
    price: q.price,
    changePercent: q.changePercent,
    changeMonthly: q.changeMonthly,
    volume: q.volume,
    high: q.high,
    low: q.low,
    open: q.open,
    previousClose: q.previousClose,
    currency: q.currency,
  }));
}

export function useSearchStocks(query: string) {
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  const searchQuery = useQuery({
    queryKey: ['searchStocks', debouncedQuery],
    queryFn: () => searchStocks(debouncedQuery),
    enabled: debouncedQuery.length >= 3,
    staleTime: 2 * 60 * 1000,
  });

  const symbols = (searchQuery.data || []).map(r => r.symbol);

  const detailsQuery = useQuery({
    queryKey: ['searchStocksDetails', symbols.sort().join(',')],
    queryFn: () => fetchDetailedQuotes(symbols),
    enabled: symbols.length > 0,
    staleTime: 2 * 60 * 1000,
  });

  return {
    data: searchQuery.data,
    enrichedData: detailsQuery.data || [],
    isLoading: searchQuery.isLoading,
    isLoadingDetails: detailsQuery.isLoading,
  };
}
