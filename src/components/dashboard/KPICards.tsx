import { TrendingUp, TrendingDown, BarChart3, Loader2 } from "lucide-react";
import { useDashboardKPIs } from "@/hooks/useMarketData";

interface KPIData {
  title: string;
  ticker: string;
  value: string;
  price: string;
  isPositive: boolean;
  icon: typeof TrendingUp;
}

export function KPICards() {
  const { data: quotes, isLoading } = useDashboardKPIs();

  const calculateKPIs = (): KPIData[] => {
    if (!quotes || quotes.length === 0) {
      return [
        { title: "Maior Alta", ticker: isLoading ? "Carregando..." : "—", value: "—", price: "—", isPositive: true, icon: TrendingUp },
        { title: "Maior Baixa", ticker: isLoading ? "Carregando..." : "—", value: "—", price: "—", isPositive: false, icon: TrendingDown },
        { title: "Volume Total", ticker: "—", value: "—", price: "—", isPositive: true, icon: BarChart3 },
      ];
    }

    const sorted = [...quotes].sort((a, b) => b.changePercent - a.changePercent);

    const topGainer = sorted[0];
    const topLoser = sorted[sorted.length - 1];
    const totalVolume = quotes.reduce((acc, q) => acc + q.volume, 0);

    return [
      {
        title: "Maior Alta",
        ticker: topGainer.symbol,
        value: `${topGainer.changePercent >= 0 ? '+' : ''}${topGainer.changePercent.toFixed(2)}%`,
        price: `$ ${topGainer.price.toFixed(2)}`,
        isPositive: topGainer.changePercent >= 0,
        icon: TrendingUp,
      },
      {
        title: "Maior Baixa",
        ticker: topLoser.symbol,
        value: `${topLoser.changePercent >= 0 ? '+' : ''}${topLoser.changePercent.toFixed(2)}%`,
        price: `$ ${topLoser.price.toFixed(2)}`,
        isPositive: topLoser.changePercent >= 0,
        icon: TrendingDown,
      },
      {
        title: "Volume Total",
        ticker: `${quotes.length} ações`,
        value: `${(totalVolume / 1000000).toFixed(1)}M`,
        price: "Volume agregado",
        isPositive: true,
        icon: BarChart3,
      },
    ];
  };

  const kpiData = calculateKPIs();

  return (
    <div className="space-y-4">
      {isLoading && (
        <div className="flex items-center gap-2 px-1 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span>Carregando KPIs...</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {kpiData.map((kpi, index) => (
          <div
            key={kpi.title}
            className="kpi-card"
            style={{ animationDelay: `${0.1 * index}s` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">{kpi.title}</p>
                <span className="ticker-badge mt-1">{kpi.ticker}</span>
              </div>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  kpi.isPositive
                    ? "bg-success/10 text-success"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                <kpi.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="space-y-1">
              <p
                className={`text-2xl font-bold font-mono ${
                  kpi.isPositive ? "text-success" : "text-destructive"
                }`}
              >
                {kpi.value}
              </p>
              <p className="text-sm text-muted-foreground font-mono">
                {kpi.price}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
