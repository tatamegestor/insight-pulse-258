# Checklist de Implementação - Top Performer Mensal

## ✅ Etapa 1: Preparação do Banco de Dados

- [ ] Acesse o [Supabase Dashboard](https://app.supabase.com) do seu projeto
- [ ] Vá para **SQL Editor**
- [ ] Copie e execute o conteúdo de: `supabase/migrations/20260210_create_monthly_top_performer.sql`
- [ ] Confirme que a tabela `monthly_top_performer` foi criada

**Verificação:**
```sql
-- Execute no SQL Editor
SELECT * FROM monthly_top_performer;
-- Deve retornar uma tabela vazia (0 rows)
```

---

## ✅ Etapa 2: Deploy Local (Teste)

- [ ] Abra terminal na raiz do projeto
- [ ] Execute: `supabase functions serve`
- [ ] Aguarde até ver: `Functions running at http://localhost:54321`

**Teste com cURL:**
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

- [ ] Resposta deve ser: `"success": true`

---

## ✅ Etapa 3: Verificar Dados no Supabase

- [ ] Abra [Supabase Dashboard](https://app.supabase.com)
- [ ] Vá para **Table Editor**
- [ ] Selecione tabela `monthly_top_performer`
- [ ] Confirme que o registro de AAPL aparece

---

## ✅ Etapa 4: Configurar n8n

### 4.1 - Criar o Workflow
- [ ] Acesse seu workspace no n8n
- [ ] Crie um novo workflow
- [ ] Adicione um trigger (recomendado: **Schedule** para rodar periodicamente)

### 4.2 - Adicionar HTTP Request
- [ ] Adicione nó **HTTP Request**
- [ ] Configure:

| Campo | Valor |
|-------|-------|
| **URL** | `https://seu-app.supabase.co/functions/v1/save-monthly-top-performer` |
| **Method** | POST |
| **Headers** | Content-Type: application/json |

### 4.3 - Autenticação (Se necessário)
Se sua edge function exigir Bearer token:
- [ ] Headers → Adicione: `Authorization: Bearer seu-anon-key-supabase`

### 4.4 - Body do Request
- [ ] Configure o JSON com seus dados
- [ ] Teste com dados hard-coded primeiro:

```json
{
  "symbol": "AAPL",
  "name": "Apple Inc.",
  "price": 150.25,
  "monthlyChange": 15.75,
  "market": "US",
  "currency": "USD"
}
```

- [ ] Clique em **Execute Workflow**
- [ ] Verifique se a resposta tem `"success": true`

### 4.5 - Integrar com sua API de dados
- [ ] Substitua os valores hard-coded pelos dados reais da sua API
- [ ] Exemplo (adapte ao seu contexto):

```json
{
  "symbol": "{{ $node['Get Top Stocks'].json.topMonthly.symbol }}",
  "name": "{{ $node['Get Top Stocks'].json.topMonthly.name }}",
  "price": {{ $node['Get Top Stocks'].json.topMonthly.price }},
  "monthlyChange": {{ $node['Get Top Stocks'].json.topMonthly.monthlyChange }},
  "market": "{{ $node['Get Top Stocks'].json.topMonthly.market }}",
  "currency": "{{ $node['Get Top Stocks'].json.topMonthly.currency }}"
}
```

### 4.6 - Agendar Execução
- [ ] Clique em **Schedule** no trigger
- [ ] Configure intervalo desejado (recomendado: a cada 6 ou 24 horas)
- [ ] **Salve o workflow**

---

## ✅ Etapa 5: Testar Frontend

- [ ] Inicie o servidor de desenvolvimento: `npm run dev`
- [ ] Abra o navegador em `http://localhost:5173`
- [ ] Navegue para o **Dashboard**
- [ ] Procure o terceiro card: **"Maior Var. Mensal"**
- [ ] Verifique se está exibindo os dados salvos

**Se não aparecer nada:**
- [ ] Abra DevTools (F12) → Console
- [ ] Procure por erros de CORS ou fetch
- [ ] Verifique se `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estão em `.env.local`

---

## ✅ Etapa 6: Deploy em Produção

### 6.1 - Deploy da Edge Function
```bash
# Opção 1: Via CLI
supabase functions deploy save-monthly-top-performer

# Opção 2: Via Supabase Dashboard
# - Functions → save-monthly-top-performer → Redeploy
```

### 6.2 - Aplicar Migration em Produção
```bash
# Se usar Supabase CLI
supabase db push

# Ou manualmente no SQL Editor do Supabase de produção
```

### 6.3 - Atualizar URL no n8n
- [ ] No workflow n8n, atualize a URL:
  ```
  https://seu-projeto-producao.supabase.co/functions/v1/save-monthly-top-performer
  ```

### 6.4 - Deploy do Frontend
```bash
# Build
npm run build

# Deploy (depende da sua plataforma - Vercel, Netlifly, etc)
```

---

## ✅ Etapa 7: Validação Final

### Checklist de Sucesso:
- [ ] Edge function respondendo com status 200
- [ ] Dados sendo salvos na tabela `monthly_top_performer`
- [ ] Frontend carregando dados corretamente
- [ ] Card "Maior Var. Mensal" exibindo símbolo, variação e preço
- [ ] n8n enviando dados periodicamente
- [ ] Cores mudando para verde (positivo) ou vermelho (negativo)
- [ ] Ícone do card é um raio ⚡

---

## 🆘 Troubleshooting

### Erro: "Dados incompletos"
→ Verifique se todos os campos obrigatórios estão no JSON

### Erro: "CORS error"
→ A edge function tem CORS habilitado, mas verifique headers

### Edge function retorna 500
→ Verifique se a tabela foi criada corretamente
→ Veja os logs no Supabase → Functions

### Frontend mostra "Carregando..." indefinidamente
→ Verifique console (F12) para erros
→ Confirme variáveis de ambiente

### Hook retorna null
→ Verifique se há registros na tabela
→ Execute: `SELECT * FROM monthly_top_performer;`

---

## 📋 Exemplo de Workflow n8n Completo

```
┌─────────────────┐
│    Schedule     │ (Diariamente às 16h)
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│ Get Top Stocks API      │ (Sua API que calcula top)
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ HTTP Request                        │
│ POST save-monthly-top-performer    │
│ (Com o JSON do payload)             │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────┐
│ Check Response  │
└─────────────────┘
         │
         ▼
    SUCCESS ✓
```

---

## 📞 Suporte

Qualquer dúvida, referir aos documentos:
- `docs/INTEGRACAO_TOP_PERFORMER_MENSAL.md` - Documentação completa
- `docs/EXEMPLOS_PAYLOADS_TOP_PERFORMER.md` - Exemplos de requisições
- `docs/ARQUITETURA_TOP_PERFORMER.txt` - Visão geral da arquitetura
