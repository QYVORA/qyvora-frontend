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
  showConnectionGuide?: boolean;
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
  showConnectionGuide = true,
}: WalkthroughLayoutProps) {
  const allDone = totalSteps > 0 && completedCount === totalSteps;
  const { connection, isConnected, isLoading, error, connect, disconnect } = useLabConnection();

  const handleConnect = async () => {
    if (!scenarioId) return;
    await connect(labId, scenarioId);
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 md:px-6 lg:px-8 py-8 md:py-12 font-mono">
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="group mb-8 flex items-center gap-2 text-text-muted transition-colors hover:text-text-primary"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        <span className="text-[10px] font-black uppercase tracking-widest">All Labs</span>
      </button>

      {/* Room Header */}
      <div className="mb-10 rounded-2xl border border-border/30 bg-bg-card p-6 md:p-8">
        <div className="flex items-start gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-border/30 bg-bg-elevated text-accent">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl md:text-4xl font-black text-text-primary tracking-tight">
              {title}
            </h1>
            <p className="mt-2 text-base text-text-secondary leading-relaxed">{subtitle}</p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {difficulty && (
                <span className={cn('px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest', difficultyColor ?? 'bg-accent/10 text-accent')}>
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
            </div>
          </div>
        </div>
      </div>

      {/* Connection Panel */}
      {scenarioId && (
        <div className="mb-10 rounded-2xl border border-border/20 bg-bg-card p-6">
          <div className="flex items-center gap-3 mb-3">
            <Terminal className="w-4 h-4 text-accent" />
            <h3 className="text-[10px] font-black uppercase tracking-widest text-accent">
              Lab Connection
            </h3>
          </div>

          {!isConnected ? (
            <div className="space-y-3">
              <p className="text-sm text-text-muted font-mono leading-relaxed">
                Connect to a live lab machine to run commands and complete this walkthrough.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleConnect}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-accent/30 bg-accent/10 text-[10px] font-black uppercase tracking-widest text-accent hover:bg-accent/20 transition-colors disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Terminal className="w-3 h-3" />}
                  {isLoading ? 'Connecting...' : 'Connect to Lab'}
                </button>
                {error && <span className="text-[9px] text-red-400">{error}</span>}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-500/10 text-[9px] font-black uppercase tracking-widest text-green-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Connected
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-bg-elevated text-[9px] font-mono text-text-muted">
                  Target: {connection?.targetIp}
                </span>
              </div>
              <button
                onClick={disconnect}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-500/10 text-[9px] font-black uppercase tracking-widest text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Unplug className="w-3 h-3" />}
                Disconnect
              </button>
            </div>
          )}
        </div>
      )}

      {/* Steps */}
      <div className="space-y-6">
        {children}
      </div>

      {/* Progress */}
      <div className="mt-10 rounded-2xl border border-border/20 bg-bg-card px-6 py-5 flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">
          Progress
        </span>
        <span className="text-sm font-bold text-text-secondary">
          {completedCount}/{totalSteps} steps
        </span>
      </div>

      {allDone && (
        <div className="mt-4 rounded-2xl border border-accent/20 bg-accent/5 px-6 py-5 text-center">
          <span className="text-xs font-black uppercase tracking-widest text-accent">
            Walkthrough complete! Claim your CP below.
          </span>
        </div>
      )}
    </div>
  );
}
