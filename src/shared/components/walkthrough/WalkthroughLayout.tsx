import { Unplug, Loader2 } from 'lucide-react';
import React, { Children, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import { IconTerminal } from '@/shared/components/icons';
import type { FocusedStepListItem } from '@/shared/components/learning/FocusedStepList';
import LearningWorkspaceShell from '@/shared/components/learning/LearningWorkspaceShell';
import type { LearningOutlineItem, WorkspaceStat } from '@/shared/components/learning/LearningWorkspaceShell';
import LearningNav from '@/shared/components/learning/LearningNav';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';
import { scrollToStepId } from '@/shared/utils/scrollToStep';
import { useLabConnection } from '@/features/student/hooks/useLabConnection';
import { SimulationPanel, useSimulation, getNetworkProfileForLab, type SimulationType } from '@/features/student/components/simulations';

export interface WalkthroughLayoutProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  difficulty?: string;
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
  /** Step metadata in the same order as `children`. Used for anchors, outline and nav. */
  stepList?: FocusedStepListItem[];
  /** Index used to highlight/scroll the current step in the bottom navigation. */
  activeStepIndex?: number;
  onStepSelect?: (index: number) => void;
  /** stepIdPrefix for anchor ids. */
  stepIdPrefix?: string;
}

export function WalkthroughLayout({
  title,
  subtitle,
  icon,
  difficulty,
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
  const prefersReducedMotion = useReducedMotion();

  /**
   * Every step stays mounted on this page, so selecting a step scrolls to that
   * step's anchor instead of swapping the visible content.
   */
  const handleStepSelect = useCallback((index: number) => {
    onStepSelect?.(index);
    const target = stepList?.[index];
    if (!target) return;
    scrollToStepId(
      `${stepIdPrefix ?? 'step'}-${target.number}`,
      prefersReducedMotion ? 'auto' : 'smooth',
    );
  }, [onStepSelect, stepList, stepIdPrefix, prefersReducedMotion]);

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
  if (totalSteps > 0) {
    headerStats.push({ label: "steps", value: `${completedCount}/${totalSteps}` });
  }

  const outline: LearningOutlineItem[] = (stepList ?? []).map((item) => ({
    id: `${stepIdPrefix ?? 'step'}-${item.number}`,
    label: item.title,
  }));

  return (
    <div className="w-full bg-canvas min-h-dvh">
      <LearningWorkspaceShell
        icon={icon}
        title={title}
        description={subtitle}
        onBack={onBack}
        backLabel={backLabel}
        stats={headerStats}
        outline={outline}
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

        {/* Connection Banner */}
        {scenarioId && showConnectionGuide && (
          !isConnected ? (
            <div className="flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-bg-card mb-6">
              <span className="text-sm text-text-secondary">
                Connect to lab environment to begin
              </span>
              <button
                onClick={handleConnect}
                disabled={isLoading}
                className="btn-primary text-xs px-4 py-2 inline-flex items-center gap-2 min-h-[44px]"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <IconTerminal size={16} />}
                {isLoading ? "Connecting..." : "Connect"}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-success/10 border border-success/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-mono text-success flex-1">
                Connected: {connection?.targetIp}
              </span>
              <button
                onClick={disconnect}
                disabled={isLoading}
                className="text-xs text-danger hover:text-danger/80 transition-colors min-h-[44px] px-2"
              >
                Disconnect
              </button>
            </div>
          )
        )}

        {/* Simulation Panel */}
        {simulations && simulations.length > 0 && (
          <div>
            <SimulationPanel simulations={simulations} />
          </div>
        )}

        {/* Steps — every section stays expanded on the page. */}
        <div className="space-y-12 md:space-y-16">
          {Children.toArray(children).map((child, index) => {
            const item = stepList?.[index];
            const id = item ? `${stepIdPrefix ?? 'step'}-${item.number}` : undefined;
            return (
              <div key={index} id={id} className="scroll-mt-20 md:scroll-mt-24">
                {child}
              </div>
            );
          })}
        </div>

        {/* Navigation */}
        {stepList && stepList.length > 0 && activeStepIndex !== undefined && onStepSelect && (
          <LearningNav
            currentStep={activeStepIndex}
            totalSteps={stepList.length}
            isLastStep={activeStepIndex === stepList.length - 1}
            isComplete={allDone}
            onPrev={activeStepIndex > 0 ? () => handleStepSelect(activeStepIndex - 1) : undefined}
            onNext={
              activeStepIndex < stepList.length - 1 && !stepList[activeStepIndex + 1].isLocked
                ? () => handleStepSelect(activeStepIndex + 1)
                : undefined
            }
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
              {"Operation complete. Mission debrief available above."}
            </span>
          </div>
        )}

        {footer}
      </LearningWorkspaceShell>
    </div>
  );
}