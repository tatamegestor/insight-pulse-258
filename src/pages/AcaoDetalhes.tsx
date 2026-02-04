import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ArrowLeft, TrendingUp, TrendingDown, Bot, Sparkles, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
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
import { useStockQuote, useStockHistory, detectMarket } from "@/hooks/useMarketData";
import { format } from "date-fns";

// Mapeamento de símbolos para metadados
const stockMetadata: Record<string, { name: string; sector: string; logo: string }> = {
  // Brasileiras
  "PETR4": { name: "Petrobras", sector: "Energia", logo: "🛢️" },
  "VALE3": { name: "Vale", sector: "Mineração", logo: "⛏️" },
  "ITUB4": { name: "Itaú Unibanco", sector: "Financeiro", logo: "🏦" },
  "BBDC4": { name: "Bradesco", sector: "Financeiro", logo: "🏦" },
  "ABEV3": { name: "Ambev", sector: "Bebidas", logo: "🍺" },
  "MGLU3": { name: "Magazine Luiza", sector: "Varejo", logo: "🛒" },
  // Americanas
  "AAPL": { name: "Apple Inc.", sector: "Tecnologia", logo: "🍎" },
  "MSFT": { name: "Microsoft", sector: "Tecnologia", logo: "💻" },
  "GOOGL": { name: "Alphabet (Google)", sector: "Tecnologia", logo: "🔍" },
  "AMZN": { name: "Amazon", sector: "Varejo", logo: "📦" },
  "TSLA": { name: "Tesla", sector: "Automotivo", logo: "🚗" },
  "NVDA": { name: "NVIDIA", sector: "Tecnologia", logo: "🎮" },
  "META": { name: "Meta Platforms", sector: "Tecnologia", logo: "👤" },
};

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

export default function AcaoDetalhes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const symbol = id?.toUpperCase() || "AAPL";
  const market = detectMarket(symbol);

  const { data: quote, isLoading: quoteLoading } = useStockQuote(symbol);
  const { data: timeSeries, isLoading: timeSeriesLoading } = useStockHistory(symbol, market);

  const metadata = stockMetadata[symbol] || { name: quote?.name || symbol, sector: "Desconhecido", logo: "📈" };
  const isPositive = quote ? quote.change >= 0 : true;
  const currencySymbol = market === 'BR' ? 'R$' : '$';

  // Preparar dados do gráfico (últimos 30 dias, ordenado)
  const chartData = timeSeries
    ?.slice(0, 30)
    .reverse()
    .map(item => ({
      date: format(new Date(item.date), 'dd/MM'),
      price: item.close,
    })) || [];

  // Calcular métricas
  const high52w = timeSeries?.length ? Math.max(...timeSeries.map(d => d.high)) : 0;
  const low52w = timeSeries?.length ? Math.min(...timeSeries.map(d => d.low)) : 0;
  const avgVolume = timeSeries?.length 
    ? timeSeries.slice(0, 20).reduce((acc, d) => acc + d.volume, 0) / 20 
    : 0;

  // Gerar insights baseados nos dados reais
  const generateInsights = () => {
    if (!quote) return [];
    
    const insights = [];
    const changePercent = quote.changePercent;
    
    if (changePercent > 2) {
      insights.push({
        type: "positive",
        text: `${symbol} subiu ${changePercent.toFixed(2)}% hoje, indicando forte momentum de alta. O preço atual de ${currencySymbol}${quote.price.toFixed(2)} está acima da média recente.`,
      });
    } else if (changePercent < -2) {
      insights.push({
        type: "warning",
        text: `${symbol} caiu ${Math.abs(changePercent).toFixed(2)}% hoje. Considere aguardar sinais de reversão antes de novas posições.`,
      });
    }

    if (avgVolume > 0 && quote.volume > avgVolume * 1.5) {
      insights.push({
        type: "positive",
        text: `Volume de negociação 50%+ acima da média, indicando forte interesse institucional no ativo.`,
      });
    }

    if (high52w > 0 && quote.price >= high52w * 0.95) {
      insights.push({
        type: "neutral",
        text: `Preço próximo da máxima recente (${currencySymbol}${high52w.toFixed(2)}). Pode haver resistência neste nível.`,
      });
    } else if (low52w > 0 && quote.price <= low52w * 1.05) {
      insights.push({
        type: "neutral",
        text: `Preço próximo da mínima recente (${currencySymbol}${low52w.toFixed(2)}). Pode representar oportunidade de entrada.`,
      });
    }

    const apiSource = market === 'BR' ? 'brapi.dev' : 'Financial Modeling Prep';
    insights.push({
      type: "neutral",
      text: `Dados em tempo real via ${apiSource}. Mercado: ${market === 'BR' ? 'B3' : 'NASDAQ/NYSE'}.`,
    });

    return insights;
  };

  const insights = generateInsights();
  const sentimentScore = quote 
    ? Math.min(100, Math.max(0, 50 + quote.changePercent * 5))
    : 50;

  if (quoteLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Carregando dados de {symbol}...</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/mercado")}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao Mercado
        </Button>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 animate-fade-in">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{metadata.logo}</span>
              <h1 className="text-4xl font-bold text-foreground">{symbol}</h1>
              <span className="px-3 py-1 text-sm rounded-lg bg-muted text-muted-foreground">
                {metadata.sector}
              </span>
              <span className="px-2 py-1 text-xs rounded bg-primary/10 text-primary font-medium">
                {market === 'BR' ? '🇧🇷 B3' : '🇺🇸 NASDAQ'}
              </span>
            </div>
            <p className="text-xl text-muted-foreground">{quote?.name || metadata.name}</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold font-mono text-foreground">
              {currencySymbol} {quote?.price.toFixed(2) || "—"}
            </p>
            {quote && (
              <p
                className={`flex items-center justify-end gap-1 text-xl font-semibold font-mono ${
                  isPositive ? "text-success" : "text-destructive"
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="h-5 w-5" />
                ) : (
                  <TrendingDown className="h-5 w-5" />
                )}
                {isPositive ? "+" : ""}
                {quote.changePercent.toFixed(2)}%
              </p>
            )}
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
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(240, 10%, 18%)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="date"
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
                        tickFormatter={(value) => `${currencySymbol} ${value}`}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke="hsl(187, 85%, 53%)"
                        strokeWidth={2}
                        fill="url(#colorPriceDetail)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <p>Histórico não disponível para {market === 'BR' ? 'ações brasileiras' : 'esta ação'}</p>
                </div>
              )}
            </div>

            {/* Fundamentals */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: "Abertura", value: quote ? `${currencySymbol} ${quote.open.toFixed(2)}` : "—" },
                { label: "Máxima", value: quote ? `${currencySymbol} ${quote.high.toFixed(2)}` : "—" },
                { label: "Mínima", value: quote ? `${currencySymbol} ${quote.low.toFixed(2)}` : "—" },
                { label: "Volume", value: quote ? `${(quote.volume / 1000000).toFixed(1)}M` : "—" },
                { label: "Máx. 30d", value: high52w ? `${currencySymbol} ${high52w.toFixed(2)}` : "—" },
                { label: "Mín. 30d", value: low52w ? `${currencySymbol} ${low52w.toFixed(2)}` : "—" },
              ].map((item) => (
                <div key={item.label} className="kpi-card text-center">
                  <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                  <p className="text-lg font-bold font-mono text-foreground">{item.value}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ai" className="mt-6 space-y-6">
            {/* AI Sentiment */}
            <div className="ai-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">
                    Análise Inteligente
                  </h3>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">Sentimento:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-destructive via-warning to-success"
                        style={{ width: `${sentimentScore}%` }}
                      />
                    </div>
                    <span
                      className={`font-mono font-bold ${
                        sentimentScore >= 60
                          ? "text-success"
                          : sentimentScore >= 40
                          ? "text-warning"
                          : "text-destructive"
                      }`}
                    >
                      {sentimentScore.toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {insights.length > 0 ? (
                  insights.map((insight, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-3 p-4 rounded-lg border ${
                        insight.type === "positive"
                          ? "bg-success/5 border-success/20"
                          : insight.type === "warning"
                          ? "bg-warning/5 border-warning/20"
                          : "bg-muted/50 border-border"
                      }`}
                    >
                      {insight.type === "positive" ? (
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-success mt-0.5" />
                      ) : insight.type === "warning" ? (
                        <AlertCircle className="h-5 w-5 shrink-0 text-warning mt-0.5" />
                      ) : (
                        <Bot className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                      )}
                      <p className="text-foreground/90 leading-relaxed">{insight.text}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                    Carregando análise...
                  </div>
                )}
              </div>

              <p className="text-xs text-muted-foreground mt-4">
                Análise gerada automaticamente com base em dados de mercado em tempo real.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
