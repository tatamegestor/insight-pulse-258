import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Search, TrendingUp, TrendingDown, ExternalLink, Loader2, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useStockPrices, StockPrice } from "@/hooks/useStockPrices";
import { useSearchStocks } from "@/hooks/useSearchStocks";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Mercado() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("br");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useStockPrices();
  const { data: searchResults, isLoading: searchLoading } = useSearchStocks(searchTerm);

  // Symbols already monitored in DB
  const monitoredSymbols = new Set((data?.all || []).map(s => s.symbol.toUpperCase()));

  // Filter search results to show only non-monitored stocks
  const apiResults = (searchResults || []).filter(
    (r) => !monitoredSymbols.has(r.symbol.toUpperCase())
  );

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['stockPrices'] });
  };

  const stocks: StockPrice[] = activeTab === "br" ? (data?.br || []) : (data?.us || []);

  const filteredStocks = stocks.filter((stock) => {
    const term = searchTerm.toLowerCase();
    return (
      stock.symbol.toLowerCase().includes(term) ||
      (stock.short_name || "").toLowerCase().includes(term) ||
      (stock.long_name || "").toLowerCase().includes(term)
    );
  });

  const formatPrice = (price: number, currency: string | null) => {
    const sym = currency === 'USD' ? '$' : 'R$';
    return `${sym} ${Number(price).toFixed(2)}`;
  };

  const formatVariation = (value: number | null) => {
    if (value === null || value === undefined) return null;
    return Number(value).toFixed(2);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Mercado</h1>
              <p className="text-muted-foreground mt-1">
                Cotações em tempo real via workflow automatizado
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-fade-in">
          <TabsList className="bg-muted/50 border border-border">
            <TabsTrigger value="br" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              🇧🇷 Brasil (B3)
            </TabsTrigger>
            <TabsTrigger value="us" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              🇺🇸 EUA (NASDAQ/NYSE)
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search */}
        <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por ticker ou nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-muted/50 border-border focus:border-primary"
            />
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="glass-card p-4 animate-fade-in">
            <div className="flex items-center gap-3">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">
                Carregando cotações...
              </span>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="glass-card overflow-hidden animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <TooltipProvider>
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Ação</TableHead>
                  <TableHead className="text-muted-foreground">Nome</TableHead>
                  <TableHead className="text-muted-foreground text-right">Preço</TableHead>
                  <TableHead className="text-muted-foreground text-right">Var. Diária</TableHead>
                  <TableHead className="text-muted-foreground text-right">Var. Mensal</TableHead>
                  <TableHead className="text-muted-foreground">Insight IA</TableHead>
                  <TableHead className="text-muted-foreground text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStocks.length === 0 && !isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      {searchTerm ? "Nenhuma ação encontrada para esta busca." : "Nenhuma ação disponível."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStocks.map((stock) => {
                    return (
                      <TableRow
                        key={stock.id}
                        className="table-row-interactive border-border cursor-pointer"
                        onClick={() => navigate(`/acao/${stock.symbol}`)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {stock.logo_url ? (
                              <img
                                src={stock.logo_url}
                                alt={stock.symbol}
                                className="h-6 w-6 rounded"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                              />
                            ) : (
                              <span className="text-xl">📈</span>
                            )}
                            <span className="ticker-badge">{stock.symbol}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-foreground font-medium">
                          <div className="flex items-center gap-1.5">
                            {stock.trend_emoji && <span>{stock.trend_emoji}</span>}
                            {stock.short_name || stock.long_name || stock.symbol}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono text-foreground">
                          {formatPrice(stock.current_price, stock.currency)}
                        </TableCell>
                        <TableCell className="text-right">
                          <VariationBadge value={formatVariation(stock.variation_daily ?? stock.brapi_change_percent ?? 0)} />
                        </TableCell>
                        <TableCell className="text-right">
                          <VariationBadge value={formatVariation(stock.brapi_change_percent)} />
                        </TableCell>
                        <TableCell className="max-w-[200px]">
                          {stock.auto_insight ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="text-xs text-muted-foreground truncate block cursor-help">
                                  {stock.auto_insight}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p>{stock.auto_insight}</p>
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
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
                  })
                )}
              </TableBody>
            </Table>
          </TooltipProvider>
        </div>

        {/* API Search Results */}
        {searchTerm.length >= 3 && (
          <div className="glass-card overflow-hidden animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="p-4 border-b border-border flex items-center gap-2">
              <Search className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Resultados da busca na B3</h3>
              <Badge variant="secondary" className="text-xs">API</Badge>
              {searchLoading && <Loader2 className="h-3 w-3 animate-spin text-primary ml-auto" />}
            </div>
            {searchLoading ? (
              <div className="p-6 text-center text-muted-foreground text-sm">
                Buscando ações...
              </div>
            ) : apiResults.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground text-sm">
                Nenhuma ação adicional encontrada para "{searchTerm}".
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Ticker</TableHead>
                    <TableHead className="text-muted-foreground">Nome</TableHead>
                    <TableHead className="text-muted-foreground text-right">Preço</TableHead>
                    <TableHead className="text-muted-foreground text-right">Variação</TableHead>
                    <TableHead className="text-muted-foreground">Setor</TableHead>
                    <TableHead className="text-muted-foreground text-right">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiResults.map((stock) => (
                    <TableRow
                      key={stock.symbol}
                      className="table-row-interactive border-border cursor-pointer"
                      onClick={() => navigate(`/acao/${stock.symbol}`)}
                    >
                      <TableCell>
                        <span className="ticker-badge">{stock.symbol}</span>
                      </TableCell>
                      <TableCell className="text-foreground font-medium">
                        {stock.name}
                      </TableCell>
                      <TableCell className="text-right font-mono text-foreground">
                        {stock.close ? `R$ ${Number(stock.close).toFixed(2)}` : '—'}
                      </TableCell>
                      <TableCell className="text-right">
                        <VariationBadge value={stock.change ? Number(stock.change).toFixed(2) : null} />
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {stock.sector || '—'}
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
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function VariationBadge({ value }: { value: string | null }) {
  if (value === null) return <span className="text-muted-foreground text-xs">—</span>;
  const num = parseFloat(value);
  const isPositive = num >= 0;
  return (
    <span className={`inline-flex items-center gap-1 font-mono text-sm font-medium ${isPositive ? "text-success" : "text-destructive"}`}>
      {isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
      {isPositive ? "+" : ""}{value}%
    </span>
  );
}
