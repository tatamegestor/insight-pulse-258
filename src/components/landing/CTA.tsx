import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  "Acesso a todos os mercados",
  "Insights de IA ilimitados",
  "Alertas personalizados",
  "Suporte prioritário",
];

export function CTA() {
  return (
    <section className="py-20 bg-sidebar text-sidebar-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Comece a investir de forma{" "}
            <span className="text-primary">inteligente</span> hoje
          </h2>
          <p className="text-lg text-sidebar-foreground/70 mb-8">
            Junte-se a milhares de investidores que já estão usando IA para 
            tomar melhores decisões no mercado financeiro.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm text-sidebar-foreground/80"
              >
                <Check className="h-4 w-4 text-primary" />
                {benefit}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-12 text-base"
              >
                Criar Conta Grátis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/mercado">
              <Button
                size="lg"
                variant="outline"
                className="border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent px-8 h-12 text-base"
              >
                Explorar Mercados
              </Button>
            </Link>
          </div>

          <p className="text-sm text-sidebar-foreground/50 mt-6">
            Grátis para começar. Sem cartão de crédito necessário.
          </p>
        </div>
      </div>
    </section>
  );
}
