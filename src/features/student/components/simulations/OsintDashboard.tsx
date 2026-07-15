import { useState } from 'react';
import { Search, Globe, Hash, User, Image, Calendar, Database } from 'lucide-react';
import type { OsintModule } from './types';

interface OsintDashboardProps {
  modules: OsintModule[];
}

const MODULE_ICONS: Record<string, typeof Globe> = {
  whois: Globe, dns: Database, metadata: Hash, social: User, images: Image, search: Search, timeline: Calendar,
};

export function OsintDashboard({ modules }: OsintDashboardProps) {
  const [activeModule, setActiveModule] = useState(modules[0]?.id || '');
  const [queries, setQueries] = useState<Record<string, string>>({});

  const current = modules.find(m => m.id === activeModule);
  const Icon = MODULE_ICONS[current?.type || 'search'] || Search;

  return (
    <div className="flex flex-col h-full rounded-2xl border border-border/30 bg-bg-card overflow-hidden">
      <div className="px-4 py-3 bg-bg-elevated border-b border-border/20">
        <p className="text-[10px] font-black uppercase tracking-widest text-accent">OSINT Dashboard</p>
      </div>

      <div className="flex-1 min-h-0 flex">
        {/* Module Tabs */}
        <div className="w-[160px] border-r border-border/20 overflow-auto shrink-0 py-1">
          {modules.map(m => {
            const MIcon = MODULE_ICONS[m.type] || Search;
            return (
              <button key={m.id} onClick={() => setActiveModule(m.id)}
                className={`w-full flex items-center gap-2 px-3 py-2.5 text-left transition-colors ${
                  activeModule === m.id ? 'bg-accent/10 text-accent' : 'text-text-muted hover:bg-white/5'
                }`}>
                <MIcon size={12} />
                <span className="text-[10px] font-mono">{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Module Content */}
        {current && (
          <div className="flex-1 min-w-0 flex flex-col p-4">
            <div className="flex items-center gap-2 mb-4">
              <Icon size={16} className="text-accent" />
              <h3 className="text-sm font-bold text-text-primary">{current.label}</h3>
            </div>

            {/* Query Input */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={queries[current.id] || ''}
                onChange={e => setQueries(prev => ({ ...prev, [current.id]: e.target.value }))}
                placeholder={`Enter ${current.type} query...`}
                className="flex-1 px-3 py-2 rounded-lg bg-black/40 border border-border/30 text-[11px] font-mono text-text-primary outline-none focus:border-accent/50"
              />
              <button className="px-3 py-2 rounded-lg bg-accent/10 border border-accent/30 text-[9px] font-black uppercase tracking-wider text-accent">
                Search
              </button>
            </div>

            {/* Result */}
            <div className="flex-1 overflow-auto bg-black/40 rounded-lg p-3">
              {current.result ? (
                <pre className="text-[10px] font-mono text-text-muted whitespace-pre-wrap">{current.result}</pre>
              ) : (
                <div className="flex items-center justify-center h-full text-text-muted/50 text-[10px] font-mono">
                  Enter a query and click Search
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
