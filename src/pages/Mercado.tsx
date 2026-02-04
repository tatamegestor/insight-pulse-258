import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Search, Filter, TrendingUp, TrendingDown, ExternalLink, Loader2, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { getMultipleStockQuotes, StockQuote, clearCache } from "@/services/alphaVantage";
import { Progress } from "@/components/ui/progress";

// Lista reduzida de ações para respeitar limite da API
const monitoredStocks = [
  { symbol: "AAPL", name: "Apple Inc.", sector: "Tecnologia", logo: "🍎" },
  { symbol: "MSFT", name: "Microsoft", sector: "Tecnologia", logo: "💻" },
  { symbol: "GOOGL", name: "Alphabet (Google)", sector: "Tecnologia", logo: "🔍" },
  { symbol: "AMZN", name: "Amazon", sector: "Varejo", logo: "📦" },
  { symbol: "TSLA", name: "Tesla", sector: "Automotivo", logo: "🚗" },
  { symbol: "NVDA", name: "NVIDIA", sector: "Tecnologia", logo: "🎮" },
];

const sectors = ["Todos", "Tecnologia", "Varejo", "Automotivo"];

export default function Mercado() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState("Todos");
  const [quotes, setQuotes] = useState<Map<string, StockQuote>>(new Map());
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAllQuotes = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    setLoadedCount(0);
    
    if (forceRefresh) {
      clearCache();
      setQuotes(new Map());
    }

    const symbols = monitoredStocks.map(s => s.symbol);
    
    await getMultipleStockQuotes(symbols, (loaded, total, data) => {
      setLoadedCount(loaded);
      setQuotes(new Map(data));
    });

    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchAllQuotes();
  }, [fetchAllQuotes]);

  const filteredStocks = monitoredStocks.filter((stock) => {
    const matchesSearch =
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector =
      selectedSector === "Todos" || stock.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  const formatPrice = (quote: StockQuote | undefined) => {
    if (!quote) return "—";
    return `$ ${quote.price.toFixed(2)}`;
  };

  const formatChange = (quote: StockQuote | undefined) => {
    if (!quote) return null;
    return parseFloat(quote.changePercent.replace('%', ''));
  };

  const progress = (loadedCount / monitoredStocks.length) * 100;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Mercado</h1>
              <p className="text-muted-foreground mt-1">
                Cotações em tempo real via Alpha Vantage
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchAllQuotes(true)}
              disabled={isLoading}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por ticker ou nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-muted/50 border-border focus:border-primary"
            />
          </div>
          <Select value={selectedSector} onValueChange={setSelectedSector}>
            <SelectTrigger className="w-full sm:w-[200px] bg-muted/50 border-border">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filtrar por setor" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {sectors.map((sector) => (
                <SelectItem key={sector} value={sector}>
                  {sector}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Loading Progress */}
        {isLoading && (
          <div className="glass-card p-4 animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">
                Carregando cotações... {loadedCount}/{monitoredStocks.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              API gratuita: 1 requisição por segundo. Dados são cacheados por 5 minutos.
            </p>
          </div>
        )}

        {/* Table */}
        <div className="glass-card overflow-hidden animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Ação</TableHead>
                <TableHead className="text-muted-foreground">Nome</TableHead>
                <TableHead className="text-muted-foreground text-right">Preço</TableHead>
                <TableHead className="text-muted-foreground text-right">Variação</TableHead>
                <TableHead className="text-muted-foreground">Setor</TableHead>
                <TableHead className="text-muted-foreground text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStocks.map((stock) => {
                const quote = quotes.get(stock.symbol);
                const change = formatChange(quote);
                const isPositive = change !== null && change >= 0;
                const hasData = quote !== undefined;
                
                return (
                  <TableRow
                    key={stock.symbol}
                    className="table-row-interactive border-border cursor-pointer"
                    onClick={() => navigate(`/acao/${stock.symbol}`)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{stock.logo}</span>
                        <span className="ticker-badge">{stock.symbol}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground font-medium">
                      {stock.name}
                    </TableCell>
                    <TableCell className="text-right font-mono text-foreground">
                      {!hasData && isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin ml-auto" />
                      ) : (
                        formatPrice(quote)
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {!hasData && isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin ml-auto" />
                      ) : change !== null ? (
                        <span
                          className={`inline-flex items-center gap-1 font-mono font-medium ${
                            isPositive ? "text-success" : "text-destructive"
                          }`}
                        >
                          {isPositive ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : (
                            <TrendingDown className="h-4 w-4" />
                          )}
                          {isPositive ? "+" : ""}
                          {change.toFixed(2)}%
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 text-xs rounded-md bg-muted text-muted-foreground">
                        {stock.sector}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:text-primary hover:bg-primary/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/acao/${stock.symbol}`);
                        }}
                      >
                        Ver Detalhes
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
}
