import { Bot, Sparkles, TrendingUp } from "lucide-react";

export function AIInsightCard() {
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
          <p className="text-foreground/90 leading-relaxed">
            O mercado brasileiro apresenta <strong className="text-success">tendência de alta</strong> nesta sessão, 
            impulsionado pelo setor de commodities. <strong className="text-primary">VALE3</strong> lidera os ganhos 
            com valorização de 3.2%, seguida por <strong className="text-primary">PETR4</strong> (+2.8%). 
            O índice Ibovespa avança 1.4% e pode testar a resistência dos 130.000 pontos ainda hoje.
          </p>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2 text-sm text-success">
              <TrendingUp className="h-4 w-4" />
              <span className="font-medium">Sentimento: Otimista</span>
            </div>
            <span className="text-xs text-muted-foreground">
              Atualizado há 5 minutos
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
