import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const N8N_WEBHOOK_URL = "https://projeto-final.app.n8n.cloud/webhook/buscar-acoes-globais";
const TWELVE_DATA_SYMBOLS = "AAPL,MSFT,GOOGL,AMZN,TSLA";

async function fetchFromN8n(): Promise<any[] | null> {
  try {
    console.log("Trying n8n webhook...");
    const response = await fetch(N8N_WEBHOOK_URL, { method: "GET" });
    if (!response.ok) {
      console.warn(`n8n returned ${response.status}`);
      return null;
    }
    const text = await response.text();
    if (!text || text.trim().length === 0) {
      console.warn("n8n returned empty response");
      return null;
    }
    const data = JSON.parse(text);
    let rawItems: any[] = [];
    const items = Array.isArray(data) ? data : [data];
    for (const item of items) {
      if (Array.isArray(item?.acoes)) {
        rawItems.push(...item.acoes);
      } else if (item?.ticker) {
        rawItems.push(item);
      }
    }
    const quotes = rawItems
      .filter((item: any) => item?.ticker)
      .map((item: any) => ({
        ticker: item.ticker,
        nome: item.nome || item.ticker,
        preco: item.preco,
        variacao_diaria: item.variacao_diaria,
        variacao_mensal: item.variacao_mensal,
      }));
    if (quotes.length === 0) {
      console.warn("n8n returned 0 valid quotes");
      return null;
    }
    console.log(`n8n success: ${quotes.length} quotes`);
    return quotes;
  } catch (err) {
    console.warn("n8n fetch failed:", String(err));
    return null;
  }
}

async function fetchFromTwelveData(): Promise<any[] | null> {
  const apiKey = Deno.env.get("TWELVE_DATA_API_KEY");
  if (!apiKey) {
    console.error("TWELVE_DATA_API_KEY not configured");
    return null;
  }
  try {
    console.log("Falling back to Twelve Data API...");
    const url = `https://api.twelvedata.com/quote?symbol=${TWELVE_DATA_SYMBOLS}&apikey=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Twelve Data returned ${response.status}`);
      return null;
    }
    const data = await response.json();
    console.log("Twelve Data response keys:", Object.keys(data));

    const quotes: any[] = [];
    for (const symbol of TWELVE_DATA_SYMBOLS.split(",")) {
      const item = data[symbol];
      if (!item || item.status === "error") continue;
      quotes.push({
        ticker: item.symbol || symbol,
        nome: item.name || symbol,
        preco: parseFloat(item.close) || 0,
        variacao_diaria: parseFloat(item.percent_change) || 0,
        variacao_mensal: 0,
      });
    }
    if (quotes.length === 0) {
      console.warn("Twelve Data returned 0 valid quotes");
      return null;
    }
    console.log(`Twelve Data success: ${quotes.length} quotes`);
    return quotes;
  } catch (err) {
    console.error("Twelve Data fetch failed:", String(err));
    return null;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Try n8n first (single attempt), then fallback to Twelve Data
    let quotes = await fetchFromN8n();
    if (!quotes) {
      quotes = await fetchFromTwelveData();
    }

    return new Response(JSON.stringify({ quotes: quotes || [] }), {
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
