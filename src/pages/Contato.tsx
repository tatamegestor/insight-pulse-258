import { useState } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function Contato() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success("Mensagem enviada com sucesso! Retornaremos em breve.");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Entre em <span className="text-primary">Contato</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tem alguma dúvida, sugestão ou precisa de ajuda? Nossa equipe está pronta para atender você.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <Mail className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-1">E-mail</h3>
              <p className="text-muted-foreground text-sm">suporte@investai.com.br</p>
              <p className="text-muted-foreground text-sm">contato@investai.com.br</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <Phone className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-1">Telefone</h3>
              <p className="text-muted-foreground text-sm">(11) 9999-8888</p>
              <p className="text-muted-foreground text-sm">Seg a Sex, 9h às 18h</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <MapPin className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-1">Endereço</h3>
              <p className="text-muted-foreground text-sm">Av. Paulista, 1000 - 10º andar</p>
              <p className="text-muted-foreground text-sm">São Paulo, SP - Brasil</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-8">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <CheckCircle className="h-16 w-16 text-success mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-2">Mensagem Enviada!</h3>
                <p className="text-muted-foreground mb-6">
                  Obrigado pelo contato. Nossa equipe retornará em até 24 horas úteis.
                </p>
                <Button onClick={() => setSubmitted(false)} variant="outline">
                  Enviar outra mensagem
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome completo</Label>
                    <Input id="name" placeholder="Seu nome" required className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" placeholder="seu@email.com" required className="mt-1.5" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="subject">Assunto</Label>
                  <Input id="subject" placeholder="Como podemos ajudar?" required className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea id="message" placeholder="Descreva sua dúvida ou sugestão..." rows={6} required className="mt-1.5" />
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Mensagem
                </Button>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
