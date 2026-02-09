import { Link } from "react-router-dom";
import { Bot, LineChart, Bell, Wallet, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "Insights com IA",
    description:
      "Nossa inteligência artificial analisa o mercado 24/7 e te envia alertas personalizados sobre oportunidades.",
    href: "/analises",
  },
  {
    icon: LineChart,
    title: "Análise Técnica",
    description:
      "Gráficos avançados com indicadores técnicos para você tomar decisões baseadas em dados.",
    href: "/ferramentas",
  },
  {
    icon: Bell,
    title: "Alertas em Tempo Real",
    description:
      "Receba notificações instantâneas sobre movimentações importantes nas suas ações.",
    href: "/ferramentas",
  },
  {
    icon: Wallet,
    title: "Gestão de Carteira",
    description:
      "Acompanhe todos os seus investimentos em um só lugar com visão consolidada.",
    href: "/ferramentas",
  },
  {
    icon: Shield,
    title: "Segurança Total",
    description:
      "Seus dados protegidos com criptografia de ponta e autenticação em duas etapas.",
    href: "/sobre",
  },
  {
    icon: Zap,
    title: "Performance",
    description:
      "Plataforma otimizada para carregar dados em milissegundos, sem travamentos.",
    href: "/sobre",
  },
];

export function Features() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Tudo que você precisa para{" "}
            <span className="text-primary">investir melhor</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ferramentas profissionais simplificadas para investidores de todos os níveis.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Link
              key={index}
              to={feature.href}
              className="group bg-card rounded-xl border border-border p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg"
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
