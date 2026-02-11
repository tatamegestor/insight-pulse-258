import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, TrendingUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (name: string) => {
    setDropdownOpen(dropdownOpen === name ? null : name);
  };

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border" role="navigation" aria-label="Navegação principal">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg">
        Pular para o conteúdo principal
      </a>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" aria-label="Invest AI - Página inicial">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <TrendingUp className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Invest <span className="text-primary">AI</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8" ref={dropdownRef}>
            <div className="flex items-center gap-6">
              <Link to="/mercado" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Mercados
              </Link>
              
              {/* Ferramentas Dropdown */}
              <div className="relative">
                <button
                  onClick={() => toggleDropdown("ferramentas")}
                  className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Ferramentas
                  <ChevronDown className={`h-4 w-4 transition-transform ${dropdownOpen === "ferramentas" ? "rotate-180" : ""}`} />
                </button>
                {dropdownOpen === "ferramentas" && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg py-2 z-50">
                    <Link to="/ferramentas" onClick={() => setDropdownOpen(null)} className="block px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                      Todas as Ferramentas
                    </Link>
                    <Link to="/recursos/alertas" onClick={() => setDropdownOpen(null)} className="block px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                      Alertas de Preço
                    </Link>
                    <Link to="/recursos/carteira" onClick={() => setDropdownOpen(null)} className="block px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                      Gestão de Carteira
                    </Link>
                    <Link to="/recursos/chatbot" onClick={() => setDropdownOpen(null)} className="block px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                      Chatbot IA
                    </Link>
                  </div>
                )}
              </div>

              {/* Análises Dropdown */}
              <div className="relative">
                <button
                  onClick={() => toggleDropdown("analises")}
                  className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Análises
                  <ChevronDown className={`h-4 w-4 transition-transform ${dropdownOpen === "analises" ? "rotate-180" : ""}`} />
                </button>
                {dropdownOpen === "analises" && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg py-2 z-50">
                    <Link to="/analises" onClick={() => setDropdownOpen(null)} className="block px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                      Todas as Análises
                    </Link>
                    <Link to="/recursos/insights" onClick={() => setDropdownOpen(null)} className="block px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                      Insight Diário IA
                    </Link>
                    <Link to="/recursos/rankings" onClick={() => setDropdownOpen(null)} className="block px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                      Rankings de Ações
                    </Link>
                  </div>
                )}
              </div>

              <Link to="/blog" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Artigos
              </Link>
              <Link to="/valores" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Valores
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Entrar
                </Button>
              </Link>
              <Link to="/login?tab=register">
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Cadastre-se Grátis
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div id="mobile-menu" className="md:hidden bg-card border-b border-border" role="menu">
          <div className="px-4 py-4 space-y-3">
            <Link to="/mercado" onClick={() => setIsOpen(false)} className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
              Mercados
            </Link>
            <Link to="/ferramentas" onClick={() => setIsOpen(false)} className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
              Ferramentas
            </Link>
            <Link to="/analises" onClick={() => setIsOpen(false)} className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
              Análises
            </Link>
            <Link to="/blog" onClick={() => setIsOpen(false)} className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
              Notícias
            </Link>
            <Link to="/valores" onClick={() => setIsOpen(false)} className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
              Valores
            </Link>
            <Link to="/sobre" onClick={() => setIsOpen(false)} className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
              Sobre
            </Link>
            <Link to="/contato" onClick={() => setIsOpen(false)} className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
              Contato
            </Link>
            <div className="pt-4 space-y-2 border-t border-border">
              <Link to="/login" onClick={() => setIsOpen(false)} className="block">
                <Button variant="outline" className="w-full">
                  Entrar
                </Button>
              </Link>
              <Link to="/login?tab=register" onClick={() => setIsOpen(false)} className="block">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  Cadastre-se Grátis
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
