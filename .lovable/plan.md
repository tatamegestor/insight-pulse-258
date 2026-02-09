

# Busca Dinâmica de Ações na Tela de Mercado

## Resumo

Adicionar busca dinâmica no campo de pesquisa da tela de Mercado que consulta a API brapi.dev em tempo real para qualquer ação brasileira (com histórico de 30 dias do plano pago) e ações globais (sem histórico).

## O que muda para o usuário

- Ao digitar 3+ caracteres no campo de busca, além de filtrar as ações monitoradas, aparece uma seção "Resultados da busca na B3" com ações vindas diretamente da API
- Clicar em um resultado leva à página de detalhes com gráfico de 30 dias (para ações BR)
- Ações já monitoradas no banco são identificadas com badge visual

## Detalhes técnicos

### 1. Novo hook: `src/hooks/useSearchStocks.ts`
- Debounce de 500ms no termo de busca
- Chama Edge Function `search-stocks` quando query >= 3 caracteres
- Retorna lista de resultados da API

### 2. Atualizar `src/pages/Mercado.tsx`
- Integrar o hook `useSearchStocks` ao campo de busca existente
- Manter filtro local na tabela principal (ações monitoradas)
- Adicionar seção abaixo da tabela com resultados da API quando houver busca
- Cada resultado mostra: ticker, nome, preço, variação
- Botão "Ver Detalhes" navega para `/acao/{symbol}`

### 3. Atualizar `src/pages/AcaoDetalhes.tsx`
- Quando a ação não existe na tabela `stock_prices`, buscar dados em tempo real via `fetch-brazilian-stocks` (inclui histórico de 30 dias do plano pago)
- Renderizar gráfico com dados históricos reais
- Para ações US não monitoradas: mostrar apenas cotação atual

### 4. Atualizar secret BRAPI_TOKEN
- Atualizar o valor do secret para a key do plano pago fornecida pelo usuário

### Arquivos impactados
1. `src/hooks/useSearchStocks.ts` -- novo
2. `src/pages/Mercado.tsx` -- adicionar seção de resultados da busca
3. `src/pages/AcaoDetalhes.tsx` -- fallback para ações não monitoradas
