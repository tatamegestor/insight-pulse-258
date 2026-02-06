import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Trash2, TrendingUp, AlertCircle, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useChatbot } from "@/hooks/useChatbot";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { cn } from "@/lib/utils";

const COMPANY_SUGGESTIONS = [
  { name: "PETR4", label: "Petrobras" },
  { name: "VALE3", label: "Vale" },
  { name: "ITUB4", label: "Itaú" },
  { name: "AAPL", label: "Apple" },
  { name: "MSFT", label: "Microsoft" },
];

export function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, isLoading, sendMessage, clearHistory } = useChatbot();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive or loading state changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSuggestionClick = (company: string) => {
    sendMessage(company);
  };

  return (
    <>
      {/* Floating Button */}
      <Button
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg",
          "bg-primary hover:bg-primary/90 text-primary-foreground",
          "transition-transform hover:scale-105",
          isOpen && "rotate-90"
        )}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </Button>

      {/* Chat Panel */}
      {isOpen && (
        <div
          className={cn(
            "fixed bottom-24 right-6 z-50 w-[340px] h-[420px]",
            "flex flex-col",
            "glass-card overflow-hidden",
            "animate-scale-in"
          )}
        >
          {/* Header with gradient */}
          <div className="flex items-center justify-between py-3 px-4 border-b border-border/50 bg-gradient-to-r from-primary/10 to-primary/5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/15">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <span className="text-base font-semibold text-foreground">Invest AI</span>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5">
                Beta
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={clearHistory}
              className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
              title="Limpar conversa"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            <div ref={scrollRef} className="h-full overflow-y-auto p-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-8">
                  <div className="p-4 rounded-2xl bg-primary/10">
                    <Building2 className="h-10 w-10 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-foreground font-medium">
                      Seu assistente de investimentos
                    </p>
                    <p className="text-sm text-muted-foreground max-w-[280px]">
                      Pergunte sobre empresas, ações e mercado financeiro
                    </p>
                  </div>
                  
                  {/* Suggestion chips */}
                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {COMPANY_SUGGESTIONS.map((company) => (
                      <button
                        key={company.name}
                        onClick={() => handleSuggestionClick(company.name)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs font-medium",
                          "bg-secondary hover:bg-secondary/80 text-secondary-foreground",
                          "border border-border/50 hover:border-primary/30",
                          "transition-all duration-200 hover:scale-105"
                        )}
                      >
                        {company.name}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {messages.map((msg) => (
                    <ChatMessage key={msg.id} message={msg} />
                  ))}
                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-primary" />
                      </div>
                      <div className="rounded-xl px-3 py-2 bg-gradient-to-br from-muted to-muted/80 border border-border/50">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce [animation-delay:0ms]" />
                          <span className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce [animation-delay:150ms]" />
                          <span className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce [animation-delay:300ms]" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Footer with disclaimer and input */}
          <div className="border-t border-border/50 bg-background/50">
            {/* Disclaimer */}
            <div className="flex items-center gap-1.5 px-4 pt-2 pb-1">
              <AlertCircle className="h-3 w-3 text-muted-foreground shrink-0" />
              <p className="text-[10px] text-muted-foreground leading-tight">
                Informações educacionais. Não constitui recomendação de investimento.
              </p>
            </div>
            
            {/* Input */}
            <div className="px-4 pb-4 pt-1">
              <ChatInput onSend={sendMessage} isLoading={isLoading} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
