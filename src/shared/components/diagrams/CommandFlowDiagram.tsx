import { cn } from '@/shared/utils/cn';

export interface CommandFlowStep {
  id: string;
  command: string;
  result: string;
  status: 'pending' | 'running' | 'success' | 'error';
  icon?: string;
}

interface CommandFlowDiagramProps {
  steps: CommandFlowStep[];
  className?: string;
}

export function CommandFlowDiagram({ steps, className }: CommandFlowDiagramProps) {
  return (
    <div className={cn('rounded-xl border border-border/20 bg-bg-elevated/50 p-4', className)}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[9px] font-black uppercase tracking-widest text-accent">Execution Flow</span>
      </div>
      <div className="space-y-3">
        {steps.map((step, idx) => (
          <div key={step.id} className="relative">
            {/* Connector line */}
            {idx < steps.length - 1 && (
              <div className="absolute left-4 top-10 w-0.5 h-3 bg-border/30" />
            )}
            <div className="flex items-start gap-3">
              {/* Status indicator */}
              <div className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-all',
                step.status === 'success' ? 'border-green-400/30 bg-green-400/10 text-green-400' :
                step.status === 'error' ? 'border-red-400/30 bg-red-400/10 text-red-400' :
                step.status === 'running' ? 'border-yellow-400/30 bg-yellow-400/10 text-yellow-400' :
                'border-border/30 bg-bg-elevated text-text-muted/60',
              )}>
                {step.status === 'success' ? (
                  <span className="text-xs">✓</span>
                ) : step.status === 'error' ? (
                  <span className="text-xs">✗</span>
                ) : (
                  <span className="text-[10px] font-mono font-bold">{idx + 1}</span>
                )}
              </div>
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="rounded-lg bg-bg border border-border/20 px-3 py-2 font-mono">
                  <code className="text-xs text-green-400 break-all">{step.command}</code>
                </div>
                {step.result && (
                  <div className="mt-1 rounded-lg bg-bg-elevated/50 border border-border/10 px-3 py-2">
                    <code className="text-[10px] text-text-muted/70 break-all">{step.result}</code>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface SimpleCommandFlowProps {
  commands: Array<{ label: string; command: string; description?: string }>;
  className?: string;
}

export function SimpleCommandFlow({ commands, className }: SimpleCommandFlowProps) {
  return (
    <div className={cn('rounded-xl border border-border/20 bg-bg-elevated/50 p-4', className)}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[9px] font-black uppercase tracking-widest text-accent">Command Sequence</span>
      </div>
      <div className="space-y-2">
        {commands.map((cmd, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-md bg-accent/10 flex items-center justify-center shrink-0">
              <span className="text-[10px] font-mono font-bold text-accent">{idx + 1}</span>
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-text-muted/70 mb-0.5">{cmd.label}</p>
              <div className="rounded-lg bg-bg border border-border/20 px-3 py-1.5">
                <code className="text-xs text-green-400">{cmd.command}</code>
              </div>
              {cmd.description && (
                <p className="text-[9px] font-mono text-text-muted/50 mt-1">{cmd.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
