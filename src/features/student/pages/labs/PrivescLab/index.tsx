import { useState, useCallback, useMemo } from 'react';
import { Shield } from 'lucide-react';
import SEO from '@/shared/components/SEO';
import ScenarioCard from '@/shared/components/ScenarioCard';
import { WalkthroughLayout } from '@/shared/components/walkthrough/WalkthroughLayout';
import { WalkthroughStep } from '@/shared/components/walkthrough/WalkthroughStep';
import { PRIVESC_SCENARIOS } from '@/features/student/data/simulations/privesc-scenarios';
import { createPrivescSimulations } from '@/features/student/components/simulations/labSimulationContent';
import type { PrivescScenario } from '@/features/student/data/simulations/types';
import { verifyLabFlag } from '../../../services/lab.service';
import { getRelatedContentForLab } from '@/shared/constants/topicMap';
import RelatedContent from '@/shared/components/RelatedContent';
import LabHeroSection from '@/shared/components/LabHeroSection';


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
      const isLocked = !isCompleted && index > firstIncomplete;
      return { isLocked, isCompleted, isActive };
    },
    [chapters, completedSteps]
  );

  const allDone =
    chapters.length > 0 &&
    chapters.every((ch) => completedSteps.has(ch.id));

  const simulations = useMemo(
    () => selectedScenario ? createPrivescSimulations(selectedScenario.filesystem) : [],
    [selectedScenario],
  );

  if (!selectedScenario) {
    const firstScenarioWithVillain = PRIVESC_SCENARIOS.find(s => s.villain);
    return (
      <div className="bg-bg min-h-full">
        <SEO
          title="Privilege Escalation Lab"
          description="Escalate privileges in simulated Linux environments."
          noindex
        />

        <LabHeroSection
          icon={<Shield className="w-8 h-8 text-accent" />}
          title="Privilege"
          accentWord="Escalation"
          description="Escalate from low-privilege user to root using Linux misconfigurations."
          villain={firstScenarioWithVillain?.villain}
        />

        <div className="px-3 md:px-4 lg:px-6 pb-20 lg:pb-24 space-y-8">
          <div className="border-t border-border/30" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {PRIVESC_SCENARIOS.map((scenario) => (
              <ScenarioCard
                key={scenario.id}
                title={scenario.title}
                difficulty={scenario.difficulty}
                description={scenario.technique}
                cpReward={50}
                onStart={() => {
                  setCompletedSteps(new Set());
                  setSelectedScenario(scenario);
                }}
              />
            ))}
          </div>

          <RelatedContent {...getRelatedContentForLab('privesc')} title="Continue This Topic" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg min-h-full">
      <SEO
        title={`${selectedScenario.title} — Privilege Escalation`}
        description={selectedScenario.description}
        noindex
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
        simulations={simulations}
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
