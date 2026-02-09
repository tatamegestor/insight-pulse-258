import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, Bot, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-14">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Bot className="h-4 w-4" />
              Inteligência Artificial para Investidores
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Invista com{" "}
              <span className="text-primary">inteligência</span>,{" "}
              lucre com{" "}
              <span className="text-success">estratégia</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              Acompanhe o mercado em tempo real, receba insights baseados em IA e tome 
              decisões de investimento mais inteligentes. Tudo em uma única plataforma.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/login">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-12 text-base">
                  Comece Grátis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="#mercados">
                <Button size="lg" variant="outline" className="px-8 h-12 text-base">
                  Explorar Mercados
                </Button>
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mt-10 pt-10 border-t border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-5 w-5 text-success" />
                <span>Dados seguros</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="h-5 w-5 text-primary" />
                <span>Tempo real</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-5 w-5 text-success" />
                <span>+50k usuários</span>
              </div>
            </div>
          </div>

          {/* Stats/Visual */}
          <div className="relative">
            <div className="bg-card rounded-2xl border border-border shadow-lg p-6">
              {/* Mini chart header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Índice Principal</p>
                  <p className="text-2xl font-bold text-foreground">IBOV</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold font-mono text-foreground">128.450</p>
                  <p className="text-sm font-medium text-success">+1.24% ↑</p>
                </div>
              </div>

              {/* Fake chart */}
              <div className="h-48 bg-muted/50 rounded-lg flex items-end justify-between gap-1 p-4">
                {[40, 55, 45, 60, 50, 70, 65, 80, 75, 85, 78, 90].map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-primary/80 rounded-t-sm transition-all hover:bg-primary"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>

              {/* Mini tickers */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">S&P 500</p>
                  <p className="font-bold font-mono text-sm">5.234</p>
                  <p className="text-xs text-success">+0.45%</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Bitcoin</p>
                  <p className="font-bold font-mono text-sm">$68.5K</p>
                  <p className="text-xs text-destructive">-1.2%</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Dólar</p>
                  <p className="font-bold font-mono text-sm">R$4.92</p>
                  <p className="text-xs text-success">+0.15%</p>
                </div>
              </div>
            </div>

            {/* Floating cards */}
            <div className="absolute -top-4 -right-4 bg-card border border-border rounded-lg p-3 shadow-lg animate-fade-in">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-success/20 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-success" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Alerta IA</p>
                  <p className="text-sm font-semibold text-foreground">PETR4 +5.2%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
