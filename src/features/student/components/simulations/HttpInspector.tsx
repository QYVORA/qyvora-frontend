import { useState } from 'react';
import { Send, ArrowUpDown } from 'lucide-react';
import type { HttpRequest } from './types';

interface HttpInspectorProps {
  requests: HttpRequest[];
}

export function HttpInspector({ requests }: HttpInspectorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(requests[0]?.id || null);
  const [editMode, setEditMode] = useState(false);
  const [editedBody, setEditedBody] = useState('');
  const [replayed, setReplayed] = useState(false);

  const selected = requests.find(r => r.id === selectedId);

  const handleReplay = () => {
    setReplayed(true);
    setTimeout(() => setReplayed(false), 2000);
  };

  return (
    <div className="flex flex-col h-full rounded-2xl border border-border/30 bg-bg-card overflow-hidden">
      <div className="px-4 py-3 bg-bg-elevated border-b border-border/20">
        <p className="text-[10px] font-black uppercase tracking-widest text-accent">HTTP Inspector</p>
      </div>

      <div className="flex-1 min-h-0 flex">
        {/* Request List */}
        <div className="w-[200px] border-r border-border/20 overflow-auto shrink-0">
          {requests.map(req => (
            <button
              key={req.id}
              onClick={() => { setSelectedId(req.id); setEditMode(false); }}
              className={`w-full text-left px-3 py-2.5 border-b border-border/10 transition-colors ${
                selectedId === req.id ? 'bg-accent/10 border-l-2 border-l-accent' : 'hover:bg-white/5 border-l-2 border-l-transparent'
              }`}
            >
              <span className={`text-[9px] font-black uppercase tracking-wider mr-1.5 ${
                req.method === 'GET' ? 'text-green-400' :
                req.method === 'POST' ? 'text-yellow-400' :
                req.method === 'PUT' ? 'text-blue-400' :
                req.method === 'DELETE' ? 'text-red-400' : 'text-text-muted'
              }`}>
                {req.method}
              </span>
              <span className="text-[10px] font-mono text-text-muted truncate">{req.url.split('/').pop()}</span>
            </button>
          ))}
        </div>

        {/* Request/Response Detail */}
        {selected && (
          <div className="flex-1 min-w-0 flex flex-col">
            {/* Request */}
            <div className="border-b border-border/20 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                    selected.method === 'GET' ? 'bg-green-400/10 text-green-400' :
                    selected.method === 'POST' ? 'bg-yellow-400/10 text-yellow-400' :
                    selected.method === 'PUT' ? 'bg-blue-400/10 text-blue-400' :
                    'bg-red-400/10 text-red-400'
                  }`}>{selected.method}</span>
                  <span className="text-[11px] font-mono text-text-primary">{selected.url}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { setEditMode(!editMode); setEditedBody(selected.body || ''); }}
                    aria-label="Toggle inspector" className="text-[9px] font-black uppercase tracking-wider text-text-muted hover:text-accent">
                    <ArrowUpDown size={12} />
                  </button>
                  <button onClick={handleReplay}
                    className="flex items-center gap-1 px-2 py-1 rounded bg-accent/10 text-[9px] font-black uppercase tracking-wider text-accent hover:bg-accent/20">
                    <Send size={10} /> Replay
                  </button>
                </div>
              </div>

              <div className="mb-2">
                <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-1">Request Headers</p>
                {Object.entries(selected.headers).map(([k, v]) => (
                  <div key={k} className="text-[10px] font-mono">
                    <span className="text-accent">{k}:</span>{' '}
                    <span className="text-text-muted">{v}</span>
                  </div>
                ))}
              </div>

              {selected.body && (
                <div>
                  <label htmlFor="http-body-editor" className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-1 block">Body</label>
                  {editMode ? (
                    <textarea id="http-body-editor" value={editedBody} onChange={e => setEditedBody(e.target.value)}
                      className="w-full h-20 bg-black/40 border border-border/30 rounded p-2 text-[10px] font-mono text-text-primary outline-none" />
                  ) : (
                    <pre className="text-[10px] font-mono text-text-muted whitespace-pre-wrap bg-black/40 rounded p-2">{selected.body}</pre>
                  )}
                </div>
              )}

              {replayed && (
                <div className="mt-2 text-[9px] font-black uppercase tracking-wider text-green-400">
                  Request replayed successfully
                </div>
              )}
            </div>

            {/* Response */}
            <div className="flex-1 overflow-auto p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2 py-0.5 rounded text-[9px] font-black ${
                  selected.response.statusCode < 300 ? 'bg-green-400/10 text-green-400' :
                  selected.response.statusCode < 400 ? 'bg-yellow-400/10 text-yellow-400' :
                  'bg-red-400/10 text-red-400'
                }`}>
                  {selected.response.statusCode} {selected.response.statusText}
                </span>
                <span className="text-[9px] font-mono text-text-muted">{selected.response.timing}ms</span>
              </div>

              <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-1">Response Headers</p>
              {Object.entries(selected.response.headers).map(([k, v]) => (
                <div key={k} className="text-[10px] font-mono mb-0.5">
                  <span className="text-accent">{k}:</span>{' '}
                  <span className="text-text-muted">{v}</span>
                </div>
              ))}

              <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mt-3 mb-1">Response Body</p>
              <pre className="text-[10px] font-mono text-text-muted whitespace-pre-wrap bg-black/40 rounded p-2">
                {selected.response.body}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
