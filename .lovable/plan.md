

# Adicionar variacao mensal real para acoes US

## Problema atual
A Edge Function `fetch-global-stocks` retorna `variacao_mensal: 0` para todas as acoes US, tanto no fallback do Twelve Data quanto no n8n. A aba "Acoes US" mostra 0.00% na coluna de variacao mensal.

## Solucao
Usar o endpoint `time_series` do Twelve Data para buscar o preco de ~1 mes atras e calcular a variacao percentual, seguindo a mesma logica usada para acoes BR (que busca historico de 1 mes via brapi).

## Etapas

### 1. Atualizar a Edge Function `fetch-global-stocks/index.ts`

Na funcao `fetchFromTwelveData()`:
- Apos buscar as cotacoes atuais via `/quote`, fazer uma segunda chamada ao endpoint `/time_series` com `interval=1day&outputsize=22` (aprox. 1 mes de pregoes) para os mesmos simbolos.
- Pegar o preco de fechamento mais antigo retornado e calcular: `((precoAtual - precoAntigo) / precoAntigo) * 100`.
- Preencher o campo `variacao_mensal` com esse valor.

### 2. Tambem tratar o caso do n8n
- Se o n8n retornar `variacao_mensal` como `undefined`, `null` ou `"---"`, converter para `0` para evitar erros no frontend.

## Detalhes tecnicos

### Chamada ao Twelve Data Time Series
```text
GET https://api.twelvedata.com/time_series?symbol=AAPL,MSFT,GOOGL,AMZN,TSLA&interval=1day&outputsize=22&apikey=...

Resposta:
{
  "AAPL": {
    "values": [
      { "datetime": "2025-02-07", "close": "227.63" },
      ...
      { "datetime": "2025-01-10", "close": "215.30" }  // ~1 mes atras
    ]
  }
}
```

### Calculo
- Preco atual: vem do `/quote` (campo `close`)
- Preco antigo: ultimo elemento do array `values` do `/time_series`
- `variacao_mensal = ((close_atual - close_antigo) / close_antigo) * 100`

### Impacto
- Apenas `supabase/functions/fetch-global-stocks/index.ts` sera modificado
- Nenhuma mudanca no frontend -- o campo `variacao_mensal` ja e exibido na tabela, so precisa receber o valor correto

