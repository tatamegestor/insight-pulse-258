
# Plano: Implementar Requisitos Faltantes do Projeto DiverseDev

## Resumo

Completar a implementação do projeto "Stocks Intelligence" conforme os requisitos do documento DiverseDev, focando em: banco de dados, persistência via n8n, ranking de ações, e cálculos financeiros completos.

---

## 1. Banco de Dados (Supabase)

### Tabelas a criar:

**1.1. stock_quotes (Cotações históricas)**
```sql
- id (uuid, PK)
- symbol (text) - Ex: PETR4, AAPL
- name (text) - Nome da empresa
- price (decimal) - Preço atual
- change_percent (decimal) - Variação percentual
- volume (bigint) - Volume negociado
- market (text) - BR ou US
- currency (text) - BRL ou USD
- fetched_at (timestamp) - Quando foi coletado
- created_at (timestamp)
```

**1.2. system_logs (Logs do sistema)**
```sql
- id (uuid, PK)
- action (text) - Ex: FETCH_QUOTES, N8N_SYNC
- status (text) - SUCCESS, ERROR
- details (jsonb) - Detalhes adicionais
- source (text) - Ex: n8n, edge_function, frontend
- created_at (timestamp)
```

**1.3. stock_rankings (Cache de rankings)**
```sql
- id (uuid, PK)
- symbol (text)
- name (text)
- daily_change (decimal)
- weekly_change (decimal)
- monthly_change (decimal)
- rank_position (integer)
- market (text)
- calculated_at (timestamp)
```

---

## 2. Automação n8n

### 2.1. Workflow de coleta de dados (novo)

O n8n deve ter um workflow agendado que:
1. Executa a cada 15-30 minutos (horário de mercado)
2. Busca cotações das APIs (brapi + FMP)
3. Salva no Supabase via API REST
4. Registra logs de execução
5. Calcula rankings diários/semanais/mensais

### 2.2. Edge Function para receber dados do n8n

Criar nova edge function `sync-market-data`:
- Recebe dados do n8n
- Valida e insere no banco
- Calcula variações
- Atualiza rankings
- Registra logs

---

## 3. Frontend - Novas Funcionalidades

### 3.1. Ranking de Ações (nova página ou componente)

Mostrar:
- Top 5 maiores altas do dia
- Top 5 maiores baixas do dia
- Top 5 do mês
- Filtros por mercado (BR/US)

### 3.2. Dashboard Aprimorado

Adicionar ao dashboard existente:
- Card de ranking (top gainers/losers)
- Variação mensal nos KPIs
- Gráfico comparativo de performance

### 3.3. Página de Mercado

Melhorias:
- Ordenação por variação (maior/menor)
- Coluna de variação mensal
- Indicador visual de tendência

---

## 4. Cálculos Financeiros

### No backend (edge function):
- Variação diária: `(preço_atual - preço_anterior) / preço_anterior * 100`
- Variação semanal: comparar com 5 dias úteis atrás
- Variação mensal: comparar com 22 dias úteis atrás
- Média móvel simples (7 dias)

### No frontend:
- Exibir todos os cálculos vindos do banco
- Formatar com cores (verde/vermelho)

---

## 5. Detalhes Tecnicos

### Arquivos a criar:

```text
1. supabase/functions/sync-market-data/index.ts
   - Recebe dados do n8n
   - Insere cotações no banco
   - Calcula rankings
   - Registra logs

2. src/components/dashboard/RankingCard.tsx
   - Componente de ranking top 5
   - Altas e baixas do dia

3. src/pages/Rankings.tsx (opcional)
   - Página dedicada a rankings
   - Filtros e ordenação

4. src/hooks/useRankings.ts
   - Hook para buscar rankings do banco
```

### Arquivos a modificar:

```text
1. src/pages/Dashboard.tsx
   - Adicionar RankingCard
   - Mostrar dados do banco

2. src/pages/Mercado.tsx
   - Adicionar ordenação por variação
   - Mostrar variação mensal

3. src/components/dashboard/KPICards.tsx
   - Adicionar variação mensal
   - Buscar dados do banco
```

---

## 6. Fluxo Completo do Dado (para apresentação)

```text
[APIs Externas] --> [n8n Workflow] --> [Edge Function] --> [Supabase DB]
                                                               |
                                                               v
[Frontend React] <-- [React Query] <-- [Supabase Client] <-----+
```

1. APIs brapi.dev e FMP fornecem cotações
2. n8n coleta periodicamente (agendado)
3. Edge function valida e persiste
4. Banco armazena historico e rankings
5. Frontend exibe dados e insights

---

## 7. Evidencias Tecnicas para Entrega

O que voce tera apos implementacao:

- Prints do n8n: Workflow de coleta + webhook do chatbot
- Diagrama do banco: 3 tabelas (quotes, logs, rankings)
- Prints do Supabase: Tabelas com dados reais
- Interface Lovable: Dashboard com rankings e graficos
- Fluxo completo: Dado da API ate a tela

---

## 8. Ordem de Implementacao Sugerida

1. **Primeiro**: Criar tabelas no Supabase (15 min)
2. **Segundo**: Edge function sync-market-data (30 min)
3. **Terceiro**: Configurar workflow n8n de coleta (30 min)
4. **Quarto**: Componente RankingCard no dashboard (20 min)
5. **Quinto**: Melhorar pagina Mercado com ordenacao (15 min)
6. **Sexto**: Testar fluxo completo (15 min)

---

## Resumo das Lacunas Criticas

| Prioridade | Item | Impacto |
|------------|------|---------|
| ALTA | Tabelas no banco | Sem isso, nao ha persistencia |
| ALTA | Workflow n8n de coleta | Requisito obrigatorio |
| ALTA | Logs no banco | Requisito obrigatorio |
| MEDIA | Rankings | Funcionalidade do tema |
| MEDIA | Variacao mensal | Melhora o produto |
| BAIXA | Dashboard aprimorado | Polish final |

