-- 1. Tabela stock_quotes (Cotações históricas)
CREATE TABLE public.stock_quotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  price DECIMAL(18, 4) NOT NULL,
  change_percent DECIMAL(10, 4) NOT NULL DEFAULT 0,
  volume BIGINT NOT NULL DEFAULT 0,
  market TEXT NOT NULL CHECK (market IN ('BR', 'US')),
  currency TEXT NOT NULL DEFAULT 'BRL' CHECK (currency IN ('BRL', 'USD')),
  fetched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_stock_quotes_symbol ON public.stock_quotes(symbol);
CREATE INDEX idx_stock_quotes_market ON public.stock_quotes(market);
CREATE INDEX idx_stock_quotes_fetched_at ON public.stock_quotes(fetched_at DESC);

-- RLS para stock_quotes (leitura pública, escrita via service role)
ALTER TABLE public.stock_quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ler cotações" 
ON public.stock_quotes 
FOR SELECT 
USING (true);

-- 2. Tabela system_logs (Logs do sistema)
CREATE TABLE public.system_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  action TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('SUCCESS', 'ERROR', 'PENDING')),
  details JSONB DEFAULT '{}',
  source TEXT NOT NULL DEFAULT 'system',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_system_logs_action ON public.system_logs(action);
CREATE INDEX idx_system_logs_status ON public.system_logs(status);
CREATE INDEX idx_system_logs_created_at ON public.system_logs(created_at DESC);

-- RLS para system_logs (leitura pública, escrita via service role)
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ler logs" 
ON public.system_logs 
FOR SELECT 
USING (true);

-- 3. Tabela stock_rankings (Cache de rankings)
CREATE TABLE public.stock_rankings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  daily_change DECIMAL(10, 4) NOT NULL DEFAULT 0,
  weekly_change DECIMAL(10, 4),
  monthly_change DECIMAL(10, 4),
  rank_position INTEGER NOT NULL,
  market TEXT NOT NULL CHECK (market IN ('BR', 'US')),
  calculated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_stock_rankings_market ON public.stock_rankings(market);
CREATE INDEX idx_stock_rankings_rank ON public.stock_rankings(rank_position);
CREATE INDEX idx_stock_rankings_calculated_at ON public.stock_rankings(calculated_at DESC);

-- RLS para stock_rankings (leitura pública, escrita via service role)
ALTER TABLE public.stock_rankings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ler rankings" 
ON public.stock_rankings 
FOR SELECT 
USING (true);