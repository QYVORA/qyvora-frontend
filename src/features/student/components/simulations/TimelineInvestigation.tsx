import { useState } from 'react';
import { Clock, AlertTriangle, AlertCircle, Info, Network, Cpu, FileText, Key, Globe, Mail } from 'lucide-react';
import type { TimelineEvent } from './types';

interface TimelineInvestigationProps {
  events: TimelineEvent[];
}

const CATEGORY_ICONS: Record<string, typeof Network> = {
  network: Network, process: Cpu, file: FileText, auth: Key, dns: Globe, email: Mail,
};

const SEVERITY_COLORS: Record<string, string> = {
  low: 'border-blue-400/30 bg-blue-400/5',
  medium: 'border-yellow-400/30 bg-yellow-400/5',
  high: 'border-orange-400/30 bg-orange-400/5',
  critical: 'border-red-400/30 bg-red-400/5',
};

const SEVERITY_DOT: Record<string, string> = {
  low: 'bg-blue-400', medium: 'bg-yellow-400', high: 'bg-orange-400', critical: 'bg-red-400',
};

export function TimelineInvestigation({ events }: TimelineInvestigationProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [orderedIds, setOrderedIds] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const selected = events.find(e => e.id === selectedId);

  const filtered = filterCategory ? events.filter(e => e.category === filterCategory) : events;
  const sorted = [...filtered].sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  const handleReorder = (eventId: string) => {
    setOrderedIds(prev =>
      prev.includes(eventId) ? prev.filter(id => id !== eventId) : [...prev, eventId]
    );
  };

  return (
    <div className="flex flex-col h-full rounded-2xl border border-border/30 bg-bg-card overflow-hidden">
      <div className="px-4 py-3 bg-bg-elevated border-b border-border/20 flex items-center gap-3">
        <p className="text-[10px] font-black uppercase tracking-widest text-accent">Timeline Investigation</p>
        <div className="flex items-center gap-1 ml-auto">
          {['network', 'process', 'file', 'auth', 'dns', 'email'].map(cat => {
            const CatIcon = CATEGORY_ICONS[cat] || Network;
            return (
              <button key={cat} onClick={() => setFilterCategory(filterCategory === cat ? null : cat)}
                className={`p-1 rounded ${filterCategory === cat ? 'bg-accent/20 text-accent' : 'text-text-muted/50 hover:text-text-muted'}`}
                title={cat}>
                <CatIcon size={12} />
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 min-h-0 flex">
        {/* Timeline */}
        <div className="flex-1 overflow-auto p-4">
          <div className="relative pl-6">
            {/* Vertical line */}
            <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-border/30" />

            {sorted.map(event => {
              const CatIcon = CATEGORY_ICONS[event.category] || Network;
              const isSelected = selectedId === event.id;
              const isOrdered = orderedIds.includes(event.id);

              return (
                <button key={event.id} onClick={() => setSelectedId(event.id)}
                  className={`relative w-full text-left mb-4 pl-4 transition-all ${isSelected ? 'scale-[1.01]' : ''}`}>
                  {/* Dot */}
                  <div className={`absolute -left-4 top-3 w-3 h-3 rounded-full border-2 border-bg-card ${SEVERITY_DOT[event.severity]} ${isOrdered ? 'ring-2 ring-accent ring-offset-1 ring-offset-bg-card' : ''}`} />

                  <div className={`p-3 rounded-xl border transition-colors ${isSelected ? 'border-accent/30 bg-accent/5' : SEVERITY_COLORS[event.severity]}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <CatIcon size={10} className="text-text-muted" />
                      <span className="text-[9px] font-mono text-text-muted">{event.timestamp}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[7px] font-black uppercase ${SEVERITY_DOT[event.severity]} bg-opacity-20 text-${event.severity === 'critical' ? 'red' : event.severity === 'high' ? 'orange' : event.severity === 'medium' ? 'yellow' : 'blue'}-400`}>
                        {event.severity}
                      </span>
                    </div>
                    <p className="text-[11px] font-bold text-text-primary">{event.title}</p>
                    <p className="text-[10px] font-mono text-text-muted mt-1">{event.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Event Detail */}
        {selected && (
          <div className="w-[280px] border-l border-border/20 p-4 overflow-auto shrink-0">
            <h3 className="text-sm font-bold text-text-primary mb-2">{selected.title}</h3>
            <div className="space-y-2 text-[10px] font-mono mb-4">
              <div><span className="text-text-muted">Time:</span> <span className="text-text-primary">{selected.timestamp}</span></div>
              <div><span className="text-text-muted">Category:</span> <span className="text-text-primary capitalize">{selected.category}</span></div>
              <div><span className="text-text-muted">Severity:</span> <span className="text-text-primary capitalize">{selected.severity}</span></div>
            </div>
            <p className="text-[10px] font-mono text-text-muted leading-relaxed">{selected.description}</p>

            {selected.relatedEvents && selected.relatedEvents.length > 0 && (
              <div className="mt-4">
                <p className="text-[9px] font-black uppercase tracking-widest text-accent mb-2">Related Events</p>
                {selected.relatedEvents.map(relId => {
                  const rel = events.find(e => e.id === relId);
                  return rel ? (
                    <button key={relId} onClick={() => setSelectedId(relId)}
                      className="block w-full text-left text-[10px] font-mono text-text-muted hover:text-accent mb-1">
                      {rel.timestamp} - {rel.title}
                    </button>
                  ) : null;
                })}
              </div>
            )}

            {/* Reorder button */}
            <button onClick={() => handleReorder(selected.id)}
              className={`mt-4 w-full px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                orderedIds.includes(selected.id)
                  ? 'bg-accent/20 border border-accent/30 text-accent'
                  : 'bg-bg-elevated border border-border/30 text-text-muted'
              }`}>
              {orderedIds.includes(selected.id) ? 'Remove from Sequence' : 'Add to Sequence'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
