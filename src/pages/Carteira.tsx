import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Wallet, TrendingUp, TrendingDown, PieChart, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePortfolio, PortfolioItem, PortfolioInput } from "@/hooks/usePortfolio";
import { StockFormDialog } from "@/components/portfolio/StockFormDialog";
import { useToast } from "@/hooks/use-toast";
import { getStockQuote } from "@/services/alphaVantage";
import { useQuery } from "@tanstack/react-query";

export default function Carteira() {
  const { portfolio, isLoading, addStock, updateStock, deleteStock } = usePortfolio();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStock, setEditingStock] = useState<PortfolioItem | null>(null);
  const { toast } = useToast();

  // Fetch current prices for all stocks in portfolio
  const { data: currentPrices } = useQuery({
    queryKey: ['portfolioPrices', portfolio.map(s => s.symbol).join(',')],
    queryFn: async () => {
      const prices: Record<string, number> = {};
      for (const stock of portfolio) {
        const quote = await getStockQuote(stock.symbol);
        if (quote) {
          prices[stock.symbol] = quote.price;
        }
      }
      return prices;
    },
    enabled: portfolio.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  const handleAddStock = async (data: PortfolioInput) => {
    try {
      await addStock.mutateAsync(data);
      setDialogOpen(false);
      toast({
        title: "Ativo adicionado!",
        description: `${data.symbol} foi adicionado à sua carteira.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao adicionar",
        description: error.message,
      });
    }
  };

  const handleUpdateStock = async (data: PortfolioInput) => {
    if (!editingStock) return;
    
    try {
      await updateStock.mutateAsync({ id: editingStock.id, ...data });
      setEditingStock(null);
      setDialogOpen(false);
      toast({
        title: "Ativo atualizado!",
        description: `${data.symbol} foi atualizado.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar",
        description: error.message,
      });
    }
  };

  const handleDeleteStock = async (stock: PortfolioItem) => {
    if (!confirm(`Deseja remover ${stock.symbol} da sua carteira?`)) return;
    
    try {
      await deleteStock.mutateAsync(stock.id);
      toast({
        title: "Ativo removido!",
        description: `${stock.symbol} foi removido da sua carteira.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao remover",
        description: error.message,
      });
    }
  };

  const openEditDialog = (stock: PortfolioItem) => {
    setEditingStock(stock);
    setDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingStock(null);
    setDialogOpen(true);
  };

  // Calculate totals
  const calculateTotals = () => {
    let totalInvested = 0;
    let totalCurrent = 0;

    portfolio.forEach((stock) => {
      const invested = stock.quantity * stock.avg_price;
      const currentPrice = currentPrices?.[stock.symbol] || stock.avg_price;
      const current = stock.quantity * currentPrice;
      
      totalInvested += invested;
      totalCurrent += current;
    });

    const totalProfit = totalCurrent - totalInvested;
    const totalProfitPercent = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

    return { totalInvested, totalCurrent, totalProfit, totalProfitPercent };
  };

  const { totalInvested, totalCurrent, totalProfit, totalProfitPercent } = calculateTotals();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-muted-foreground">Carregando carteira...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Minha Carteira</h1>
            <p className="text-muted-foreground mt-1">
              Acompanhe seus investimentos e rentabilidade
            </p>
          </div>
          <Button onClick={openAddDialog} className="gap-2">
            <Plus className="h-4 w-4" />
            Adicionar Ativo
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="kpi-card">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">Patrimônio Total</p>
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <p className="text-3xl font-bold font-mono text-foreground">
              $ {totalCurrent.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="kpi-card">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">Total Investido</p>
              <PieChart className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-3xl font-bold font-mono text-foreground">
              $ {totalInvested.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="kpi-card">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">Lucro/Prejuízo</p>
              {totalProfit >= 0 ? (
                <TrendingUp className="h-5 w-5 text-success" />
              ) : (
                <TrendingDown className="h-5 w-5 text-destructive" />
              )}
            </div>
            <p
              className={`text-3xl font-bold font-mono ${
                totalProfit >= 0 ? "text-success" : "text-destructive"
              }`}
            >
              {totalProfit >= 0 ? "+" : ""}${" "}
              {Math.abs(totalProfit).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
            <p
              className={`text-sm font-mono ${
                totalProfit >= 0 ? "text-success" : "text-destructive"
              }`}
            >
              ({totalProfit >= 0 ? "+" : ""}
              {totalProfitPercent.toFixed(2)}%)
            </p>
          </div>
        </div>

        {/* Portfolio Table */}
        <div className="glass-card overflow-hidden animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="p-4 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Seus Ativos</h3>
          </div>
          
          {portfolio.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground mb-4">
                Você ainda não tem ativos na sua carteira.
              </p>
              <Button onClick={openAddDialog} variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Adicionar seu primeiro ativo
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Ativo</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">Qtd.</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">Preço Médio</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">Preço Atual</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">Valor Total</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">Rentabilidade</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.map((stock) => {
                    const currentPrice = currentPrices?.[stock.symbol] || stock.avg_price;
                    const totalValue = stock.quantity * currentPrice;
                    const profit = (currentPrice - stock.avg_price) * stock.quantity;
                    const profitPercent =
                      ((currentPrice - stock.avg_price) / stock.avg_price) * 100;
                    const isPositive = profit >= 0;

                    return (
                      <tr
                        key={stock.id}
                        className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{stock.logo}</span>
                            <div>
                              <span className="ticker-badge">{stock.symbol}</span>
                              <p className="text-xs text-muted-foreground mt-1">
                                {stock.name}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-right font-mono text-foreground">
                          {stock.quantity}
                        </td>
                        <td className="p-4 text-right font-mono text-muted-foreground">
                          $ {stock.avg_price.toFixed(2)}
                        </td>
                        <td className="p-4 text-right font-mono text-foreground">
                          $ {currentPrice.toFixed(2)}
                        </td>
                        <td className="p-4 text-right font-mono font-medium text-foreground">
                          $ {totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-4 text-right">
                          <div
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
                            {profitPercent.toFixed(2)}%
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(stock)}
                              className="h-8 w-8"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteStock(stock)}
                              className="h-8 w-8 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <StockFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={editingStock ? handleUpdateStock : handleAddStock}
        stock={editingStock}
        isLoading={addStock.isPending || updateStock.isPending}
      />
    </DashboardLayout>
  );
}
