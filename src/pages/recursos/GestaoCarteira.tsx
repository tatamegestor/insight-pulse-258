import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Wallet, ArrowRight, PieChart, TrendingUp, History } from "lucide-react";
import { Link } from "react-router-dom";

export default function GestaoCarteira() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-2xl bg-primary/10">
              <Wallet className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Gestão de <span className="text-primary">Carteira</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Tenha uma visão clara e consolidada do seu patrimônio. Acompanhe a rentabilidade e a distribuição dos seus ativos em um único lugar.
          </p>
          <Link to="/login">
            <Button size="lg" className="gap-2">
              Criar Minha Carteira <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card p-8 rounded-2xl border border-border">
            <TrendingUp className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Rentabilidade</h3>
            <p className="text-muted-foreground">Cálculo automático de lucro/prejuízo com base no seu preço médio e cotação atual.</p>
          </div>
          <div className="bg-card p-8 rounded-2xl border border-border">
            <PieChart className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Distribuição</h3>
            <p className="text-muted-foreground">Visualize a composição da sua carteira com gráficos intuitivos e claros.</p>
          </div>
          <div className="bg-card p-8 rounded-2xl border border-border">
            <History className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Histórico</h3>
            <p className="text-muted-foreground">Mantenha o registro de quando você comprou cada ativo e acompanhe a evolução.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}