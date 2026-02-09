

# Corrigir aba "Acoes US" - Fallback direto para Twelve Data API

## Problema
O webhook do n8n (`buscar-acoes-globais`) retorna respostas vazias com frequencia, fazendo a aba "Acoes US" mostrar "Dados nao disponiveis". Os logs confirmam que em muitas tentativas todas as 3 retries falham com "Empty response from n8n".

## Solucao
Atualizar a Edge Function `fetch-global-stocks` para chamar a **Twelve Data API diretamente** como fallback quando o n8n falhar. A API key ja esta no workflow n8n que voce compartilhou (`9610af1956df4e569bd15031e497a846`).

## Etapas

### 1. Salvar a API key do Twelve Data como secret
- Adicionar o secret `TWELVE_DATA_API_KEY` com o valor da chave que esta no workflow n8n.

### 2. Atualizar a Edge Function `fetch-global-stocks`
- Manter a tentativa via n8n como fonte primaria (1 tentativa apenas para nao atrasar)
- Se falhar, chamar diretamente: `https://api.twelvedata.com/quote?symbol=AAPL,MSFT,GOOGL,AMZN,TSLA&apikey=...`
- Mapear os campos da resposta do Twelve Data para o formato esperado:

```text
Twelve Data response:
{
  "AAPL": {
    "symbol": "AAPL",
    "name": "Apple Inc",
    "close": "278.12",
    "percent_change": "0.80",
    ...
  }
}

Formato de saida:
{
  ticker: "AAPL",
  nome: "Apple Inc.",
  preco: "US$ 278.12",
  variacao_diaria: "0.80%",
  variacao_mensal: "---"
}
```

### 3. Corrigir a conversao de dados no frontend
- No `n8nToMarketQuote` em `src/services/marketData.ts`, o campo `changePercent` esta sendo calculado incorretamente. O `variacao_diaria` ja e uma porcentagem (ex: 0.80), mas o codigo faz `(variacao_diaria / preco) * 100` como se fosse um valor absoluto.
- Corrigir para usar `variacao_diaria` diretamente como `changePercent` e calcular `change` (valor absoluto) a partir do preco.

## Detalhes tecnicos

### Edge Function (fetch-global-stocks/index.ts)
- Reduzir retries do n8n de 3 para 1
- Adicionar funcao `fetchFromTwelveData()` que chama a API diretamente
- Usar `Deno.env.get("TWELVE_DATA_API_KEY")` para a chave
- Processar a resposta do Twelve Data no mesmo formato de saida

### Frontend (src/services/marketData.ts)
- `n8nToMarketQuote`: corrigir mapeamento de `change` e `changePercent`

## Resultado esperado
A aba "Acoes US" sempre mostrara dados, mesmo quando o n8n estiver instavel, pois a Edge Function chamara a Twelve Data API diretamente como fallback.

