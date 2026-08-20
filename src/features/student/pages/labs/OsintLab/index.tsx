import { useMemo } from 'react';
import { Globe, CheckCircle } from 'lucide-react';
import { WalkthroughLayout, WalkthroughStep } from '@/shared/components/walkthrough/';
import { OSINT_CHALLENGES } from '@/features/student/data/simulations';
import { createOsintSimulations } from '@/features/student/components/simulations/labSimulationContent';
import SEO from '@/shared/components/SEO';
import LearningAccordion from '@/shared/components/learning/LearningAccordion';
import { getRelatedContentForLab } from '@/shared/constants/topicMap';
import RelatedContent from '@/shared/components/RelatedContent';
import StudentHeroSection from '@/shared/components/StudentHeroSection';
import { LabCelebration } from '@/shared/components/LabCelebration';
import useLabAccess from '@/features/student/hooks/useLabAccess';
import useLabScenario from '@/features/student/hooks/useLabScenario';
import { getLabCpCost } from '@/features/student/data/simulations/labAccess';

type OsintChallenge = typeof OSINT_CHALLENGES[number];

const OsintLab = () => {
  const { activeScenario: activeChallenge, completedSteps, handleFlagSubmit, getStepState, allDone, startScenario, exitScenario } =
    useLabScenario<OsintChallenge>({
      labId: 'osint',
      getScenarioId: (c) => c.id,
      getStepIds: (c) => c.steps.map((_, i) => `${c.id}-step-${i}`),
    });
  const { isLocked, purchaseLab } = useLabAccess();

  const simulations = useMemo(
    () => activeChallenge ? createOsintSimulations(activeChallenge.targetName, activeChallenge.skills) : [],
    [activeChallenge],
  );

  if (!activeChallenge) {
    const firstChallengeWithVillain = OSINT_CHALLENGES.find(c => c.villain);
    return (
      <div className="bg-bg min-h-full">
        <SEO title="OSINT Recon Lab" description="Master open-source intelligence gathering techniques." noindex />

        <StudentHeroSection
          fullHeight={false}
          title="OSINT Recon"
          accentWord="Challenge"
          description="Master open-source intelligence gathering with guided reconnaissance exercises."
          villain={firstChallengeWithVillain?.villain}
        />

        <div className="px-3 md:px-4 lg:px-6 pb-20 lg:pb-24 space-y-8">

          <LearningAccordion
            items={OSINT_CHALLENGES.map((challenge) => {
              const cpCost = getLabCpCost(challenge.id);
              const locked = isLocked(challenge.id);
              return {
                id: challenge.id,
                title: challenge.title,
                subtitle: `${challenge.targetName} — ${challenge.skills.slice(0, 2).join(' · ')}`,
                description: challenge.description,
                difficulty: challenge.difficulty,
                meta: (
                  <span className="text-[9px] font-black uppercase tracking-widest text-accent">
                    {challenge.cpReward} CP
                  </span>
                ),
                onStart: () => startScenario(challenge),
                startLabel: 'Start Mission',
                locked,
                cpCost: locked ? cpCost ?? undefined : undefined,
                onUnlock: cpCost ? async () => {
                  const success = await purchaseLab(challenge.id, 'osint');
                  if (success) startScenario(challenge);
                } : undefined,
              };
            })}
          />

          <RelatedContent {...getRelatedContentForLab('osint')} title="Continue This Topic" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg min-h-full">
      <SEO title={`${activeChallenge.title} — OSINT Lab`} description={activeChallenge.description} noindex />
      <WalkthroughLayout
        title={activeChallenge.title}
        subtitle={activeChallenge.description}
        icon={<Globe className="w-6 h-6" />}
        difficulty={activeChallenge.difficulty}
        labId="osint"
        scenarioId={activeChallenge.id}
        onBack={exitScenario}
        completedCount={completedSteps.size}
        totalSteps={activeChallenge.steps.length + 2}
        simulations={simulations}
      >
        <WalkthroughStep
          stepIndex={0}
          title="Mission Briefing"
          narrative={`## ${activeChallenge.title}\n\n${activeChallenge.description}\n\n**Target:** ${activeChallenge.targetName}\n\n**Skills:** ${activeChallenge.skills.join(', ')}`}
          mission={activeChallenge.description}
          objectives={[
            `Research ${activeChallenge.targetName}`,
            'Gather open-source intelligence',
            'Analyze collected data',
            'Capture the flag',
          ]}
          isLocked={false}
          isCompleted={true}
          isActive={false}
          flagId="briefing"
          labId="osint"
          onFlagSubmit={async () => ({ correct: false })}
          onComplete={() => {}}
          skipFlag
        />

        <div className="rounded-2xl border border-border/30 bg-bg-card p-4 mb-2">
          <p className="text-sm font-black text-text-primary mb-1">Target: {activeChallenge.targetName}</p>
          <p className="text-sm text-text-muted font-mono">{activeChallenge.targetDescription}</p>
        </div>

        {activeChallenge.steps.map((step, index) => {
          const { isLocked, isCompleted, isActive } = getStepState(index);

          const narrative = index === 0 && activeChallenge.narrative
            ? `${activeChallenge.narrative}\n\n## OSINT Reconnaissance — Step ${index + 1}\n\nTool: ${step.tool}\n\n${step.explanation}\n\nExecute the command below to gather intelligence.`
            : `## OSINT Reconnaissance — Step ${index + 1}\n\nTool: ${step.tool}\n\n${step.explanation}\n\nExecute the command below to gather intelligence.`;

          return (
            <WalkthroughStep
              key={index}
              stepIndex={index + 1}
              title={`Step ${index + 1} — ${step.tool}`}
              narrative={narrative}
              commandInstruction={step.command}
              isLocked={isLocked}
              isCompleted={isCompleted}
              isActive={isActive}
              flagId={`${activeChallenge.id}-step-${index}`}
              labId="osint"
              onFlagSubmit={handleFlagSubmit}
              onComplete={() => {}}
            />
          );
        })}

        <WalkthroughStep
          stepIndex={activeChallenge.steps.length + 1}
          title="Mission Debrief"
          narrative={`## Mission Complete\n\nYou successfully gathered open-source intelligence on **${activeChallenge.targetName}**.\n\n### Key Takeaways\n\n- OSINT tools provide powerful reconnaissance capabilities\n- Public data can reveal sensitive information\n- Understanding OSINT is essential for both offense and defense\n- Always consider what your digital footprint reveals\n\n### What to Remember\n\nOSINT is a critical skill for security professionals. The same techniques used for reconnaissance can be used for defensive intelligence gathering.`}
          reflection={`What did you learn about OSINT reconnaissance? How could you use these techniques to improve an organization's security posture?`}
          isLocked={false}
          isCompleted={allDone}
          isActive={false}
          flagId="debrief"
          labId="osint"
          onFlagSubmit={async () => ({ correct: false })}
          onComplete={() => {}}
          skipFlag
        />
      </WalkthroughLayout>

      <LabCelebration
        trigger={allDone}
        title={activeChallenge.title}
        rewardCp={activeChallenge.cpReward}
      />
    </div>
  );
};

export default OsintLab;
