import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const webhookUrl = Deno.env.get("N8N_WEBHOOK_URL");

    if (!webhookUrl) {
      console.error("N8N_WEBHOOK_URL secret not configured");
      return new Response(
        JSON.stringify({
          error: "Webhook não configurado",
          response: "O assistente ainda não está configurado. Configure a URL do webhook n8n.",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { message, sessionId, isActivePlan } = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: "Mensagem é obrigatória" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Processing message for session ${sessionId}: ${message.substring(0, 50)}... | isActivePlan: ${isActivePlan}`);

    // Call n8n webhook
    const n8nResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        sessionId,
        isActivePlan: !!isActivePlan,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!n8nResponse.ok) {
      console.error(`n8n returned status ${n8nResponse.status}`);
      return new Response(
        JSON.stringify({
          error: "Erro ao processar mensagem",
          response: "Não foi possível obter resposta do assistente.",
        }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data = await n8nResponse.json();
    
    // n8n can return response in different formats
    const responseText = data.response || data.output || data.message || data.text || JSON.stringify(data);

    console.log(`Response received: ${responseText.substring(0, 50)}...`);

    return new Response(
      JSON.stringify({ response: responseText }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Chat webhook error:", error);
    return new Response(
      JSON.stringify({
        error: "Erro interno",
        response: "Ocorreu um erro ao processar sua mensagem.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
