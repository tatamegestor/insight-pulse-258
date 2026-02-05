
# Plano: Edge Function Simples para Receber Insight do n8n

## Resumo

Criar uma edge function que **apenas recebe** o insight gerado pelo GPT no n8n e salva no banco de dados. O n8n sera responsavel por chamar o GPT e formatar a resposta.

---

## Arquitetura

```text
[n8n Workflow]
      |
      ├── Schedule Trigger (3x ao dia)
      ├── HTTP Request (buscar dados do mercado)
      ├── OpenAI Node (GPT gera insight)
      ├── Code Node (formatar payload)
      |
      v
[Edge Function: save-daily-insight]
      |
      ├── Recebe: { content, sentiment, market }
      ├── Salva em daily_insights
      ├── Registra log em system_logs
      |
      v
[Frontend Dashboard]
      |
      └── useDailyInsight hook busca e exibe
```

---

## 1. Banco de Dados

### Nova Tabela: `daily_insights`

| Coluna | Tipo | Descricao |
|--------|------|-----------|
| id | uuid (PK) | Identificador unico |
| content | text | Texto do insight gerado pelo GPT |
| sentiment | text | otimista, neutro, pessimista |
| market | text | BR, US ou BOTH |
| generated_at | timestamp | Quando foi gerado |
| created_at | timestamp | Timestamp de criacao |

**RLS**: Leitura publica (SELECT para todos).

---

## 2. Edge Function: `save-daily-insight`

### Payload esperado do n8n:

```json
{
  "content": "O mercado brasileiro apresenta tendencia de alta...",
  "sentiment": "otimista",
  "market": "BOTH"
}
```

### Codigo da Edge Function:

```typescript
// supabase/functions/save-daily-insight/index.ts

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, ...",
};

interface InsightRequest {
  content: string;
  sentiment: "otimista" | "neutro" | "pessimista";
  market?: "BR" | "US" | "BOTH";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const { content, sentiment, market = "BOTH" }: InsightRequest = await req.json();

    if (!content || !sentiment) {
      throw new Error("content and sentiment are required");
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

    if (error) throw error;

    // 2. Registrar log de sucesso
    await supabase.from("system_logs").insert({
      action: "SAVE_DAILY_INSIGHT",
      status: "SUCCESS",
      details: { insight_id: data.id, sentiment, market },
      source: "n8n",
    });

    return new Response(
      JSON.stringify({ success: true, insight: data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    // Log de erro
    await supabase.from("system_logs").insert({
      action: "SAVE_DAILY_INSIGHT",
      status: "ERROR",
      details: { error: error.message },
      source: "n8n",
    });

    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
```

---

## 3. Frontend

### Novo Hook: `useDailyInsight`

```typescript
// src/hooks/useDailyInsight.ts
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DailyInsight {
  id: string;
  content: string;
  sentiment: "otimista" | "neutro" | "pessimista";
  market: string;
  generated_at: string;
  created_at: string;
}

export function useDailyInsight() {
  return useQuery({
    queryKey: ["dailyInsight"],
    queryFn: async (): Promise<DailyInsight | null> => {
      const { data, error } = await supabase
        .from("daily_insights")
        .select("*")
        .order("generated_at", { ascending: false })
        .limit(1);

      if (error) {
        console.error("Error fetching daily insight:", error);
        return null;
      }

      return data?.[0] || null;
    },
    staleTime: 1000 * 60 * 30, // Cache 30 minutos
    refetchInterval: 1000 * 60 * 15, // Refetch a cada 15 min
  });
}
```

### Componente Atualizado: `AIInsightCard`

Modificacoes:
- Importar e usar `useDailyInsight`
- Substituir texto estatico por dados do banco
- Mostrar sentimento com cores dinamicas
- Exibir tempo desde ultima atualizacao (formatRelative)
- Estado de loading com skeleton

---

## 4. Configuracao n8n

### Workflow: "Gerar e Salvar Insight Diario"

**Nos do Workflow:**

1. **Schedule Trigger**
   - Cron: `0 10,14,17 * * 1-5` (10h, 14h, 17h dias uteis)

2. **HTTP Request** (buscar dados do mercado - opcional)
   - Pode buscar do seu banco ou de APIs externas

3. **OpenAI Node** (GPT)
   - Model: gpt-4 ou gpt-3.5-turbo
   - Prompt:
   ```text
   Voce e um analista de mercado financeiro.
   Gere um insight conciso (3 frases) sobre o mercado de acoes hoje.
   Inclua tendencia geral, destaque 1-2 acoes, e possivel direcao futura.
   Responda em portugues brasileiro.
   ```

4. **Code Node** (formatar payload)
   ```javascript
   const response = $input.first().json.message.content;
   
   // Detectar sentimento baseado em palavras-chave
   let sentiment = "neutro";
   if (response.toLowerCase().includes("alta") || 
       response.toLowerCase().includes("otimista") ||
       response.toLowerCase().includes("positivo")) {
     sentiment = "otimista";
   } else if (response.toLowerCase().includes("baixa") || 
              response.toLowerCase().includes("pessimista") ||
              response.toLowerCase().includes("negativo")) {
     sentiment = "pessimista";
   }
   
   return {
     json: {
       content: response,
       sentiment: sentiment,
       market: "BOTH"
     }
   };
   ```

5. **HTTP Request** (salvar no banco)
   - Method: POST
   - URL: `https://zwlvmzsfcvomjckvvknn.supabase.co/functions/v1/save-daily-insight`
   - Headers:
     - `Authorization`: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (anon key)
     - `Content-Type`: `application/json`
   - Body: `{{ $json }}` (output do Code Node)

---

## 5. Arquivos a Criar

| Arquivo | Descricao |
|---------|-----------|
| `supabase/functions/save-daily-insight/index.ts` | Edge function para salvar insight |
| `src/hooks/useDailyInsight.ts` | Hook para buscar insight do banco |

## 6. Arquivos a Modificar

| Arquivo | Alteracao |
|---------|-----------|
| `src/components/dashboard/AIInsightCard.tsx` | Usar dados reais do hook |

## 7. Migration SQL

```sql
-- Criar tabela daily_insights
CREATE TABLE public.daily_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  sentiment text NOT NULL DEFAULT 'neutro',
  market text NOT NULL DEFAULT 'BOTH',
  generated_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.daily_insights ENABLE ROW LEVEL SECURITY;

-- Politica: Todos podem ler
CREATE POLICY "Todos podem ler insights" 
  ON public.daily_insights 
  FOR SELECT 
  USING (true);
```

---

## 6. Ordem de Implementacao

| Ordem | Tarefa | Tempo |
|-------|--------|-------|
| 1 | Criar tabela `daily_insights` (migration) | 5 min |
| 2 | Criar edge function `save-daily-insight` | 10 min |
| 3 | Criar hook `useDailyInsight` | 5 min |
| 4 | Atualizar `AIInsightCard` com dados reais | 10 min |
| 5 | Configurar workflow n8n com OpenAI | 15 min |
| 6 | Testar fluxo completo | 5 min |

**Tempo total estimado**: ~50 minutos

---

## 7. Teste da Edge Function

### Via cURL:

```bash
curl -X POST \
  'https://zwlvmzsfcvomjckvvknn.supabase.co/functions/v1/save-daily-insight' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
  -H 'Content-Type: application/json' \
  -d '{
    "content": "O mercado brasileiro opera em alta nesta sessao...",
    "sentiment": "otimista",
    "market": "BOTH"
  }'
```

### Resposta esperada:

```json
{
  "success": true,
  "insight": {
    "id": "uuid-aqui",
    "content": "O mercado brasileiro opera em alta...",
    "sentiment": "otimista",
    "market": "BOTH",
    "generated_at": "2026-02-05T14:30:00Z"
  }
}
```
