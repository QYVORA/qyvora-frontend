import { useState } from 'react';
import { Mail, Paperclip, AlertTriangle, ChevronDown, ChevronRight } from 'lucide-react';
import type { SimEmail } from './types';

interface EmailClientProps {
  emails: SimEmail[];
}

export function EmailClient({ emails }: EmailClientProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showHeaders, setShowHeaders] = useState(false);
  const [showIndicators, setShowIndicators] = useState(false);

  const selected = emails.find(e => e.id === selectedId);

  return (
    <div className="flex flex-col h-full rounded-2xl border border-border/30 bg-bg-card overflow-hidden">
      <div className="px-4 py-3 bg-bg-elevated border-b border-border/20 flex items-center gap-2">
        <Mail size={14} className="text-accent" />
        <p className="text-[10px] font-black uppercase tracking-widest text-accent">Email Client</p>
        <span className="ml-auto text-[9px] font-mono text-text-muted">{emails.length} messages</span>
      </div>

      <div className="flex-1 min-h-0 flex">
        {/* Inbox */}
        <div className="w-[240px] border-r border-border/20 overflow-auto shrink-0">
          {emails.map(email => (
            <button
              key={email.id}
              onClick={() => { setSelectedId(email.id); setShowHeaders(false); setShowIndicators(false); }}
              className={`w-full text-left px-3 py-3 border-b border-border/10 transition-colors ${
                selectedId === email.id ? 'bg-accent/10' : 'hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-text-primary truncate">{email.fromName}</span>
                {email.isPhishing && <AlertTriangle size={10} className="text-yellow-400 shrink-0" />}
              </div>
              <p className="text-[10px] font-mono text-text-muted truncate">{email.subject}</p>
              <p className="text-[9px] font-mono text-text-muted/50 mt-1">{email.receivedAt}</p>
            </button>
          ))}
        </div>

        {/* Email Detail */}
        {selected && (
          <div className="flex-1 min-w-0 flex flex-col overflow-auto p-4">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-text-primary mb-2">{selected.subject}</h3>
              <div className="flex items-center gap-4 text-[10px] font-mono text-text-muted">
                <span>From: <span className="text-text-primary">{selected.from}</span></span>
                <span>To: <span className="text-text-primary">{selected.to}</span></span>
              </div>
              <p className="text-[9px] font-mono text-text-muted/50 mt-1">{selected.receivedAt}</p>
            </div>

            {selected.attachments && selected.attachments.length > 0 && (
              <div className="mb-4 p-2 rounded bg-bg-elevated border border-border/20">
                <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-1">Attachments</p>
                {selected.attachments.map((a, i) => (
                  <div key={i} className="flex items-center gap-2 text-[10px] font-mono text-text-muted">
                    <Paperclip size={10} />
                    <span>{a.name}</span>
                    <span className="text-text-muted/50">({a.size})</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex-1 text-[11px] font-mono text-text-secondary leading-relaxed whitespace-pre-wrap">
              {selected.body}
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/20">
              <button onClick={() => setShowHeaders(!showHeaders)}
                className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded ${showHeaders ? 'bg-accent/20 text-accent' : 'text-text-muted hover:text-accent'}`}>
                Headers
              </button>
              <button onClick={() => setShowIndicators(!showIndicators)}
                className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded ${showIndicators ? 'bg-accent/20 text-accent' : 'text-text-muted hover:text-accent'}`}>
                Indicators ({selected.indicators.length})
              </button>
            </div>

            {showHeaders && (
              <div className="mt-3 p-3 bg-black/40 rounded text-[10px] font-mono">
                {selected.headers.map((h, i) => (
                  <div key={i} className="mb-0.5">
                    <span className="text-accent">{h.key}:</span>{' '}
                    <span className="text-text-muted">{h.value}</span>
                  </div>
                ))}
              </div>
            )}

            {showIndicators && (
              <div className="mt-3 space-y-2">
                {selected.indicators.map((ind, i) => (
                  <div key={i} className={`p-2 rounded border text-[10px] font-mono ${
                    ind.severity === 'high' ? 'border-red-500/30 bg-red-500/5' :
                    ind.severity === 'medium' ? 'border-yellow-500/30 bg-yellow-500/5' :
                    'border-border/30 bg-bg-elevated'
                  }`}>
                    <span className={`font-black uppercase text-[9px] ${
                      ind.severity === 'high' ? 'text-red-400' :
                      ind.severity === 'medium' ? 'text-yellow-400' : 'text-text-muted'
                    }`}>{ind.type}</span>
                    <p className="text-text-muted mt-1">{ind.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
