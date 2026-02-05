
# Plano: Melhorar Visual do Chatbot + Disclaimer Legal

## Resumo

Aprimorar a aparência do chatbot com estilo glass-card premium, adicionar mensagem de boas-vindas explicando o propósito (resumidor de empresas) e incluir disclaimer legal para proteção jurídica.

---

## Mudancas Visuais

### FloatingChatbot.tsx

**Header melhorado:**
- Icone de grafico/empresa ao lado do titulo
- Titulo mais descritivo: "Analista de Empresas"
- Gradiente sutil no header
- Badge "Beta" opcional

**Painel de chat:**
- Usar classe `glass-card` existente no projeto
- Bordas mais arredondadas (rounded-2xl)
- Animacao de entrada mais suave
- Sombra com tom laranja sutil

**Mensagem de boas-vindas (estado vazio):**
- Icone grande de empresa/grafico
- Texto explicativo: "Digite o nome de uma empresa para ver um resumo sobre ela"
- Sugestoes de empresas como chips clicaveis (PETR4, VALE3, AAPL)

### ChatMessage.tsx

**Mensagens do assistente:**
- Fundo com gradiente sutil
- Borda fina colorida
- Avatar com icone de grafico ao inves de bot generico

**Mensagens do usuario:**
- Manter estilo atual (primary color)

### ChatInput.tsx

**Input aprimorado:**
- Placeholder contextual: "Digite o nome da empresa..."
- Borda com foco laranja
- Icone de busca opcional

---

## Disclaimer Legal

**Onde adicionar:**
1. Footer do painel de chat (sempre visivel)
2. Mensagem inicial do assistente (primeira resposta)

**Texto do disclaimer:**
```
Este servico fornece apenas informacoes educacionais. 
Nao constitui recomendacao de investimento.
```

**Estilo:**
- Texto pequeno (text-xs)
- Cor muted
- Icone de informacao (AlertCircle)

---

## Arquivos a Modificar

### 1. src/components/chat/FloatingChatbot.tsx

Mudancas:
- Aplicar classe `glass-card` no Card
- Redesenhar header com icone TrendingUp
- Nova mensagem de boas-vindas com sugestoes
- Adicionar disclaimer no footer

### 2. src/components/chat/ChatMessage.tsx

Mudancas:
- Icone TrendingUp para avatar do assistente
- Gradiente sutil nas mensagens do assistente
- Texto do assistente com cor mais legivel (text-foreground)

### 3. src/components/chat/ChatInput.tsx

Mudancas:
- Placeholder: "Digite o nome da empresa..."
- Estilo do input com borda focada em primary

---

## Componente de Sugestoes

Novo elemento dentro do estado vazio:
- Chips com nomes de empresas populares
- Ao clicar, envia automaticamente a mensagem
- Exemplos: PETR4, VALE3, ITUB4, AAPL, MSFT

---

## Estrutura Visual Final

```text
+----------------------------------+
|  [icon] Analista de Empresas  [x]|  <- Header com gradiente
+----------------------------------+
|                                  |
|     [icone grande]               |
|   Digite o nome de uma empresa   |  <- Estado vazio
|   para ver um resumo             |
|                                  |
|   [PETR4] [VALE3] [AAPL]         |  <- Sugestoes clicaveis
|                                  |
+----------------------------------+
|  [i] Nao constitui recomendacao  |  <- Disclaimer
|  Digite o nome da empresa...  [>]|  <- Input
+----------------------------------+
```

---

## Detalhes Tecnicos

**Classes CSS a utilizar:**
- `glass-card` (ja existe no index.css)
- `ai-card` (para efeito premium com gradiente laranja)
- Animacoes existentes: `animate-fade-in`, `animate-scale-in`

**Icones necessarios (lucide-react):**
- TrendingUp ou BarChart3 (para tema financeiro)
- Building2 (empresas)
- AlertCircle ou Info (disclaimer)

---

## Resultado Esperado

- Visual premium alinhado com o design system do app
- Proposito claro do chatbot (resumidor de empresas)
- Protecao juridica com disclaimer visivel
- Experiencia mais intuitiva com sugestoes de empresas
