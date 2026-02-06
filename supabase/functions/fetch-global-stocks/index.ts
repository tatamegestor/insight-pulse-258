import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const N8N_WEBHOOK_URL = "https://projeto-final.app.n8n.cloud/webhook/buscar-acoes-globais";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Fetching global stocks from n8n webhook...");
    const response = await fetch(N8N_WEBHOOK_URL, { method: "GET" });

    if (!response.ok) {
      throw new Error(`n8n webhook returned ${response.status}`);
    }

    const text = await response.text();
    console.log("n8n raw response:", text.substring(0, 500));

    if (!text || text.trim().length === 0) {
      return new Response(JSON.stringify({ quotes: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("Invalid JSON from n8n:", text.substring(0, 200));
      return new Response(JSON.stringify({ quotes: [], error: "Invalid JSON from webhook" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Normaliza: pode ser objeto único ou array
    const rawItems = Array.isArray(data) ? data : [data];

    const quotes = rawItems
      .filter((item: any) => item?.ticker)
      .map((item: any) => ({
        ticker: item.ticker,
        nome: item.nome || item.ticker,
        preco: item.preco,
        variacao_diaria: item.variacao_diaria,
        variacao_mensal: item.variacao_mensal,
      }));

    console.log(`Returning ${quotes.length} quotes`);

    return new Response(JSON.stringify({ quotes }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching global stocks:", error);
    return new Response(JSON.stringify({ quotes: [], error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
