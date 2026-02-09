import { Link } from "react-router-dom";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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

function useBlogPosts() {
  return useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data as BlogPost[];
    },
  });
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  return format(new Date(dateStr), "dd MMM yyyy", { locale: ptBR });
}

function estimateReadTime(content: string) {
  const words = content.split(/\s+/).length;
  return `${Math.max(1, Math.ceil(words / 200))} min`;
}

export default function Blog() {
  const { data: posts, isLoading } = useBlogPosts();

  const hasPosts = posts && posts.length > 0;
  const featured = hasPosts ? posts[0] : null;
  const rest = hasPosts ? posts.slice(1) : [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Blog <span className="text-primary">Invest AI</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Artigos, tutoriais e análises para ajudar você a investir melhor.
          </p>
        </div>

        {isLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {!isLoading && !hasPosts && (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-xl">Nenhum artigo publicado ainda.</p>
            <p className="mt-2">Volte em breve para novidades!</p>
          </div>
        )}

        {featured && (
          <Link to={`/blog/${featured.slug}`} className="block group mb-10">
            <Card className="overflow-hidden transition-shadow hover:shadow-lg">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="h-64 md:h-80 bg-muted/50 flex items-center justify-center overflow-hidden">
                  {featured.cover_image_url ? (
                    <img src={featured.cover_image_url} alt={featured.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-8xl">📝</span>
                  )}
                </div>
                <CardContent className="p-8 flex flex-col justify-center">
                  <Badge variant="secondary" className="w-fit mb-3">{featured.category}</Badge>
                  <h2 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-muted-foreground mb-4">{featured.summary}</p>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{formatDate(featured.published_at)}</span>
                    <span>•</span>
                    <span>{estimateReadTime(featured.content)} de leitura</span>
                  </div>
                </CardContent>
              </div>
            </Card>
          </Link>
        )}

        {rest.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post) => (
              <Link to={`/blog/${post.slug}`} key={post.id} className="group">
                <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
                  <div className="h-40 bg-muted/50 flex items-center justify-center overflow-hidden">
                    {post.cover_image_url ? (
                      <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-6xl">📝</span>
                    )}
                  </div>
                  <CardContent className="p-5">
                    <Badge variant="secondary" className="mb-2">{post.category}</Badge>
                    <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{post.summary}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatDate(post.published_at)}</span>
                      <span className="flex items-center gap-1 text-primary font-medium">
                        Ler <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
