import { Unplug, Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { IconClock, IconTerminal } from '@/shared/components/icons';
import { cn } from '@/shared/utils/cn';
import { useLabConnection } from '@/features/student/hooks/useLabConnection';
import { SimulationPanel, useSimulation, getNetworkProfileForLab, type SimulationType } from '@/features/student/components/simulations';

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
  onBack?: () => void;
  backLabel?: string;
  completedCount?: number;
  totalSteps?: number;
  showConnectionGuide?: boolean;
  simulations?: { type: SimulationType; content: React.ReactNode; breakout?: boolean }[];
  headerMetadata?: React.ReactNode;
  headerActions?: React.ReactNode;
  sidebar?: React.ReactNode;
  sidebarOpen?: boolean;
  onSidebarToggle?: () => void;
  toolbar?: React.ReactNode;
  navigation?: React.ReactNode;
  headerContent?: React.ReactNode;
  footer?: React.ReactNode;
  progressContent?: React.ReactNode;
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
  completedCount = 0,
  totalSteps = 0,
  showConnectionGuide = true,
  simulations,
  headerMetadata,
  headerActions,
  sidebar,
  toolbar,
  navigation,
  headerContent,
  footer,
  progressContent,
}: WalkthroughLayoutProps) {
  const allDone = totalSteps > 0 && completedCount === totalSteps;
  const { connection, isConnected, isLoading, error, connect, disconnect } = useLabConnection();
  const { network, browser } = useSimulation();

  useEffect(() => {
    const profile = getNetworkProfileForLab(labId);
    if (profile) {
      network.setActiveProfile(profile);
    }
    browser.resetBrowser();
    return () => { network.setActiveProfile(null); };
  }, [labId]);

  const handleConnect = async () => {
    if (!scenarioId) return;
    await connect(labId, scenarioId);
  };

  return (
    <div className="w-full">
      {/* Desktop Toolbar (right side) */}
      {toolbar && (
        <div className="hidden lg:block">
          {toolbar}
        </div>
      )}

      <div className="w-full py-8 md:py-12">
        {/* Room Header */}
        <div className="relative overflow-hidden mb-12 md:mb-16 rounded-2xl border border-border/30 bg-bg-card p-6 md:p-8">
          <div className="flex items-start gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-border/30 bg-bg-elevated text-accent">
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[1.05] text-text-primary">
                {title}
              </h1>
              <p className="mt-3 text-base md:text-lg text-text-secondary leading-relaxed">{subtitle}</p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {difficulty && (
                  <span className={cn('px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest', difficultyColor ?? 'bg-accent/10 text-accent')}>
                    {difficulty}
                  </span>
                )}
                {estimatedMinutes && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-bg-elevated text-[9px] font-black uppercase tracking-widest text-text-muted">
                    <IconClock size={12} />
                    {estimatedMinutes} min
                  </span>
                )}
                <span className="px-2.5 py-1 rounded-lg bg-bg-elevated text-[9px] font-black uppercase tracking-widest text-text-muted">
                  {labId}
                </span>
                {headerMetadata}
              </div>
              {headerActions && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {headerActions}
                </div>
              )}
            </div>
          </div>
        </div>

        {headerContent}

        {/* Connection Panel */}
        {scenarioId && showConnectionGuide && (
          <div className="mb-10 rounded-2xl border border-border/30 bg-bg-card p-5 md:p-7">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/30 bg-bg-elevated text-accent">
                <IconTerminal size={18} />
              </div>
              <h3 className="text-[11px] font-black uppercase tracking-widest text-text-primary">
                Lab Connection
              </h3>
              <span className="px-2.5 py-1 rounded-lg bg-accent/10 text-[9px] font-black uppercase tracking-widest text-accent">
                Live Instance
              </span>
            </div>

            {!isConnected ? (
              <div className="space-y-4">
                <p className="text-sm md:text-base text-text-secondary font-mono leading-relaxed">
                  Connect to a live lab machine to run commands and complete this walkthrough.
                  Your progress, commands and captured flags are saved as you go.
                </p>
                <div className="grid gap-2 sm:grid-cols-3">
                  <div className="rounded-xl border border-border/20 bg-bg-elevated px-3.5 py-3">
                    <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-1">Target</p>
                    <p className="text-sm font-mono text-text-primary">Linux VM</p>
                  </div>
                  <div className="rounded-xl border border-border/20 bg-bg-elevated px-3.5 py-3">
                    <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-1">Persists</p>
                    <p className="text-sm font-mono text-text-primary">Session saved</p>
                  </div>
                  <div className="rounded-xl border border-border/20 bg-bg-elevated px-3.5 py-3">
                    <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-1">Flags</p>
                    <p className="text-sm font-mono text-text-primary">Verified on submit</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <button
                    onClick={handleConnect}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-accent/30 bg-accent/10 text-[10px] font-black uppercase tracking-widest text-accent hover:bg-accent/20 transition-colors disabled:opacity-50 w-fit"
                  >
                    {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <IconTerminal size={14} />}
                    {isLoading ? 'Connecting...' : 'Connect to Lab'}
                  </button>
                  {error && <span className="text-xs text-red-400">{error}</span>}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 text-[10px] font-black uppercase tracking-widest text-green-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      Connected
                    </span>
                    <span className="px-3 py-1.5 rounded-lg bg-bg-elevated text-[10px] font-mono text-text-secondary">
                      Target: <span className="text-text-primary">{connection?.targetIp}</span>
                    </span>
                  </div>
                  <button
                    onClick={disconnect}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-red-500/30 bg-red-500/10 text-[10px] font-black uppercase tracking-widest text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50 w-fit"
                  >
                    {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Unplug className="w-3.5 h-3.5" />}
                    Disconnect
                  </button>
                </div>
                <p className="text-sm text-text-secondary font-mono leading-relaxed">
                  Use the terminal below to run commands against the live machine. Progress is tracked automatically.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Simulation Panel */}
        {simulations && simulations.length > 0 && (
          <div className="mb-10">
            <SimulationPanel simulations={simulations} />
          </div>
        )}

        {/* Steps — wc-prose keeps the reading column comfortable on wide screens */}
        <div className="wc-prose space-y-12 md:space-y-16">
          {children}
        </div>

        {/* Progress */}
        {progressContent || (
          <div className="mt-10 rounded-2xl border border-border/20 bg-bg-card px-4 py-4 md:px-6 md:py-5 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">
              Progress
            </span>
            <span className="text-sm font-bold text-text-secondary">
              {completedCount}/{totalSteps} steps
            </span>
          </div>
        )}

        {allDone && (
          <div className="mt-4 rounded-2xl border border-accent/20 bg-accent/5 px-6 py-5 text-center">
            <span className="text-xs font-black uppercase tracking-widest text-accent">
              Walkthrough complete! Claim your CP below.
            </span>
          </div>
        )}

        {/* Bottom Navigation */}
        {navigation && (
          <div className="mt-8">
            {navigation}
          </div>
        )}

        {footer}
      </div>
    </div>
  );
}
