import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

const sections = [
  {
    title: "1. Aceitação dos Termos",
    content: "Ao acessar e utilizar a plataforma Invest AI, você concorda com estes Termos de Uso e com nossa Política de Privacidade. Se você não concordar com algum destes termos, não utilize nossos serviços.",
  },
  {
    title: "2. Descrição do Serviço",
    content: "A Invest AI é uma plataforma de análise e acompanhamento de mercado financeiro que utiliza inteligência artificial para fornecer insights e dados sobre ações e investimentos. Nosso serviço não constitui recomendação de investimento.",
  },
  {
    title: "3. Cadastro e Conta",
    content: "Para utilizar a plataforma, você precisa criar uma conta fornecendo informações verdadeiras e atualizadas. Você é responsável por manter a confidencialidade de suas credenciais de acesso e por todas as atividades realizadas em sua conta.",
  },
  {
    title: "4. Uso Aceitável",
    content: "Você concorda em utilizar a plataforma apenas para fins legais e de acordo com estes termos. É proibido: tentar acessar áreas restritas do sistema, realizar engenharia reversa, utilizar bots ou scrapers para coletar dados, ou compartilhar sua conta com terceiros.",
  },
  {
    title: "5. Isenção de Responsabilidade",
    content: "As informações fornecidas pela Invest AI são de caráter informativo e educacional. Não nos responsabilizamos por decisões de investimento tomadas com base em nossos dados ou análises. Todo investimento envolve riscos e resultados passados não garantem resultados futuros.",
  },
  {
    title: "6. Propriedade Intelectual",
    content: "Todo o conteúdo da plataforma, incluindo textos, gráficos, logos, ícones, imagens, análises e software, é propriedade da Invest AI ou de seus licenciadores e está protegido por leis de propriedade intelectual.",
  },
  {
    title: "7. Privacidade e Dados",
    content: "O tratamento de seus dados pessoais é regido por nossa Política de Privacidade. Ao utilizar nossos serviços, você consente com a coleta e uso de dados conforme descrito na referida política.",
  },
  {
    title: "8. Modificações",
    content: "Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. Alterações significativas serão comunicadas por e-mail ou através da plataforma. O uso continuado do serviço após alterações constitui aceitação dos novos termos.",
  },
  {
    title: "9. Contato",
    content: "Para dúvidas sobre estes Termos de Uso, entre em contato conosco através da página de Contato ou pelo e-mail suporte@investai.com.br.",
  },
];

export default function Termos() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-foreground mb-2">Termos de Uso</h1>
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
