import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DailyInsight {
  id: string;
  content: string;
  sentiment: "otimista" | "neutro" | "pessimista";
  market: string;
  generated_at: string;
  created_at: string;
}

export function useDailyInsight() {
  return useQuery({
    queryKey: ["dailyInsight"],
    queryFn: async (): Promise<DailyInsight | null> => {
      const { data, error } = await supabase
        .from("daily_insights")
        .select("*")
        .order("generated_at", { ascending: false })
        .limit(1);

      if (error) {
        console.error("Error fetching daily insight:", error);
        return null;
      }

      return (data?.[0] as DailyInsight) || null;
    },
    staleTime: 1000 * 60 * 30, // Cache 30 minutos
    refetchInterval: 1000 * 60 * 15, // Refetch a cada 15 min
  });
}
