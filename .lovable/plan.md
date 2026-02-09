

# Refatorar Mercado + Detalhes com dados reais completos

## Resumo

A tela de Mercado e a pagina de Detalhes da Acao serao completamente refatoradas para usar dados reais vindos da tabela `stock_prices` (alimentada pelo workflow n8n), incluindo grafico historico real, variacao mensal, insights gerados por IA e busca por sigla/nome.

## O que muda

### Tela de Mercado (`/mercado`)
- Remover listas hardcoded de acoes (5 BR + 6 US fixos)
- Buscar todas as acoes da tabela `stock_prices` (15 acoes monitoradas pelo n8n)
- Separar BR/US pela coluna `currency` (BRL = Brasil, USD = EUA)
- Adicionar coluna **Var. Mensal** na tabela
- Mostrar **trend emoji** ao lado do nome
- Busca filtra por `symbol`, `short_name` ou `long_name`
- Logo real via `logo_url` do banco (quando disponivel)

### Tela de Detalhes (`/acao/:id`)
- Buscar dados da tabela `stock_prices` como fonte primaria (preco, insight, trend, 52-week, P/E, market cap, etc.)
- **Grafico com dados reais**: para acoes BR, buscar historico de 1 mes via brapi.dev (`range=1mo`); para US, usar historico do Twelve Data ou Polygon
- Exibir `auto_insight` real da IA (vindo do n8n) em vez de insights gerados localmente
- Mostrar metricas adicionais: `volatility_level`, `range_position`, `market_cap`, `price_earnings`, `fifty_two_week_high/low`
- Tooltip do grafico mostra o simbolo de moeda correto (R$ ou $)

### Nova Edge Function: `search-stocks`
- Recebe parametro `query`
- Busca na brapi.dev: `https://brapi.dev/api/quote/list?search={query}&token=...`
- Permite buscar qualquer acao BR disponivel na brapi, alem das monitoradas

### Novo hook: `src/hooks/useStockPrices.ts`
- Busca registros mais recentes de cada symbol na tabela `stock_prices`
- Separa por mercado (BRL/USD)
- Usado na tela de Mercado

---

## Detalhes tecnicos

### Hook `useStockPrices`
```text
Query: SELECT DISTINCT ON (symbol) * FROM stock_prices ORDER BY symbol, created_at DESC

Retorna: lista de stock_prices agrupada pelo registro mais recente de cada symbol
Separacao: currency = 'BRL' -> BR, currency = 'USD' -> US
```

### Grafico de detalhes (dados reais)
- **Acoes BR**: chamar `fetch-brazilian-stocks` com `range=1mo&interval=1d` para obter `historicalDataPrice`, que ja retorna array com datas e precos de fechamento
- **Acoes US**: chamar `fetch-us-stocks` com `withHistory=true` para obter dados do Polygon.io (30 dias)
- O grafico exibira esses dados reais em vez de series vazias ou fallback

### Edge Function `search-stocks`
```text
GET /search-stocks?query=PETR

Chama: https://brapi.dev/api/quote/list?search=PETR&token=...
Retorna: [{ symbol: "PETR4", name: "Petrobras PN", ... }]
```

### Pagina de Detalhes - dados enriquecidos
A pagina AcaoDetalhes passara a exibir:
- `auto_insight` do banco (insight real gerado pela IA no workflow)
- `trend_emoji` + `trend` (ex: "alta", "estavel")
- `volatility_level` (baixa, media, alta)
- `range_position` (posicao no range de 52 semanas)
- `market_cap` e `price_earnings` (P/L)
- `fifty_two_week_high` e `fifty_two_week_low` reais

### Arquivos impactados
1. `src/hooks/useStockPrices.ts` -- novo hook
2. `src/pages/Mercado.tsx` -- refatoracao completa
3. `src/pages/AcaoDetalhes.tsx` -- refatoracao completa com grafico real e insights da IA
4. `supabase/functions/search-stocks/index.ts` -- nova Edge Function
5. `src/services/marketData.ts` -- ajustes menores para historico BR

