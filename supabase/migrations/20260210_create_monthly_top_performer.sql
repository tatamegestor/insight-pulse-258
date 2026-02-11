-- Tabela para armazenar o ativo com maior variação mensal
CREATE TABLE public.monthly_top_performer (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  price DECIMAL(15, 4) NOT NULL,
  monthly_change DECIMAL(10, 4) NOT NULL,
  market TEXT NOT NULL CHECK (market IN ('BR', 'US')),
  currency TEXT NOT NULL DEFAULT 'USD',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_monthly_top_performer_market ON public.monthly_top_performer(market);
CREATE INDEX idx_monthly_top_performer_updated_at ON public.monthly_top_performer(updated_at DESC);

-- RLS para monthly_top_performer (leitura pública, escrita via service role)
ALTER TABLE public.monthly_top_performer ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ler top performer mensal" 
ON public.monthly_top_performer 
FOR SELECT 
USING (true);

CREATE POLICY "Apenas service role pode inserir/atualizar" 
ON public.monthly_top_performer 
FOR ALL 
USING (false)
WITH CHECK (false);
