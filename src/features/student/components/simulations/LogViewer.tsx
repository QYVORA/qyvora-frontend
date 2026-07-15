import { useState, useMemo } from 'react';
import { Search, AlertTriangle, AlertCircle, Info, Bug } from 'lucide-react';
import type { SimLogSource } from './types';

interface LogViewerProps {
  sources: SimLogSource[];
}

export function LogViewer({ sources }: LogViewerProps) {
  const [activeSource, setActiveSource] = useState(sources[0]?.id || '');
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<string | null>(null);

  const source = sources.find(s => s.id === activeSource);

  const filtered = useMemo(() => {
    if (!source) return [];
    return source.entries.filter(e => {
      if (levelFilter && e.level !== levelFilter) return false;
      if (search && !e.message.toLowerCase().includes(search.toLowerCase()) && !e.source.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [source, search, levelFilter]);

  const levelIcon = (level: string) => {
    switch (level) {
      case 'error': return <AlertTriangle size={10} className="text-red-400" />;
      case 'warn': return <AlertCircle size={10} className="text-yellow-400" />;
      case 'debug': return <Bug size={10} className="text-text-muted" />;
      default: return <Info size={10} className="text-blue-400" />;
    }
  };

  return (
    <div className="flex flex-col h-full rounded-2xl border border-border/30 bg-bg-card overflow-hidden">
      <div className="px-4 py-3 bg-bg-elevated border-b border-border/20 flex items-center gap-3">
        <p className="text-[10px] font-black uppercase tracking-widest text-accent">Log Viewer</p>
        <div className="flex items-center gap-1 ml-2">
          {sources.map(s => (
            <button key={s.id} onClick={() => setActiveSource(s.id)}
              className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                activeSource === s.id ? 'bg-accent/20 text-accent' : 'text-text-muted hover:text-text-primary'
              }`}>
              {s.label}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-bg border border-border/30">
            <Search size={10} className="text-text-muted" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search logs..."
              className="bg-transparent text-[10px] font-mono text-text-primary outline-none w-28" />
          </div>
          <div className="flex items-center gap-0.5">
            {['info', 'warn', 'error', 'debug'].map(l => (
              <button key={l} onClick={() => setLevelFilter(levelFilter === l ? null : l)}
                className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
                  levelFilter === l ? 'bg-accent/20 text-accent' : 'text-text-muted/50 hover:text-text-muted'
                }`}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto font-mono text-[10px]">
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-full text-text-muted/50">No matching log entries</div>
        ) : (
          filtered.map((entry, i) => (
            <div key={i} className="flex items-start gap-2 px-4 py-1.5 border-b border-border/5 hover:bg-white/5">
              {levelIcon(entry.level)}
              <span className="text-text-muted/50 shrink-0 w-[140px]">{entry.timestamp}</span>
              <span className="text-accent shrink-0 w-[80px] truncate">{entry.source}</span>
              <span className="text-text-muted flex-1">{entry.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
