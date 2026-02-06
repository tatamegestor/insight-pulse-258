import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface PriceAlert {
  id: string;
  user_id: string;
  symbol: string;
  name: string;
  target_price: number;
  direction: 'above' | 'below';
  is_active: boolean;
  triggered_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PriceAlertInput {
  symbol: string;
  name: string;
  target_price: number;
  direction: 'above' | 'below';
}

export function usePriceAlerts() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const alertsQuery = useQuery({
    queryKey: ['priceAlerts', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('price_alerts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as PriceAlert[];
    },
    enabled: !!user,
  });

  const createAlert = useMutation({
    mutationFn: async (input: PriceAlertInput) => {
      if (!user) throw new Error('Não autenticado');
      const { data, error } = await supabase
        .from('price_alerts')
        .insert({ ...input, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['priceAlerts'] }),
  });

  const toggleAlert = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('price_alerts')
        .update({ is_active })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['priceAlerts'] }),
  });

  const deleteAlert = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('price_alerts')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['priceAlerts'] }),
  });

  return {
    alerts: alertsQuery.data || [],
    isLoading: alertsQuery.isLoading,
    createAlert,
    toggleAlert,
    deleteAlert,
  };
}
