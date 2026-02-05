import { useState } from "react";
import { MessageCircle, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { useChatbot } from "@/hooks/useChatbot";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { cn } from "@/lib/utils";

export function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, isLoading, sendMessage, clearHistory } = useChatbot();

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
        <Card
          className={cn(
            "fixed bottom-24 right-6 z-50 w-[380px] h-[500px]",
            "flex flex-col",
            "bg-background/95 backdrop-blur-md border-border/50",
            "shadow-2xl animate-scale-in"
          )}
        >
          <CardHeader className="flex flex-row items-center justify-between py-3 px-4 border-b">
            <CardTitle className="text-base font-semibold">Assistente</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={clearHistory}
              className="h-8 w-8"
              title="Limpar conversa"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-full p-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  <p>Envie uma mensagem para começar</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {messages.map((msg) => (
                    <ChatMessage key={msg.id} message={msg} />
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>

          <CardFooter className="p-4 border-t">
            <ChatInput onSend={sendMessage} isLoading={isLoading} />
          </CardFooter>
        </Card>
      )}
    </>
  );
}
