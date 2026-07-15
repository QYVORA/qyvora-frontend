import { useState, useCallback } from 'react';
import { Play, Clock, AlertTriangle } from 'lucide-react';
import type { SqlTable, SqlQueryResult } from './types';

interface SqlConsoleProps {
  tables: SqlTable[];
  predefinedQueries?: { query: string; description: string }[];
}

export function SqlConsole({ tables, predefinedQueries = [] }: SqlConsoleProps) {
  const [query, setQuery] = useState('SELECT * FROM users LIMIT 10;');
  const [result, setResult] = useState<SqlQueryResult | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const executeQuery = useCallback(() => {
    const start = performance.now();
    const trimmed = query.trim().toLowerCase();
    const timing = Math.round(performance.now() - start + Math.random() * 50);

    // Simple SQL simulation
    if (trimmed.startsWith('select')) {
      // Find referenced table
      const fromMatch = trimmed.match(/from\s+(\w+)/);
      const tableName = fromMatch?.[1];
      const table = tables.find(t => t.name.toLowerCase() === tableName);

      if (table) {
        const limitMatch = trimmed.match(/limit\s+(\d+)/);
        const limit = limitMatch ? parseInt(limitMatch[1]) : 10;
        const rows = table.rows.slice(0, limit);
        setResult({ columns: table.columns, rows, timing });
      } else {
        setResult({ columns: [], rows: [], error: `Table '${tableName}' doesn't exist`, timing });
      }
    } else if (trimmed.startsWith('show tables') || trimmed.startsWith('show databases')) {
      setResult({
        columns: ['Table Name'],
        rows: tables.map(t => ({ 'Table Name': t.name })),
        timing,
      });
    } else if (trimmed.startsWith('describe') || trimmed.startsWith('desc')) {
      const tableName = trimmed.split(/\s+/)[1];
      const table = tables.find(t => t.name.toLowerCase() === tableName);
      if (table) {
        setResult({
          columns: ['Field', 'Type'],
          rows: table.columns.map(c => ({ Field: c, Type: 'varchar(255)' })),
          timing,
        });
      } else {
        setResult({ columns: [], rows: [], error: `Table '${tableName}' doesn't exist`, timing });
      }
    } else if (trimmed.startsWith('insert') || trimmed.startsWith('update') || trimmed.startsWith('delete')) {
      const affected = Math.floor(Math.random() * 5) + 1;
      setResult({ columns: [], rows: [], affectedRows: affected, timing });
    } else {
      setResult({ columns: [], rows: [], error: 'Query not supported in simulation mode', timing });
    }

    setHistory(prev => [...prev, query]);
  }, [query, tables]);

  return (
    <div className="flex flex-col h-full rounded-2xl border border-border/30 bg-bg-card overflow-hidden">
      <div className="px-4 py-3 bg-bg-elevated border-b border-border/20">
        <p className="text-[10px] font-black uppercase tracking-widest text-accent">SQL Console</p>
      </div>

      {/* Schema */}
      <div className="px-4 py-2 bg-black/40 border-b border-border/20 flex items-center gap-3 overflow-auto">
        <span className="text-[9px] font-black uppercase tracking-widest text-text-muted shrink-0">Tables:</span>
        {tables.map(t => (
          <button key={t.name} onClick={() => setQuery(`SELECT * FROM ${t.name} LIMIT 10;`)}
            className="px-2 py-0.5 rounded bg-bg-elevated text-[9px] font-mono text-accent hover:bg-accent/10 shrink-0">
            {t.name} <span className="text-text-muted/50">({t.rows.length})</span>
          </button>
        ))}
      </div>

      {/* Query Input */}
      <div className="p-3 border-b border-border/20">
        <div className="flex gap-2">
          <textarea
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); executeQuery(); } }}
            className="flex-1 h-16 bg-black/40 border border-border/30 rounded-lg p-2 text-[11px] font-mono text-text-primary outline-none resize-none focus:border-accent/50"
            placeholder="Enter SQL query..."
          />
          <button onClick={executeQuery}
            className="flex items-center gap-1 px-3 rounded-lg bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20 transition-colors self-start">
            <Play size={14} /> <span className="text-[9px] font-black uppercase tracking-wider">Run</span>
          </button>
        </div>
        {predefinedQueries.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {predefinedQueries.map((pq, i) => (
              <button key={i} onClick={() => setQuery(pq.query)}
                className="px-2 py-0.5 rounded bg-bg-elevated text-[8px] font-mono text-text-muted hover:text-accent truncate max-w-[150px]"
                title={pq.description}>
                {pq.description}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results */}
      <div className="flex-1 overflow-auto">
        {result?.error ? (
          <div className="p-4 flex items-center gap-2 text-red-400 text-[10px] font-mono">
            <AlertTriangle size={12} /> {result.error}
          </div>
        ) : result && result.columns.length > 0 ? (
          <div className="p-3">
            <div className="flex items-center gap-3 mb-2 text-[9px] font-mono text-text-muted">
              <span>{result.rows.length} rows</span>
              <span className="flex items-center gap-1"><Clock size={9} /> {result.timing}ms</span>
            </div>
            <table className="w-full text-[10px] font-mono">
              <thead>
                <tr>
                  {result.columns.map(c => (
                    <th key={c} className="text-left px-2 py-1.5 text-accent border-b border-border/30">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.rows.map((row, i) => (
                  <tr key={i} className="border-b border-border/10 hover:bg-white/5">
                    {result.columns.map(c => (
                      <td key={c} className="px-2 py-1.5 text-text-muted">{row[c]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : result?.affectedRows !== undefined ? (
          <div className="p-4 text-[10px] font-mono text-green-400">
            Query affected {result.affectedRows} row(s) in {result.timing}ms
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-text-muted/50 text-[10px] font-mono">
            Run a query to see results
          </div>
        )}
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="border-t border-border/20 px-4 py-2 max-h-[80px] overflow-auto">
          <p className="text-[8px] font-black uppercase tracking-widest text-text-muted/50 mb-1">History</p>
          {history.slice(-5).map((h, i) => (
            <button key={i} onClick={() => setQuery(h)}
              className="block text-[9px] font-mono text-text-muted/50 hover:text-accent truncate w-full text-left">
              {h}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
