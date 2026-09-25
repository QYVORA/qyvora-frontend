import { useState, useMemo } from 'react';
import { Target } from 'lucide-react';
import { WalkthroughLayout, WalkthroughStep } from '@/shared/components/walkthrough/';
import LearningAccordion from '@/shared/components/learning/LearningAccordion';
import LabPage from '@/shared/components/learning/LabPage';
import type { FocusedStepListItem } from '@/shared/components/learning/FocusedStepList';
import { KILL_CHAIN_SCENARIOS } from '@/features/student/data/simulations';
import type { KillChainScenario, KillChainPhase, KillChainCommand } from '@/features/student/data/simulations';
import { getRelatedContentForLab } from '@/shared/constants/topicMap';
import RelatedContent from '@/shared/components/RelatedContent';
import { KillChainDiagramSimple } from '@/shared/components/diagrams/KillChainDiagram';
import { LabListingSkeleton } from '@/features/student/components/StudentSkeletons';
import useLabAccess from '@/features/student/hooks/useLabAccess';
import useLabScenario from '@/features/student/hooks/useLabScenario';
import { getLabCpCost } from '@/features/student/data/simulations/labAccess';

interface RequiredCommandStep {
  phase: KillChainPhase;
  cmdIdx: number;
  command: KillChainCommand;
  isFirstInPhase: boolean;
  optionalCommands: string[];
}

const getRequiredCommandSteps = (scenario: KillChainScenario): RequiredCommandStep[] => {
  const steps: RequiredCommandStep[] = [];
  scenario.phases.forEach((phase) => {
    const optionalCommands = phase.commands.filter((cmd) => !cmd.isRequired).map((cmd) => cmd.command);
    phase.commands.forEach((command, cmdIdx) => {
      if (!command.isRequired) return;
      steps.push({
        phase,
        cmdIdx,
        command,
        isFirstInPhase: !phase.commands.slice(0, cmdIdx).some((c) => c.isRequired),
        optionalCommands,
      });
    });
  });
  return steps;
};

const KillChainLab = () => {
  const {
    activeScenario,
    completedSteps,
    handleComplete,
    handleFlagSubmit,
    getStepState,
    allDone,
    startScenario,
    exitScenario,
  } = useLabScenario<KillChainScenario>({
    labId: 'kill-chain',
    getScenarioId: (s) => s.id,
    getStepIds: (s) =>
      getRequiredCommandSteps(s).map((st) => `${st.phase.id}-${st.cmdIdx}`),
  });
  const { isLocked, purchaseLab, loading } = useLabAccess();
  const [viewStepIdx, setViewStepIdx] = useState<number | null>(null);

  const commandSteps = useMemo(
    () => (activeScenario ? getRequiredCommandSteps(activeScenario) : []),
    [activeScenario]
  );

  const stepCount = commandSteps.length;
  const firstIncomplete = commandSteps.findIndex((_, i) => !getStepState(i).isCompleted);
  const defaultActiveIndex = firstIncomplete === -1 ? stepCount + 1 : firstIncomplete + 1;
  const activeIndex = viewStepIdx ?? defaultActiveIndex;

  const completedPhaseIds = useMemo(() => {
    if (!activeScenario) return [];
    return activeScenario.phases
      .filter(
        (phase) =>
          phase.commands.some((c) => c.isRequired) &&
          phase.commands.every(
            (c, cmdIdx) => !c.isRequired || completedSteps.has(`${phase.id}-${cmdIdx}`)
          )
      )
      .map((p) => p.id);
  }, [activeScenario, completedSteps]);

  const currentPhaseIndex = useMemo(() => {
    if (!activeScenario) return 0;
    const idx = activeScenario.phases.findIndex((phase) =>
      phase.commands.some(
        (c, cmdIdx) => c.isRequired && !completedSteps.has(`${phase.id}-${cmdIdx}`)
      )
    );
    return idx === -1 ? activeScenario.phases.length - 1 : idx;
  }, [activeScenario, completedSteps]);

  const stepItems: FocusedStepListItem[] = activeScenario
    ? [
        {
          index: 0,
          number: 1,
          title: 'Mission Briefing',
          isActive: activeIndex === 0,
          isCompleted: true,
        },
        ...commandSteps.map((st, i) => {
          const state = getStepState(i);
          return {
            index: i + 1,
            number: i + 2,
            title: `${st.phase.name} — Command ${st.cmdIdx + 1}`,
            isActive: activeIndex === i + 1,
            isCompleted: state.isCompleted,
            isLocked: state.isLocked,
          };
        }),
        {
          index: stepCount + 1,
          number: stepCount + 2,
          title: 'Mission Debrief',
          isActive: activeIndex === stepCount + 1,
          isCompleted: allDone,
          isLocked: !allDone,
        },
      ]
    : [];

  if (loading) return <LabListingSkeleton />;

  return (
    <LabPage
      title="Kill"
      accentWord="Chain"
      description="Execute full kill chain simulations, from reconnaissance to exfiltration."
      activeScenario={activeScenario}
      celebrationShow={!!allDone}
      celebrationTitle={activeScenario?.title || ''}
      celebrationCp={activeScenario?.cpReward || 0}
      listingContent={
        <LearningAccordion
          items={KILL_CHAIN_SCENARIOS.map((s) => {
            const cpCost = getLabCpCost(s.id);
            const locked = isLocked(s.id);
            return {
              id: s.id,
              title: s.title,
              subtitle: `${s.phases.length} phases, full chain`,
              description: s.description,
              difficulty: s.difficulty,
              meta: (
                <span className="text-xs font-black uppercase tracking-widest text-accent">
                  {s.cpReward} CP
                </span>
              ),
              onStart: () => startScenario(s),
              startLabel: "Start",
              locked,
              cpCost: locked ? cpCost ?? undefined : undefined,
              onUnlock: cpCost ? async () => {
                const success = await purchaseLab(s.id, 'kill-chain');
                if (success) startScenario(s);
              } : undefined,
            };
          })}
        />
      }
      relatedContent={<RelatedContent {...getRelatedContentForLab('killchain')} title="Continue This Topic" />}
      walkthroughContent={
        activeScenario ? (
          <WalkthroughLayout
            title={activeScenario.title}
            subtitle={activeScenario.description}
            icon={<Target className="w-6 h-6" />}
            difficulty={activeScenario.difficulty}
            labId="kill-chain"
            scenarioId={activeScenario.id}
            onBack={exitScenario}
            completedCount={completedSteps.size + 1 + (allDone ? 1 : 0)}
            totalSteps={stepCount + 2}
            stepList={stepItems}
            activeStepIndex={activeIndex}
            onStepSelect={setViewStepIdx}
            stepIdPrefix="ws-step"
          >
            <WalkthroughStep
              stepIndex={0}
              title="Mission Briefing"
              narrative={`## ${activeScenario.title}\n\n${activeScenario.description}\n\n**Target:** ${activeScenario.targetDescription}\n\n**Phases:** ${activeScenario.phases.length}`}
              mission={activeScenario.description}
              objectives={[
                'Execute each phase of the kill chain',
                'Complete required commands in each phase',
                'Advance through reconnaissance to exfiltration',
                'Capture the flag',
              ]}
              isLocked={false}
              isCompleted={true}
              isActive={false}
              flagId="briefing"
              labId="kill-chain"
              onFlagSubmit={async () => ({ correct: false })}
              onComplete={() => {}}
              skipFlag
            >
              <div className="rounded-2xl border border-border/50 bg-bg-card p-4 md:p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-4 h-4 text-accent" />
                  <span className="text-xs font-black uppercase tracking-widest text-accent">Kill Chain Progress</span>
                </div>
                <KillChainDiagramSimple
                  phases={activeScenario.phases.map((p) => p.name)}
                  currentPhaseIndex={currentPhaseIndex}
                  completedPhaseIds={completedPhaseIds}
                />
              </div>
            </WalkthroughStep>

            {commandSteps.map((st, i) => {
              const { isLocked, isCompleted, isActive } = getStepState(i);
              const optionalLine =
                st.optionalCommands.length > 0 && st.isFirstInPhase
                  ? `\n\n**Optional commands:** ${st.optionalCommands.map((c) => `\`${c}\``).join(', ')}`
                  : '';
              const narrative = st.isFirstInPhase
                ? `## ${st.phase.name}\n\n${st.phase.narrative || st.command.explanation}\n\nExecute the required command below to advance the kill chain.${optionalLine}`
                : `## ${st.phase.name}. Command ${st.cmdIdx + 1}\n\n${st.command.explanation}\n\nExecute the command below to advance the kill chain.`;

              return (
                <WalkthroughStep
                  key={`${st.phase.id}-${st.cmdIdx}`}
                  stepIndex={i + 1}
                  title={`${st.phase.name} — Command ${st.cmdIdx + 1}`}
                  narrative={narrative}
                  commandInstruction={st.command.command}
                  quiz={st.isFirstInPhase ? st.phase.quiz : undefined}
                  isLocked={isLocked}
                  isCompleted={isCompleted}
                  isActive={isActive}
                  flagId={`${st.phase.id}-${st.cmdIdx}`}
                  labId="kill-chain"
                  onFlagSubmit={async (id, flag) => {
                    const res = await handleFlagSubmit(id, flag);
                    if (res.correct) setViewStepIdx(null);
                    return res;
                  }}
                  onComplete={() => {
                    setViewStepIdx(null);
                    handleComplete(`${st.phase.id}-${st.cmdIdx}`);
                  }}
                />
              );
            })}

            <WalkthroughStep
              stepIndex={stepCount + 1}
              title="Mission Debrief"
              narrative={`## Kill Chain Complete\n\nYou successfully executed the full kill chain against **${activeScenario.title}**.\n\n### Key Takeaways\n\n- The kill chain model provides a structured approach to penetration testing\n- Each phase builds on the previous one\n- Reconnaissance is critical for identifying attack vectors\n- Lateral movement and privilege escalation are key to achieving objectives\n\n### What to Remember\n\nUnderstanding the kill chain helps defenders identify and mitigate attacks at each stage. This model is foundational for both offensive and defensive security.`}
              reflection={`What did you learn about the kill chain methodology? How would you defend against each phase of an attack?`}
              isLocked={!allDone}
              isCompleted={!!allDone}
              isActive={false}
              flagId="debrief"
              labId="kill-chain"
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

export default KillChainLab;