import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Bot, ArrowRight, MessageSquare, Brain, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function ChatbotIA() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-2xl bg-primary/10">
              <Bot className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Chatbot com <span className="text-primary">IA</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Seu analista pessoal disponível 24 horas por dia. Tire dúvidas, peça análises de ações e entenda o mercado com a ajuda da inteligência artificial.
          </p>
          <Link to="/login">
            <Button size="lg" className="gap-2">
              Conversar com a IA <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card p-8 rounded-2xl border border-border">
            <MessageSquare className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Conversa Natural</h3>
            <p className="text-muted-foreground">Pergunte como se estivesse falando com um especialista humano. Nossa IA entende o contexto.</p>
          </div>
          <div className="bg-card p-8 rounded-2xl border border-border">
            <Brain className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Análise Profunda</h3>
            <p className="text-muted-foreground">Obtenha insights baseados em dados fundamentalistas e técnicos sobre qualquer ativo.</p>
          </div>
          <div className="bg-card p-8 rounded-2xl border border-border">
            <Sparkles className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Dicas Personalizadas</h3>
            <p className="text-muted-foreground">Receba sugestões alinhadas com o seu perfil de investidor e objetivos.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}