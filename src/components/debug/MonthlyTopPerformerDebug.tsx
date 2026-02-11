/**
 * Componente de Debug para Top Performer Mensal
 * USE APENAS PARA TESTES - remova em produção
 * 
 * Adicione este componente no Dashboard para visualizar os dados siendo carregados
 */

import { useMonthlyTopPerformer } from "@/hooks/useMarketData";

export function MonthlyTopPerformerDebug() {
  const { data, isLoading, error } = useMonthlyTopPerformer();

  return (
    <div className="p-4 mt-8 bg-slate-900 border border-slate-700 rounded-lg text-white">
      <h3 className="font-bold mb-4 text-yellow-400">🔍 Debug: Top Performer Mensal</h3>
      
      <div className="space-y-3 text-sm font-mono">
        <div>
          <span className="text-blue-400">Loading:</span> {isLoading ? "true" : "false"}
        </div>
        
        <div>
          <span className="text-blue-400">Error:</span> {error ? error.message : "null"}
        </div>
        
        <div>
          <span className="text-blue-400">Data:</span>
          <pre className="mt-2 p-2 bg-slate-800 rounded text-green-400 overflow-auto max-h-64">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>

      {data && data.length > 0 ? (
        <div className="mt-4 p-3 bg-green-900/30 border border-green-600 rounded">
          <p className="text-green-400">✓ Dados carregados com sucesso!</p>
          <p className="text-sm mt-2">
            {data.length} registro(s) encontrado(s)
          </p>
        </div>
      ) : (
        <div className="mt-4 p-3 bg-red-900/30 border border-red-600 rounded">
          <p className="text-red-400">✗ Nenhum dado encontrado</p>
          {isLoading && <p className="text-sm mt-2">Carregando...</p>}
          {error && <p className="text-sm mt-2 text-red-300">{error.message}</p>}
        </div>
      )}
    </div>
  );
}
