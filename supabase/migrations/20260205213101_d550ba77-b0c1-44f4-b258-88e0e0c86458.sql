-- Criar tabela daily_insights para armazenar insights gerados pelo GPT via n8n
CREATE TABLE public.daily_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  sentiment text NOT NULL DEFAULT 'neutro',
  market text NOT NULL DEFAULT 'BOTH',
  generated_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.daily_insights ENABLE ROW LEVEL SECURITY;

-- Política: Todos podem ler insights (leitura pública)
CREATE POLICY "Todos podem ler insights" 
  ON public.daily_insights 
  FOR SELECT 
  USING (true);