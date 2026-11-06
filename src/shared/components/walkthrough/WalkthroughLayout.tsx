import { Unplug, Loader2 } from 'lucide-react';
import React, { Children, cloneElement, isValidElement, useCallback, useEffect } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { IconTerminal } from '@/shared/components/icons';
import type { FocusedStepListItem } from '@/shared/components/learning/FocusedStepList';
import LearningWorkspaceShell from '@/shared/components/learning/LearningWorkspaceShell';
import type { WorkspaceStat } from '@/shared/components/learning/LearningWorkspaceShell';
import Button from '@/shared/components/ui/Button';
import LearningNav from '@/shared/components/learning/LearningNav';
import { LearningTaskAccordion } from '@/shared/components/learning/LearningTaskAccordion';
import type { LearningTask } from '@/shared/components/learning/LearningTaskAccordion';
import { WalkthroughStep } from './WalkthroughStep';
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
    window.requestAnimationFrame(() => {
      scrollToStepId(
        `${stepIdPrefix ?? 'step'}-${target.number}`,
        prefersReducedMotion ? 'auto' : 'smooth',
      );
    });
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

  const childArray = Children.toArray(children);
  const tasks: LearningTask[] = childArray.map((child, index) => {
    const item = stepList?.[index];
    const id = item
      ? `${stepIdPrefix ?? 'step'}-${item.number}`
      : `${stepIdPrefix ?? 'step'}-${index + 1}`;
    const content =
      isValidElement(child) && child.type === WalkthroughStep
        ? cloneElement(child as ReactElement<{ hideHeader?: boolean }>, { hideHeader: true })
        : child;

    return {
      id,
      title: item?.title ?? `Task ${index + 1}`,
      description: item?.isCompleted ? 'Completed' : item?.isActive ? 'Current task' : undefined,
      completed: item?.isCompleted,
      locked: item?.isLocked,
      content,
    };
  });
  const activeTaskId =
    activeStepIndex !== undefined ? tasks[activeStepIndex]?.id : undefined;
  const nextTaskIndex = stepList?.findIndex((item) => !item.isCompleted && !item.isLocked) ?? -1;
  const continueIndex = nextTaskIndex >= 0 ? nextTaskIndex : 0;
  const continueAction =
    stepList && stepList.length > 0 && onStepSelect ? (
      <Button variant="secondary" onClick={() => handleStepSelect(continueIndex)}>
        {completedCount > 0 ? (allDone ? 'Review lab' : 'Continue lab') : 'Start lab'}
      </Button>
    ) : null;

  return (
    <div className="w-full bg-canvas min-h-dvh">
      <LearningWorkspaceShell
        icon={icon}
        title={title}
        description={subtitle}
        onBack={onBack}
        backLabel={backLabel}
        stats={headerStats}
        progress={
          totalSteps > 0
            ? {
                value: Math.round((completedCount / totalSteps) * 100),
                label: `${completedCount}/${totalSteps} tasks`,
              }
            : undefined
        }
        actions={
          (headerMetadata || headerActions || continueAction) ? (
            <div className="flex flex-wrap items-center gap-2">
              {headerMetadata}
              {headerActions}
              {continueAction}
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

        {/* Tasks — one accordion item per step, current task open. */}
        <LearningTaskAccordion
          tasks={tasks}
          activeId={activeTaskId}
          onActiveChange={(id) => {
            const index = tasks.findIndex((task) => task.id === id);
            if (index >= 0) handleStepSelect(index);
          }}
        />

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

        {/* Optional page-specific progress detail; the hero owns the main bar. */}
        {progressContent}

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