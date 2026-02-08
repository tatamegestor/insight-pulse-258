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
    const GNEWS_API_KEY = Deno.env.get('GNEWS_API_KEY');
    
    if (!GNEWS_API_KEY) {
      console.error('GNEWS_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'GNews API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let pageSize = 5;
    
    if (req.method === 'POST') {
      try {
        const body = await req.json();
        if (body.pageSize) pageSize = Math.min(body.pageSize, 10);
      } catch {
        // Use defaults
      }
    }

    const query = 'ibovespa OR b3 OR investimentos OR selic OR dolar OR euro OR petr4 OR vale3 OR itub4';
    const url = `https://gnews.io/api/v4/search?lang=pt&q=${encodeURIComponent(query)}&max=${pageSize}&token=${GNEWS_API_KEY}`;
    
    console.log(`Fetching GNews, max: ${pageSize}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`GNews API error [${response.status}]:`, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch news', details: errorText }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    
    // Map GNews format to our NewsArticle format
    const articles = (data.articles || []).map((article: any) => ({
      source: {
        id: null,
        name: article.source?.name || 'Unknown',
      },
      author: null,
      title: article.title || '',
      description: article.description || null,
      url: article.url || '',
      urlToImage: article.image || null,
      publishedAt: article.publishedAt || new Date().toISOString(),
      content: article.content || null,
    }));

    console.log(`Found ${articles.length} articles from GNews`);

    return new Response(
      JSON.stringify({ articles, totalResults: articles.length }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error: unknown) {
    console.error('Error in fetch-news function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Internal server error', message: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
