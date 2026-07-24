import { useState, useCallback, useMemo } from 'react';
import { Globe, CheckCircle } from 'lucide-react';
import { WalkthroughLayout, WalkthroughStep } from '@/shared/components/walkthrough/';
import { OSINT_CHALLENGES } from '@/features/student/data/simulations/osint-data';
import { createOsintSimulations } from '@/features/student/components/simulations/labSimulationContent';
import SEO from '@/shared/components/SEO';
import ScenarioCard from '@/shared/components/ScenarioCard';
import { verifyLabFlag } from '../../../services/lab.service';
import { getRelatedContentForLab } from '@/shared/constants/topicMap';
import RelatedContent from '@/shared/components/RelatedContent';
import LabHeroSection from '@/shared/components/LabHeroSection';


const DIFFICULTY_STYLES: Record<string, string> = {
  beginner: 'bg-green-400/10 text-green-400 border-green-400/20',
  intermediate: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
  advanced: 'bg-red-400/10 text-red-400 border-red-400/20',
};

const OsintLab = () => {
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [flagInput, setFlagInput] = useState('');
  const [flagStatus, setFlagStatus] = useState('idle');
  const [flagLoading, setFlagLoading] = useState(false);

  const startChallenge = useCallback((challenge) => {
    setActiveChallenge(challenge);
    setCompletedSteps(new Set());
    setFlagInput('');
    setFlagStatus('idle');
    setFlagLoading(false);
  }, []);

  const exitChallenge = useCallback(() => {
    setActiveChallenge(null);
    setCompletedSteps(new Set());
    setFlagInput('');
    setFlagStatus('idle');
    setFlagLoading(false);
  }, []);

  const handleStepComplete = useCallback((index) => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  }, []);

  const handleSubmitFlag = useCallback(async () => {
    if (!activeChallenge || !flagInput.trim() || flagLoading) return;
    setFlagLoading(true);
    try {
      const result = await verifyLabFlag('osint', activeChallenge.id, flagInput.trim());
      setFlagStatus(result.correct ? 'correct' : 'incorrect');
    } catch {
      setFlagStatus('incorrect');
    } finally {
      setFlagLoading(false);
    }
  }, [activeChallenge, flagInput, flagLoading]);

  const handleFlagSubmit = useCallback(async (_stepId: string, flag: string) => {
    if (!activeChallenge) return { correct: false };
    try {
      return await verifyLabFlag('osint', activeChallenge.id, flag);
    } catch {
      return { correct: false };
    }
  }, [activeChallenge]);

  const allStepsCompleted = activeChallenge && completedSteps.size >= activeChallenge.steps.length;

  const simulations = useMemo(
    () => activeChallenge ? createOsintSimulations(activeChallenge.targetName, activeChallenge.skills) : [],
    [activeChallenge],
  );

  if (!activeChallenge) {
    const firstChallengeWithVillain = OSINT_CHALLENGES.find(c => c.villain);
    return (
      <div className="bg-bg min-h-full">
        <SEO title="OSINT Recon Lab" description="Master open-source intelligence gathering techniques." noindex />

        <LabHeroSection
          icon={<Globe className="w-8 h-8 text-accent" />}
          title="OSINT Recon"
          accentWord="Challenge"
          description="Master open-source intelligence gathering with guided reconnaissance exercises."
          villain={firstChallengeWithVillain?.villain}
        />

        <div className="px-3 md:px-4 lg:px-6 pb-20 lg:pb-24 space-y-8">
          <div className="border-t border-border/30" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {OSINT_CHALLENGES.map((challenge) => (
              <ScenarioCard
                key={challenge.id}
                title={challenge.title}
                difficulty={challenge.difficulty}
                description={challenge.description}
                cpReward={challenge.cpReward}
                onStart={() => startChallenge(challenge)}
              />
            ))}
          </div>

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
        onBack={exitChallenge}
        completedCount={completedSteps.size}
        totalSteps={activeChallenge.steps.length}
        simulations={simulations}
      >
        <div className="rounded-2xl border border-border/30 bg-bg-card p-4 mb-2">
          <p className="text-sm font-black text-text-primary mb-1">🎯 Target: {activeChallenge.targetName}</p>
          <p className="text-sm text-text-muted font-mono">{activeChallenge.targetDescription}</p>
        </div>

        {activeChallenge.steps.map((step, index) => {
          const isCompleted = completedSteps.has(index);
          const firstIncomplete = activeChallenge.steps.findIndex((_: string, i: number) => !completedSteps.has(i));
          const isActive = index === firstIncomplete;
          const isLocked = !isCompleted && index > firstIncomplete;

          const emojis = ['🔎', '🌐', '📡', '🔍', '🕵️', '🏆'];
          const emoji = emojis[index % emojis.length];

          const narrative = index === 0 && activeChallenge.narrative
            ? `${activeChallenge.narrative}\n\n🔎 OSINT Reconnaissance — Step ${index + 1}\n\nTool: ${step.tool}\n\n${step.explanation}\n\nExecute the command below to gather intelligence.`
            : `${emoji} OSINT Reconnaissance — Step ${index + 1}\n\nTool: ${step.tool}\n\n${step.explanation}\n\nExecute the command below to gather intelligence.`;

          return (
            <WalkthroughStep
              key={index}
              stepIndex={index}
              title={`Step ${index + 1} — ${step.tool}`}
              narrative={narrative}
              commandInstruction={step.command}
              isLocked={isLocked}
              isCompleted={isCompleted}
              isActive={isActive}
              flagId={`${activeChallenge.id}-step-${index}`}
              labId="osint"
              onFlagSubmit={handleFlagSubmit}
              onComplete={() => handleStepComplete(index)}
            />
          );
        })}

        {flagStatus === 'correct' && (
          <div className="rounded-2xl border border-accent/30 bg-accent/5 p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
              <CheckCircle className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-lg font-black text-accent">Flag Captured!</p>
              <p className="text-sm font-mono text-text-muted mt-1">+{activeChallenge.cpReward} CP earned.</p>
              <button onClick={exitChallenge} className="btn-secondary !rounded-xl !text-[10px] mt-3 px-5 py-2">Back to Challenges</button>
            </div>
          </div>
        )}
      </WalkthroughLayout>
    </div>
  );
};

export default OsintLab;
