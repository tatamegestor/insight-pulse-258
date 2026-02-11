import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { TrendingUp, ArrowRight, TrendingDown, Activity } from "lucide-react";
import { Link } from "react-router-dom";

export default function Rankings() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-2xl bg-primary/10">
              <TrendingUp className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Rankings de <span className="text-primary">Ações</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Descubra as oportunidades do momento. Acompanhe as maiores altas, baixas e os ativos mais negociados do dia em tempo real.
          </p>
          <Link to="/login">
            <Button size="lg" className="gap-2">
              Ver Rankings Completos <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card p-8 rounded-2xl border border-border">
            <TrendingUp className="h-10 w-10 text-success mb-4" />
            <h3 className="text-xl font-semibold mb-2">Maiores Altas</h3>
            <p className="text-muted-foreground">Veja quais empresas estão se valorizando hoje e entenda os motivos.</p>
          </div>
          <div className="bg-card p-8 rounded-2xl border border-border">
            <TrendingDown className="h-10 w-10 text-destructive mb-4" />
            <h3 className="text-xl font-semibold mb-2">Maiores Baixas</h3>
            <p className="text-muted-foreground">Identifique correções de mercado e possíveis oportunidades de compra.</p>
          </div>
          <div className="bg-card p-8 rounded-2xl border border-border">
            <Activity className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Mais Ativas</h3>
            <p className="text-muted-foreground">Acompanhe as ações com maior volume de negociação e liquidez.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}