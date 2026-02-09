import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Check, Zap, Crown, Rocket } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Gratuito",
    price: "R$ 0",
    period: "/mês",
    description: "Para quem está começando a investir",
    icon: Zap,
    highlight: false,
    features: [
      "Cotações em tempo real",
      "Dashboard básico",
      "Rankings de ações",
      "Notícias do mercado",
      "1 alerta de preço",
    ],
    cta: "Começar Grátis",
    ctaLink: "/login?tab=register",
  },
  {
    name: "Pro",
    price: "R$ 29,90",
    period: "/mês",
    description: "Para investidores que querem ir além",
    icon: Crown,
    highlight: true,
    badge: "Mais Popular",
    features: [
      "Tudo do plano Gratuito",
      "Insights diários com IA",
      "Alertas ilimitados de preço",
      "Gestão completa de carteira",
      "Chatbot IA exclusivo",
      "Análises avançadas",
      "Notificações via WhatsApp",
    ],
    cta: "Assinar Pro",
    ctaLink: "/login?tab=register",
  },
  {
    name: "Enterprise",
    price: "R$ 99,90",
    period: "/mês",
    description: "Para profissionais e assessores",
    icon: Rocket,
    highlight: false,
    features: [
      "Tudo do plano Pro",
      "API de dados em tempo real",
      "Relatórios personalizados",
      "Multi-carteiras",
      "Suporte prioritário",
      "Webhooks e integrações",
      "Dashboard white-label",
    ],
    cta: "Falar com Vendas",
    ctaLink: "/contato",
  },
];

export default function Valores() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Planos & <span className="text-primary">Valores</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Escolha o plano ideal para o seu perfil de investidor. Cancele quando quiser.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-8 flex flex-col transition-all duration-300 ${
                  plan.highlight
                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/10 scale-[1.03]"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-xs font-semibold px-4 py-1.5 rounded-full">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${plan.highlight ? "bg-primary/10" : "bg-muted"}`}>
                    <Icon className={`h-5 w-5 ${plan.highlight ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                </div>

                <div className="mb-2">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-foreground">
                      <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to={plan.ctaLink}>
                  <Button
                    className={`w-full ${
                      plan.highlight
                        ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                        : "bg-muted hover:bg-muted/80 text-foreground"
                    }`}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-foreground mb-8">Perguntas Frequentes</h2>
          <div className="space-y-6 text-left">
            {[
              {
                q: "Posso cancelar a qualquer momento?",
                a: "Sim! Sem fidelidade, sem multas. Cancele quando quiser pela página de configurações.",
              },
              {
                q: "Os dados de mercado são em tempo real?",
                a: "Sim, todos os planos têm acesso a cotações em tempo real da B3 e mercados internacionais.",
              },
              {
                q: "Como funciona o Chatbot IA?",
                a: "Nosso assistente com inteligência artificial responde dúvidas sobre seus investimentos, analisa sua carteira e fornece insights personalizados.",
              },
            ].map((faq) => (
              <div key={faq.q} className="border border-border rounded-xl p-5 bg-card">
                <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
