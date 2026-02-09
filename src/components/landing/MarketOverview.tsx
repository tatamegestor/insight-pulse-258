import { useState } from "react";
import { TrendingUp, TrendingDown, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useMarketOverview } from "@/hooks/useMarketData";
import { MarketQuote } from "@/services/marketData";
import { Skeleton } from "@/components/ui/skeleton";

function MarketTable({ data, isLoading, showMonthly = false }: { data: MarketQuote[]; isLoading?: boolean; showMonthly?: boolean }) {
  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="flex justify-between items-center">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>Dados não disponíveis</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
         <thead>
          <tr className="border-b border-border">
            <th scope="col" className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-muted-foreground">
              Nome
            </th>
            <th scope="col" className="text-right py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-muted-foreground">
              Último
            </th>
            <th scope="col" className="text-right py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-muted-foreground hidden sm:table-cell">
              Variação (1D)
            </th>
            <th scope="col" className="text-right py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-muted-foreground">
              Var. % (1D)
            </th>
            {showMonthly && (
              <th scope="col" className="text-right py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-muted-foreground hidden md:table-cell">
                Var. % (Mensal)
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={item.symbol}
              className="border-b border-border/50 hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <td className="py-3 sm:py-4 px-2 sm:px-4">
                <div>
                  <p className="font-medium text-foreground text-sm sm:text-base">{item.name}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{item.symbol}</p>
                </div>
              </td>
              <td className="text-right py-3 sm:py-4 px-2 sm:px-4 font-mono font-medium text-foreground text-sm sm:text-base">
                {item.currency === 'BRL' ? 'R$ ' : 'US$ '}
                {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
              <td
                className={`text-right py-3 sm:py-4 px-2 sm:px-4 font-mono hidden sm:table-cell ${
                  item.change >= 0 ? "text-success" : "text-destructive"
                }`}
              >
                {item.change >= 0 ? "+" : ""}
                {item.change.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
              <td className="text-right py-3 sm:py-4 px-2 sm:px-4">
                <span
                  className={`inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm font-medium ${
                    item.changePercent >= 0
                      ? "bg-success/10 text-success"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {item.changePercent >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {item.changePercent >= 0 ? "+" : ""}
                  {item.changePercent.toFixed(2)}%
                </span>
              </td>
              {showMonthly && (
                <td className="text-right py-3 sm:py-4 px-2 sm:px-4 hidden md:table-cell">
                  <span
                    className={`inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm font-medium ${
                      (item.changeMonthly ?? 0) >= 0
                        ? "bg-success/10 text-success"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {(item.changeMonthly ?? 0) >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {(item.changeMonthly ?? 0) >= 0 ? "+" : ""}
                    {(item.changeMonthly ?? 0).toFixed(2)}%
                  </span>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function MarketOverview() {
  const { brStocks, usStocks, isLoading } = useMarketOverview();

  return (
    <section id="mercados" className="py-6 bg-background" aria-labelledby="mercados-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h2 id="mercados-heading" className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Mercados</h2>
            <p className="text-muted-foreground">
              Acompanhe os principais índices e ativos em tempo real
            </p>
          </div>
          <Link to="/mercado">
            <Button variant="outline" className="hidden sm:flex">
              Ver todos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <Tabs defaultValue="acoes-br" className="w-full">
            <div className="border-b border-border px-4">
              <TabsList className="h-14 bg-transparent gap-4">
                <TabsTrigger
                  value="acoes-br"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none bg-transparent"
                >
                  Ações BR
                </TabsTrigger>
                <TabsTrigger
                  value="acoes-us"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none bg-transparent"
                >
                  Ações US
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="acoes-br" className="m-0">
              <MarketTable data={brStocks.data} isLoading={brStocks.isLoading} showMonthly />
            </TabsContent>
            <TabsContent value="acoes-us" className="m-0">
              <MarketTable data={usStocks.data} isLoading={usStocks.isLoading} showMonthly />
            </TabsContent>
          </Tabs>
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Link to="/mercado">
            <Button variant="outline">
              Ver todos os mercados
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
