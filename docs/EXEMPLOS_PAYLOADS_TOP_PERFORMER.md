# Exemplos de Payloads - Top Performer Mensal

## 1. Ativo Brasileiro com Variação Positiva

```bash
curl -X POST http://localhost:54321/functions/v1/save-monthly-top-performer \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "PETR4",
    "name": "Petrobras S.A.",
    "price": 28.45,
    "monthlyChange": 18.5,
    "market": "BR",
    "currency": "BRL"
  }'
```

## 2. Ativo Americano com Variação Positiva

```bash
curl -X POST http://localhost:54321/functions/v1/save-monthly-top-performer \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "NVDA",
    "name": "NVIDIA Corporation",
    "price": 875.30,
    "monthlyChange": 25.75,
    "market": "US",
    "currency": "USD"
  }'
```

## 3. Ativo com Variação Negativa

```bash
curl -X POST http://localhost:54321/functions/v1/save-monthly-top-performer \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "TSLA",
    "name": "Tesla Inc.",
    "price": 285.75,
    "monthlyChange": -12.3,
    "market": "US",
    "currency": "USD"
  }'
```

## 4. Payloads para n8n (HTTP Request Body)

### Para ativos US:
```json
{
  "symbol": "{{ $node['Stock API'].json.symbol }}",
  "name": "{{ $node['Stock API'].json.name }}",
  "price": {{ $node['Stock API'].json.price }},
  "monthlyChange": {{ $node['Stock API'].json.monthlyPercentChange }},
  "market": "US",
  "currency": "USD"
}
```

### Para ativos BR:
```json
{
  "symbol": "{{ $node['Stock API'].json.symbol }}",
  "name": "{{ $node['Stock API'].json.name }}",
  "price": {{ $node['Stock API'].json.price }},
  "monthlyChange": {{ $node['Stock API'].json.monthlyPercentChange }},
  "market": "BR",
  "currency": "BRL"
}
```

## 5. Respostas Esperadas

### Sucesso (201 Created ou 200 OK):
```json
{
  "success": true,
  "message": "Top performer mensal atualizado: PETR4",
  "data": {
    "symbol": "PETR4",
    "name": "Petrobras S.A.",
    "price": 28.45,
    "monthlyChange": 18.5,
    "market": "BR"
  }
}
```

### Erro - Campos Incompletos (400):
```json
{
  "error": "Dados incompletos. Obrigatórios: symbol, name, price, monthlyChange, market"
}
```

### Erro - Servidor (500):
```json
{
  "error": "Erro ao inserir: [mensagem do erro do Supabase]"
}
```

## 6. Teste com JavaScript/Node.js

```javascript
async function updateMonthlyTopPerformer(data) {
  const response = await fetch(
    'http://localhost:54321/functions/v1/save-monthly-top-performer',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        symbol: data.symbol,
        name: data.name,
        price: data.price,
        monthlyChange: data.monthlyChange,
        market: data.market,
        currency: data.currency || 'USD'
      })
    }
  );

  const result = await response.json();
  
  if (!response.ok) {
    console.error('Erro:', result.error);
    throw new Error(result.error);
  }

  console.log('Sucesso:', result.message);
  return result.data;
}

// Exemplo de uso:
updateMonthlyTopPerformer({
  symbol: 'AAPL',
  name: 'Apple Inc.',
  price: 150.25,
  monthlyChange: 15.75,
  market: 'US',
  currency: 'USD'
}).catch(err => console.error(err));
```

## 7. Teste com Python

```python
import requests
import json

def update_monthly_top_performer(data):
    url = 'http://localhost:54321/functions/v1/save-monthly-top-performer'
    headers = {'Content-Type': 'application/json'}
    
    response = requests.post(url, json=data, headers=headers)
    result = response.json()
    
    if response.status_code != 200:
        print(f"Erro: {result['error']}")
        raise Exception(result['error'])
    
    print(f"Sucesso: {result['message']}")
    return result['data']

# Exemplo de uso:
data = {
    'symbol': 'AAPL',
    'name': 'Apple Inc.',
    'price': 150.25,
    'monthlyChange': 15.75,
    'market': 'US',
    'currency': 'USD'
}

update_monthly_top_performer(data)
```

## 8. Verificar Dados Salvos

### Via SQL (Supabase):
```sql
SELECT * FROM monthly_top_performer ORDER BY updated_at DESC LIMIT 5;
```

### Via JavaScript no Frontend:
```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const { data } = await supabase
  .from('monthly_top_performer')
  .select('*')
  .order('updated_at', { ascending: false });

console.log(data);
```

---

## Dicas de Teste

1. **Teste local primeiro**: Use `supabase functions serve` e faça requisições com cURL
2. **Verifique o banco**: Confirme que os dados estão sendo salvos com a query SQL acima
3. **Teste com diferentes mercados**: Envie dados para BR e US separadamente
4. **Verifique o frontend**: Após salvar, recarregue a página do dashboard para ver a atualização
5. **Monitore logs**: Verifique os logs da Edge Function no Supabase para detalhes de erros
