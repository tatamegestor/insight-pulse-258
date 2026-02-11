# Integração - Top Performer Mensal

## Resumo das Mudanças

### 1. **Nova Tabela no Banco de Dados**
- Criada tabela `monthly_top_performer` para armazenar o ativo com maior variação mensal
- Arquivo: `supabase/migrations/20260210_create_monthly_top_performer.sql`

### 2. **Nova Edge Function**
- Criada função `save-monthly-top-performer` para receber dados do n8n
- Caminho: `supabase/functions/save-monthly-top-performer/index.ts`

### 3. **Frontend - Hook**
- Adicionado hook `useMonthlyTopPerformer()` em `src/hooks/useMarketData.ts`
- Busca dados da tabela `monthly_top_performer`

### 4. **Frontend - Componente**
- Modificado componente `KPICards` para:
  - Substituir card de "Volume Total" por "Maior Var. Mensal"
  - Usar o novo hook para buscar dados
  - Mostrar símbolo, variação (%) e preço do ativo

---

## Instruções de Uso

### 1. **Aplicar Migration**
Execute a migration no Supabase:
```bash
supabase migration up
```

Ou acesse o SQL Editor no Supabase e execute o conteúdo de:
```
supabase/migrations/20260210_create_monthly_top_performer.sql
```

### 2. **Testar a Edge Function Localmente**
```bash
supabase functions serve
```

### 3. **Chamar a Edge Function (via cURL ou n8n)**

#### Exemplo cURL:
```bash
curl -X POST http://localhost:54321/functions/v1/save-monthly-top-performer \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "price": 150.25,
    "monthlyChange": 15.75,
    "market": "US",
    "currency": "USD"
  }'
```

#### Exemplo de Resposta (Sucesso):
```json
{
  "success": true,
  "message": "Top performer mensal atualizado: AAPL",
  "data": {
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "price": 150.25,
    "monthlyChange": 15.75,
    "market": "US"
  }
}
```

---

## Configuração no n8n

### Passo 1: Criar Workflow no n8n
1. Crie um novo workflow no n8n
2. Configure um trigger (Schedule, Webhook, etc.)

### Passo 2: Adicionar HTTP Request
Adicione um nó **HTTP Request** com as seguintes configurações:

| Campo | Valor |
|-------|-------|
| **URL** | `https://seu-projeto.supabase.co/functions/v1/save-monthly-top-performer` |
| **Method** | `POST` |
| **Authentication** | `Header` |
| **Header Key** | `Authorization` |
| **Header Value** | `Bearer seu-anon-key` |
| **Content Type** | `application/json` |

### Passo 3: Body do Request
```json
{
  "symbol": "{{ $node.YourNode.json.symbol }}",
  "name": "{{ $node.YourNode.json.name }}",
  "price": "{{ $node.YourNode.json.price }}",
  "monthlyChange": "{{ $node.YourNode.json.monthlyChange }}",
  "market": "{{ $node.YourNode.json.market }}",
  "currency": "{{ $node.YourNode.json.currency }}"
}
```

---

## Campos Esperados

A edge function espera os seguintes campos obrigatórios:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `symbol` | string | Símbolo da ação (ex: AAPL, PETR4) |
| `name` | string | Nome da empresa |
| `price` | number | Preço atual |
| `monthlyChange` | number | Variação mensal em % |
| `market` | "BR" \| "US" | Mercado (Brasil ou EUA) |
| `currency` | string (opcional) | Moeda (padrão: USD) |

---

## Fluxo de Dados

```
n8n (Automação)
    ↓
    └─→ POST /save-monthly-top-performer
        ↓
    Supabase Edge Function
        ↓
    Salva/Atualiza em monthly_top_performer
        ↓
    Frontend (React)
        ↓
    useMonthlyTopPerformer()
        ↓
    KPICards Component
        ↓
    Exibe no Dashboard
```

---

## Tipos de Dados (TypeScript)

### MonthlyTopPerformer (Retorno):
```typescript
interface MonthlyTopPerformer {
  id: string;
  symbol: string;
  name: string;
  price: number;
  monthly_change: number;
  market: 'BR' | 'US';
  currency: string;
  updated_at: string;
}
```

---

## Notas Importantes

1. **Atualização Automática**: Cada mercado (BR/US) terá um top performer. Se já existir um registro, será atualizado. Se for o primeiro, será inserido.

2. **Intervalo de Atualização**: O hook no frontend busca os dados a cada 30 minutos e mantém cache.

3. **Ícone**: O card agora usa o ícone `Zap` (raio) em vez de `BarChart3`, indicando atividade/variação mensal.

4. **Variedade Visual**: O card muda de cor entre verde (positivo) e vermelho (negativo) dependendo do sinal da variação.

---

## Troubleshooting

### "Erro ao inserir/atualizar"
- Verifique se a migration foi aplicada
- Confirme se os dados estão no formato correto

### "Dados incompletos"
- Certifique-se de que todos os campos obrigatórios estão sendo enviados
- Verifique o console do n8n para mensagens de erro

### Hook retorna `null` ou trava carregando
- Verifique se as variáveis de ambiente `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estão configuradas
- Confirme se a RLS policy permite leitura

---

## Deploy em Produção

1. Aplique a migration no banco de produção
2. Atualize o projeto com os novos arquivos
3. Configure as URLs das edge functions no n8n (use a URL de produção)
4. Teste o workflow no n8n com dados reais
