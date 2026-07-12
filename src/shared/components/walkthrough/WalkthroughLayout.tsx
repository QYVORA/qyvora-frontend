import { ArrowLeft, Clock, Terminal, Unplug, Loader2 } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { useLabConnection } from '@/features/student/hooks/useLabConnection';

export interface WalkthroughLayoutProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  difficulty?: string;
  difficultyColor?: string;
  estimatedMinutes?: number;
  labId: string;
  scenarioId?: string;
  children: React.ReactNode;
  onBack: () => void;
  completedCount?: number;
  totalSteps?: number;
}

export function WalkthroughLayout({
  title,
  subtitle,
  icon,
  difficulty,
  difficultyColor,
  estimatedMinutes,
  labId,
  scenarioId,
  children,
  onBack,
  completedCount = 0,
  totalSteps = 0,
}: WalkthroughLayoutProps) {
  const allDone = totalSteps > 0 && completedCount === totalSteps;
  const { connection, isConnected, isLoading, error, connect, disconnect } = useLabConnection();

  const handleConnect = async () => {
    if (!scenarioId) return;
    await connect(labId, scenarioId);
  };

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 md:px-6 lg:px-8 py-6 font-mono">
      <button
        type="button"
        onClick={onBack}
        className="group mb-6 flex items-center gap-2 text-text-muted transition-colors hover:text-text-primary"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        <span className="text-[10px] font-black uppercase tracking-widest">All Labs</span>
      </button>

      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border/30 bg-bg-card text-accent">
          {icon}
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-black text-text-primary tracking-tight truncate">
            {title}
          </h1>
          <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {difficulty && (
              <span
                className={cn(
                  'px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest',
                  difficultyColor ?? 'bg-accent/10 text-accent',
                )}
              >
                {difficulty}
              </span>
            )}

            {estimatedMinutes && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-bg-elevated text-[9px] font-black uppercase tracking-widest text-text-muted">
                <Clock className="h-3 w-3" />
                {estimatedMinutes} min
              </span>
            )}

            <span className="px-2.5 py-1 rounded-lg bg-bg-elevated text-[9px] font-black uppercase tracking-widest text-text-muted">
              {labId}
            </span>

            {/* Connect / Disconnect button */}
            {scenarioId && (
              <div className="ml-auto flex items-center gap-2">
                {isConnected ? (
                  <>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-500/10 text-[9px] font-black uppercase tracking-widest text-green-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      {connection?.targetIp ?? 'Connected'}
                    </span>
                    <button
                      onClick={disconnect}
                      disabled={isLoading}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-500/10 text-[9px] font-black uppercase tracking-widest text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                    >
                      {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Unplug className="w-3 h-3" />}
                      Disconnect
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleConnect}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-accent/30 bg-accent/10 text-[9px] font-black uppercase tracking-widest text-accent hover:bg-accent/20 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Terminal className="w-3 h-3" />}
                    Connect
                  </button>
                )}
                {error && (
                  <span className="text-[9px] text-red-400">{error}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mb-6 h-px bg-border/30" />

      <div className="space-y-2">
        {children}
      </div>

      <div className="mt-8 rounded-xl border border-border/20 bg-bg-card px-4 py-3 flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-widest text-text-muted">
          Progress
        </span>
        <span className="text-sm font-bold text-text-secondary">
          {completedCount}/{totalSteps} steps
        </span>
      </div>

      {allDone && (
        <div className="mt-4 rounded-xl border border-accent/20 bg-accent-dim px-4 py-3 text-center">
          <span className="text-xs font-black uppercase tracking-widest text-accent">
            Walkthrough complete!
          </span>
        </div>
      )}
    </div>
  );
}
