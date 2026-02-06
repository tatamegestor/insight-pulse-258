import { Bot, Sparkles, TrendingUp, TrendingDown, Minus } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useDailyInsight } from "@/hooks/useDailyInsight";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export function AIInsightCard() {
  const { data: insight, isLoading } = useDailyInsight();

  const getSentimentConfig = (sentiment: string) => {
    switch (sentiment) {
      case "otimista":
        return {
          icon: TrendingUp,
          label: "Otimista",
          colorClass: "text-success",
          badgeClass: "bg-success/20 text-success border-success/30",
        };
      case "pessimista":
        return {
          icon: TrendingDown,
          label: "Pessimista",
          colorClass: "text-destructive",
          badgeClass: "bg-destructive/20 text-destructive border-destructive/30",
        };
      default:
        return {
          icon: Minus,
          label: "Neutro",
          colorClass: "text-muted-foreground",
          badgeClass: "bg-muted text-muted-foreground border-muted-foreground/30",
        };
    }
  };

  const getTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: ptBR,
      });
    } catch {
      return "recentemente";
    }
  };

  if (isLoading) {
    return (
      <div className="ai-card p-6 lg:p-8">
        <div className="flex items-start gap-4">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>
    );
  }

  // Fallback para quando não há insight no banco
  if (!insight) {
    return (
      <div className="ai-card p-6 lg:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/20 border border-primary/30">
            <Bot className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Insight do Dia
              </h3>
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/20 text-primary border border-primary/30">
                IA
              </span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Aguardando o primeiro insight do dia. O insight será gerado automaticamente
              com análises do mercado em tempo real.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const sentimentConfig = getSentimentConfig(insight.sentiment);
  const SentimentIcon = sentimentConfig.icon;

  return (
    <div className="ai-card p-6 lg:p-8">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/20 border border-primary/30">
          <Bot className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Insight do Dia
            </h3>
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/20 text-primary border border-primary/30">
              IA
            </span>
          </div>
          <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/90 leading-relaxed [&>p]:m-0 [&>ul]:my-1 [&>ol]:my-1">
            <ReactMarkdown>{insight.content}</ReactMarkdown>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <div className={`flex items-center gap-2 text-sm ${sentimentConfig.colorClass}`}>
              <SentimentIcon className="h-4 w-4" />
              <span className="font-medium">Sentimento: {sentimentConfig.label}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              Atualizado {getTimeAgo(insight.generated_at)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
