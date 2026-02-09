import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ArrowLeft, TrendingUp, TrendingDown, Bot, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { useStockPrice } from "@/hooks/useStockPrices";
import { useStockHistory, detectMarket } from "@/hooks/useMarketData";
import { format } from "date-fns";

const CustomTooltip = ({ active, payload, label, currencySymbol }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 border border-primary/20">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <p className="text-lg font-bold font-mono text-primary">
          {currencySymbol} {payload[0].value.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

export default function AcaoDetalhes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const symbol = id?.toUpperCase() || "";
  const market = detectMarket(symbol);
  const currencySymbol = market === 'BR' ? 'R$' : '$';

  // Dados reais do banco (stock_prices)
  const { data: stockData, isLoading: stockLoading } = useStockPrice(symbol);
  // Histórico real para gráfico
  const { data: timeSeries, isLoading: timeSeriesLoading } = useStockHistory(symbol, market);

  // Preparar dados do gráfico
  const chartData = timeSeries
    ?.slice(0, 30)
    .reverse()
    .map(item => ({
      date: format(new Date(item.date), 'dd/MM'),
      price: item.close,
    })) || [];

  const dailyChange = stockData?.brapi_change_percent ?? stockData?.variation_daily ?? 0;
  const isPositive = dailyChange >= 0;

  if (stockLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Carregando dados de {symbol}...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (!stockData) {
    return (
      <DashboardLayout>
        <div className="space-y-4">
          <Button variant="ghost" onClick={() => navigate("/mercado")} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar ao Mercado
          </Button>
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-xl">Ação "{symbol}" não encontrada no banco de dados.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const metrics = [
    { label: "Abertura", value: stockData.open_price ? `${currencySymbol} ${Number(stockData.open_price).toFixed(2)}` : "—" },
    { label: "Máxima", value: stockData.high_price ? `${currencySymbol} ${Number(stockData.high_price).toFixed(2)}` : "—" },
    { label: "Mínima", value: stockData.low_price ? `${currencySymbol} ${Number(stockData.low_price).toFixed(2)}` : "—" },
    { label: "Volume", value: stockData.volume ? `${(Number(stockData.volume) / 1000000).toFixed(1)}M` : "—" },
    { label: "Máx. 52 sem.", value: stockData.fifty_two_week_high ? `${currencySymbol} ${Number(stockData.fifty_two_week_high).toFixed(2)}` : "—" },
    { label: "Mín. 52 sem.", value: stockData.fifty_two_week_low ? `${currencySymbol} ${Number(stockData.fifty_two_week_low).toFixed(2)}` : "—" },
    { label: "P/L", value: stockData.price_earnings ? Number(stockData.price_earnings).toFixed(2) : "—" },
    { label: "Market Cap", value: stockData.market_cap ? `${currencySymbol} ${(Number(stockData.market_cap) / 1e9).toFixed(1)}B` : "—" },
    { label: "Volatilidade", value: stockData.volatility_level || "—" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate("/mercado")} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-2" /> Voltar ao Mercado
        </Button>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 animate-fade-in">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {stockData.logo_url ? (
                <img src={stockData.logo_url} alt={symbol} className="h-10 w-10 rounded" />
              ) : (
                <span className="text-3xl">📈</span>
              )}
              <h1 className="text-4xl font-bold text-foreground">{symbol}</h1>
              {stockData.trend_emoji && <span className="text-2xl">{stockData.trend_emoji}</span>}
              <span className="px-2 py-1 text-xs rounded bg-primary/10 text-primary font-medium">
                {market === 'BR' ? '🇧🇷 B3' : '🇺🇸 NASDAQ'}
              </span>
            </div>
            <p className="text-xl text-muted-foreground">{stockData.long_name || stockData.short_name || symbol}</p>
            {stockData.trend && (
              <span className="text-xs text-muted-foreground">Tendência: {stockData.trend}</span>
            )}
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold font-mono text-foreground">
              {currencySymbol} {Number(stockData.current_price).toFixed(2)}
            </p>
            <p className={`flex items-center justify-end gap-1 text-xl font-semibold font-mono ${isPositive ? "text-success" : "text-destructive"}`}>
              {isPositive ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
              {isPositive ? "+" : ""}{Number(dailyChange).toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <TabsList className="bg-muted/50 border border-border">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="ai" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Bot className="h-4 w-4 mr-2" />
              Análise da IA
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
            {/* Chart */}
            <div className="chart-container">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Histórico de Preços (30 dias)
              </h3>
              {timeSeriesLoading ? (
                <div className="h-[300px] flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : chartData.length > 0 ? (
                <div className="h-[300px] lg:h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorPriceDetail" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(187, 85%, 53%)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(187, 85%, 53%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 10%, 18%)" vertical={false} />
                      <XAxis dataKey="date" stroke="hsl(215, 20%, 55%)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} tickLine={false} axisLine={false} domain={["dataMin - 5", "dataMax + 5"]} tickFormatter={(v) => `${currencySymbol} ${v}`} />
                      <Tooltip content={<CustomTooltip currencySymbol={currencySymbol} />} />
                      <Area type="monotone" dataKey="price" stroke="hsl(187, 85%, 53%)" strokeWidth={2} fill="url(#colorPriceDetail)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <p>Histórico não disponível para esta ação</p>
                </div>
              )}
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {metrics.map((item) => (
                <div key={item.label} className="kpi-card text-center">
                  <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                  <p className="text-lg font-bold font-mono text-foreground">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Range Position */}
            {stockData.position_52week_range !== null && stockData.position_52week_range !== undefined && (
              <div className="glass-card p-4">
                <p className="text-sm text-muted-foreground mb-2">Posição no range de 52 semanas</p>
                <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-destructive via-warning to-success"
                    style={{ width: `${Math.min(100, Math.max(0, Number(stockData.position_52week_range)))}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{stockData.fifty_two_week_low ? `${currencySymbol} ${Number(stockData.fifty_two_week_low).toFixed(2)}` : ''}</span>
                  <span>{stockData.range_position || ''}</span>
                  <span>{stockData.fifty_two_week_high ? `${currencySymbol} ${Number(stockData.fifty_two_week_high).toFixed(2)}` : ''}</span>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="ai" className="mt-6 space-y-6">
            <div className="ai-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">
                  Análise Inteligente (IA)
                </h3>
              </div>

              {stockData.auto_insight ? (
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <p className="text-foreground/90 leading-relaxed text-base">
                    {stockData.auto_insight}
                  </p>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum insight disponível para esta ação.
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                {stockData.trend && (
                  <div className="p-3 rounded-lg bg-muted/30 border border-border text-center">
                    <p className="text-xs text-muted-foreground">Tendência</p>
                    <p className="text-lg font-semibold mt-1">{stockData.trend_emoji} {stockData.trend}</p>
                  </div>
                )}
                {stockData.volatility_level && (
                  <div className="p-3 rounded-lg bg-muted/30 border border-border text-center">
                    <p className="text-xs text-muted-foreground">Volatilidade</p>
                    <p className="text-lg font-semibold mt-1">{stockData.volatility_level}</p>
                  </div>
                )}
                {stockData.range_position && (
                  <div className="p-3 rounded-lg bg-muted/30 border border-border text-center">
                    <p className="text-xs text-muted-foreground">Posição Range</p>
                    <p className="text-lg font-semibold mt-1">{stockData.range_position}</p>
                  </div>
                )}
              </div>

              <p className="text-xs text-muted-foreground mt-4">
                Insight gerado automaticamente pelo workflow de IA via n8n.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
