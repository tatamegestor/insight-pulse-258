import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Sun, BarChart3, FileText } from "lucide-react";
import { Link } from "react-router-dom";

export default function InsightDiario() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-2xl bg-primary/10">
              <Sparkles className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Insight Diário de <span className="text-primary">IA</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Comece o dia com vantagem. Nossa IA processa milhares de notícias e dados para entregar um resumo estratégico do mercado todas as manhãs.
          </p>
          <Link to="/login">
            <Button size="lg" className="gap-2">
              Ler Insight de Hoje <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card p-8 rounded-2xl border border-border">
            <Sun className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Panorama Geral</h3>
            <p className="text-muted-foreground">Entenda o humor do mercado antes mesmo da abertura do pregão.</p>
          </div>
          <div className="bg-card p-8 rounded-2xl border border-border">
            <BarChart3 className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Tendências</h3>
            <p className="text-muted-foreground">Identifique quais setores e ativos estão em destaque e merecem sua atenção.</p>
          </div>
          <div className="bg-card p-8 rounded-2xl border border-border">
            <FileText className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Resumo Executivo</h3>
            <p className="text-muted-foreground">Informação condensada e direta ao ponto, sem ruídos, para você tomar decisões rápidas.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}