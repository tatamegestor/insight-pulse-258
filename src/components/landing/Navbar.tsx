import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, TrendingUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <TrendingUp className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Invest<span className="text-primary">IA</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              <Link to="/mercado" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Mercados
              </Link>
              <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Ferramentas
                <ChevronDown className="h-4 w-4" />
              </button>
              <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Análises
                <ChevronDown className="h-4 w-4" />
              </button>
              <Link to="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Notícias
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Entrar
                </Button>
              </Link>
              <Link to="/login">
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Cadastre-se Grátis
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-card border-b border-border">
          <div className="px-4 py-4 space-y-3">
            <Link to="/mercado" className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
              Mercados
            </Link>
            <button className="block w-full text-left py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
              Ferramentas
            </button>
            <button className="block w-full text-left py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
              Análises
            </button>
            <Link to="#" className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
              Notícias
            </Link>
            <div className="pt-4 space-y-2 border-t border-border">
              <Link to="/login" className="block">
                <Button variant="outline" className="w-full">
                  Entrar
                </Button>
              </Link>
              <Link to="/login" className="block">
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
