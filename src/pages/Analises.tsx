import { Link } from "react-router-dom";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Bot, TrendingUp, BarChart3, PieChart, ArrowRight, Sparkles, Lock } from "lucide-react";

const analysisTypes = [
  {
    icon: Sparkles,
    title: "Insight Diário de IA",
    description: "Todos os dias nossa IA analisa o mercado e gera um resumo com sentimento (otimista, neutro ou pessimista) sobre o panorama geral.",
    available: true,
    href: "/recursos/insights",
  },
  {
    icon: Bot,
    title: "Análise por Ação",
    description: "Cada ativo monitorado recebe um insight automático baseado em variação diária, posição no range de 52 semanas e volatilidade.",
    available: true,
    href: "/mercado",
  },
  {
    icon: BarChart3,
    title: "Tendências de Mercado",
    description: "Identifique tendências de alta, baixa ou estabilidade com base em indicadores calculados automaticamente.",
    available: true,
    href: "/mercado",
  },
  {
    icon: PieChart,
    title: "Análise de Carteira",
    description: "Visualize a composição da sua carteira, distribuição de risco e performance comparada ao mercado.",
    available: true,
    href: "/recursos/carteira",
  },
  {
    icon: TrendingUp,
    title: "Ranking Inteligente",
    description: "Rankings automáticos das maiores altas e baixas, atualizados continuamente via automação.",
    available: true,
    href: "/recursos/rankings",
  },
];

export default function Analises() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Análises <span className="text-primary">Inteligentes</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Nossa IA trabalha 24/7 para analisar o mercado e fornecer insights acionáveis para seus investimentos.
          </p>
        </div>

        <div className="space-y-6 mb-16">
          {analysisTypes.map((analysis) => (
            <div key={analysis.title} className="bg-card border border-border rounded-xl p-6 flex flex-col md:flex-row gap-6 items-start md:items-center transition-all hover:border-primary/30">
              <div className="h-14 w-14 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
                <analysis.icon className="h-7 w-7 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-foreground">{analysis.title}</h3>
                  {analysis.available ? (
                    <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded-full font-medium">Disponível</span>
                  ) : (
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                      <Lock className="h-3 w-3" /> Em breve
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground">{analysis.description}</p>
              </div>
              <Link to={analysis.href || "/login"} className="shrink-0">
                <Button variant="outline" size="sm">
                  Acessar
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-sidebar rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-bold text-sidebar-foreground mb-3">
            Comece a usar análises de IA agora
          </h2>
          <p className="text-sidebar-foreground/70 mb-6">
            Crie sua conta gratuita e tenha acesso a todas as análises disponíveis.
          </p>
          <Link to="/login">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Criar Conta Grátis
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
