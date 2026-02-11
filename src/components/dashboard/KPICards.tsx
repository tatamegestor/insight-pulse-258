import { TrendingUp, TrendingDown, Zap, Loader2 } from "lucide-react";
import { useDashboardKPIs, useMonthlyTopPerformer } from "@/hooks/useMarketData";

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
  const { data: monthlyData, isLoading: monthlyLoading, error: monthlyError } = useMonthlyTopPerformer();

  const calculateTopGainerAndLoser = (): { gainer: KPIData; loser: KPIData } | null => {
    if (!quotes || quotes.length === 0) {
      return null;
    }

    const sorted = [...quotes].sort((a, b) => b.changePercent - a.changePercent);
    const topGainer = sorted[0];
    const topLoser = sorted[sorted.length - 1];

    return {
      gainer: {
        title: "Maior Alta",
        ticker: topGainer.symbol,
        value: `${topGainer.changePercent >= 0 ? '+' : ''}${topGainer.changePercent.toFixed(2)}%`,
        price: `$ ${topGainer.price.toFixed(2)}`,
        isPositive: topGainer.changePercent >= 0,
        icon: TrendingUp,
      },
      loser: {
        title: "Maior Baixa",
        ticker: topLoser.symbol,
        value: `${topLoser.changePercent >= 0 ? '+' : ''}${topLoser.changePercent.toFixed(2)}%`,
        price: `$ ${topLoser.price.toFixed(2)}`,
        isPositive: topLoser.changePercent >= 0,
        icon: TrendingDown,
      },
    };
  };

  const getMonthlyTopPerformer = (): KPIData => {
    if (monthlyLoading) {
      return {
        title: "Maior Var. Mensal",
        ticker: "Carregando...",
        value: "—",
        price: "—",
        isPositive: true,
        icon: Zap,
      };
    }

    if (!monthlyData || monthlyData.length === 0 || monthlyError) {
      return {
        title: "Maior Var. Mensal",
        ticker: "—",
        value: "—",
        price: "—",
        isPositive: true,
        icon: Zap,
      };
    }

    const monthlyTopPerformer = monthlyData[0];
    const isPositive = monthlyTopPerformer.monthly_change >= 0;

    return {
      title: "Maior Var. Mensal",
      ticker: monthlyTopPerformer.symbol,
      value: `${isPositive ? '+' : ''}${monthlyTopPerformer.monthly_change.toFixed(2)}%`,
      price: `${monthlyTopPerformer.currency} ${monthlyTopPerformer.price.toFixed(2)}`,
      isPositive,
      icon: Zap,
    };
  };

  const topPerformers = calculateTopGainerAndLoser();
  const monthlyCard = getMonthlyTopPerformer();

  const kpiData: KPIData[] = [
    topPerformers?.gainer || {
      title: "Maior Alta",
      ticker: isLoading ? "Carregando..." : "—",
      value: "—",
      price: "—",
      isPositive: true,
      icon: TrendingUp,
    },
    topPerformers?.loser || {
      title: "Maior Baixa",
      ticker: isLoading ? "Carregando..." : "—",
      value: "—",
      price: "—",
      isPositive: false,
      icon: TrendingDown,
    },
    monthlyCard,
  ];

  return (
    <div className="space-y-4">
      {(isLoading || monthlyLoading) && (
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
