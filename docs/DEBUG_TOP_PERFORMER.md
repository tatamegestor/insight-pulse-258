# Debug - Consumo do Top Performer Mensal

## Passo 1: Adicionar Componente de Debug

1. Abra [Dashboard.tsx](src/pages/Dashboard.tsx)
2. Importe o componente de debug no topo:

```typescript
import { MonthlyTopPerformerDebug } from "@/components/debug/MonthlyTopPerformerDebug";
```

3. Adicione o componente APÓS o `</div>` final (antes do fechamento de `DashboardLayout`):

```tsx
<MonthlyTopPerformerDebug />
```

Ficará assim:
```tsx
<DashboardLayout>
  <div className="space-y-8">
    {/* ... conteúdo existente ... */}
  </div>
  
  {/* Debug component */}
  <MonthlyTopPerformerDebug />
</DashboardLayout>
```

---

## Passo 2: Testar Localmente

1. Inicie o servidor: `npm run dev`
2. Vá para http://localhost:5173/dashboard
3. **Role para baixo** até encontrar a seção `🔍 Debug: Top Performer Mensal`

Você verá:
- ✅ **Loading**: true/false
- ✅ **Error**: mensagem de erro (se houver)
- ✅ **Data**: JSON com os dados recebidos

---

## Checklist de Troubleshooting

### ❌ Mostra "Loading: true" indefinidamente?
**Causa**: A query está travada
- [ ] Verifique o console (F12 → Console)
- [ ] Procure por erros de CORS
- [ ] Verifique se `browser.allowlist` está configurado

**Solução**:
```javascript
// No console do navegador, execute:
fetch(import.meta.env.VITE_SUPABASE_URL + '/rest/v1/monthly_top_performer?select=*')
.then(r => r.json())
.then(data => console.log(data))
.catch(err => console.error(err));
```

---

### ❌ Mostra erro "Failed to fetch"?
**Causa**: Problema de CORS ou URL inválida
- [ ] Confirme que `VITE_SUPABASE_URL` está correto
- [ ] Verifique se a tabela existe no banco

**Teste SQL**:
```sql
-- Execute no Supabase SQL Editor
SELECT COUNT(*) as total FROM monthly_top_performer;
```

---

### ❌ Mostra "Nenhum dado encontrado"?
**Causa**: Tabela vazia
- [ ] Confirme que você enviou dados via n8n
- [ ] Verifique se o n8n está funcionando

**Teste manual**:
```bash
# Execute este cURL para simular o n8n:
curl -X POST https://seu-projeto.supabase.co/functions/v1/save-monthly-top-performer \
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

Depois verifique o banco:
```sql
SELECT * FROM monthly_top_performer ORDER BY updated_at DESC;
```

---

### ❌ Está funcionando mas o card não aparece?
**Causa**: Dados não estão formatados corretamente
- [ ] Verifique no debug se `data` é um array
- [ ] Confirme se contém os campos: `symbol`, `monthly_change`, `price`, `currency`

**JSON esperado**:
```json
[
  {
    "id": "uuid",
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "price": 150.25,
    "monthly_change": 15.75,
    "market": "US",
    "currency": "USD",
    "updated_at": "2026-02-10T10:00:00Z",
    "created_at": "2026-02-10T10:00:00Z"
  }
]
```

---

## Testes Específicos por Console

### 1. Testar cliente Supabase:
```javascript
import { supabase } from '@/integrations/supabase/client';

const { data, error } = await supabase
  .from('monthly_top_performer')
  .select('*');

console.log('Data:', data);
console.log('Error:', error);
```

### 2. Testar RLS permissions:
```javascript
// Se retornar erro de permissão, o RLS está bloqueando
import { supabase } from '@/integrations/supabase/client';

const { data, error } = await supabase
  .from('monthly_top_performer')
  .select('count', { count: 'exact', head: true });

if (error?.code === 'PGRST116') {
  console.error('RLS bloqueando acesso');
}
```

### 3. Testar hook diretamente:
```javascript
// No console de uma página que use o hook:
const { data, isLoading, error } = useMonthlyTopPerformer();
console.log({ data, isLoading, error });
```

---

## Variáveis de Ambiente

Certifique-se de ter em `.env.local`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=seu-anon-key
```

---

## Logs para Verificar

### No Supabase Dashboard:
1. Vá para **Logs** → **Functions**
2. Procure pela função `save-monthly-top-performer`
3. Verifique se os requests nos n8n estão chegando (status 200)

### No navegador (DevTools):
1. Abra **F12** → **Network**
2. Procure por requisições para `/rest/v1/monthly_top_performer`
3. Verifique o status ( deve ser 200)
4. Verifique o response JSON

---

## Após Resolver

Não esqueça de **remover o componente de debug** antes de ir para produção:

```bash
# Remove a linha de debug
git diff src/pages/Dashboard.tsx
```

Ou simplesmente delete a importação e o componente `<MonthlyTopPerformerDebug />` do arquivo.

---

## Resumo do Fluxo Esperado

```
Frontend (Browser)
  ↓
  useMonthlyTopPerformer() hook
  ↓
  Busca: GET /rest/v1/monthly_top_performer
  ↓
  Supabase (monthly_top_performer table)
  ↓
  Response JSON com dados
  ↓
  React Query cache
  ↓
  Renderiza KPICards com Card 3: "Maior Var. Mensal"
```

Se algo falhar em qualquer ponto, o debug component mostrará.
