import { useState, useEffect, useCallback } from "react";
import { TrendingUp, TrendingDown, BarChart3, Loader2 } from "lucide-react";
import { getMultipleStockQuotes, StockQuote } from "@/services/alphaVantage";

// Menos ações para reduzir requisições
const kpiSymbols = ["AAPL", "MSFT", "GOOGL"];

interface KPIData {
  title: string;
  ticker: string;
  value: string;
  price: string;
  isPositive: boolean;
  icon: typeof TrendingUp;
}

export function KPICards() {
  const [quotes, setQuotes] = useState<Map<string, StockQuote>>(new Map());
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchQuotes = useCallback(async () => {
    setIsLoading(true);
    
    await getMultipleStockQuotes(kpiSymbols, (loaded, total, data) => {
      setLoadedCount(loaded);
      setQuotes(new Map(data));
    });

    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  const calculateKPIs = (): KPIData[] => {
    const validQuotes = Array.from(quotes.values());
    
    if (validQuotes.length === 0) {
      return [
        { title: "Maior Alta", ticker: isLoading ? "Carregando..." : "—", value: "—", price: "—", isPositive: true, icon: TrendingUp },
        { title: "Maior Baixa", ticker: isLoading ? "Carregando..." : "—", value: "—", price: "—", isPositive: false, icon: TrendingDown },
        { title: "Volume Total", ticker: "—", value: "—", price: "—", isPositive: true, icon: BarChart3 },
      ];
    }

    const sorted = [...validQuotes].sort((a, b) => {
      const aChange = parseFloat(a.changePercent.replace('%', ''));
      const bChange = parseFloat(b.changePercent.replace('%', ''));
      return bChange - aChange;
    });

    const topGainer = sorted[0];
    const topLoser = sorted[sorted.length - 1];
    const totalVolume = validQuotes.reduce((acc, q) => acc + q.volume, 0);

    const topGainerChange = parseFloat(topGainer.changePercent.replace('%', ''));
    const topLoserChange = parseFloat(topLoser.changePercent.replace('%', ''));

    return [
      {
        title: "Maior Alta",
        ticker: topGainer.symbol,
        value: `${topGainerChange >= 0 ? '+' : ''}${topGainerChange.toFixed(2)}%`,
        price: `$ ${topGainer.price.toFixed(2)}`,
        isPositive: topGainerChange >= 0,
        icon: TrendingUp,
      },
      {
        title: "Maior Baixa",
        ticker: topLoser.symbol,
        value: `${topLoserChange >= 0 ? '+' : ''}${topLoserChange.toFixed(2)}%`,
        price: `$ ${topLoser.price.toFixed(2)}`,
        isPositive: topLoserChange >= 0,
        icon: TrendingDown,
      },
      {
        title: "Volume Total",
        ticker: `${validQuotes.length} ações`,
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
      {isLoading && loadedCount < kpiSymbols.length && (
        <div className="flex items-center gap-2 px-1 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span>Carregando KPIs... {loadedCount}/{kpiSymbols.length}</span>
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
