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
    const MAX_RETRIES = 3;
    let lastError = "";

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      console.log(`Attempt ${attempt}/${MAX_RETRIES}: Fetching global stocks from n8n...`);

      try {
        const response = await fetch(N8N_WEBHOOK_URL, { method: "GET" });

        if (!response.ok) {
          lastError = `n8n webhook returned ${response.status}`;
          console.warn(lastError);
          continue;
        }

        const text = await response.text();
        console.log(`Attempt ${attempt} raw response (first 300):`, text.substring(0, 300));

        if (!text || text.trim().length === 0) {
          lastError = "Empty response from n8n";
          console.warn(`Attempt ${attempt}: empty response, retrying...`);
          continue;
        }

        let data: any;
        try {
          data = JSON.parse(text);
        } catch {
          lastError = "Invalid JSON from n8n";
          console.warn(`Attempt ${attempt}: invalid JSON, retrying...`);
          continue;
        }

        // Normaliza: pode ser array com objeto { acoes: [...] } ou array direto de tickers
        let rawItems: any[] = [];
        const items = Array.isArray(data) ? data : [data];
        
        for (const item of items) {
          if (Array.isArray(item?.acoes)) {
            // Novo formato: [{ acoes: [...] }]
            rawItems.push(...item.acoes);
          } else if (item?.ticker) {
            // Formato antigo: objetos com ticker na raiz
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
          lastError = "Parsed 0 quotes from response";
          console.warn(`Attempt ${attempt}: no valid quotes, retrying...`);
          continue;
        }

        console.log(`Success on attempt ${attempt}: returning ${quotes.length} quotes`);
        return new Response(JSON.stringify({ quotes }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (err) {
        lastError = String(err);
        console.warn(`Attempt ${attempt} failed:`, lastError);
      }
    }

    console.error(`All ${MAX_RETRIES} attempts failed. Last error: ${lastError}`);
    return new Response(JSON.stringify({ quotes: [], error: lastError }), {
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
