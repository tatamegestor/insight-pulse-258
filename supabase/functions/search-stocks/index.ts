import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const query = url.searchParams.get('query') || '';

    if (!query || query.length < 2) {
      return new Response(
        JSON.stringify({ results: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const BRAPI_TOKEN = Deno.env.get('BRAPI_TOKEN');
    let searchUrl = `https://brapi.dev/api/quote/list?search=${encodeURIComponent(query)}&limit=10`;
    if (BRAPI_TOKEN) {
      searchUrl += `&token=${BRAPI_TOKEN}`;
    }

    console.log(`Searching brapi.dev for: ${query}`);
    const response = await fetch(searchUrl);
    const data = await response.json();

    const results = (data.stocks || []).map((s: any) => ({
      symbol: s.stock,
      name: s.name || s.stock,
      close: s.close,
      change: s.change,
      sector: s.sector,
      type: s.type,
    }));

    return new Response(
      JSON.stringify({ results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Error in search-stocks:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
