import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Páginas Existentes
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Mercado from "./pages/Mercado";
import AcaoDetalhes from "./pages/AcaoDetalhes";
import Carteira from "./pages/Carteira";
import Configuracoes from "./pages/Configuracoes";
import Notificacoes from "./pages/Notificacoes";
import NotFound from "./pages/NotFound";
import Sobre from "./pages/Sobre";
import Termos from "./pages/Termos";
import Privacidade from "./pages/Privacidade";
import Contato from "./pages/Contato";
import Ferramentas from "./pages/Ferramentas";
import Analises from "./pages/Analises";
import Blog from "./pages/Blog";
import BlogPostPage from "./pages/BlogPost";
import Valores from "./pages/Valores";

// NOVAS IMPORTAÇÕES (Recursos)
// Certifique-se de que criou a pasta 'recursos' dentro de 'pages'
import AlertasPreco from "./pages/recursos/AlertasPreco";
import GestaoCarteira from "./pages/recursos/GestaoCarteira";
import ChatbotIA from "./pages/recursos/ChatbotIA";
import InsightDiario from "./pages/recursos/InsightDiario";
import Rankings from "./pages/recursos/Rankings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Rotas Públicas */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/termos" element={<Termos />} />
            <Route path="/privacidade" element={<Privacidade />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/ferramentas" element={<Ferramentas />} />
            <Route path="/analises" element={<Analises />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/valores" element={<Valores />} />

            {/* NOVAS ROTAS DE RECURSOS (Adicionadas aqui) */}
            <Route path="/recursos/alertas" element={<AlertasPreco />} />
            <Route path="/recursos/carteira" element={<GestaoCarteira />} />
            <Route path="/recursos/chatbot" element={<ChatbotIA />} />
            <Route path="/recursos/insights" element={<InsightDiario />} />
            <Route path="/recursos/rankings" element={<Rankings />} />

            {/* Rotas Protegidas (Dashboard e Funcionalidades Internas) */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/mercado" element={
              <ProtectedRoute>
                <Mercado />
              </ProtectedRoute>
            } />
            <Route path="/acao/:id" element={
              <ProtectedRoute>
                <AcaoDetalhes />
              </ProtectedRoute>
            } />
            <Route path="/carteira" element={
              <ProtectedRoute>
                <Carteira />
              </ProtectedRoute>
            } />
            <Route path="/notificacoes" element={
              <ProtectedRoute>
                <Notificacoes />
              </ProtectedRoute>
            } />
            <Route path="/configuracoes" element={
              <ProtectedRoute>
                <Configuracoes />
              </ProtectedRoute>
            } />

            {/* Rota de Erro (Deve ser sempre a última) */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;