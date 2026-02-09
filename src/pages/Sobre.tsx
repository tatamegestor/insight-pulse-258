import { Link } from "react-router-dom";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { TrendingUp, Users, Globe, Award, Target, Heart } from "lucide-react";

const stats = [
  { label: "Usuários ativos", value: "50K+", icon: Users },
  { label: "Ativos monitorados", value: "500+", icon: TrendingUp },
  { label: "Países", value: "12", icon: Globe },
  { label: "Uptime", value: "99.9%", icon: Award },
];

const values = [
  {
    icon: Target,
    title: "Transparência",
    description: "Acreditamos que todos os investidores merecem acesso a informações claras e precisas sobre o mercado financeiro.",
  },
  {
    icon: Heart,
    title: "Acessibilidade",
    description: "Nossa missão é democratizar o acesso a ferramentas profissionais de investimento para todos.",
  },
  {
    icon: Award,
    title: "Excelência",
    description: "Buscamos constantemente melhorar nossos algoritmos de IA para oferecer insights cada vez mais precisos.",
  },
];

export default function Sobre() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Sobre a <span className="text-primary">Invest AI</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Nascemos da visão de que inteligência artificial pode transformar a forma como as pessoas investem.
            Nossa plataforma combina dados em tempo real com análises avançadas de IA para ajudar investidores
            de todos os níveis a tomar decisões mais inteligentes.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-card border border-border rounded-xl p-6 text-center">
              <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
              <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div className="bg-card border border-border rounded-2xl p-8 md:p-12 mb-20">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">Nossa Missão</h2>
              <p className="text-muted-foreground mb-4">
                Democratizar o acesso a ferramentas de análise financeira avançada, utilizando inteligência
                artificial para nivelar o campo de jogo entre investidores individuais e institucionais.
              </p>
              <p className="text-muted-foreground">
                Acreditamos que com as ferramentas certas e informações de qualidade, qualquer pessoa pode
                construir um patrimônio sólido e alcançar seus objetivos financeiros.
              </p>
            </div>
            <div className="bg-muted/50 rounded-xl p-8 text-center">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <p className="text-xl font-semibold text-foreground mb-2">Invest AI</p>
              <p className="text-muted-foreground text-sm">Inteligência financeira para todos</p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-10">Nossos Valores</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value) => (
              <div key={value.title} className="bg-card border border-border rounded-xl p-6">
                <value.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Comece a investir agora
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
