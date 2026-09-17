import { Unplug, Loader2, Minimize2, Maximize2 } from 'lucide-react';
import { Children, useEffect } from 'react';
import type { ReactNode } from 'react';
import { IconTerminal } from '@/shared/components/icons';
import WalkthroughScrollControls from '@/shared/components/learning/WalkthroughScrollControls';
import FocusedStepList from '@/shared/components/learning/FocusedStepList';
import type { FocusedStepListItem } from '@/shared/components/learning/FocusedStepList';
import LearningWorkspaceShell from '@/shared/components/learning/LearningWorkspaceShell';
import type { WorkspaceStat } from '@/shared/components/learning/LearningWorkspaceShell';
import LearningToolbar from '@/shared/components/learning/LearningToolbar';
import LearningNav from '@/shared/components/learning/LearningNav';
import { useLabConnection } from '@/features/student/hooks/useLabConnection';
import { useRoomSession } from '@/features/student/hooks/useRoomSession';
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
  headerContent?: React.ReactNode;
  footer?: React.ReactNode;
  progressContent?: React.ReactNode;
  /** steps metadata (in the same order as `children`). When provided, the walkthrough
      collapses non-active steps into focused compact rows instead of a long scroll. */
  stepList?: FocusedStepListItem[];
  /** which `children` index is currently expanded (falls back to all-expanded when unset) */
  activeStepIndex?: number;
  onStepSelect?: (index: number) => void;
  stepIdPrefix?: string;
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
  backLabel,
  completedCount = 0,
  totalSteps = 0,
  showConnectionGuide = true,
  simulations,
  headerMetadata,
  headerActions,
  headerContent,
  footer,
  progressContent,
  stepList,
  activeStepIndex,
  onStepSelect,
  stepIdPrefix,
}: WalkthroughLayoutProps) {
  const allDone = totalSteps > 0 && completedCount === totalSteps;
  const { connection, isConnected, isLoading, error, connect, disconnect } = useLabConnection();
  const { network, browser } = useSimulation();
  const { fullscreen, toggleFullscreen } = useRoomSession();

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

  const headerStats: WorkspaceStat[] = [];
  if (difficulty) {
    headerStats.push({ label: "Difficulty", value: difficulty });
  }
  if (estimatedMinutes) {
    headerStats.push({ label: "Est. time", value: `${estimatedMinutes} min` });
  }
  headerStats.push({ label: "Lab", value: labId });

  return (
    <div className="w-full bg-canvas min-h-dvh">
      {/* Walkthrough scroll controls (fixed to viewport) */}
      <WalkthroughScrollControls />

      {/* Fullscreen toolbar — desktop rail + mobile floating panel */}
      <LearningToolbar
        actions={[
          {
            id: 'fullscreen',
            icon: fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />,
            label: fullscreen
              ? "Exit fullscreen"
              : "Enter fullscreen",
            onClick: toggleFullscreen,
          },
        ]}
      />

      <LearningWorkspaceShell
        icon={icon}
        title={title}
        description={subtitle}
        onBack={onBack}
        backLabel={backLabel}
        stats={headerStats}
        actions={
          (headerMetadata || headerActions) ? (
            <div className="flex flex-wrap items-center gap-2">
              {headerMetadata}
              {headerActions}
            </div>
          ) : undefined
        }
      >
        {headerContent}

        {/* Connection Panel */}
        {scenarioId && showConnectionGuide && (
          <div className="rounded-xl border border-border-subtle bg-surface p-5 md:p-6">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-border-subtle bg-surface-raised text-accent">
                <IconTerminal size={18} />
              </div>
              <h3 className="type-h3 font-black uppercase tracking-tight text-text-primary">
                {"Lab Connection"}
              </h3>
              <span className="type-meta rounded-md border border-accent/30 bg-accent/10 px-2 py-1 text-accent">
                {"Live Instance"}
              </span>
            </div>

            {!isConnected ? (
              <div className="space-y-4">
                <p className="text-sm md:text-base text-text-secondary font-mono leading-[2] md:leading-[2.2]">
                  {"Connect to a live lab machine to run commands and complete this walkthrough. Your progress, commands and captured flags are saved as you go."}
                </p>
                <div className="grid gap-2 sm:grid-cols-3">
                  <div className="rounded-xl border border-border/20 bg-surface-raised px-3.5 py-3">
                    <p className="type-meta font-black uppercase tracking-widest text-text-tertiary mb-1">{"Target"}</p>
                    <p className="text-sm font-mono text-text-primary">Linux VM</p>
                  </div>
                  <div className="rounded-xl border border-border/20 bg-surface-raised px-3.5 py-3">
                    <p className="type-meta font-black uppercase tracking-widest text-text-tertiary mb-1">{"Persists"}</p>
                    <p className="text-sm font-mono text-text-primary">{"Session saved"}</p>
                  </div>
                  <div className="rounded-xl border border-border/20 bg-surface-raised px-3.5 py-3">
                    <p className="type-meta font-black uppercase tracking-widest text-text-tertiary mb-1">{"Flags"}</p>
                    <p className="text-sm font-mono text-text-primary">{"Verified on submit"}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <button
                    onClick={handleConnect}
                    disabled={isLoading}
                    className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 rounded-xl btn-primary"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <IconTerminal size={16} />}
                    {isLoading ? "Connecting..." : "Connect to Lab"}
                  </button>
                  {error && <span className="text-xs text-danger">{error}</span>}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-success/10 text-xs font-black uppercase tracking-widest text-success">
                      <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                      {"Connected"}
                    </span>
                    <span className="px-3 py-1.5 rounded-lg bg-surface-raised text-xs font-mono text-text-secondary">
                      {"Target"}: <span className="text-text-primary">{connection?.targetIp}</span>
                    </span>
                  </div>
                  <button
                    onClick={disconnect}
                    disabled={isLoading}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 px-4 text-xs font-black uppercase tracking-widest text-danger transition-colors hover:bg-danger/20 disabled:opacity-50 w-fit"
                  >
                    {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Unplug className="w-3.5 h-3.5" />}
                    {"Disconnect"}
                  </button>
                </div>
                <p className="text-sm text-text-secondary font-mono leading-[2] md:leading-[2.2]">
                  {"Use the terminal below to run commands against the live machine. Progress is tracked automatically."}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Simulation Panel */}
        {simulations && simulations.length > 0 && (
          <div>
            <SimulationPanel simulations={simulations} />
          </div>
        )}

        {/* Steps — full width, matching blog text layout */}
        <div className="space-y-12 md:space-y-16">
          {stepList && stepList.length > 0 && activeStepIndex !== undefined && onStepSelect ? (
            <FocusedStepList
              idPrefix={stepIdPrefix}
              items={stepList}
              onSelect={onStepSelect}
              renderActive={(i) => Children.toArray(children)[i] ?? null}
              className="space-y-4"
            />
          ) : (
            children
          )}
        </div>

        {/* Navigation — previous / next step, matching course & bootcamp pattern */}
        {stepList && stepList.length > 0 && activeStepIndex !== undefined && onStepSelect && (
          <LearningNav
            currentStep={activeStepIndex}
            totalSteps={stepList.length}
            isLastStep={activeStepIndex === stepList.length - 1}
            isComplete={allDone}
            onPrev={activeStepIndex > 0 ? () => onStepSelect(activeStepIndex - 1) : undefined}
            onNext={activeStepIndex < stepList.length - 1 ? () => onStepSelect(activeStepIndex + 1) : undefined}
            finishContent={
              allDone && onBack ? (
                <button
                  type="button"
                  onClick={onBack}
                  className="btn-secondary inline-flex min-h-[44px] flex-1 md:flex-none items-center justify-center gap-1.5 px-5 py-2.5"
                >
                  {backLabel ?? 'Back'}
                </button>
              ) : undefined
            }
          />
        )}

        {/* Progress */}
        {progressContent || (
          <div className="rounded-xl border border-border-subtle bg-surface px-4 py-4 md:px-5 md:py-5">
            <div className="mb-3 flex items-center justify-between gap-4">
              <span className="type-meta font-black uppercase tracking-widest text-text-tertiary">
                {"Progress"}
              </span>
              <span className="text-sm font-bold text-text-secondary">
                {`${completedCount}/${totalSteps} steps`}
              </span>
            </div>
            <div
              className="h-2 overflow-hidden rounded-full bg-surface-raised"
              role="progressbar"
              aria-valuenow={totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${completedCount}/${totalSteps} steps complete`}
            >
              <div
                className="h-full bg-accent transition-[width] duration-700 ease-out rounded-full"
                style={{ width: `${totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0}%` }}
              />
            </div>
          </div>
        )}

        {allDone && (
          <div className="rounded-xl border border-accent/20 bg-accent/5 px-6 py-5 text-center">
            <span className="text-xs font-black uppercase tracking-widest text-accent">
              {"Walkthrough complete! Claim your CP below."}
            </span>
          </div>
        )}

        {footer}
      </LearningWorkspaceShell>
    </div>
  );
}