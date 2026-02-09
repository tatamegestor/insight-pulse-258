import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import ReactMarkdown from "react-markdown";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string;
  cover_image_url: string | null;
  author: string;
  category: string;
  published_at: string | null;
  created_at: string;
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      return data as BlogPost | null;
    },
    enabled: !!slug,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link to="/blog" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
          <ArrowLeft className="h-4 w-4" /> Voltar ao Blog
        </Link>

        {isLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {!isLoading && !post && (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-xl">Artigo não encontrado.</p>
          </div>
        )}

        {post && (
          <article>
            {post.cover_image_url && (
              <img src={post.cover_image_url} alt={post.title} className="w-full h-64 sm:h-80 object-cover rounded-xl mb-8" />
            )}
            <Badge variant="secondary" className="mb-4">{post.category}</Badge>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{post.title}</h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-8">
              <span>Por {post.author}</span>
              <span>•</span>
              <span>{post.published_at ? format(new Date(post.published_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : ""}</span>
            </div>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          </article>
        )}
      </main>
      <Footer />
    </div>
  );
}
