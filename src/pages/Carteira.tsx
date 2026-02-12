import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { differenceInDays, differenceInMonths, differenceInYears, parseISO, format } from "date-fns";
import { Wallet, TrendingUp, TrendingDown, PieChart, Plus, Pencil, Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePortfolio, PortfolioItem, PortfolioInput } from "@/hooks/usePortfolio";
import { StockFormDialog } from "@/components/portfolio/StockFormDialog";
import { useToast } from "@/hooks/use-toast";
import { detectMarket } from "@/services/marketData"; 
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export default function Carteira() {
  const { portfolio, isLoading, addStock, updateStock, deleteStock } = usePortfolio();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStock, setEditingStock] = useState<PortfolioItem | null>(null);
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const handleImageError = (symbol: string) => {
    setBrokenImages(prev => new Set(prev).add(symbol));
  };

  // --- BUSCA DE PREÇOS NO SUPABASE (Sincronizado com n8n) ---
  const { data: marketData, isFetching: isUpdatingPrices } = useQuery({
    queryKey: ['portfolioPrices', portfolio.map(s => s.symbol).join(',')],
    queryFn: async () => {
      if (portfolio.length === 0) return {};

      const symbols = portfolio.map(s => s.symbol);
      
      // Buscamos os dados que o n8n está salvando
      const { data, error } = await supabase
        .from('stock_prices')
        .select('symbol, logo_url, current_price, currency, updated_at')
        .in('symbol', symbols);
      
      if (error) {
        console.error("ERRO SUPABASE (stock_prices):", error.message);
        // Retornamos um objeto vazio para não quebrar a renderização, mas logamos o erro
        return {};
      }

      const prices: Record<string, { price: number; currency: string; logoUrl?: string; updatedAt?: string }> = {};

      if (data) {
        data.forEach((s) => {
          prices[s.symbol] = { 
            price: Number(s.current_price) || 0, 
            currency: s.currency || 'BRL',
            logoUrl: s.logo_url || undefined,
            updatedAt: s.updated_at
          };
        });
      }
      return prices;
    },
    enabled: portfolio.length > 0,
    refetchInterval: 5000, // Tenta atualizar a cada 5s para refletir o n8n
  });

  const handleAddStock = async (data: PortfolioInput) => {
    try {
      await addStock.mutateAsync(data);
      setDialogOpen(false);
      toast({
        title: "Ativo adicionado!",
        description: `${data.symbol} enviado. O n8n atualizará o preço em instantes.`,
      });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erro", description: error.message });
    }
  };

  const handleUpdateStock = async (data: PortfolioInput) => {
    if (!editingStock) return;
    try {
      await updateStock.mutateAsync({ id: editingStock.id, ...data });
      setEditingStock(null);
      setDialogOpen(false);
      toast({ title: "Ativo atualizado!", description: `${data.symbol} foi atualizado.` });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erro", description: error.message });
    }
  };

  const handleDeleteStock = async (stock: PortfolioItem) => {
    if (!confirm(`Deseja remover ${stock.symbol}?`)) return;
    try {
      await deleteStock.mutateAsync(stock.id);
      toast({ title: "Ativo removido!", description: `${stock.symbol} saiu da carteira.` });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erro", description: error.message });
    }
  };

  const calculateTotals = () => {
    let totalInvested = 0;
    let totalCurrent = 0;

    portfolio.forEach((stock) => {
      const invested = stock.quantity * stock.avg_price;
      const marketPrice = marketData?.[stock.symbol]?.price || stock.avg_price;
      const current = stock.quantity * marketPrice;
      
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
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              Minha Carteira
              {isUpdatingPrices && <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />}
            </h1>
            <p className="text-muted-foreground mt-1">Gestão de ativos com cotação via n8n & Brapi</p>
          </div>
          <Button onClick={() => { setEditingStock(null); setDialogOpen(true); }} className="gap-2">
            <Plus className="h-4 w-4" /> Adicionar Ativo
          </Button>
        </div>

        {/* Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CardKpi title="Patrimônio Total" value={totalCurrent} icon={<Wallet className="text-primary" />} />
          <CardKpi title="Total Investido" value={totalInvested} icon={<PieChart className="text-muted-foreground" />} />
          <div className="kpi-card">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">Lucro/Prejuízo</p>
              {totalProfit >= 0 ? <TrendingUp className="h-5 w-5 text-success" /> : <TrendingDown className="h-5 w-5 text-destructive" />}
            </div>
            <p className={`text-3xl font-bold font-mono ${totalProfit >= 0 ? "text-success" : "text-destructive"}`}>
              {totalProfit >= 0 ? "+" : "-"} R$ {Math.abs(totalProfit).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
            <p className={`text-sm font-mono ${totalProfit >= 0 ? "text-success" : "text-destructive"}`}>
              ({totalProfit >= 0 ? "+" : ""}{totalProfitPercent.toFixed(2)}%)
            </p>
          </div>
        </div>

        {/* Tabela */}
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-border"><h3 className="text-lg font-semibold">Seus Ativos</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-sm text-muted-foreground">
                  <th className="text-left p-4">Ativo</th>
                  <th className="text-right p-4">Qtd.</th>
                  <th className="text-right p-4">Preço Médio</th>
                  <th className="text-right p-4">Preço Atual</th>
                  <th className="text-right p-4">Valor Total</th>
                  <th className="text-right p-4">Rentabilidade</th>
                  <th className="text-center p-4">Tempo</th>
                  <th className="text-right p-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.map((stock) => {
                  const priceInfo = marketData?.[stock.symbol];
                  const currentPrice = priceInfo?.price || stock.avg_price;
                  const totalValue = stock.quantity * currentPrice;
                  const profitPercent = stock.avg_price > 0 ? ((currentPrice - stock.avg_price) / stock.avg_price) * 100 : 0;

                  return (
                    <tr key={stock.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {priceInfo?.logoUrl && !brokenImages.has(stock.symbol) ? (
                            <img src={priceInfo.logoUrl} className="w-8 h-8 rounded-full object-contain bg-white p-0.5" onError={() => handleImageError(stock.symbol)} />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs">{stock.symbol.substring(0,2)}</div>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm uppercase">{stock.symbol}</span>
                              <span className="text-[10px] px-1 rounded bg-secondary">{detectMarket(stock.symbol) === 'BR' ? '🇧🇷' : '🇺🇸'}</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground truncate max-w-[120px]">{stock.name || 'Ação'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right font-mono">{stock.quantity}</td>
                      <td className="p-4 text-right font-mono text-muted-foreground">R$ {stock.avg_price.toFixed(2)}</td>
                      <td className="p-4 text-right font-mono">
                        {!priceInfo ? <span className="text-amber-500 text-[10px] animate-pulse">Sincronizando...</span> : `R$ ${currentPrice.toFixed(2)}`}
                      </td>
                      <td className="p-4 text-right font-mono font-medium">R$ {totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                      <td className={`p-4 text-right font-mono text-xs ${profitPercent >= 0 ? "text-success" : "text-destructive"}`}>
                        {profitPercent >= 0 ? "+" : ""}{profitPercent.toFixed(2)}%
                      </td>
                      <td className="p-4 text-center text-[11px]">
                        {stock.purchased_at ? format(parseISO(stock.purchased_at), 'dd/MM/yy') : '--'}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => { setEditingStock(stock); setDialogOpen(true); }} className="h-7 w-7"><Pencil className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteStock(stock)} className="h-7 w-7 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <StockFormDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={editingStock ? handleUpdateStock : handleAddStock} stock={editingStock} isLoading={addStock.isPending || updateStock.isPending} />
    </DashboardLayout>
  );
}

function CardKpi({ title, value, icon }: { title: string, value: number, icon: React.ReactNode }) {
  return (
    <div className="kpi-card">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-muted-foreground">{title}</p>
        {icon}
      </div>
      <p className="text-3xl font-bold font-mono">R$ {value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
    </div>
  );
}