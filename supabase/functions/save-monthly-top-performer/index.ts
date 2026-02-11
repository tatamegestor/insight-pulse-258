import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-info, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface MonthlyTopPerformerData {
  symbol: string;
  name: string;
  price: number;
  monthlyChange: number;
  market: "BR" | "US";
  currency?: "BRL" | "USD";
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const data: MonthlyTopPerformerData = await req.json();

    // Validar dados obrigatórios
    if (!data.symbol || !data.name || data.price === undefined || data.monthlyChange === undefined || !data.market) {
      return new Response(
        JSON.stringify({
          error: "Dados incompletos. Obrigatórios: symbol, name, price, monthlyChange, market",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Salvando top performer mensal: ${data.symbol} (${data.market})`);

    // Deletar registros antigos para este mercado ou atualizar se existir o símbolo
    const { data: existing } = await supabase
      .from("monthly_top_performer")
      .select("id")
      .eq("market", data.market)
      .single();

    if (existing) {
      // Atualizar registro existente
      const { error: updateError } = await supabase
        .from("monthly_top_performer")
        .update({
          symbol: data.symbol,
          name: data.name,
          price: data.price,
          monthly_change: data.monthlyChange,
          currency: data.currency || "USD",
          updated_at: new Date().toISOString(),
        })
        .eq("market", data.market);

      if (updateError) {
        throw new Error(`Erro ao atualizar: ${updateError.message}`);
      }
    } else {
      // Inserir novo registro
      const { error: insertError } = await supabase
        .from("monthly_top_performer")
        .insert({
          symbol: data.symbol,
          name: data.name,
          price: data.price,
          monthly_change: data.monthlyChange,
          market: data.market,
          currency: data.currency || "USD",
        });

      if (insertError) {
        throw new Error(`Erro ao inserir: ${insertError.message}`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Top performer mensal atualizado: ${data.symbol}`,
        data: {
          symbol: data.symbol,
          name: data.name,
          price: data.price,
          monthlyChange: data.monthlyChange,
          market: data.market,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Erro:", error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Erro desconhecido",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
