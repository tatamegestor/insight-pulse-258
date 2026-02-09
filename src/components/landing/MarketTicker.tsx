import { TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { useMarketTicker } from "@/hooks/useMarketData";
import { Skeleton } from "@/components/ui/skeleton";

export function MarketTicker() {
  const { data: quotes, isLoading } = useMarketTicker();

  // Formatar dados para exibição
  const tickers = quotes?.map(quote => ({
    symbol: quote.symbol,
    value: quote.price.toLocaleString('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    }),
    change: `${quote.changePercent >= 0 ? '+' : ''}${quote.changePercent.toFixed(2)}%`,
    positive: quote.changePercent >= 0,
  })) || [];

  if (isLoading) {
    return (
      <div className="bg-sidebar text-sidebar-foreground overflow-hidden py-3">
        <div className="flex items-center gap-6 px-6">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">Carregando cotações...</span>
          <div className="flex gap-6">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-5 w-24" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (tickers.length === 0) {
    return (
      <div className="bg-sidebar text-sidebar-foreground overflow-hidden py-3">
        <div className="flex items-center gap-6 px-6">
          <span className="text-sm text-muted-foreground">Dados de mercado indisponíveis</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-sidebar text-sidebar-foreground overflow-hidden py-2 sm:py-3" role="marquee" aria-label="Cotações do mercado em tempo real">
      <div className="flex animate-[scroll_30s_linear_infinite] whitespace-nowrap hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]">
        {[...tickers, ...tickers].map((ticker, index) => (
          <div
            key={index}
            className="flex items-center gap-3 px-6 border-r border-sidebar-border"
          >
            <span className="font-semibold text-sm">{ticker.symbol}</span>
            <span className="font-mono text-sm">{ticker.value}</span>
            <span
              className={`flex items-center gap-1 text-sm font-medium ${
                ticker.positive ? "text-success" : "text-destructive"
              }`}
            >
              {ticker.positive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {ticker.change}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
