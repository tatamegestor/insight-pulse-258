import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { ChatMessageData } from "@/components/chat/ChatMessage";
import { useAuth } from "@/hooks/useAuth";

const SESSION_KEY = "chatbot_session_id";

function getOrCreateSessionId(): string {
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

export function useChatbot() {
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(getOrCreateSessionId);
  const { profile } = useAuth();

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: ChatMessageData = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("chat-webhook", {
        body: {
          message: content,
          sessionId,
          isActivePlan: (profile as any)?.is_active_plan ?? false,
        },
      });

      if (error) throw error;

      const assistantMessage: ChatMessageData = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data?.response || "Desculpe, não consegui processar sua mensagem.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Chatbot error:", err);
      const errorMessage: ChatMessageData = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Erro ao conectar com o assistente. Tente novamente.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, profile]);

  const clearHistory = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearHistory,
    sessionId,
  };
}
