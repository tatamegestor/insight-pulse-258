
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  author TEXT NOT NULL DEFAULT 'Equipe InsightPulse',
  category TEXT NOT NULL DEFAULT 'Mercado',
  published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ler posts publicados"
  ON public.blog_posts FOR SELECT
  USING (published = true);

CREATE POLICY "Admins podem inserir posts"
  ON public.blog_posts FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins podem atualizar posts"
  ON public.blog_posts FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins podem deletar posts"
  ON public.blog_posts FOR DELETE
  USING (auth.uid() IS NOT NULL);

CREATE INDEX idx_blog_posts_slug ON public.blog_posts (slug);
CREATE INDEX idx_blog_posts_published ON public.blog_posts (published, published_at DESC);
