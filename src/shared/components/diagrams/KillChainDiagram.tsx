import { cn } from '@/shared/utils/cn';
import { Shield, Target, Crosshair, Bug, Wifi, Eye, FileText, Lock } from 'lucide-react';

export interface KillChainPhaseData {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export const KILL_CHAIN_PHASES: KillChainPhaseData[] = [
  { id: 'recon', name: 'Reconnaissance', description: 'Gather intel', icon: <Eye className="w-4 h-4" />, color: 'text-blue-400 border-blue-400/30 bg-blue-400/10' },
  { id: 'weapon', name: 'Weaponization', description: 'Prepare exploits', icon: <Bug className="w-4 h-4" />, color: 'text-purple-400 border-purple-400/30 bg-purple-400/10' },
  { id: 'delivery', name: 'Delivery', description: 'Deliver payload', icon: <FileText className="w-4 h-4" />, color: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10' },
  { id: 'exploit', name: 'Exploitation', description: 'Execute code', icon: <Crosshair className="w-4 h-4" />, color: 'text-orange-400 border-orange-400/30 bg-orange-400/10' },
  { id: 'install', name: 'Installation', description: 'Establish persistence', icon: <Lock className="w-4 h-4" />, color: 'text-red-400 border-red-400/30 bg-red-400/10' },
  { id: 'c2', name: 'Command & Control', description: 'Maintain access', icon: <Wifi className="w-4 h-4" />, color: 'text-pink-400 border-pink-400/30 bg-pink-400/10' },
  { id: 'actions', name: 'Actions on Objectives', description: 'Achieve goals', icon: <Target className="w-4 h-4" />, color: 'text-accent border-accent/30 bg-accent/10' },
];

interface KillChainDiagramProps {
  currentPhaseIndex?: number;
  completedPhaseIds?: string[];
  className?: string;
}

export function KillChainDiagram({ currentPhaseIndex = -1, completedPhaseIds = [], className }: KillChainDiagramProps) {
  return (
    <div className={cn('rounded-xl border border-border/20 bg-bg-elevated/50 p-4', className)}>
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-4 h-4 text-accent" />
        <span className="text-[9px] font-black uppercase tracking-widest text-accent">Kill Chain Phases</span>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
        {KILL_CHAIN_PHASES.map((phase, idx) => {
          const isCompleted = completedPhaseIds.includes(phase.id);
          const isCurrent = idx === currentPhaseIndex;
          return (
            <div key={phase.id} className="flex items-center">
              <div className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-xl border transition-all',
                isCompleted ? 'border-green-400/30 bg-green-400/10 text-green-400' :
                isCurrent ? 'border-yellow-400/30 bg-yellow-400/10 text-yellow-400' :
                'border-border/20 bg-bg-elevated/50 text-text-muted/50',
              )}>
                <div className={cn(
                  'flex items-center justify-center w-6 h-6 rounded-lg',
                  isCompleted ? 'bg-green-400/20' : isCurrent ? 'bg-yellow-400/20' : 'bg-white/5',
                )}>
                  {isCompleted ? (
                    <span className="text-green-400 text-xs">✓</span>
                  ) : (
                    <span className="text-[10px] font-mono font-bold">{idx + 1}</span>
                  )}
                </div>
                <div className="hidden md:block">
                  <p className="text-[9px] font-black uppercase tracking-wider leading-tight">{phase.name}</p>
                  <p className="text-[8px] font-mono opacity-60">{phase.description}</p>
                </div>
              </div>
              {idx < KILL_CHAIN_PHASES.length - 1 && (
                <svg width="16" height="8" viewBox="0 0 16 8" className="mx-1 hidden sm:block">
                  <line x1="0" y1="4" x2="12" y2="4" stroke="currentColor" strokeWidth="1.5" className="text-border/40" />
                  <polygon points="10,1 16,4 10,7" fill="currentColor" className="text-border/40" />
                </svg>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface KillChainDiagramSimpleProps {
  phases: string[];
  currentPhaseIndex?: number;
  completedPhaseIds?: string[];
  className?: string;
}

export function KillChainDiagramSimple({ phases, currentPhaseIndex = -1, completedPhaseIds = [], className }: KillChainDiagramSimpleProps) {
  return (
    <div className={cn('rounded-xl border border-border/20 bg-bg-elevated/50 p-3 md:p-4', className)}>
      <div className="flex items-center gap-2 mb-3">
        <Shield className="w-3.5 h-3.5 text-accent" />
        <span className="text-[9px] font-black uppercase tracking-widest text-accent">Kill Chain Progress</span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {phases.map((phase, idx) => {
          const isCompleted = completedPhaseIds.includes(phase);
          const isCurrent = idx === currentPhaseIndex;
          return (
            <div key={phase} className="flex items-center">
              <div className={cn(
                'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all',
                isCompleted ? 'border-accent/30 bg-accent/10 text-accent' :
                isCurrent ? 'border-yellow-400/30 bg-yellow-400/10 text-yellow-400' :
                'border-border/20 bg-white/5 text-text-muted/40',
              )}>
                {isCompleted ? (
                  <span className="text-accent text-[10px]">✓</span>
                ) : (
                  <span className="text-[10px] font-mono font-bold">{idx + 1}</span>
                )}
                <span className="text-[9px] font-black uppercase tracking-wider">{phase}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
