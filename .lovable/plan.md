

# Plano: Chatbot Flutuante com Integração n8n (Opção B - Secret)

## Resumo

Implementar um chatbot flutuante que aparece em todas as páginas, comunicando-se com n8n através de uma Edge Function que usa a secret `N8N_WEBHOOK_URL`.

---

## Arquitetura

```text
Usuario digita mensagem
         │
         ▼
┌─────────────────────────┐
│   FloatingChatbot.tsx   │
│   (Componente React)    │
└───────────┬─────────────┘
            │ POST /chat-webhook
            ▼
┌─────────────────────────┐
│  Edge Function          │
│  chat-webhook/index.ts  │
│  (usa N8N_WEBHOOK_URL)  │
└───────────┬─────────────┘
            │ POST webhook
            ▼
┌─────────────────────────┐
│     n8n Workflow        │
│  Webhook → AI → Reply   │
└─────────────────────────┘
```

---

## Arquivos a Criar

### 1. src/components/chat/FloatingChatbot.tsx

Componente principal contendo:
- Botao flutuante (canto inferior direito)
- Painel de chat expansivel
- Header com titulo e botao fechar
- Area de mensagens com scroll
- Input de texto e botao enviar
- Estados: isOpen, isLoading, messages

### 2. src/components/chat/ChatMessage.tsx

Componente de mensagem individual:
- Estilo diferente para user vs assistant
- Avatar ou icone
- Timestamp opcional
- Animacao de entrada

### 3. src/components/chat/ChatInput.tsx

Input de mensagem:
- Campo de texto
- Botao enviar
- Suporte a Enter para enviar
- Estado de loading (desabilita durante envio)

### 4. src/hooks/useChatbot.ts

Hook para gerenciar estado:
- messages: array de mensagens
- isLoading: boolean
- sendMessage(content): envia para edge function
- clearHistory(): limpa conversa
- sessionId: gerado e persistido no localStorage

### 5. supabase/functions/chat-webhook/index.ts

Edge Function proxy:
- Recebe POST com { message, sessionId }
- Le secret N8N_WEBHOOK_URL
- Chama webhook do n8n
- Retorna { response } do n8n
- CORS headers
- Tratamento de erros

---

## Arquivos a Modificar

### src/App.tsx

Adicionar FloatingChatbot como componente global (fora das rotas, para aparecer em todas as paginas).

---

## Estrutura de Dados

```typescript
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
```

---

## Estilo do Componente

Botao Flutuante:
- position: fixed
- bottom: 24px, right: 24px
- z-index: 50
- Tamanho: 56px
- Cor: primary (laranja)
- Icone: MessageCircle (lucide-react)
- Sombra e hover effect

Painel de Chat:
- position: fixed
- bottom: 96px, right: 24px
- width: 380px, height: 500px
- z-index: 50
- glass-card effect
- Animacao slide-in

---

## Edge Function: chat-webhook

```typescript
// Estrutura basica
const corsHeaders = { ... };

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  
  // Ler webhook URL da secret
  const webhookUrl = Deno.env.get('N8N_WEBHOOK_URL');
  if (!webhookUrl) return erro 500;
  
  // Parsear body
  const { message, sessionId } = await req.json();
  
  // Chamar n8n
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sessionId, timestamp: new Date().toISOString() })
  });
  
  // Retornar resposta
  const data = await response.json();
  return new Response(JSON.stringify({ response: data.response || data.output }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
});
```

---

## Secret Necessaria

**N8N_WEBHOOK_URL**: URL do webhook n8n (ex: https://seu-n8n.app/webhook/abc123)

O usuario precisara:
1. Criar workflow no n8n com Webhook trigger
2. Copiar URL do webhook
3. Adicionar como secret no projeto

---

## Ordem de Implementacao

1. Criar componentes de UI (FloatingChatbot, ChatMessage, ChatInput)
2. Criar hook useChatbot
3. Criar Edge Function chat-webhook
4. Solicitar secret N8N_WEBHOOK_URL ao usuario
5. Integrar FloatingChatbot no App.tsx
6. Deploy e testar

---

## Resultado Esperado

- Botao de chat flutuante visivel em todas as paginas
- Ao clicar, abre painel de conversacao
- Usuario digita mensagem, envia para n8n via Edge Function
- Resposta do n8n aparece no chat
- Historico mantido durante a sessao

