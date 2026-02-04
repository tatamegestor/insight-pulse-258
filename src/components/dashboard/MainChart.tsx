import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { TrendingUp, TrendingDown, Clock, Loader2, RefreshCw } from "lucide-react";
import { useMainChartData } from "@/hooks/useMarketData";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 border border-primary/20">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <p className="text-lg font-bold font-mono text-primary">
          $ {payload[0].value.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

const DEFAULT_SYMBOL = "AAPL";

export function MainChart() {
  const { quote, history, isLoading, error } = useMainChartData(DEFAULT_SYMBOL);
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['stockQuote', DEFAULT_SYMBOL] });
    queryClient.invalidateQueries({ queryKey: ['stockHistory', DEFAULT_SYMBOL] });
  };

  // Preparar dados do gráfico
  const chartData = history
    .slice(0, 20)
    .reverse()
    .map(item => ({
      time: format(new Date(item.date), 'dd/MM'),
      price: item.close,
    }));

  const isPositive = quote ? quote.change >= 0 : true;

  return (
    <div className="chart-container">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-semibold text-foreground">{DEFAULT_SYMBOL}</h3>
            <span className="ticker-badge">Apple Inc.</span>
            {quote && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                </span>
                Dados reais
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-3">
            {isLoading && !quote ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="text-muted-foreground">Carregando...</span>
              </div>
            ) : quote ? (
              <>
                <span className="text-3xl font-bold font-mono text-foreground">
                  $ {quote.price.toFixed(2)}
                </span>
                <span
                  className={`flex items-center gap-1 text-lg font-semibold font-mono ${
                    isPositive ? "text-success" : "text-destructive"
                  }`}
                >
                  {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  {isPositive ? '+' : ''}{quote.changePercent.toFixed(2)}%
                </span>
              </>
            ) : (
              <span className="text-muted-foreground">Aguardando dados...</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Últimos 20 dias</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            disabled={isLoading}
            className="h-8 w-8"
            title="Atualizar dados"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-warning/10 border border-warning/20 text-warning text-sm">
          Erro ao carregar dados. Tente novamente.
        </div>
      )}

      <div className="h-[300px] lg:h-[400px]">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(187, 85%, 53%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(187, 85%, 53%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(240, 10%, 18%)"
                vertical={false}
              />
              <XAxis
                dataKey="time"
                stroke="hsl(215, 20%, 55%)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(215, 20%, 55%)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={["dataMin - 5", "dataMax + 5"]}
                tickFormatter={(value) => `$ ${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="price"
                stroke="hsl(187, 85%, 53%)"
                strokeWidth={2}
                fill="url(#colorPrice)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
              <span className="text-muted-foreground">Carregando gráfico...</span>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p>Aguardando dados do gráfico...</p>
              <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-3">
                <RefreshCw className="h-4 w-4 mr-2" />
                Tentar novamente
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
