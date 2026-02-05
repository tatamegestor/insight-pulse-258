import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface StockRanking {
  id: string;
  symbol: string;
  name: string;
  daily_change: number;
  weekly_change: number | null;
  monthly_change: number | null;
  rank_position: number;
  market: "BR" | "US";
  calculated_at: string;
}

export interface SystemLog {
  id: string;
  action: string;
  status: string;
  details: Record<string, unknown>;
  source: string;
  created_at: string;
}

// Buscar rankings do banco
export function useStockRankings(market?: "BR" | "US", limit = 10) {
  return useQuery({
    queryKey: ["stockRankings", market, limit],
    queryFn: async (): Promise<StockRanking[]> => {
      let query = supabase
        .from("stock_rankings")
        .select("*")
        .order("rank_position", { ascending: true })
        .limit(limit);

      if (market) {
        query = query.eq("market", market);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching rankings:", error);
        return [];
      }

      return (data as StockRanking[]) || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });
}

// Buscar top gainers (maiores altas)
export function useTopGainers(market?: "BR" | "US", limit = 5) {
  return useQuery({
    queryKey: ["topGainers", market, limit],
    queryFn: async (): Promise<StockRanking[]> => {
      let query = supabase
        .from("stock_rankings")
        .select("*")
        .order("daily_change", { ascending: false })
        .limit(limit);

      if (market) {
        query = query.eq("market", market);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching top gainers:", error);
        return [];
      }

      return (data as StockRanking[]) || [];
    },
    staleTime: 1000 * 60 * 5,
  });
}

// Buscar top losers (maiores baixas)
export function useTopLosers(market?: "BR" | "US", limit = 5) {
  return useQuery({
    queryKey: ["topLosers", market, limit],
    queryFn: async (): Promise<StockRanking[]> => {
      let query = supabase
        .from("stock_rankings")
        .select("*")
        .order("daily_change", { ascending: true })
        .limit(limit);

      if (market) {
        query = query.eq("market", market);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching top losers:", error);
        return [];
      }

      return (data as StockRanking[]) || [];
    },
    staleTime: 1000 * 60 * 5,
  });
}

// Buscar logs do sistema
export function useSystemLogs(limit = 20) {
  return useQuery({
    queryKey: ["systemLogs", limit],
    queryFn: async (): Promise<SystemLog[]> => {
      const { data, error } = await supabase
        .from("system_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Error fetching system logs:", error);
        return [];
      }

      return (data as SystemLog[]) || [];
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Buscar última sincronização
export function useLastSync() {
  return useQuery({
    queryKey: ["lastSync"],
    queryFn: async (): Promise<SystemLog | null> => {
      const { data, error } = await supabase
        .from("system_logs")
        .select("*")
        .eq("action", "SYNC_MARKET_DATA")
        .eq("status", "SUCCESS")
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) {
        console.error("Error fetching last sync:", error);
        return null;
      }

      return (data?.[0] as SystemLog) || null;
    },
    staleTime: 1000 * 60 * 2,
  });
}
