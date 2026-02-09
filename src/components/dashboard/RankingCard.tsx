import { TrendingUp, TrendingDown, Loader2, RefreshCw } from "lucide-react";
import { useTopGainers, useTopLosers, useLastSync } from "@/hooks/useRankings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface RankingItemProps {
  symbol: string;
  name: string;
  change: number;
  position: number;
  isGainer?: boolean;
}

function RankingItem({ symbol, name, change, position, isGainer = true }: RankingItemProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
      <div className="flex items-center gap-3">
        <span className="w-6 h-6 flex items-center justify-center text-xs font-bold rounded-full bg-muted text-muted-foreground">
          {position}
        </span>
        <div>
          <span className="ticker-badge text-xs">{symbol}</span>
          <p className="text-xs text-muted-foreground truncate max-w-[140px]">{name}</p>
        </div>
      </div>
      <div className={`flex items-center gap-1 font-mono text-sm font-medium ${
        isGainer ? "text-success" : "text-destructive"
      }`}>
        {isGainer ? (
          <TrendingUp className="h-3 w-3" />
        ) : (
          <TrendingDown className="h-3 w-3" />
        )}
        {change >= 0 ? "+" : ""}{change.toFixed(2)}%
        <span className="text-[10px] text-muted-foreground ml-1">(1D)</span>
      </div>
    </div>
  );
}

export function RankingCard() {
  const { data: gainers, isLoading: gainersLoading } = useTopGainers(undefined, 5);
  const { data: losers, isLoading: losersLoading } = useTopLosers(undefined, 5);
  const { data: lastSync } = useLastSync();

  const isLoading = gainersLoading || losersLoading;
  const hasData = (gainers && gainers.length > 0) || (losers && losers.length > 0);

  return (
    <Card className="glass-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <span className="text-primary">📊</span>
            Ranking de Ações
          </CardTitle>
          {lastSync && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <RefreshCw className="h-3 w-3" />
              <span>
                {formatDistanceToNow(new Date(lastSync.created_at), {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : !hasData ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">Nenhum dado de ranking disponível</p>
            <p className="text-xs mt-1">Os rankings serão atualizados automaticamente via n8n</p>
          </div>
        ) : (
          <Tabs defaultValue="gainers" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted/50">
              <TabsTrigger 
                value="gainers" 
                className="data-[state=active]:bg-success/20 data-[state=active]:text-success"
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                Altas
              </TabsTrigger>
              <TabsTrigger 
                value="losers"
                className="data-[state=active]:bg-destructive/20 data-[state=active]:text-destructive"
              >
                <TrendingDown className="h-3 w-3 mr-1" />
                Baixas
              </TabsTrigger>
            </TabsList>
            <TabsContent value="gainers" className="mt-3">
              {gainers && gainers.length > 0 ? (
                <div className="space-y-1">
                  {gainers.map((stock, index) => (
                    <RankingItem
                      key={stock.id}
                      symbol={stock.symbol}
                      name={stock.name}
                      change={stock.daily_change}
                      position={index + 1}
                      isGainer={true}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center text-sm text-muted-foreground py-4">
                  Sem dados de altas
                </p>
              )}
            </TabsContent>
            <TabsContent value="losers" className="mt-3">
              {losers && losers.length > 0 ? (
                <div className="space-y-1">
                  {losers.map((stock, index) => (
                    <RankingItem
                      key={stock.id}
                      symbol={stock.symbol}
                      name={stock.name}
                      change={stock.daily_change}
                      position={index + 1}
                      isGainer={false}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center text-sm text-muted-foreground py-4">
                  Sem dados de baixas
                </p>
              )}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
