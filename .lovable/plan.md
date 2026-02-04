

# Plano: Dados de Mercado Reais com brapi.dev e FMP

## Resumo

Este plano substitui todos os dados mockados por dados reais usando duas APIs:
- **brapi.dev** - Acoes brasileiras (PETR4, VALE3, ITUB4, MGLU3) + indices + cambio
- **Financial Modeling Prep (FMP)** - Acoes americanas (NASDAQ/NYSE)

As chaves de API fornecidas serao armazenadas como secrets no backend.

---

## Componentes Afetados

| Local | Dados Atuais | Solucao |
|-------|--------------|---------|
| `MarketTicker.tsx` (navbar) | 8 tickers mockados | Dados reais via edge functions |
| `MarketOverview.tsx` | Indices, acoes BR, crypto mockados | Dados reais BR + US |
| `KPICards.tsx` | AAPL, MSFT, GOOGL via Alpha Vantage | Manter US via FMP |
| `MainChart.tsx` | AAPL via Alpha Vantage | Manter US via FMP |
| `Mercado.tsx` | 6 acoes US via Alpha Vantage | BR + US separados |
| `Carteira.tsx` | Precos via Alpha Vantage | FMP para US |
| `AcaoDetalhes.tsx` | Alpha Vantage | Detectar BR/US automaticamente |

---

## Implementacao

### Fase 1: Secrets e Edge Functions

**1.1 Adicionar Secrets**
- `FMP_API_KEY`: FIadOZn7UD2JxvkScaoXAuRZUpuMVXKb
- `BRAPI_TOKEN`: 8pPsx56CGS2WDFgAjnKQvo

**1.2 Criar Edge Function: fetch-brazilian-stocks**

Arquivo: `supabase/functions/fetch-brazilian-stocks/index.ts`

Funcionalidades:
- Endpoint POST que aceita lista de simbolos
- Chama brapi.dev/api/quote/{simbolos}
- Implementa cache de 5 minutos em memoria
- Retorna formato padronizado

Dados disponiveis via brapi:
- Acoes: PETR4, VALE3, ITUB4, BBDC4, ABEV3, etc
- Indices: IBOV, IFIX
- Cambio: USD (dolar), EUR (euro)
- Crypto: BTC, ETH

**1.3 Criar Edge Function: fetch-us-stocks**

Arquivo: `supabase/functions/fetch-us-stocks/index.ts`

Funcionalidades:
- Endpoint POST que aceita lista de simbolos
- Chama FMP /api/v3/quote/{simbolos}
- Suporte a batch (multiplos simbolos por request)
- Cache de 5 minutos
- Historico opcional via /api/v3/historical-price-full

---

### Fase 2: Servico Unificado no Frontend

**2.1 Criar src/services/marketData.ts**

```text
Funcoes exportadas:
- getBrazilianStocks(symbols[]) -> StockQuote[]
- getUSStocks(symbols[]) -> StockQuote[]
- getStockHistory(symbol, market) -> TimeSeriesData[]
- detectMarket(symbol) -> 'BR' | 'US'
```

Interface padronizada:
```typescript
interface MarketQuote {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  high: number
  low: number
  open: number
  previousClose: number
  market: 'BR' | 'US'
  currency: 'BRL' | 'USD'
  updatedAt: string
}
```

**2.2 Criar src/hooks/useMarketData.ts**

Hooks:
- `useBrazilianStocks(symbols)` - React Query wrapper
- `useUSStocks(symbols)` - React Query wrapper
- `useMarketTicker()` - Dados para a navbar (BR + cambio + indices)
- `useMarketOverview()` - Dados para tabela de mercados

---

### Fase 3: Atualizar Componentes

**3.1 MarketTicker.tsx**

Antes (mockado):
```typescript
const tickers = [
  { symbol: "IBOV", value: "128.450", change: "+1.24%" },
  // ... mais 7 mockados
];
```

Depois:
- Buscar PETR4, VALE3, ITUB4, MGLU3 via brapi
- Buscar USD, EUR via brapi
- Manter animacao de scroll
- Loading skeleton enquanto carrega

**3.2 MarketOverview.tsx**

Antes: 3 tabs com dados mockados (indices, acoes, crypto)

Depois:
- Tab "Acoes BR": PETR4, VALE3, ITUB4, BBDC4, ABEV3 (brapi real)
- Tab "Acoes US": AAPL, MSFT, GOOGL, AMZN, TSLA (FMP real)
- Tab "Indices": IBOV (brapi), S&P500, Nasdaq (FMP)
- Remover crypto ou manter mockado (brapi nao tem crypto gratis)

**3.3 KPICards.tsx e MainChart.tsx**

- Substituir Alpha Vantage por FMP
- Manter mesma logica de exibicao
- Cache de 5 minutos via React Query

**3.4 Mercado.tsx**

Antes: Lista de 6 acoes US

Depois:
- Duas secoes: "Acoes Brasileiras" e "Acoes Americanas"
- Tab para alternar entre mercados
- Dados reais de ambas APIs

**3.5 AcaoDetalhes.tsx**

- Detectar mercado pelo simbolo (termina em numero = BR)
- Chamar edge function correta
- Adaptar moeda exibida (R$ ou $)

**3.6 Carteira.tsx**

- Detectar mercado de cada ativo
- Buscar preco atual na API correta

---

### Fase 4: Remover Codigo Antigo

- Remover `src/services/alphaVantage.ts`
- Atualizar imports em todos os arquivos
- Remover hooks antigos de `useStockData.ts`

---

## Limites das APIs

| API | Limite Gratuito | Estrategia |
|-----|-----------------|------------|
| brapi.dev | 4 acoes gratis sem token, 15k req/mes com token | Usar token fornecido |
| FMP | 250 req/dia | Batch requests + cache 5min |

---

## Ordem de Execucao

1. Adicionar secrets (FMP_API_KEY, BRAPI_TOKEN)
2. Criar edge function fetch-brazilian-stocks
3. Criar edge function fetch-us-stocks
4. Criar servico marketData.ts
5. Criar hook useMarketData.ts
6. Atualizar MarketTicker.tsx (navbar)
7. Atualizar MarketOverview.tsx
8. Atualizar KPICards.tsx
9. Atualizar MainChart.tsx
10. Atualizar Mercado.tsx
11. Atualizar AcaoDetalhes.tsx
12. Atualizar Carteira.tsx
13. Remover alphaVantage.ts e useStockData.ts
14. Testar fluxo completo

---

## Resultado Esperado

- Navbar mostrando PETR4, VALE3, ITUB4, MGLU3, USD, EUR com precos reais
- Pagina de Mercado com acoes BR e US reais
- Dashboard com KPIs e grafico de dados reais
- Carteira calculando lucro/prejuizo com precos atualizados
- Detalhes de acao com historico real

