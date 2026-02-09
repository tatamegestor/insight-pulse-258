import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

export interface SearchStockResult {
  symbol: string;
  name: string;
  close: number | null;
  change: number | null;
  sector: string | null;
  type: string | null;
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

export function useSearchStocks(query: string) {
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  return useQuery({
    queryKey: ['searchStocks', debouncedQuery],
    queryFn: () => searchStocks(debouncedQuery),
    enabled: debouncedQuery.length >= 3,
    staleTime: 2 * 60 * 1000,
  });
}
