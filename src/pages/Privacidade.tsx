import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

const sections = [
  {
    title: "1. Dados que Coletamos",
    content: "Coletamos informações que você fornece diretamente (nome, e-mail, telefone), dados de uso da plataforma (páginas visitadas, ações pesquisadas), e dados técnicos (endereço IP, tipo de navegador, dispositivo).",
  },
  {
    title: "2. Como Usamos seus Dados",
    content: "Utilizamos seus dados para: fornecer e melhorar nossos serviços, personalizar sua experiência, enviar alertas e notificações configurados por você, realizar análises estatísticas agregadas, e cumprir obrigações legais.",
  },
  {
    title: "3. Compartilhamento de Dados",
    content: "Não vendemos seus dados pessoais. Podemos compartilhar informações com: prestadores de serviços essenciais (hospedagem, processamento), autoridades competentes quando exigido por lei, e parceiros de análise de forma anonimizada.",
  },
  {
    title: "4. Segurança",
    content: "Implementamos medidas técnicas e organizacionais para proteger seus dados, incluindo criptografia em trânsito e em repouso, controles de acesso, monitoramento de segurança e backups regulares.",
  },
  {
    title: "5. Cookies",
    content: "Utilizamos cookies essenciais para o funcionamento da plataforma e cookies analíticos para melhorar nossos serviços. Você pode gerenciar suas preferências de cookies nas configurações do navegador.",
  },
  {
    title: "6. Seus Direitos (LGPD)",
    content: "Conforme a Lei Geral de Proteção de Dados (LGPD), você tem direito a: acessar seus dados, corrigir informações incorretas, solicitar a exclusão de dados, revogar o consentimento, e solicitar a portabilidade dos dados.",
  },
  {
    title: "7. Retenção de Dados",
    content: "Mantemos seus dados pelo tempo necessário para fornecer os serviços ou conforme exigido por lei. Dados de conta são retidos enquanto sua conta estiver ativa. Após exclusão da conta, dados são removidos em até 30 dias.",
  },
  {
    title: "8. Contato do DPO",
    content: "Para exercer seus direitos ou tirar dúvidas sobre privacidade, entre em contato com nosso Encarregado de Proteção de Dados (DPO) pelo e-mail privacidade@investai.com.br.",
  },
];

export default function Privacidade() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-foreground mb-2">Política de Privacidade</h1>
        <p className="text-muted-foreground mb-10">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.title} className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-xl font-semibold text-foreground mb-3">{section.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
