import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  volume: number;
  market: "BR" | "US";
  currency: "BRL" | "USD";
}

interface SyncRequest {
  quotes: StockQuote[];
  source?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const { quotes, source = "n8n" }: SyncRequest = await req.json();

    if (!quotes || !Array.isArray(quotes) || quotes.length === 0) {
      throw new Error("No quotes provided");
    }

    console.log(`Syncing ${quotes.length} quotes from ${source}`);

    // 1. Insert quotes into stock_quotes table
    const quotesToInsert = quotes.map((q) => ({
      symbol: q.symbol,
      name: q.name,
      price: q.price,
      change_percent: q.changePercent,
      volume: q.volume,
      market: q.market,
      currency: q.currency,
      fetched_at: new Date().toISOString(),
    }));

    const { error: insertError } = await supabase
      .from("stock_quotes")
      .insert(quotesToInsert);

    if (insertError) {
      throw new Error(`Failed to insert quotes: ${insertError.message}`);
    }

    // 2. Calculate and update rankings
    const brQuotes = quotes.filter((q) => q.market === "BR");
    const usQuotes = quotes.filter((q) => q.market === "US");

    // Calculate rankings for each market
    const calculateRankings = async (
      marketQuotes: StockQuote[],
      market: "BR" | "US"
    ) => {
      if (marketQuotes.length === 0) return;

      // Sort by daily change (descending for gainers)
      const sorted = [...marketQuotes].sort(
        (a, b) => b.changePercent - a.changePercent
      );

      // Delete old rankings for this market
      await supabase.from("stock_rankings").delete().eq("market", market);

      // Insert new rankings
      const rankings = sorted.map((q, index) => ({
        symbol: q.symbol,
        name: q.name,
        daily_change: q.changePercent,
        weekly_change: null, // Will be calculated with historical data
        monthly_change: null, // Will be calculated with historical data
        rank_position: index + 1,
        market: market,
        calculated_at: new Date().toISOString(),
      }));

      const { error: rankError } = await supabase
        .from("stock_rankings")
        .insert(rankings);

      if (rankError) {
        console.error(`Failed to insert rankings for ${market}:`, rankError);
      }
    };

    await Promise.all([
      calculateRankings(brQuotes, "BR"),
      calculateRankings(usQuotes, "US"),
    ]);

    // 3. Calculate weekly and monthly changes using historical data
    await calculateHistoricalChanges(supabase);

    // 4. Log success
    await supabase.from("system_logs").insert({
      action: "SYNC_MARKET_DATA",
      status: "SUCCESS",
      details: {
        quotes_count: quotes.length,
        br_count: brQuotes.length,
        us_count: usQuotes.length,
      },
      source: source,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: `Synced ${quotes.length} quotes successfully`,
        br_count: brQuotes.length,
        us_count: usQuotes.length,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Sync error:", error);

    // Log error
    await supabase.from("system_logs").insert({
      action: "SYNC_MARKET_DATA",
      status: "ERROR",
      details: { error: error.message },
      source: "edge_function",
    });

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

async function calculateHistoricalChanges(supabase: any) {
  try {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get all current rankings
    const { data: rankings } = await supabase
      .from("stock_rankings")
      .select("*");

    if (!rankings || rankings.length === 0) return;

    for (const ranking of rankings) {
      // Get weekly historical price
      const { data: weeklyData } = await supabase
        .from("stock_quotes")
        .select("price")
        .eq("symbol", ranking.symbol)
        .lte("fetched_at", oneWeekAgo.toISOString())
        .order("fetched_at", { ascending: false })
        .limit(1);

      // Get monthly historical price
      const { data: monthlyData } = await supabase
        .from("stock_quotes")
        .select("price")
        .eq("symbol", ranking.symbol)
        .lte("fetched_at", oneMonthAgo.toISOString())
        .order("fetched_at", { ascending: false })
        .limit(1);

      // Get current price
      const { data: currentData } = await supabase
        .from("stock_quotes")
        .select("price")
        .eq("symbol", ranking.symbol)
        .order("fetched_at", { ascending: false })
        .limit(1);

      if (currentData && currentData.length > 0) {
        const currentPrice = currentData[0].price;
        let weeklyChange = null;
        let monthlyChange = null;

        if (weeklyData && weeklyData.length > 0) {
          weeklyChange =
            ((currentPrice - weeklyData[0].price) / weeklyData[0].price) * 100;
        }

        if (monthlyData && monthlyData.length > 0) {
          monthlyChange =
            ((currentPrice - monthlyData[0].price) / monthlyData[0].price) *
            100;
        }

        // Update ranking with historical changes
        await supabase
          .from("stock_rankings")
          .update({
            weekly_change: weeklyChange,
            monthly_change: monthlyChange,
          })
          .eq("id", ranking.id);
      }
    }
  } catch (error) {
    console.error("Error calculating historical changes:", error);
  }
}
