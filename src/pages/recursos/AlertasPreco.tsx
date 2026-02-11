import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Bell, ArrowRight, CheckCircle2, Smartphone, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export default function AlertasPreco() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-2xl bg-primary/10">
              <Bell className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Alertas de <span className="text-primary">Preço</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Nunca mais perca uma oportunidade de investimento. Defina seus preços-alvo e seja notificado instantaneamente onde você estiver.
          </p>
          <Link to="/login">
            <Button size="lg" className="gap-2">
              Configurar Alertas <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-card p-8 rounded-2xl border border-border hover:border-primary/30 transition-colors">
            <Zap className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Tempo Real</h3>
            <p className="text-muted-foreground">Monitoramento contínuo do mercado. Assim que o preço bater, você sabe.</p>
          </div>
          <div className="bg-card p-8 rounded-2xl border border-border hover:border-primary/30 transition-colors">
            <Smartphone className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">WhatsApp</h3>
            <p className="text-muted-foreground">Receba notificações diretamente no seu WhatsApp, sem precisar instalar apps extras.</p>
          </div>
          <div className="bg-card p-8 rounded-2xl border border-border hover:border-primary/30 transition-colors">
            <CheckCircle2 className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Personalizável</h3>
            <p className="text-muted-foreground">Defina alertas de alta ou baixa para qualquer ativo da B3 ou mercado americano.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}