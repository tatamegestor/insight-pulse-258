

# Completar o Sistema SaaS - Isolamento de Dados por Usuario

## Situacao Atual

O sistema ja possui boa parte da estrutura SaaS implementada:

| Recurso | Status | Detalhes |
|---------|--------|----------|
| Autenticacao | OK | Email/senha + Google OAuth |
| Perfis (nome, telefone) | OK | Tabela `profiles` com RLS por `user_id` |
| Alertas de preco | OK | Tabela `price_alerts` com RLS por `user_id` |
| Rotas protegidas | OK | Todas as paginas internas usam `ProtectedRoute` |
| **Carteira (portfolio)** | **FALTANDO** | **Tabela nao existe no banco** |

## O Que Precisa Ser Feito

### 1. Criar a tabela `portfolio` no banco de dados

Criar a tabela com as colunas necessarias (symbol, name, quantity, avg_price, logo, user_id) e com RLS habilitado, garantindo que cada usuario so veja, edite e delete seus proprios ativos.

Politicas RLS:
- SELECT: somente onde `auth.uid() = user_id`
- INSERT: somente onde `auth.uid() = user_id`
- UPDATE: somente onde `auth.uid() = user_id`
- DELETE: somente onde `auth.uid() = user_id`

### 2. Nenhuma alteracao de codigo necessaria

O codigo do frontend (`usePortfolio.ts`, `Carteira.tsx`) ja esta pronto e filtra por `user_id`. So precisa da tabela no banco.

## Resumo

Apos criar a tabela `portfolio` com RLS, o sistema estara 100% funcional como SaaS:
- Cada usuario tera seus proprios dados isolados (perfil, carteira, alertas)
- Nenhum usuario consegue acessar dados de outro
- Todas as paginas exigem autenticacao

## Detalhes Tecnicos

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

ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own portfolio" ON public.portfolio
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own portfolio" ON public.portfolio
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own portfolio" ON public.portfolio
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own portfolio" ON public.portfolio
  FOR DELETE USING (auth.uid() = user_id);
```

