import { useState, useCallback } from 'react';
import { Shield } from 'lucide-react';
import SEO from '@/shared/components/SEO';
import ScenarioCard from '@/shared/components/ScenarioCard';
import { WalkthroughLayout } from '@/shared/components/walkthrough/WalkthroughLayout';
import { WalkthroughStep } from '@/shared/components/walkthrough/WalkthroughStep';
import { PRIVESC_SCENARIOS } from '@/features/student/data/simulations/privesc-scenarios';
import { SCENARIO_DIAGRAMS } from '@/shared/components/ScenarioDiagrams';
import type { PrivescScenario } from '@/features/student/data/simulations/types';
import { verifyLabFlag } from '../../../services/lab.service';
import { getRelatedContentForLab } from '@/shared/constants/topicMap';
import RelatedContent from '@/shared/components/RelatedContent';


const DIFFICULTY_STYLES: Record<string, string> = {
  beginner: 'bg-green-400/10 text-green-400 border-green-400/20',
  intermediate: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
  advanced: 'bg-red-400/10 text-red-400 border-red-400/20',
};

const PrivescLab = () => {
  const [selectedScenario, setSelectedScenario] =
    useState<PrivescScenario | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const chapters = selectedScenario?.story?.chapters ?? [];

  const handleComplete = useCallback((stepId: string) => {
    setCompletedSteps((prev) => new Set(prev).add(stepId));
  }, []);

  const handleFlagSubmit = useCallback(
    async (stepId: string, flag: string) => {
      if (!selectedScenario) return { correct: false };
      const result = await verifyLabFlag(
        'privesc',
        selectedScenario.id,
        flag
      );
      if (result.correct) handleComplete(stepId);
      return { correct: result.correct };
    },
    [selectedScenario, handleComplete]
  );

  const getStepState = useCallback(
    (index: number) => {
      const chapter = chapters[index];
      if (!chapter) return { isLocked: true, isCompleted: false, isActive: false };
      const isCompleted = completedSteps.has(chapter.id);
      const firstIncomplete = chapters.findIndex(
        (ch) => !completedSteps.has(ch.id)
      );
      const isActive = index === firstIncomplete;
      const isLocked = !isCompleted && !isActive;
      return { isLocked, isCompleted, isActive };
    },
    [chapters, completedSteps]
  );

  const allDone =
    chapters.length > 0 &&
    chapters.every((ch) => completedSteps.has(ch.id));

  if (!selectedScenario) {
    return (
      <div className="bg-bg min-h-full">
        <SEO
          title="Privilege Escalation Lab"
          description="Escalate privileges in simulated Linux environments."
        />
        <div className="mx-auto max-w-[1600px] px-4 md:px-12 lg:px-16 pt-8 pb-20 lg:pb-24">
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                <Shield className="w-7 h-7 text-accent" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tight">
                Privilege <span className="text-accent">Escalation</span>
              </h1>
            </div>
            <p className="text-base text-text-muted font-mono max-w-2xl">
              Escalate from low-privilege user to root using Linux
              misconfigurations.
            </p>
          </div>

          <div className="border-t border-border/30 mb-8" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {PRIVESC_SCENARIOS.map((scenario, i) => (
              <ScenarioCard
                key={scenario.id}
                index={i}
                title={scenario.title}
                difficulty={scenario.difficulty}
                description={scenario.technique}
                cpReward={50}
                accentColor="#FBBF24"
                diagramSvg={SCENARIO_DIAGRAMS[scenario.id]}
                onStart={() => {
                  setCompletedSteps(new Set());
                  setSelectedScenario(scenario);
                }}
              />
            ))}
          </div>

          <div className="mt-10">
            <RelatedContent {...getRelatedContentForLab('privesc')} title="Continue This Topic" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg min-h-full">
      <SEO
        title={`${selectedScenario.title} — Privilege Escalation`}
        description={selectedScenario.description}
      />
      <WalkthroughLayout
        title={selectedScenario.title}
        subtitle={selectedScenario.technique}
        icon={<Shield className="w-6 h-6" />}
        difficulty={selectedScenario.difficulty}
        difficultyColor={DIFFICULTY_STYLES[selectedScenario.difficulty]}
        labId="privesc"
        scenarioId={selectedScenario.id}
        onBack={() => {
          setCompletedSteps(new Set());
          setSelectedScenario(null);
        }}
        completedCount={completedSteps.size}
        totalSteps={chapters.length}
      >
        {chapters.map((chapter, i) => {
          const { isLocked, isCompleted, isActive } = getStepState(i);
          return (
            <WalkthroughStep
              key={chapter.id}
              stepIndex={i}
              title={chapter.title}
              narrative={chapter.narrative}
              hint={chapter.hint}
              commandInstruction={chapter.hint}
              isLocked={isLocked}
              isCompleted={isCompleted}
              isActive={isActive}
              flagId={chapter.id}
              labId="privesc"
              onFlagSubmit={handleFlagSubmit}
              onComplete={handleComplete}
            />
          );
        })}

        {allDone && (
          <div className="mt-6 rounded-xl border border-accent/20 bg-accent/5 p-6 text-center">
            <p className="text-sm font-black text-accent uppercase tracking-widest">
              Scenario Complete
            </p>
            <p className="text-sm font-mono text-text-muted mt-2">
              You escalated privileges and captured the flag.
            </p>
          </div>
        )}
      </WalkthroughLayout>
    </div>
  );
};

export default PrivescLab;
