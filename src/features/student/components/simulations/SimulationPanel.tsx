import { Maximize2, Minimize2 } from 'lucide-react';
import { useState } from 'react';
import { type SimulationType } from './types';

interface SimulationPanelProps {
  simulations: {
    type: SimulationType;
    content: React.ReactNode;
    breakout?: boolean;
  }[];
  defaultHeight?: string;
}

export function SimulationPanel({ simulations, defaultHeight = 'h-[400px]' }: SimulationPanelProps) {
  const [activeTab, setActiveTab] = useState<SimulationType | null>(simulations[0]?.type || null);
  const [expanded, setExpanded] = useState(false);

  if (simulations.length === 0) return null;

  const activeSimulation = simulations.find(sim => sim.type === activeTab);
  const hasBreakout = activeSimulation?.breakout ?? false;

  return (
    <div className={`rounded-2xl border border-border/30 bg-bg-card ${hasBreakout ? '' : 'overflow-hidden'} ${expanded ? 'fixed inset-4 z-[200]' : defaultHeight}`}>
      {/* Content — each simulation rendered with data-active attribute */}
      <div className="h-full min-h-0">
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
