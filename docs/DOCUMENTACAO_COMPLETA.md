# 📊 InvestIA - Documentação Completa do Projeto

> **Plataforma SaaS de inteligência de investimentos** com cotações em tempo real, chatbot com IA, carteira personalizada e alertas de preço.

**URL Publicada:** https://insight-pulse-258.lovable.app  
**Última atualização:** 2026-02-09

---

## 1. Visão Geral

### 1.1 Objetivo
O InvestIA é uma plataforma SaaS de inteligência para investidores que combina dados de mercado em tempo real (ações brasileiras e americanas) com inteligência artificial para fornecer insights, análises e gestão de carteira personalizada.

### 1.2 Público-Alvo
- Investidores pessoa física (iniciantes e intermediários)
- Entusiastas do mercado financeiro
- Pessoas que desejam acompanhar ações BR e US em uma única plataforma

### 1.3 Stack Tecnológico

| Camada | Tecnologia |
|--------|------------|
| **Frontend** | React 18 + TypeScript + Vite |
| **Estilização** | Tailwind CSS + shadcn/ui |
| **Estado/Cache** | TanStack React Query v5 |
| **Roteamento** | React Router DOM v6 |
| **Backend** | Lovable Cloud (Supabase) |
| **Edge Functions** | Deno (Supabase Edge Functions) |
| **Automação** | n8n (workflows de coleta de dados) |
| **APIs de Dados** | brapi.dev (BR), Polygon.io/FMP (US) |
| **Chatbot** | n8n + IA (webhook) |
| **Gráficos** | Recharts |

---

## 2. Arquitetura do Sistema

### 2.1 Diagrama de Alto Nível

```
┌─────────────────────────────────────────────────┐
│                  FRONTEND (React)                │
│  Landing Page │ Dashboard │ Mercado │ Carteira   │
│  Notificações │ Configurações │ Blog │ Detalhes  │
└──────────────────────┬──────────────────────────┘
                       │
            ┌──────────▼──────────┐
            │   Supabase Client   │
            │   (Auth + REST)     │
            └──────────┬──────────┘
                       │
     ┌─────────────────┼─────────────────┐
     │                 │                 │
┌────▼────┐  ┌─────────▼────────┐  ┌─────▼─────┐
│  Auth   │  │  Edge Functions  │  │ Database  │
│(Email/  │  │  (9 funções)     │  │ (10 tabs) │
│ Google) │  │                  │  │           │
└─────────┘  └────────┬─────────┘  └───────────┘
                      │
          ┌───────────┼───────────┐
          │           │           │
    ┌─────▼──┐  ┌─────▼──┐  ┌────▼────┐
    │brapi.dev│  │  n8n   │  │ NewsAPI │
    │  (BR)   │  │webhooks│  │ /GNews  │
    └─────────┘  └────────┘  └─────────┘
```

### 2.2 Fluxo de Dados
1. **Coleta automática** (n8n): Workflows agendam coleta de cotações BR e US, calculam rankings e geram insights diários
2. **Armazenamento**: Dados são persistidos nas tabelas `stock_prices`, `stock_quotes`, `stock_rankings`, `daily_insights`
3. **Consulta frontend**: Hooks React Query buscam dados via Supabase client ou Edge Functions
4. **Cache**: Cache local de 5 minutos no frontend + staleTime no React Query

---

## 3. Estrutura de Diretórios

```
src/
├── App.tsx                    # Roteamento principal
├── main.tsx                   # Entry point
├── index.css                  # Design tokens e estilos globais
├── components/
│   ├── AppSidebar.tsx         # Sidebar da área logada
│   ├── DashboardLayout.tsx    # Layout wrapper (sidebar + content + chatbot)
│   ├── NavLink.tsx            # Link de navegação ativo
│   ├── ProtectedRoute.tsx     # Guard de autenticação
│   ├── chat/
│   │   ├── FloatingChatbot.tsx # Chatbot flutuante
│   │   ├── ChatInput.tsx      # Input do chat
│   │   └── ChatMessage.tsx    # Mensagem individual
│   ├── dashboard/
│   │   ├── AIInsightCard.tsx   # Card de insight diário (IA)
│   │   ├── KPICards.tsx        # Cards de KPIs do mercado
│   │   ├── MainChart.tsx       # Gráfico principal (Recharts)
│   │   └── RankingCard.tsx     # Card de ranking de ações
│   ├── landing/
│   │   ├── Navbar.tsx          # Navegação da landing
│   │   ├── MarketTicker.tsx    # Ticker de cotações
│   │   ├── Hero.tsx            # Seção hero
│   │   ├── Features.tsx        # Seção de funcionalidades
│   │   ├── MarketOverview.tsx  # Visão geral do mercado
│   │   ├── NewsSection.tsx     # Seção de notícias
│   │   ├── CTA.tsx             # Call to action
│   │   └── Footer.tsx          # Rodapé
│   ├── portfolio/
│   │   └── StockFormDialog.tsx # Diálogo de add/edit ativo
│   └── ui/                    # Componentes shadcn/ui (40+ componentes)
├── hooks/
│   ├── useAuth.tsx            # Contexto de autenticação
│   ├── useChatbot.ts          # Lógica do chatbot
│   ├── useDailyInsight.ts     # Insight diário da IA
│   ├── useMarketData.ts       # Dados de mercado (BR + US)
│   ├── useNews.ts             # Notícias financeiras
│   ├── usePortfolio.ts        # CRUD da carteira
│   ├── usePriceAlerts.ts      # Alertas de preço
│   ├── useRankings.ts         # Rankings e logs
│   ├── useSearchStocks.ts     # Busca de ações
│   ├── useStockData.ts        # Dados globais (n8n)
│   └── useStockPrices.ts      # Preços da tabela stock_prices
├── pages/
│   ├── LandingPage.tsx        # Página inicial pública
│   ├── Login.tsx              # Login/Cadastro
│   ├── Dashboard.tsx          # Dashboard principal
│   ├── Mercado.tsx            # Listagem de ações
│   ├── AcaoDetalhes.tsx       # Detalhes de uma ação
│   ├── Carteira.tsx           # Gestão da carteira
│   ├── Notificacoes.tsx       # Alertas de preço
│   ├── Configuracoes.tsx      # Configurações do perfil
│   ├── Blog.tsx / BlogPost.tsx # Blog
│   ├── Sobre / Termos / Privacidade / Contato.tsx
│   ├── Ferramentas.tsx / Analises.tsx
│   └── NotFound.tsx           # 404
├── services/
│   ├── marketData.ts          # Serviço de cotações (brapi + n8n + fallback DB)
│   ├── n8nStocks.ts           # Serviço de ações globais via n8n
│   └── newsApi.ts             # Serviço de notícias
├── integrations/supabase/
│   ├── client.ts              # Cliente Supabase (auto-gerado)
│   └── types.ts               # Types do banco (auto-gerado)
supabase/
├── config.toml                # Configuração Supabase
└── functions/
    ├── chat-webhook/          # Proxy para n8n chatbot
    ├── check-price-alerts/    # Verificar alertas disparados
    ├── fetch-brazilian-stocks/ # Buscar ações BR (brapi.dev)
    ├── fetch-global-stocks/   # Buscar ações globais (n8n)
    ├── fetch-news/            # Buscar notícias
    ├── fetch-us-stocks/       # Buscar ações US
    ├── save-daily-insight/    # Salvar insight diário
    ├── search-stocks/         # Pesquisar ações (brapi)
    └── sync-market-data/      # Sincronizar dados de mercado
```

---

## 4. Banco de Dados

### 4.1 Tabelas de Dados de Mercado (Públicas)

| Tabela | Descrição | RLS |
|--------|-----------|-----|
| `stock_prices` | Cotações detalhadas com 30+ colunas (preço, variação, volatilidade, insight IA, logo, trend) | SELECT/INSERT público |
| `stock_quotes` | Cotações simplificadas (preço, variação, volume) | SELECT público |
| `stock_rankings` | Ranking de ações por performance diária/semanal/mensal | SELECT público |
| `daily_insights` | Insights diários gerados por IA com sentimento (otimista/neutro/pessimista) | SELECT público |
| `extraction_logs` | Logs de execução dos workflows n8n | SELECT/INSERT público |
| `system_logs` | Logs do sistema (ações, status, detalhes JSONB) | SELECT público |
| `blog_posts` | Posts do blog (título, conteúdo, slug, categoria, autor) | SELECT público (publicados), CRUD autenticado |

### 4.2 Tabelas de Dados do Usuário (Privadas - RLS por user_id)

| Tabela | Descrição | RLS |
|--------|-----------|-----|
| `profiles` | Perfil do usuário (nome, telefone, avatar, is_active_plan) | SELECT/INSERT/UPDATE próprio |
| `portfolio` | Carteira de investimentos (symbol, name, quantity, avg_price, logo) | SELECT/INSERT/UPDATE/DELETE próprio |
| `price_alerts` | Alertas de preço (symbol, target_price, direction above/below, is_active) | SELECT/INSERT/UPDATE/DELETE próprio |

### 4.3 Schema Detalhado

#### `portfolio`
```sql
CREATE TABLE public.portfolio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  quantity NUMERIC NOT NULL DEFAULT 0,
  avg_price NUMERIC NOT NULL DEFAULT 0,
  logo TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- RLS: auth.uid() = user_id para SELECT, INSERT, UPDATE, DELETE
```

#### `price_alerts`
```sql
CREATE TABLE public.price_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  target_price NUMERIC NOT NULL,
  direction TEXT NOT NULL DEFAULT 'above',
  is_active BOOLEAN NOT NULL DEFAULT true,
  triggered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- RLS: auth.uid() = user_id para SELECT, INSERT, UPDATE, DELETE
```

#### `profiles`
```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone_number TEXT,
  is_active_plan BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Trigger: handle_new_user() cria perfil automaticamente no cadastro
-- RLS: auth.uid() = user_id para SELECT, INSERT, UPDATE (sem DELETE)
```

#### `stock_prices` (resumo - 30+ colunas)
```sql
CREATE TABLE public.stock_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol VARCHAR NOT NULL,
  current_price NUMERIC NOT NULL,
  market_time TIMESTAMP NOT NULL,
  open_price NUMERIC, high_price NUMERIC, low_price NUMERIC,
  previous_close NUMERIC, volume BIGINT,
  variation_daily NUMERIC, volatility_intraday NUMERIC,
  fifty_two_week_high NUMERIC, fifty_two_week_low NUMERIC,
  trend VARCHAR, trend_emoji VARCHAR,
  auto_insight TEXT, logo_url TEXT, currency VARCHAR,
  brapi_change NUMERIC, brapi_change_percent NUMERIC,
  distance_from_52week_high NUMERIC, distance_from_52week_low NUMERIC,
  position_52week_range NUMERIC, range_position VARCHAR,
  volatility_level VARCHAR, market_cap BIGINT,
  price_earnings NUMERIC, earnings_per_share NUMERIC,
  long_name VARCHAR, short_name VARCHAR,
  created_at TIMESTAMP DEFAULT now(), processed_at TIMESTAMP
);
```

### 4.4 Funções e Triggers

| Função | Tipo | Descrição |
|--------|------|----------|
| `handle_new_user()` | Trigger (SECURITY DEFINER) | Cria perfil na tabela `profiles` automaticamente quando um novo usuário se cadastra via auth. Extrai `full_name` e `phone_number` dos metadados |
| `update_profiles_updated_at()` | Trigger | Atualiza o campo `updated_at` automaticamente antes de UPDATE na tabela profiles |

---

## 5. Autenticação

### 5.1 Métodos Suportados
- **Email/Senha**: Cadastro com nome completo e telefone (WhatsApp) obrigatórios
- **Google OAuth**: Login social com redirect para `/dashboard`

### 5.2 Fluxo de Autenticação
1. Usuário acessa `/login`
2. Preenche formulário de cadastro (email, senha, nome, telefone) ou clica em "Entrar com Google"
3. Supabase Auth cria o usuário
4. Trigger `handle_new_user()` cria o perfil na tabela `profiles` com os metadados
5. `AuthProvider` (Context API) detecta a sessão via `onAuthStateChange` e carrega o perfil
6. Usuário é redirecionado para `/dashboard`

### 5.3 AuthProvider (Context API)
O `AuthProvider` expõe:
- `user` - Objeto User do Supabase Auth
- `session` - Sessão ativa
- `profile` - Dados do perfil (full_name, phone_number, is_active_plan, avatar_url)
- `loading` - Estado de carregamento
- `signIn(email, password)` - Login
- `signUp(email, password, fullName, phoneNumber)` - Cadastro
- `signInWithGoogle()` - Login social
- `signOut()` - Logout
- `updateProfile(data)` - Atualizar perfil

### 5.4 Proteção de Rotas
O componente `<ProtectedRoute>` envolve todas as páginas internas e verifica se há sessão ativa. Caso contrário, redireciona para `/login`.

**Rotas protegidas:** `/dashboard`, `/mercado`, `/acao/:id`, `/carteira`, `/notificacoes`, `/configuracoes`

**Rotas públicas:** `/`, `/login`, `/sobre`, `/termos`, `/privacidade`, `/contato`, `/ferramentas`, `/analises`, `/blog`, `/blog/:slug`

---

## 6. Edge Functions (Backend)

### 6.1 Lista de Funções

| Função | Método | Descrição | APIs Usadas |
|--------|--------|-----------|-------------|
| `chat-webhook` | POST | Proxy para o webhook n8n do chatbot. Envia message, sessionId, isActivePlan, email, fullName | n8n (N8N_WEBHOOK_URL) |
| `fetch-brazilian-stocks` | POST | Busca cotações BR. Recebe `{ symbols: string[] }` | brapi.dev (BRAPI_TOKEN) |
| `fetch-us-stocks` | POST | Busca cotações US. Recebe `{ symbols: string[], withHistory?: boolean }` | FMP/Twelve Data |
| `fetch-global-stocks` | GET/POST | Busca todas as ações globais via webhook n8n | n8n |
| `fetch-news` | POST | Busca notícias financeiras. Recebe `{ pageSize: number }` | NewsAPI/GNews |
| `search-stocks` | GET | Pesquisa ações por nome/ticker. Query param: `?query=PETR` | brapi.dev |
| `save-daily-insight` | POST | Salva insight diário gerado pela IA | - |
| `check-price-alerts` | POST | Verifica se alertas de preço foram acionados | - |
| `sync-market-data` | POST | Sincroniza dados de mercado com o banco | - |

### 6.2 Secrets Configurados

| Secret | Uso |
|--------|-----|
| `BRAPI_TOKEN` | Autenticação na API brapi.dev (ações brasileiras B3) |
| `FMP_API_KEY` | Financial Modeling Prep API (dados financeiros US) |
| `TWELVE_DATA_API_KEY` | Twelve Data API (dados de mercado) |
| `NEWS_API_KEY` | NewsAPI.org (notícias em inglês) |
| `GNEWS_API_KEY` | GNews API (notícias) |
| `MASSIVE_API_KEY` | API auxiliar |
| `N8N_WEBHOOK_URL` | URL do webhook n8n para o chatbot |
| `LOVABLE_API_KEY` | Lovable AI Gateway |

### 6.3 Detalhes do `chat-webhook`
```typescript
// Payload recebido do frontend
{ message, sessionId, isActivePlan, email, fullName }

// Payload enviado para n8n
{ message, sessionId, isActivePlan, email, fullName, timestamp }

// Resposta esperada do n8n
{ response: "texto da resposta" }
// Também aceita: { output, message, text }
```

---

## 7. Hooks Customizados

### 7.1 Dados de Mercado

| Hook | Arquivo | Descrição | StaleTime |
|------|---------|-----------|----------|
| `useBrazilianStocks(symbols)` | useMarketData.ts | Cotações BR via brapi edge function | 5 min |
| `useUSStocks(symbols)` | useMarketData.ts | Cotações US via n8n + fallback DB | 5 min |
| `useStockQuote(symbol)` | useMarketData.ts | Cotação individual (detecta mercado) | 5 min |
| `useStockHistory(symbol, market)` | useMarketData.ts | Histórico de preços com interpolação | 5 min |
| `useMarketTicker()` | useMarketData.ts | Ticker navbar (PETR4, VALE3, ITUB4, MGLU3, USD, EUR) | 5 min + refetch 5min |
| `useMarketOverview()` | useMarketData.ts | Visão geral BR (5 ações) + US (5 ações) | 5 min |
| `useDashboardKPIs()` | useMarketData.ts | KPIs (AAPL, MSFT, GOOGL) | 5 min |
| `useMainChartData(symbol)` | useMarketData.ts | Quote + histórico para gráfico | 5 min |
| `useStockPrices()` | useStockPrices.ts | Dados da tabela stock_prices (mais recente por symbol) | 5 min |
| `useStockPrice(symbol)` | useStockPrices.ts | Um registro específico da stock_prices | 5 min |
| `useGlobalStocks()` | useStockData.ts | Todas as ações via n8n edge function | 5 min |
| `useStockByTicker(ticker)` | useStockData.ts | Uma ação específica do n8n | 5 min |
| `useSearchStocks(query)` | useSearchStocks.ts | Busca com debounce 500ms + detalhes enriched | 2 min |
| `useStockRankings(market, limit)` | useRankings.ts | Rankings por posição | 5 min + refetch 5min |
| `useTopGainers(market, limit)` | useRankings.ts | Maiores altas | 5 min |
| `useTopLosers(market, limit)` | useRankings.ts | Maiores baixas | 5 min |
| `useSystemLogs(limit)` | useRankings.ts | Logs do sistema | 2 min |
| `useLastSync()` | useRankings.ts | Última sincronização bem-sucedida | 2 min |
| `useDailyInsight()` | useDailyInsight.ts | Insight diário da IA | 30 min + refetch 15min |
| `useFinanceNews(pageSize)` | useNews.ts | Notícias financeiras | 5 min |

### 7.2 Dados do Usuário

| Hook | Arquivo | Descrição | Retorno |
|------|---------|-----------|---------|
| `useAuth()` | useAuth.tsx | Contexto de autenticação | user, session, profile, loading, signIn, signUp, signInWithGoogle, signOut, updateProfile |
| `usePortfolio()` | usePortfolio.ts | CRUD da carteira | portfolio[], isLoading, error, addStock, updateStock, deleteStock |
| `usePriceAlerts()` | usePriceAlerts.ts | CRUD de alertas de preço | alerts[], isLoading, createAlert, toggleAlert, deleteAlert |
| `useChatbot()` | useChatbot.ts | Lógica do chatbot | messages[], isLoading, sendMessage, clearHistory, sessionId |

---

## 8. Services (Camada de Serviço)

### 8.1 `marketData.ts` - Serviço Principal de Cotações

**Estratégia de 3 camadas de fallback:**
1. **Cache local** em memória (Map com TTL de 5 minutos)
2. **Edge Functions** (brapi.dev para BR, n8n para US)
3. **Fallback para tabela** `stock_prices` no banco de dados

**Funções exportadas:**

| Função | Descrição |
|--------|-----------|
| `getBrazilianStocks(symbols)` | Cotações BR via edge function + cache |
| `getUSStocks(symbols)` | Cotações US via n8n → fallback DB |
| `getStockQuote(symbol)` | Cotação individual (detecta mercado automaticamente) |
| `getStockHistory(symbol, market)` | Histórico com interpolação de dias úteis faltantes |
| `getMultipleQuotes(symbols, onProgress)` | Múltiplas cotações com callback de progresso |
| `detectMarket(symbol)` | Detecta mercado BR/US pelo padrão do ticker (termina em número = BR) |
| `clearMarketCache()` | Limpa todos os caches |

**Interface `MarketQuote`:**
```typescript
interface MarketQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  changeMonthly?: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  market: 'BR' | 'US';
  currency: 'BRL' | 'USD';
  updatedAt: string;
}
```

### 8.2 `n8nStocks.ts` - Ações Globais via n8n

Serviço para ações globais via edge function `fetch-global-stocks` (proxy do webhook n8n).

| Função | Descrição |
|--------|-----------|
| `fetchGlobalStocks()` | Busca todas as ações com cache |
| `getStocksByTickers(tickers)` | Filtra por array de tickers |
| `getStockByTicker(ticker)` | Uma ação específica |
| `clearN8nCache()` | Limpa cache |

**Parseamento automático:** Remove prefixos monetários (R$, US$) e símbolos de percentual (%) dos dados retornados pelo n8n.

**Interface `N8nStockQuote`:**
```typescript
interface N8nStockQuote {
  ticker: string;
  nome: string;
  preco: number;
  variacao_diaria: number;
  variacao_mensal: number;
}
```

### 8.3 `newsApi.ts` - Notícias Financeiras

| Função | Descrição |
|--------|-----------|
| `getFinanceNews(pageSize)` | Busca notícias via edge function `fetch-news` |

**Fallback:** 5 notícias mock (Reuters, InfoMoney, Valor Econômico, Bloomberg, Exame) são retornadas quando a API falha.

---

## 9. Chatbot (Invest AI)

### 9.1 Arquitetura
```
Frontend (FloatingChatbot)
    → supabase.functions.invoke("chat-webhook")
        → Edge Function (chat-webhook/index.ts)
            → POST para N8N_WEBHOOK_URL
                → n8n Workflow "CHAT BOT LANDING PAGE"
                    → (se isActivePlan) Sub-workflow "CHATBOT PLANO ATIVO"
                → Respond to Webhook
            ← Resposta JSON { response: "..." }
        ← Return { response: "..." }
    ← Renderiza mensagem com Markdown
```

### 9.2 Payload Enviado ao n8n
```json
{
  "message": "texto do usuário",
  "sessionId": "uuid-persistido-no-localStorage",
  "isActivePlan": true,
  "email": "user@email.com",
  "fullName": "Nome do Usuário",
  "timestamp": "2026-02-09T12:00:00.000Z"
}
```

### 9.3 Workflows n8n

**CHAT BOT LANDING PAGE:**
- Recebe mensagem via Webhook
- Verifica `isActivePlan` via nó IF
- Se `true`: Chama sub-workflow "CHATBOT PLANO ATIVO"
- Se `false`: Responde com versão limitada
- Responde via "Respond to Webhook"

**CHATBOT PLANO ATIVO:**
- Sub-workflow com funcionalidades avançadas para assinantes
- Processa mensagem com IA
- Retorna resposta enriquecida

### 9.4 Features do Frontend
- Botão flutuante fixo no canto inferior direito
- Disponível na landing page E em todas as páginas logadas (via DashboardLayout)
- Suporte a Markdown na renderização de respostas (react-markdown)
- Indicador de digitação (loading spinner)
- Rolagem automática para última mensagem
- SessionId persistido no `localStorage` (sobrevive refresh)
- Disclaimer legal obrigatório no rodapé do chat
- Identificação do usuário (email/nome) enviada no payload
- Botão de limpar histórico

### 9.5 Bug Conhecido ⚠️
**Problema:** No workflow n8n "CHAT BOT LANDING PAGE", quando `isActivePlan=false`, o nó "Call 'My workflow 2'" (sub-workflow) não está conectado ao nó "Respond to Webhook". Isso causa o n8n retornar um body vazio, gerando `SyntaxError: Unexpected end of JSON input` na edge function.

**Correção necessária no n8n:**
1. Abrir o workflow "CHAT BOT LANDING PAGE"
2. Conectar a saída do nó "Call 'My workflow 2'" ao nó "Respond to Webhook"
3. Garantir que o sub-workflow retorna dados no formato `{ "response": "texto" }`

**Correção sugerida na edge function:** Tratar respostas vazias/não-JSON usando `response.text()` + `try/catch` no `JSON.parse()`.

---

## 10. Funcionalidades por Página

### 10.1 Landing Page (`/`)
- **Navbar** com logo "InvestIA" e links (Sobre, Ferramentas, Blog, Login)
- **Market Ticker** com cotações em tempo real (PETR4, VALE3, ITUB4, MGLU3, USD/BRL, EUR/BRL)
- **Hero Section** com CTA "Comece Agora Grátis"
- **Seção de Notícias** financeiras (via edge function + fallback mock)
- **Market Overview** com tabs BR/US mostrando 5 ações de cada mercado
- **CTA** de cadastro
- **Footer** com links institucionais
- **Chatbot flutuante** (FloatingChatbot)

### 10.2 Dashboard (`/dashboard`) 🔒
- **Saudação personalizada** baseada no horário (Bom dia/Boa tarde/Boa noite)
- **AI Insight Card** com insight diário gerado por IA (sentimento: otimista/neutro/pessimista)
- **KPI Cards** com cotações de AAPL, MSFT, GOOGL
- **Ranking Card** com maiores altas do mercado
- **Main Chart** (Recharts) com gráfico de histórico de preços
- **Chatbot flutuante**

### 10.3 Mercado (`/mercado`) 🔒
- **Tabs** para alternar entre Brasil (B3) e EUA (NASDAQ/NYSE)
- **Barra de busca** com filtro local + busca API (brapi) para ações não monitoradas
- **Tabela de cotações** da tabela `stock_prices` com colunas: Ação (logo + ticker), Nome (com trend emoji), Preço, Var. Diária, Var. Mensal, Insight IA
- **Resultados da API** para buscas de ações não monitoradas (com dados enriched)
- **Botão Atualizar** para invalidar cache
- **Navegação** para página de detalhes ao clicar na linha

### 10.4 Detalhes da Ação (`/acao/:id`) 🔒
- Informações detalhadas de uma ação específica
- Gráfico de histórico de preços
- Dados de preço, variação, volume

### 10.5 Carteira (`/carteira`) 🔒
- **Cards resumo:**
  - Patrimônio Total (preço atual × quantidade)
  - Total Investido (preço médio × quantidade)
  - Lucro/Prejuízo (com percentual e ícone de tendência)
- **Tabela de ativos** com preço atual em tempo real (via getStockQuote)
- **CRUD completo:** Adicionar (StockFormDialog), Editar, Remover com confirmação
- **Detecção automática** de mercado (BR/US) e moeda (R$/US$)
- Cálculo de rentabilidade por ativo

### 10.6 Notificações (`/notificacoes`) 🔒
- Criar alertas de preço (acima/abaixo de valor X)
- Listar alertas ativos/inativos
- Ativar/desativar alertas (toggle)
- Excluir alertas

### 10.7 Configurações (`/configuracoes`) 🔒
- Editar nome completo
- Editar telefone (WhatsApp)
- Editar avatar

### 10.8 Blog (`/blog` e `/blog/:slug`)
- Listagem de posts publicados (filtro `published = true`)
- Página individual de post com conteúdo completo
- Sistema de categorias e autoria

### 10.9 Páginas Institucionais
- `/sobre` - Sobre a plataforma
- `/termos` - Termos de uso
- `/privacidade` - Política de privacidade
- `/contato` - Formulário de contato
- `/ferramentas` - Ferramentas disponíveis
- `/analises` - Análises de mercado

---

## 11. Segurança (RLS)

### 11.1 Isolamento de Dados por Usuário
Todas as tabelas com dados de usuário implementam Row Level Security (RLS) com `auth.uid() = user_id`:

| Tabela | SELECT | INSERT | UPDATE | DELETE |
|--------|--------|--------|--------|--------|
| `profiles` | ✅ próprio | ✅ próprio | ✅ próprio | ❌ bloqueado |
| `portfolio` | ✅ próprio | ✅ próprio | ✅ próprio | ✅ próprio |
| `price_alerts` | ✅ próprio | ✅ próprio | ✅ próprio | ✅ próprio |

### 11.2 Dados Públicos (Leitura)
Tabelas de mercado são de leitura pública (sem filtro por user_id):

| Tabela | SELECT | INSERT | UPDATE | DELETE |
|--------|--------|--------|--------|--------|
| `stock_prices` | ✅ público | ✅ público | ❌ | ❌ |
| `stock_quotes` | ✅ público | ❌ | ❌ | ❌ |
| `stock_rankings` | ✅ público | ❌ | ❌ | ❌ |
| `daily_insights` | ✅ público | ❌ | ❌ | ❌ |
| `system_logs` | ✅ público | ❌ | ❌ | ❌ |
| `extraction_logs` | ✅ público | ✅ público | ❌ | ❌ |
| `blog_posts` | ✅ publicados | ✅ autenticado | ✅ autenticado | ✅ autenticado |

### 11.3 Políticas Restrictive
Todas as policies são do tipo **RESTRICTIVE** (usando `WITH CHECK` para INSERT e `USING` para SELECT/UPDATE/DELETE), garantindo que nenhuma outra policy permissiva possa sobrescrevê-las.

---

## 12. Integrações Externas

### 12.1 brapi.dev (Ações Brasileiras)
- **Uso:** Cotações de ações da B3, busca por ticker/nome
- **Secret:** `BRAPI_TOKEN`
- **Edge Functions:** `fetch-brazilian-stocks`, `search-stocks`
- **Dados:** Preço, variação, volume, histórico, logo, nome

### 12.2 n8n (Automação)
- **Uso:** Coleta de cotações globais, chatbot com IA
- **Secret:** `N8N_WEBHOOK_URL`
- **Edge Functions:** `fetch-global-stocks`, `chat-webhook`
- **Workflows:**
  - Coleta automática de ações BR e US
  - Cálculo de rankings de performance
  - Geração de insights diários com IA
  - Chatbot interativo com rotas por plano

### 12.3 APIs de Notícias
- **NewsAPI.org** (`NEWS_API_KEY`) - Notícias financeiras em inglês
- **GNews** (`GNEWS_API_KEY`) - Notícias alternativas
- **Edge Function:** `fetch-news`

### 12.4 APIs de Dados Financeiros
- **Financial Modeling Prep** (`FMP_API_KEY`) - Dados de ações US
- **Twelve Data** (`TWELVE_DATA_API_KEY`) - Dados de mercado alternativos

---

## 13. Design System

### 13.1 Tema
- **Tema escuro** como padrão
- Tokens semânticos via CSS variables em HSL
- Sistema de design baseado em shadcn/ui com 40+ componentes

### 13.2 Tokens Principais
```css
:root {
  --background: /* HSL */;
  --foreground: /* HSL */;
  --primary: /* HSL */;
  --primary-foreground: /* HSL */;
  --secondary: /* HSL */;
  --muted: /* HSL */;
  --muted-foreground: /* HSL */;
  --accent: /* HSL */;
  --destructive: /* HSL */;
  --border: /* HSL */;
  --sidebar-*: /* tokens da sidebar */;
}
```

### 13.3 Classes Customizadas
| Classe | Uso |
|--------|-----|
| `.glass-card` | Card com efeito glassmorphism |
| `.kpi-card` | Card de KPI do dashboard |
| `.ticker-badge` | Badge de ticker de ação (ex: PETR4) |
| `.gradient-text` | Texto com gradiente de cor |
| `.table-row-interactive` | Linha de tabela com hover interativo |

### 13.4 Animações
- `animate-fade-in` com delays escalonados (0.1s, 0.2s, 0.3s)
- Transições suaves em hover de cards e botões
- Spinner de loading (animate-spin)
- Pulse para estados de carregamento (animate-pulse)

---

## 14. Deploy e Ambiente

### 14.1 Ambientes
| Ambiente | URL | Descrição |
|----------|-----|-----------|
| **Test (Preview)** | `id-preview--bf998e8d-...lovable.app` | Desenvolvimento e testes |
| **Live (Production)** | `insight-pulse-258.lovable.app` | Publicado para usuários |

### 14.2 Deploy
- **Frontend:** Deploy via botão "Publish" no Lovable (requer ação manual)
- **Edge Functions:** Deploy automático ao salvar código
- **Database:** Migrations executadas via Lovable Cloud

### 14.3 Variáveis de Ambiente (auto-geradas)
```
VITE_SUPABASE_URL=https://zwlvmzsfcvomjckvvknn.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...
VITE_SUPABASE_PROJECT_ID=zwlvmzsfcvomjckvvknn
```

---

## 15. Dependências Principais

| Pacote | Versão | Uso |
|--------|--------|-----|
| `react` | ^18.3.1 | Framework UI |
| `react-dom` | ^18.3.1 | Renderização DOM |
| `react-router-dom` | ^6.30.1 | Roteamento SPA |
| `@tanstack/react-query` | ^5.83.0 | Cache e estado do servidor |
| `@supabase/supabase-js` | ^2.94.1 | Cliente Supabase |
| `recharts` | ^2.15.4 | Gráficos |
| `react-markdown` | ^10.1.0 | Renderização Markdown (chatbot) |
| `lucide-react` | ^0.462.0 | Ícones |
| `sonner` | ^1.7.4 | Toast notifications |
| `tailwind-merge` | ^2.6.0 | Merge de classes Tailwind |
| `class-variance-authority` | ^0.7.1 | Variantes de componentes |
| `zod` | ^3.25.76 | Validação de schemas |
| `react-hook-form` | ^7.61.1 | Formulários |
| `date-fns` | ^3.6.0 | Manipulação de datas |

---

## 16. Backlog / Melhorias Futuras

- [ ] Persistir histórico do chatbot no banco de dados
- [ ] Personalizar chatbot com dados da carteira do usuário
- [ ] Notificações push via Web Push API
- [ ] Dashboard de análise técnica (médias móveis, RSI, MACD, Bandas de Bollinger)
- [ ] Comparador de ações (side-by-side)
- [ ] Exportar carteira em CSV/PDF
- [ ] Planos de assinatura com Stripe
- [ ] Progressive Web App (PWA) para mobile
- [ ] Internacionalização (i18n) - Português/Inglês
- [ ] Toggle modo claro/escuro
- [ ] Relatórios de performance da carteira (mensal/anual)
- [ ] Integração com B3 para importação automática de notas de corretagem
- [ ] Dividendos e proventos tracking
- [ ] Social features (compartilhar carteira, seguir investidores)
