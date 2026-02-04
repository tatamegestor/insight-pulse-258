import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface PortfolioItem {
  id: string;
  user_id: string;
  symbol: string;
  name: string;
  quantity: number;
  avg_price: number;
  logo: string;
  created_at: string;
  updated_at: string;
}

export interface PortfolioInput {
  symbol: string;
  name: string;
  quantity: number;
  avg_price: number;
  logo?: string;
}

export function usePortfolio() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const portfolioQuery = useQuery({
    queryKey: ['portfolio', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PortfolioItem[];
    },
    enabled: !!user,
  });

  const addStock = useMutation({
    mutationFn: async (input: PortfolioInput) => {
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('portfolio')
        .insert({
          user_id: user.id,
          symbol: input.symbol.toUpperCase(),
          name: input.name,
          quantity: input.quantity,
          avg_price: input.avg_price,
          logo: input.logo || '📈',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio', user?.id] });
    },
  });

  const updateStock = useMutation({
    mutationFn: async ({ id, ...input }: PortfolioInput & { id: string }) => {
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('portfolio')
        .update({
          symbol: input.symbol.toUpperCase(),
          name: input.name,
          quantity: input.quantity,
          avg_price: input.avg_price,
          logo: input.logo,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio', user?.id] });
    },
  });

  const deleteStock = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('portfolio')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio', user?.id] });
    },
  });

  return {
    portfolio: portfolioQuery.data || [],
    isLoading: portfolioQuery.isLoading,
    error: portfolioQuery.error,
    addStock,
    updateStock,
    deleteStock,
  };
}
