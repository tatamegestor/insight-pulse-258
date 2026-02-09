import { Link } from "react-router-dom";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

const posts = [
  {
    title: "Como a IA está revolucionando o mercado financeiro",
    excerpt: "Descubra como algoritmos de inteligência artificial estão transformando a forma como investidores analisam e tomam decisões no mercado de ações.",
    category: "Inteligência Artificial",
    date: "08 Fev 2026",
    readTime: "5 min",
    image: "📊",
  },
  {
    title: "Guia completo: Como montar sua primeira carteira de ações",
    excerpt: "Um passo a passo para iniciantes que querem começar a investir na bolsa de valores com segurança e estratégia.",
    category: "Educação",
    date: "05 Fev 2026",
    readTime: "8 min",
    image: "📈",
  },
  {
    title: "5 indicadores técnicos que todo investidor deve conhecer",
    excerpt: "Aprenda sobre os principais indicadores técnicos usados por profissionais para identificar oportunidades no mercado.",
    category: "Análise Técnica",
    date: "02 Fev 2026",
    readTime: "6 min",
    image: "📉",
  },
  {
    title: "Diversificação: a estratégia que protege seu patrimônio",
    excerpt: "Entenda por que diversificar seus investimentos é essencial para reduzir riscos e maximizar retornos a longo prazo.",
    category: "Estratégia",
    date: "30 Jan 2026",
    readTime: "4 min",
    image: "🛡️",
  },
  {
    title: "Mercado brasileiro vs americano: onde investir?",
    excerpt: "Uma comparação detalhada entre B3 e NASDAQ/NYSE para ajudar você a decidir onde alocar seus recursos.",
    category: "Mercados",
    date: "27 Jan 2026",
    readTime: "7 min",
    image: "🌎",
  },
  {
    title: "Alertas de preço: como usar a seu favor",
    excerpt: "Aprenda a configurar alertas inteligentes para nunca perder oportunidades de compra ou venda no momento certo.",
    category: "Ferramentas",
    date: "24 Jan 2026",
    readTime: "3 min",
    image: "🔔",
  },
];

export default function Blog() {
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

        {/* Featured Post */}
        <Link to="#" className="block group mb-10">
          <Card className="overflow-hidden transition-shadow hover:shadow-lg">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="h-64 md:h-80 bg-muted/50 flex items-center justify-center text-8xl">
                {posts[0].image}
              </div>
              <CardContent className="p-8 flex flex-col justify-center">
                <Badge variant="secondary" className="w-fit mb-3">{posts[0].category}</Badge>
                <h2 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {posts[0].title}
                </h2>
                <p className="text-muted-foreground mb-4">{posts[0].excerpt}</p>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>{posts[0].date}</span>
                  <span>•</span>
                  <span>{posts[0].readTime} de leitura</span>
                </div>
              </CardContent>
            </div>
          </Card>
        </Link>

        {/* Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.slice(1).map((post) => (
            <Link to="#" key={post.title} className="group">
              <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
                <div className="h-40 bg-muted/50 flex items-center justify-center text-6xl">
                  {post.image}
                </div>
                <CardContent className="p-5">
                  <Badge variant="secondary" className="mb-2">{post.category}</Badge>
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{post.date}</span>
                    <span className="flex items-center gap-1 text-primary font-medium">
                      Ler <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
