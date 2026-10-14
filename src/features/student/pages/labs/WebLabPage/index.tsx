import React, { useState } from 'react';
import { WalkthroughLayout, WalkthroughDeckStep } from '@/shared/components/walkthrough/';
import type { FocusedStepListItem } from '@/shared/components/learning/FocusedStepList';
import LearningAccordion from '@/shared/components/learning/LearningAccordion';
import LabPage from '@/shared/components/learning/LabPage';
import { getRelatedContentForLab } from '@/shared/constants/topicMap';
import RelatedContent from '@/shared/components/RelatedContent';
import { LabListingSkeleton } from '@/features/student/components/StudentSkeletons';
import useLabAccess from '@/features/student/hooks/useLabAccess';
import useLabScenario from '@/features/student/hooks/useLabScenario';
import { getLabCpCost } from '@/features/student/data/simulations/labAccess';
import type { WebLabScenario } from '@/features/student/data/simulations/web-lab-types';

export interface WebLabPageProps {
  labId: string;
  title: string;
  accentWord: string;
  description: string;
  icon: React.ReactNode;
  scenarios: WebLabScenario[];
  relatedLabId?: string;
}

const WebLabPage: React.FC<WebLabPageProps> = ({
  labId,
  title,
  accentWord,
  description,
  icon,
  scenarios,
  relatedLabId,
}) => {
  const { activeScenario, completedSteps, handleFlagSubmit, getStepState, allDone, startScenario, exitScenario } =
    useLabScenario<WebLabScenario>({
      labId,
      getScenarioId: (s) => s.id,
      getStepIds: (s) => s.steps.map((_, i) => `${s.id}-step-${i}`),
    });
  const { isLocked, purchaseLab, loading } = useLabAccess();

  const [viewStepIdx, setViewStepIdx] = useState<number | null>(null);

  const stepCount = activeScenario?.steps.length ?? 0;
  const firstIncomplete = activeScenario?.steps.findIndex((_, i) => !getStepState(i).isCompleted) ?? -1;
  const defaultActiveIndex = firstIncomplete === -1 ? stepCount + 2 : firstIncomplete + 2;
  const activeIndex = viewStepIdx ?? defaultActiveIndex;

  const stepItems: FocusedStepListItem[] = activeScenario
    ? [
        {
          index: 0,
          number: 1,
          title: 'Mission Briefing',
          isActive: activeIndex === 0,
          isCompleted: true,
        },
        {
          index: 1,
          number: 2,
          title: `Target — ${activeScenario.name}`,
          isActive: activeIndex === 1,
          isCompleted: true,
        },
        ...activeScenario.steps.map((step, i) => {
          const state = getStepState(i);
          return {
            index: i + 2,
            number: i + 3,
            title: step.instruction.length > 52 ? `${step.instruction.slice(0, 52)}…` : step.instruction,
            isActive: activeIndex === i + 2,
            isCompleted: state.isCompleted,
            isLocked: state.isLocked,
          };
        }),
        {
          index: stepCount + 2,
          number: stepCount + 3,
          title: 'Mission Debrief',
          isActive: activeIndex === stepCount + 2,
          isCompleted: allDone,
          isLocked: !allDone,
        },
      ]
    : [];

  if (loading) return <LabListingSkeleton />;

  return (
    <LabPage
      title={title}
      accentWord={accentWord}
      description={description}
      activeScenario={activeScenario}
      celebrationShow={allDone}
      celebrationTitle={activeScenario?.name || ''}
      celebrationCp={activeScenario?.cpReward || 0}
      listingContent={
        <LearningAccordion
          items={scenarios.map((scenario) => {
            const cpCost = getLabCpCost(scenario.id);
            const locked = isLocked(scenario.id);
            return {
              id: scenario.id,
              title: scenario.name,
              subtitle: `${scenario.technique} · ${scenario.module}`,
              description: scenario.description,
              difficulty: scenario.difficulty,
              meta: (
                <span className="text-xs font-black uppercase tracking-widest text-accent">
                  {scenario.cpReward} CP
                </span>
              ),
              onStart: () => startScenario(scenario),
              startLabel: 'Start',
              locked,
              cpCost: locked ? cpCost ?? undefined : undefined,
              onUnlock: cpCost ? async () => {
                const success = await purchaseLab(scenario.id, labId);
                if (success) startScenario(scenario);
              } : undefined,
            };
          })}
        />
      }
      relatedContent={
        relatedLabId
          ? <RelatedContent {...getRelatedContentForLab(relatedLabId)} title="Continue This Topic" />
          : undefined
      }
      walkthroughContent={
        activeScenario ? (
          <WalkthroughLayout
            title={activeScenario.name}
            subtitle={`${activeScenario.technique} | ${activeScenario.description}`}
            icon={icon}
            difficulty={activeScenario.difficulty}
            labId={labId}
            scenarioId={activeScenario.id}
            onBack={exitScenario}
            completedCount={completedSteps.size + 1 + (allDone ? 1 : 0)}
            totalSteps={activeScenario.steps.length + 2}
            stepList={stepItems}
            activeStepIndex={activeIndex}
            onStepSelect={setViewStepIdx}
            stepIdPrefix="ws-step"
            focused
          >
            <WalkthroughDeckStep
              stepIndex={0}
              title="Mission Briefing"
              narrative={`## ${activeScenario.name}\n\n${activeScenario.narrative || activeScenario.description}\n\n**Module:** ${activeScenario.module}\n\n**Target:** ${activeScenario.url}\n\n**Technique:** ${activeScenario.technique}`}
              mission={activeScenario.description}
              objectives={activeScenario.objectives}
              isLocked={false}
              isCompleted={true}
              isActive={false}
              flagId="briefing"
              labId={labId}
              onFlagSubmit={async () => ({ correct: false })}
              onComplete={() => {}}
              skipFlag
            />

            <div className="rounded-2xl border border-border/50 bg-bg-card p-4 mb-2">
              <p className="text-sm font-mono text-text-muted">
                <span className="text-accent font-black">Endpoint:</span> {activeScenario.endpoint}
              </p>
            </div>

            {activeScenario.steps.map((step, index) => {
              const { isLocked: stepLocked, isCompleted, isActive } = getStepState(index);
              const stepId = `${activeScenario.id}-step-${index}`;

              return (
                <WalkthroughDeckStep
                  key={index}
                  stepIndex={index + 1}
                  title={`Step ${index + 1}`}
                  narrative={`## ${activeScenario.technique}. Step ${index + 1}\n\n${step.explanation}`}
                  commandInstruction={step.command}
                  evidence={step.output ? [step.output] : undefined}
                  progressiveHints={
                    step.hint
                      ? [{ level: 1 as const, content: step.hint }]
                      : activeScenario.hints.map((content, i) => ({
                          level: Math.min(i + 1, 4) as 1 | 2 | 3 | 4,
                          content,
                        }))
                  }
                  quiz={step.quiz}
                  isLocked={stepLocked}
                  isCompleted={isCompleted}
                  isActive={isActive}
                  flagId={stepId}
                  labId={labId}
                  onFlagSubmit={async (id, flag) => {
                    const res = await handleFlagSubmit(id, flag);
                    if (res.correct) setViewStepIdx(null);
                    return res;
                  }}
                  onComplete={() => setViewStepIdx(null)}
                />
              );
            })}

            <WalkthroughDeckStep
              stepIndex={activeScenario.steps.length + 1}
              title="Mission Debrief"
              narrative={`## ${activeScenario.technique} Complete\n\nYou successfully executed the **${activeScenario.technique}** technique against ${activeScenario.name}.\n\n### Key Takeaways\n\n${activeScenario.objectives.map((o) => `- ${o}`).join('\n')}\n\n### What to Remember\n\nEvery finding follows the same discipline: understand, discover, validate, exploit in the lab, collect evidence, and report. The flag you captured proves the exploit worked — now write it up as you would in a real assessment.`}
              reflection={`What did you learn about ${activeScenario.technique}? How would you defend against it?`}
              isLocked={!allDone}
              isCompleted={allDone}
              isActive={false}
              flagId="debrief"
              labId={labId}
              onFlagSubmit={async () => ({ correct: false })}
              onComplete={() => {}}
              skipFlag
            />
          </WalkthroughLayout>
        ) : null
      }
    />
  );
};

export default WebLabPage;
