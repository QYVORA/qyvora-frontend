import { useState, useCallback } from 'react';
import { Send, ChevronDown } from 'lucide-react';
import type { ApiEndpoint } from './types';

interface ApiExplorerProps {
  endpoints: ApiEndpoint[];
}

export function ApiExplorer({ endpoints }: ApiExplorerProps) {
  const [selectedId, setSelectedId] = useState(endpoints[0]?.id || '');
  const [customBody, setCustomBody] = useState('');
  const [response, setResponse] = useState<{ statusCode: number; headers: Record<string, string>; body: string; timing: number } | null>(null);

  const selected = endpoints.find(e => e.id === selectedId);

  const sendRequest = useCallback(() => {
    if (!selected) return;
    const start = performance.now();
    setResponse({
      ...selected.response,
      timing: Math.round(performance.now() - start + Math.random() * 100),
    });
  }, [selected]);

  return (
    <div className="flex flex-col h-full rounded-2xl border border-border/30 bg-bg-card overflow-hidden">
      <div className="px-4 py-3 bg-bg-elevated border-b border-border/20">
        <p className="text-[10px] font-black uppercase tracking-widest text-accent">API Explorer</p>
      </div>

      <div className="flex-1 min-h-0 flex">
        {/* Endpoint List */}
        <div className="w-[200px] border-r border-border/20 overflow-auto shrink-0">
          {endpoints.map(ep => (
            <button key={ep.id} onClick={() => { setSelectedId(ep.id); setResponse(null); }}
              className={`w-full text-left px-3 py-2.5 border-b border-border/10 transition-colors ${
                selectedId === ep.id ? 'bg-accent/10' : 'hover:bg-white/5'
              }`}>
              <span className={`text-[8px] font-black uppercase mr-1.5 ${
                ep.method === 'GET' ? 'text-green-400' :
                ep.method === 'POST' ? 'text-yellow-400' :
                ep.method === 'PUT' ? 'text-blue-400' :
                'text-red-400'
              }`}>{ep.method}</span>
              <span className="text-[10px] font-mono text-text-muted">{ep.path}</span>
            </button>
          ))}
        </div>

        {/* Request/Response */}
        {selected && (
          <div className="flex-1 min-w-0 flex flex-col">
            <div className="p-4 border-b border-border/20">
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                  selected.method === 'GET' ? 'bg-green-400/10 text-green-400' :
                  selected.method === 'POST' ? 'bg-yellow-400/10 text-yellow-400' :
                  selected.method === 'PUT' ? 'bg-blue-400/10 text-blue-400' :
                  'bg-red-400/10 text-red-400'
                }`}>{selected.method}</span>
                <span className="text-[11px] font-mono text-text-primary">{selected.path}</span>
                <button onClick={sendRequest}
                  className="ml-auto flex items-center gap-1 px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/30 text-[9px] font-black uppercase tracking-wider text-accent hover:bg-accent/20">
                  <Send size={10} /> Send
                </button>
              </div>
              <p className="text-[10px] font-mono text-text-muted">{selected.description}</p>

              <div className="mt-3">
                <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-1">Headers</p>
                {Object.entries(selected.headers).map(([k, v]) => (
                  <div key={k} className="text-[10px] font-mono">
                    <span className="text-accent">{k}:</span> <span className="text-text-muted">{v}</span>
                  </div>
                ))}
              </div>

              {selected.body && (
                <div className="mt-3">
                  <label htmlFor="api-request-body" className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-1 block">Request Body</label>
                  <textarea id="api-request-body" value={customBody || selected.body} onChange={e => setCustomBody(e.target.value)}
                    className="w-full h-20 bg-black/40 border border-border/30 rounded p-2 text-[10px] font-mono text-text-primary outline-none resize-none" />
                </div>
              )}
            </div>

            {/* Response */}
            <div className="flex-1 overflow-auto p-4">
              {response ? (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black ${
                      response.statusCode < 300 ? 'bg-green-400/10 text-green-400' :
                      response.statusCode < 400 ? 'bg-yellow-400/10 text-yellow-400' :
                      'bg-red-400/10 text-red-400'
                    }`}>{response.statusCode}</span>
                    <span className="text-[9px] font-mono text-text-muted">{response.timing}ms</span>
                  </div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-1">Response Headers</p>
                  {Object.entries(response.headers).map(([k, v]) => (
                    <div key={k} className="text-[10px] font-mono mb-0.5">
                      <span className="text-accent">{k}:</span> <span className="text-text-muted">{v}</span>
                    </div>
                  ))}
                  <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mt-3 mb-1">Response Body</p>
                  <pre className="text-[10px] font-mono text-text-muted bg-black/40 rounded p-3 whitespace-pre-wrap">{response.body}</pre>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-text-muted/50 text-[10px] font-mono">
                  Click Send to make a request
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
