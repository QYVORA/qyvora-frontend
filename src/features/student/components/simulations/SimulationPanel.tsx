import { Maximize2, Minimize2 } from 'lucide-react';
import { useState } from 'react';
import { SIMULATION_REGISTRY, type SimulationType } from './types';

interface SimulationPanelProps {
  simulations: {
    type: SimulationType;
    content: React.ReactNode;
  }[];
  defaultHeight?: string;
}

export function SimulationPanel({ simulations, defaultHeight = 'h-[400px]' }: SimulationPanelProps) {
  const [activeTab, setActiveTab] = useState<SimulationType | null>(simulations[0]?.type || null);
  const [expanded, setExpanded] = useState(false);

  if (simulations.length === 0) return null;

  return (
    <div className={`rounded-2xl border border-border/30 bg-bg-card overflow-hidden ${expanded ? 'fixed inset-4 z-[200]' : defaultHeight}`}>
      {/* Tab Bar */}
      <div className="flex items-center gap-1 px-3 py-2 bg-bg-elevated border-b border-border/20">
        {simulations.map(sim => {
          const def = SIMULATION_REGISTRY[sim.type];
          return (
            <button key={sim.type} onClick={() => setActiveTab(sim.type)}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-colors ${
                activeTab === sim.type ? 'bg-accent/15 text-accent' : 'text-text-muted hover:text-text-primary hover:bg-white/5'
              }`}>
              {def?.label || sim.type}
            </button>
          );
        })}
        <div className="ml-auto flex items-center gap-1">
          <button onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded hover:bg-white/5 text-text-muted">
            {expanded ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
          </button>
        </div>
      </div>

      {/* Content — each simulation rendered with data-active attribute */}
      <div className={`${expanded ? 'h-[calc(100%-40px)]' : 'h-[calc(100%-40px)]'} min-h-0`}>
        {simulations.map(sim => (
          <div
            key={sim.type}
            data-active={activeTab === sim.type ? 'true' : 'false'}
            className={`h-full ${activeTab === sim.type ? '' : 'hidden'}`}
          >
            {sim.content}
          </div>
        ))}
        {simulations.length === 0 && (
          <div className="flex items-center justify-center h-full text-text-muted/50 text-[10px] font-mono">
            No simulation loaded
          </div>
        )}
      </div>
    </div>
  );
}
