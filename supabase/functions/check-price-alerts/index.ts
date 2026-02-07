import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const n8nWebhookUrl = Deno.env.get("N8N_WEBHOOK_URL");

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Support GET (n8n polling) and POST (n8n trigger callback)
    let symbol: string | undefined;
    let current_price: number | undefined;
    let alert_id: string | undefined;

    if (req.method === "GET") {
      // GET request from n8n to fetch all active alerts
      const url = new URL(req.url);
      alert_id = url.searchParams.get("alert_id") || undefined;
      symbol = url.searchParams.get("symbol") || undefined;
    } else {
      // POST request with JSON body
      try {
        const body = await req.json();
        symbol = body.symbol;
        current_price = body.current_price;
        alert_id = body.alert_id;
      } catch {
        // Empty body = treat as listing request
      }
    }

    if (!symbol && !alert_id) {
      // If called without params, return all active alerts for n8n to check
      const { data: alerts, error } = await supabase
        .from("price_alerts")
        .select("*, profiles!price_alerts_user_id_fkey(phone_number, full_name)")
        .eq("is_active", true)
        .is("triggered_at", null);

      if (error) {
        // Fallback: query without join
        const { data: alertsOnly, error: err2 } = await supabase
          .from("price_alerts")
          .select("*")
          .eq("is_active", true)
          .is("triggered_at", null);

        if (err2) throw err2;

        // Fetch profiles separately
        const userIds = [...new Set(alertsOnly?.map(a => a.user_id) || [])];
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, phone_number, full_name")
          .in("user_id", userIds);

        const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

        const enriched = alertsOnly?.map(a => ({
          ...a,
          phone_number: profileMap.get(a.user_id)?.phone_number || null,
          full_name: profileMap.get(a.user_id)?.full_name || null,
        }));

        return new Response(JSON.stringify({ alerts: enriched }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ alerts }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Mark alert as triggered
    if (alert_id) {
      const { error: updateError } = await supabase
        .from("price_alerts")
        .update({ triggered_at: new Date().toISOString(), is_active: false })
        .eq("id", alert_id);

      if (updateError) throw updateError;

      return new Response(JSON.stringify({ success: true, message: "Alert marked as triggered" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
