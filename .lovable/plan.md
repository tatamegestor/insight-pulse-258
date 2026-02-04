# Plano: Dados de Mercado Reais com brapi.dev e Alpha Vantage

## ✅ IMPLEMENTADO

### Fase 1: Secrets e Edge Functions ✅
- [x] Secrets adicionados: `FMP_API_KEY`, `BRAPI_TOKEN`
- [x] Edge function `fetch-brazilian-stocks` criada (brapi.dev)
- [x] Edge function `fetch-us-stocks` criada (Alpha Vantage com fallback)

### Fase 2: Serviço Unificado no Frontend ✅
- [x] `src/services/marketData.ts` criado
- [x] `src/hooks/useMarketData.ts` criado

### Fase 3: Atualizar Componentes ✅
- [x] `MarketTicker.tsx` - Navbar com dados reais BR
- [x] `MarketOverview.tsx` - Tabs BR e US com dados reais
- [x] `KPICards.tsx` - KPIs com dados reais US
- [x] `MainChart.tsx` - Gráfico com dados reais
- [x] `Mercado.tsx` - Tabs BR e US separados
- [x] `AcaoDetalhes.tsx` - Detecta mercado e moeda automaticamente
- [x] `Carteira.tsx` - Preços reais com detecção de mercado

## Arquitetura Final

```
Frontend (React)
    │
    ├── src/services/marketData.ts
    │   ├── getBrazilianStocks() → Edge Function
    │   ├── getUSStocks() → Edge Function
    │   └── getStockHistory()
    │
    └── src/hooks/useMarketData.ts
        ├── useBrazilianStocks()
        ├── useUSStocks()
        ├── useMarketTicker()
        └── useMarketOverview()

Backend (Edge Functions)
    │
    ├── fetch-brazilian-stocks
    │   └── brapi.dev API (PETR4, VALE3, ITUB4, etc)
    │
    └── fetch-us-stocks
        └── Alpha Vantage API (AAPL, MSFT, GOOGL, etc)
        └── Fallback com dados mockados se rate limit
```

## APIs Utilizadas

| Mercado | API | Limite |
|---------|-----|--------|
| Brasil (B3) | brapi.dev | 15k req/mês com token |
| EUA (NASDAQ/NYSE) | Alpha Vantage | 25 req/dia (fallback disponível) |

## Notas
- FMP API key fornecida não funciona com endpoints atuais
- Alpha Vantage usada como alternativa para ações US
- Fallback com dados mockados quando rate limit atingido


