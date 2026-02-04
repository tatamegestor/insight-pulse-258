import { TrendingUp, TrendingDown } from "lucide-react";

const tickers = [
  { symbol: "IBOV", value: "128.450", change: "+1.24%", positive: true },
  { symbol: "S&P 500", value: "5.234", change: "+0.45%", positive: true },
  { symbol: "NASDAQ", value: "16.780", change: "+0.82%", positive: true },
  { symbol: "BTC/USD", value: "68.542", change: "-1.20%", positive: false },
  { symbol: "USD/BRL", value: "4.9250", change: "+0.15%", positive: true },
  { symbol: "EUR/BRL", value: "5.3420", change: "-0.08%", positive: false },
  { symbol: "PETR4", value: "38.45", change: "+2.15%", positive: true },
  { symbol: "VALE3", value: "62.80", change: "-0.45%", positive: false },
];

export function MarketTicker() {
  return (
    <div className="bg-sidebar text-sidebar-foreground overflow-hidden py-3">
      <div className="flex animate-[scroll_30s_linear_infinite] whitespace-nowrap">
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
