import { useState, useCallback } from 'react';
import { Shield } from 'lucide-react';
import SEO from '@/shared/components/SEO';
import { WalkthroughLayout } from '@/shared/components/walkthrough/WalkthroughLayout';
import { WalkthroughStep } from '@/shared/components/walkthrough/WalkthroughStep';
import { PRIVESC_SCENARIOS } from '@/features/student/data/simulations/privesc-scenarios';
import type { PrivescScenario } from '@/features/student/data/simulations/types';
import { verifyLabFlag } from '../../../services/lab.service';

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
        <div className="mx-auto max-w-[1600px] px-4 md:px-6 lg:px-8 pt-8 pb-20 lg:pb-24">
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

          <div className="space-y-3">
            {PRIVESC_SCENARIOS.map((scenario, i) => (
              <button
                key={scenario.id}
                onClick={() => {
                  setCompletedSteps(new Set());
                  setSelectedScenario(scenario);
                }}
                className="group w-full text-left rounded-xl border border-border/30 bg-bg-card px-5 py-4 hover:border-accent/30 transition-all duration-300 flex items-center gap-4"
              >
                <span className="text-xs font-black text-text-muted group-hover:text-accent transition-colors w-6">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-black text-text-primary group-hover:text-accent transition-colors">
                      {scenario.title}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${DIFFICULTY_STYLES[scenario.difficulty]}`}
                    >
                      {scenario.difficulty}
                    </span>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-accent/60 mt-1">
                    {scenario.technique}
                  </p>
                </div>
              </button>
            ))}
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
