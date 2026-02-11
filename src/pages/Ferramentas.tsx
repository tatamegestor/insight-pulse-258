import { Link } from "react-router-dom";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Bot, LineChart, Bell, Wallet, TrendingUp, Search, ArrowRight } from "lucide-react";

const tools = [
  {
    icon: Bot,
    title: "Chatbot com IA",
    description: "Converse com nossa inteligência artificial sobre qualquer ação ou estratégia de investimento. Receba análises personalizadas em tempo real.",
    cta: "Experimentar",
    href: "/recursos/chatbot",
    badge: "IA",
  },
  {
    icon: LineChart,
    title: "Gráficos Avançados",
    description: "Visualize históricos de preços com gráficos interativos de até 3 meses. Identifique tendências e padrões com facilidade.",
    cta: "Ver Mercados",
    href: "/mercado",
    badge: "Dados Reais",
  },
  {
    icon: Bell,
    title: "Alertas de Preço",
    description: "Configure alertas personalizados para ser notificado quando uma ação atingir o preço desejado. Nunca perca uma oportunidade.",
    cta: "Configurar Alertas",
    href: "/recursos/alertas",
    badge: "Tempo Real",
  },
  {
    icon: Wallet,
    title: "Gestão de Carteira",
    description: "Acompanhe todos os seus investimentos em um painel consolidado. Veja performance, variações e distribuição de ativos.",
    cta: "Acessar Carteira",
    href: "/recursos/carteira",
    badge: "Dashboard",
  },
  {
    icon: TrendingUp,
    title: "Ranking de Ações",
    description: "Descubra as ações com maiores altas e baixas do dia. Rankings atualizados automaticamente com dados do mercado.",
    cta: "Ver Rankings",
    href: "/recursos/rankings",
    badge: "Automático",
  },
  {
    icon: Search,
    title: "Busca Inteligente",
    description: "Pesquise qualquer ação da B3 e obtenha dados detalhados instantaneamente, mesmo para ativos que não monitora.",
    cta: "Buscar Ações",
    href: "/mercado",
    badge: "B3",
  },
];

export default function Ferramentas() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Nossas <span className="text-primary">Ferramentas</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tudo que você precisa para acompanhar o mercado e tomar decisões inteligentes de investimento.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool) => (
            <div key={tool.title} className="group bg-card border border-border rounded-xl p-6 flex flex-col transition-all hover:border-primary/30 hover:shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <tool.icon className="h-6 w-6 text-primary" />
                </div>
                <span className="text-xs font-medium bg-muted px-2.5 py-1 rounded-full text-muted-foreground">{tool.badge}</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{tool.title}</h3>
              <p className="text-muted-foreground mb-6 flex-1">{tool.description}</p>
              <Link to={tool.href}>
                <Button variant="outline" className="w-full group-hover:border-primary group-hover:text-primary">
                  {tool.cta}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
