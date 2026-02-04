
# Plano: Migrar para Massive API (ex-Polygon.io)

## Resumo

Substituir Alpha Vantage pela **Massive API** (anteriormente Polygon.io) para dados de acoes americanas. A API oferece dados end-of-day gratuitos com limite muito maior (5 req/min vs 25/dia).

---

## Por que Massive API

| Caracteristica | Alpha Vantage | Massive (Polygon) |
|---------------|---------------|-------------------|
| Limite gratuito | 25 req/dia | 5 req/min (~7.200/dia) |
| Historico | 20 dias | 2 anos |
| Dados | 15-20 min delay | End-of-day |
| Batch requests | Nao | Nao (mas limite alto compensa) |

---

## Endpoints Necessarios

### 1. Previous Day Bar (cotacao atual)
```text
GET /v2/aggs/ticker/{symbol}/prev?adjusted=true&apiKey=KEY
```

Retorna:
```json
{
  "results": [{
    "T": "AAPL",      // ticker
    "o": 115.55,      // open
    "h": 117.59,      // high
    "l": 114.13,      // low
    "c": 115.97,      // close (preco atual)
    "v": 131704427,   // volume
    "t": 1605042000000 // timestamp
  }]
}
```

### 2. Custom Bars (historico)
```text
GET /v2/aggs/ticker/{symbol}/range/1/day/{from}/{to}?adjusted=true&apiKey=KEY
```

Retorna array de barras OHLCV para os ultimos 30 dias.

### 3. Ticker Overview (nome da empresa)
```text
GET /v3/reference/tickers/{symbol}?apiKey=KEY
```

Retorna nome completo da empresa para exibicao.

---

## Mudancas na Edge Function

### Arquivo: `supabase/functions/fetch-us-stocks/index.ts`

#### Alteracoes principais:

1. **Remover Alpha Vantage** - apagar codigo e chave hardcoded

2. **Adicionar Massive API**
   - Base URL: `https://api.massive.com` (ou `api.polygon.io`)
   - Usar secret `MASSIVE_API_KEY` (a ser criada)

3. **Nova funcao `fetchFromMassive(symbol)`**
   - Chamar `/v2/aggs/ticker/{symbol}/prev`
   - Parsear resposta: `results[0].c` = preco, `results[0].o` = open, etc

4. **Nova funcao `fetchHistoryFromMassive(symbol)`**
   - Chamar `/v2/aggs/ticker/{symbol}/range/1/day/{from}/{to}`
   - `from` = 30 dias atras, `to` = hoje

5. **Calcular change e changePercent**
   - A API retorna OHLCV mas nao retorna variacao diretamente
   - Calcular: `change = close - open`, `changePercent = (change / open) * 100`
   - Ou buscar tambem o dia anterior para comparar close com previousClose

6. **Manter fallback** - dados mockados apenas como ultimo recurso

7. **Manter cache de 5 minutos** - otimizar requisicoes

---

## Mapeamento de Campos

| Massive | MarketQuote |
|---------|-------------|
| T | symbol |
| (ticker details) | name |
| c | price |
| c - (prev close) | change |
| ((c - prev) / prev) * 100 | changePercent |
| v | volume |
| h | high |
| l | low |
| o | open |
| (dia anterior c) | previousClose |

---

## Secret a Criar

**MASSIVE_API_KEY**: A chave que o usuario forneceu: `9_BEyNCSjSEhim0qFP4yPsOmrDHIcxgu`

---

## Estrategia para Cotacao Completa

Para obter todos os campos (incluindo previousClose e variacao), precisamos:

1. Buscar `/v2/aggs/ticker/{symbol}/prev` - dados do dia anterior
2. Usar esses dados para mostrar o ultimo preco de fechamento

Como a API gratuita so tem end-of-day:
- `price` = close do dia anterior
- `previousClose` = close de 2 dias atras (requer 2a chamada)
- Alternativa: usar open do dia anterior como referencia para variacao

---

## Fluxo Simplificado

```text
1. Receber simbolos [AAPL, MSFT, GOOGL]
2. Verificar cache (5 min)
3. Para cada simbolo:
   a. GET /v2/aggs/ticker/{symbol}/prev
   b. Extrair OHLCV do results[0]
   c. Calcular variacao baseado em open
   d. Mapear para MarketQuote
4. Salvar no cache
5. Retornar quotes[]

Se historico solicitado:
6. GET /v2/aggs/ticker/{symbol}/range/1/day/{30 dias atras}/{hoje}
7. Mapear resultados para TimeSeriesData[]
```

---

## Ordem de Execucao

1. Adicionar secret `MASSIVE_API_KEY` com a chave fornecida
2. Reescrever `fetch-us-stocks/index.ts` para usar Massive API
3. Fazer deploy da edge function
4. Testar na pagina `/mercado`
5. Verificar dados reais aparecendo

---

## Resultado Esperado

- Acoes US (AAPL, MSFT, GOOGL, etc) com precos reais end-of-day
- Historico de 30 dias disponivel para graficos
- Cache de 5 minutos para otimizar requisicoes
- Sem erros de rate limit (7.200 req/dia vs 25)
