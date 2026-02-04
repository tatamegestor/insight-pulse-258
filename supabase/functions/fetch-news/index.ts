import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const NEWS_API_KEY = Deno.env.get('NEWS_API_KEY');
    
    if (!NEWS_API_KEY) {
      console.error('NEWS_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'News API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body for parameters
    let pageSize = 5;
    
    if (req.method === 'POST') {
      try {
        const body = await req.json();
        if (body.pageSize) pageSize = Math.min(body.pageSize, 20);
      } catch {
        // Use defaults if body parsing fails
      }
    }

    // Financial-focused search query
    const financialQuery = 'ibovespa OR "bolsa de valores" OR "mercado financeiro" OR selic OR "banco central" OR dólar OR petrobras OR vale OR itaú OR bradesco OR dividendos OR ações OR inflação';
    
    const url = `${NEWS_API_BASE_URL}/everything?q=${encodeURIComponent(financialQuery)}&language=pt&sortBy=publishedAt&pageSize=${pageSize * 2}&apiKey=${NEWS_API_KEY}`;
    
    console.log(`Fetching financial news, pageSize: ${pageSize}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`News API error [${response.status}]:`, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch news', details: errorText }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    
    // Filter articles that have images and limit to requested size
    const articles = (data.articles || [])
      .filter((article: any) => article.urlToImage)
      .slice(0, pageSize)
      .map((article: any) => ({
        source: {
          id: article.source?.id || null,
          name: article.source?.name || 'Unknown',
        },
        author: article.author || null,
        title: article.title || '',
        description: article.description || null,
        url: article.url || '',
        urlToImage: article.urlToImage || null,
        publishedAt: article.publishedAt || new Date().toISOString(),
        content: article.content || null,
      }));

    console.log(`Found ${articles.length} financial news articles`);

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
