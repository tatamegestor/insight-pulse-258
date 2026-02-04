import { useState } from "react";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const indices = [
  { name: "Ibovespa", symbol: "IBOV", value: "128.450", change: -4.910, changePercent: -2.64 },
  { name: "IBrX 50", symbol: "IBRX50", value: "30.436,73", change: -802.11, changePercent: -2.57 },
  { name: "Dow Jones", symbol: "DJI", value: "49.178,71", change: -62.28, changePercent: -0.13 },
  { name: "S&P 500", symbol: "SPX", value: "5.234,18", change: 12.45, changePercent: 0.24 },
  { name: "Nasdaq", symbol: "IXIC", value: "16.780,32", change: 89.21, changePercent: 0.53 },
];

const stocks = [
  { name: "Petrobras", symbol: "PETR4", value: "38.45", change: 0.82, changePercent: 2.18 },
  { name: "Vale", symbol: "VALE3", value: "62.80", change: -0.45, changePercent: -0.71 },
  { name: "Itaú", symbol: "ITUB4", value: "28.92", change: 0.35, changePercent: 1.22 },
  { name: "Banco do Brasil", symbol: "BBAS3", value: "52.10", change: -0.78, changePercent: -1.47 },
  { name: "Ambev", symbol: "ABEV3", value: "12.45", change: 0.12, changePercent: 0.97 },
];

const crypto = [
  { name: "Bitcoin", symbol: "BTC", value: "68.542", change: -1842, changePercent: -2.62 },
  { name: "Ethereum", symbol: "ETH", value: "3.845", change: 45.20, changePercent: 1.19 },
  { name: "Solana", symbol: "SOL", value: "142.50", change: -3.20, changePercent: -2.20 },
  { name: "BNB", symbol: "BNB", value: "584.30", change: 12.80, changePercent: 2.24 },
  { name: "XRP", symbol: "XRP", value: "0.5234", change: -0.012, changePercent: -2.24 },
];

function MarketTable({ data }: { data: typeof indices }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
              Nome
            </th>
            <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
              Último
            </th>
            <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
              Variação
            </th>
            <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
              Var. %
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={item.symbol}
              className="border-b border-border/50 hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <td className="py-4 px-4">
                <div>
                  <p className="font-medium text-foreground">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.symbol}</p>
                </div>
              </td>
              <td className="text-right py-4 px-4 font-mono font-medium text-foreground">
                {item.value}
              </td>
              <td
                className={`text-right py-4 px-4 font-mono ${
                  item.change >= 0 ? "text-success" : "text-destructive"
                }`}
              >
                {item.change >= 0 ? "+" : ""}
                {item.change.toLocaleString("pt-BR")}
              </td>
              <td className="text-right py-4 px-4">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded text-sm font-medium ${
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function MarketOverview() {
  return (
    <section className="py-10 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Mercados</h2>
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
          <Tabs defaultValue="indices" className="w-full">
            <div className="border-b border-border px-4">
              <TabsList className="h-14 bg-transparent gap-4">
                <TabsTrigger
                  value="indices"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none bg-transparent"
                >
                  Índices
                </TabsTrigger>
                <TabsTrigger
                  value="acoes"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none bg-transparent"
                >
                  Ações
                </TabsTrigger>
                <TabsTrigger
                  value="crypto"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none bg-transparent"
                >
                  Criptomoedas
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="indices" className="m-0">
              <MarketTable data={indices} />
            </TabsContent>
            <TabsContent value="acoes" className="m-0">
              <MarketTable data={stocks} />
            </TabsContent>
            <TabsContent value="crypto" className="m-0">
              <MarketTable data={crypto} />
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
