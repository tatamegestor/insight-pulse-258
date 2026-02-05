import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface InsightRequest {
  content: string;
  sentiment: "otimista" | "neutro" | "pessimista";
  market?: "BR" | "US" | "BOTH";
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !supabaseServiceKey) {
    return new Response(
      JSON.stringify({ success: false, error: "Missing Supabase configuration" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const body = await req.json();
    const { content, sentiment, market = "BOTH" }: InsightRequest = body;

    // Validação
    if (!content || !sentiment) {
      throw new Error("content and sentiment are required");
    }

    const validSentiments = ["otimista", "neutro", "pessimista"];
    if (!validSentiments.includes(sentiment)) {
      throw new Error(`sentiment must be one of: ${validSentiments.join(", ")}`);
    }

    const validMarkets = ["BR", "US", "BOTH"];
    if (!validMarkets.includes(market)) {
      throw new Error(`market must be one of: ${validMarkets.join(", ")}`);
    }

    // 1. Salvar insight no banco
    const { data, error } = await supabase
      .from("daily_insights")
      .insert({
        content,
        sentiment,
        market,
        generated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Database insert error:", error);
      throw new Error(`Database error: ${error.message}`);
    }

    // 2. Registrar log de sucesso
    await supabase.from("system_logs").insert({
      action: "SAVE_DAILY_INSIGHT",
      status: "SUCCESS",
      details: { insight_id: data.id, sentiment, market },
      source: "n8n",
    });

    console.log("Daily insight saved successfully:", data.id);

    return new Response(
      JSON.stringify({ success: true, insight: data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error saving daily insight:", errorMessage);

    // Log de erro
    try {
      await supabase.from("system_logs").insert({
        action: "SAVE_DAILY_INSIGHT",
        status: "ERROR",
        details: { error: errorMessage },
        source: "n8n",
      });
    } catch (logError) {
      console.error("Failed to log error:", logError);
    }

    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
