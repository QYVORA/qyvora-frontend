import { useState, useCallback } from 'react';
import { Target, CheckCircle, Radar } from 'lucide-react';
import { WalkthroughLayout, WalkthroughStep } from '@/shared/components/walkthrough/';
import SEO from '@/shared/components/SEO';
import LearningAccordion from '@/shared/components/learning/LearningAccordion';
import { KILL_CHAIN_SCENARIOS } from '@/features/student/data/simulations';
import { verifyLabFlag } from '../../../services/lab.service';
import { getRelatedContentForLab } from '@/shared/constants/topicMap';
import RelatedContent from '@/shared/components/RelatedContent';
import { KillChainDiagramSimple } from '@/shared/components/diagrams/KillChainDiagram';
import StudentHeroSection from '@/shared/components/StudentHeroSection';
import { LabCelebration } from '@/shared/components/LabCelebration';
import useLabAccess from '@/features/student/hooks/useLabAccess';
import { getLabCpCost } from '@/features/student/data/simulations/labAccess';

const KillChainLab = () => {
  const [activeScenario, setActiveScenario] = useState(null);
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [completedCommands, setCompletedCommands] = useState<Set<string>>(new Set());
  const [completedPhases, setCompletedPhases] = useState<Set<string>>(new Set());
  const { isLocked, purchaseLab } = useLabAccess();

  const startScenario = useCallback((scenario) => {
    setActiveScenario(scenario); setActivePhaseIndex(0);
    setCompletedCommands(new Set<string>()); setCompletedPhases(new Set<string>());
  }, []);

  const exitScenario = useCallback(() => {
    setActiveScenario(null); setActivePhaseIndex(0);
    setCompletedCommands(new Set<string>()); setCompletedPhases(new Set<string>());
  }, []);

  const handleCommandComplete = useCallback((phaseId, cmdIndex) => {
    setCompletedCommands(prev => new Set(prev).add(`${phaseId}-${cmdIndex}`));
  }, []);

  const handlePhaseComplete = useCallback(() => {
    if (!activeScenario) return;
    setCompletedPhases(prev => new Set(prev).add(activeScenario.phases[activePhaseIndex].id));
    if (activePhaseIndex < activeScenario.phases.length - 1) setActivePhaseIndex(prev => prev + 1);
  }, [activeScenario, activePhaseIndex]);

  const handleFlagSubmit = useCallback(async (_stepId: string, flag: string) => {
    if (!activeScenario) return { correct: false };
    try {
      return await verifyLabFlag('kill-chain', activeScenario.id, flag);
    } catch {
      return { correct: false };
    }
  }, [activeScenario]);

  const currentPhase = activeScenario?.phases[activePhaseIndex] ?? null;
  const allPhasesCompleted = activeScenario && completedPhases.size === activeScenario.phases.length;

  if (!activeScenario) {
    const firstScenarioWithVillain = KILL_CHAIN_SCENARIOS.find(s => s.villain);
    return (
      <div className="bg-bg min-h-full">
        <SEO title="Kill Chain Lab" description="Execute full penetration test simulations." noindex />

        <StudentHeroSection
          fullHeight={false}
          title="Kill"
          accentWord="Chain"
          description="Execute full kill chain simulations, from reconnaissance to exfiltration."
          villain={firstScenarioWithVillain?.villain}
        />

        <div className="px-3 md:px-4 lg:px-6 pb-20 lg:pb-24 space-y-8">

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
                  <span className="text-[9px] font-black uppercase tracking-widest text-accent">
                    {s.cpReward} CP
                  </span>
                ),
                onStart: () => startScenario(s),
                startLabel: 'Start Operation',
                locked,
                cpCost: locked ? cpCost ?? undefined : undefined,
                onUnlock: cpCost ? async () => {
                  const success = await purchaseLab(s.id, 'kill-chain');
                  if (success) startScenario(s);
                } : undefined,
              };
            })}
          />

          <RelatedContent {...getRelatedContentForLab('killchain')} title="Continue This Topic" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg min-h-full">
      <SEO title={`${activeScenario.title}. Kill Chain`} description={activeScenario.description} noindex />
      <WalkthroughLayout
        title={activeScenario.title}
        subtitle={activeScenario.description}
        icon={<Target className="w-6 h-6" />}
        difficulty={activeScenario.difficulty}
        labId="killchain"
        scenarioId={activeScenario.id}
        onBack={exitScenario}
        completedCount={completedPhases.size}
        totalSteps={activeScenario.phases.length + 2}
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
          labId="killchain"
          onFlagSubmit={async () => ({ correct: false })}
          onComplete={() => {}}
          skipFlag
        />

        <div className="rounded-2xl border border-border/50 bg-bg-card p-4 mb-2">
          <p className="text-sm text-text-muted font-mono">{activeScenario.targetDescription}</p>
        </div>

        <div className="rounded-2xl border border-border/50 bg-bg-card p-4 md:p-5 mb-2">
          <div className="flex items-center gap-2 mb-4"><Radar className="w-4 h-4 text-accent" /><span className="text-[9px] font-black uppercase tracking-widest text-accent">Kill Chain Progress</span></div>
          <KillChainDiagramSimple
            phases={activeScenario.phases.map(p => p.name)}
            currentPhaseIndex={activePhaseIndex}
            completedPhaseIds={Array.from(completedPhases)}
          />
        </div>

        {currentPhase && (
          <>
            {currentPhase.commands.map((cmd, cmdIdx) => {
          const cmdKey = `${currentPhase.id}-${cmdIdx}`;
          const isCompleted = completedCommands.has(cmdKey);
          const firstIncomplete = currentPhase.commands.findIndex((_: any, i: number) => !completedCommands.has(`${currentPhase.id}-${i}`));
          const isLocked = !isCompleted && cmdIdx > firstIncomplete;

              const narrative = `## ${currentPhase.name}. Command ${cmdIdx + 1}\n\n${currentPhase.narrative || cmd.explanation}\n\nExecute the command below to advance the kill chain.`;

              return (
                <WalkthroughStep
                  key={cmdIdx}
                  stepIndex={cmdIdx + 1}
                  title={`${currentPhase.name} - Command ${cmdIdx + 1}`}
                  narrative={narrative}
                  commandInstruction={cmd.command}
                  isLocked={isLocked}
                  isCompleted={isCompleted}
                  isActive={!isCompleted}
                  flagId={cmdKey}
                  labId="killchain"
                  onFlagSubmit={handleFlagSubmit}
                  onComplete={() => handleCommandComplete(currentPhase.id, cmdIdx)}
                >
                  {cmd.isRequired && (
                    <span className="inline-flex px-2 py-0.5 rounded bg-yellow-400/10 text-[8px] font-black uppercase tracking-widest text-yellow-400">Required</span>
                  )}
                </WalkthroughStep>
              );
            })}

            {currentPhase.commands.filter(c => c.isRequired).every((_, i) => completedCommands.has(`${currentPhase.id}-${i}`)) && (
              <div className="flex justify-end mt-2">
                <button onClick={handlePhaseComplete} className="btn-primary !rounded-xl !text-[10px] px-6 py-2.5 flex items-center gap-2">
                  {activePhaseIndex < activeScenario.phases.length - 1 ? <>Complete Phase & Move Next</> : <>All Phases Complete <CheckCircle className="w-3.5 h-3.5" /></>}
                </button>
              </div>
            )}
          </>
        )}

        {allPhasesCompleted && (
          <WalkthroughStep
            stepIndex={activeScenario.phases.length + 1}
            title="Mission Debrief"
            narrative={`## Kill Chain Complete\n\nYou successfully executed the full kill chain against **${activeScenario.title}**.\n\n### Key Takeaways\n\n- The kill chain model provides a structured approach to penetration testing\n- Each phase builds on the previous one\n- Reconnaissance is critical for identifying attack vectors\n- Lateral movement and privilege escalation are key to achieving objectives\n\n### What to Remember\n\nUnderstanding the kill chain helps defenders identify and mitigate attacks at each stage. This model is foundational for both offensive and defensive security.`}
            reflection={`What did you learn about the kill chain methodology? How would you defend against each phase of an attack?`}
            isLocked={false}
            isCompleted={allPhasesCompleted}
            isActive={false}
            flagId="debrief"
            labId="killchain"
            onFlagSubmit={async () => ({ correct: false })}
            onComplete={() => {}}
            skipFlag
          />
        )}
      </WalkthroughLayout>

      <LabCelebration
        trigger={allPhasesCompleted}
        title={activeScenario.title}
        rewardCp={activeScenario.cpReward}
      />
    </div>
  );
};

export default KillChainLab;
