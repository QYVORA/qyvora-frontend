import { useState, useCallback, useMemo } from 'react';
import { Key, ArrowLeft, CheckCircle, AlertTriangle, Flag, Terminal } from 'lucide-react';
import { WalkthroughLayout, WalkthroughStep } from '@/shared/components/walkthrough/';
import { LabConnectButton } from '@/features/student/components/lab/LabConnectButton';
import { PASSWORD_EXERCISES } from '@/features/student/data/simulations/password-exercises';
import { createPasswordSimulations } from '@/features/student/components/simulations/labSimulationContent';
import SEO from '@/shared/components/SEO';
import ScenarioCard from '@/shared/components/ScenarioCard';
import { verifyLabFlag } from '../../../services/lab.service';
import { getRelatedContentForLab } from '@/shared/constants/topicMap';
import RelatedContent from '@/shared/components/RelatedContent';


const DIFFICULTY_STYLES: Record<string, string> = {
  beginner: 'bg-green-400/10 text-green-400 border-green-400/20',
  intermediate: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
  advanced: 'bg-red-400/10 text-red-400 border-red-400/20',
};

const PasswordLab = () => {
  const [activeScenario, setActiveScenario] = useState(null);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [flagInput, setFlagInput] = useState('');
  const [flagStatus, setFlagStatus] = useState('idle');
  const [flagLoading, setFlagLoading] = useState(false);

  const startScenario = useCallback((scenario) => {
    setActiveScenario(scenario);
    setCompletedSteps(new Set());
    setFlagInput('');
    setFlagStatus('idle');
    setFlagLoading(false);
  }, []);

  const exitScenario = useCallback(() => {
    setActiveScenario(null);
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
    if (!activeScenario || !flagInput.trim() || flagLoading) return;
    setFlagLoading(true);
    try {
      const result = await verifyLabFlag('passwords', activeScenario.id, flagInput.trim());
      setFlagStatus(result.correct ? 'correct' : 'incorrect');
    } catch {
      setFlagStatus('incorrect');
    } finally {
      setFlagLoading(false);
    }
  }, [activeScenario, flagInput, flagLoading]);

  const allStepsCompleted = activeScenario && completedSteps.size >= activeScenario.steps.length;

  const handleFlagSubmit = useCallback(async (_stepId: string, flag: string) => {
    if (!activeScenario) return { correct: false };
    try {
      return await verifyLabFlag('passwords', activeScenario.id, flag);
    } catch {
      return { correct: false };
    }
  }, [activeScenario]);

  const simulations = useMemo(
    () => activeScenario ? createPasswordSimulations(activeScenario.hashContent, activeScenario.hashType, ['password', '123456', 'admin', 'letmein', 'qwerty', 'test', 'guest', 'master', 'dragon', 'login']) : [],
    [activeScenario],
  );

  if (!activeScenario) {
    return (
      <div className="bg-bg min-h-full">
        <SEO title="Password Cracking Lab" description="Crack password hashes using John the Ripper and Hashcat." noindex />
        <div className=" px-3 md:px-4 lg:px-6 pt-8 pb-20 lg:pb-24">
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                <Key className="w-7 h-7 text-accent" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tight">
                Password <span className="text-accent">Cracking</span>
              </h1>
            </div>
            <p className="text-base text-text-muted font-mono max-w-2xl">
              Extract and crack password hashes using John the Ripper and Hashcat.
            </p>
          </div>

          <div className="border-t border-border/30 mb-10" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {PASSWORD_EXERCISES.map((scenario, index) => (
              <ScenarioCard
                key={scenario.id}
                title={scenario.title}
                difficulty={scenario.difficulty}
                description={scenario.description}
                cpReward={scenario.cpReward}
                subtitle={scenario.hashType}
                onStart={() => startScenario(scenario)}
              />
            ))}
          </div>

          <div className="mt-10"><RelatedContent {...getRelatedContentForLab('passwords')} title="Continue This Topic" /></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg min-h-full">
      <SEO title={`${activeScenario.title} — Password Lab`} description={activeScenario.description} noindex />
      <WalkthroughLayout
        title={activeScenario.title}
        subtitle={`${activeScenario.hashType} — ${activeScenario.description}`}
        icon={<Key className="w-6 h-6" />}
        difficulty={activeScenario.difficulty}
        labId="passwords"
        scenarioId={activeScenario.id}
        onBack={exitScenario}
        completedCount={completedSteps.size}
        totalSteps={activeScenario.steps.length}
        simulations={simulations}
      >
        {activeScenario.steps.map((step, index) => {
          const isCompleted = completedSteps.has(index);
          const firstIncomplete = activeScenario.steps.findIndex((_: string, i: number) => !completedSteps.has(i));
          const isActive = index === firstIncomplete;
          const isLocked = !isCompleted && index > firstIncomplete;

          const narratives = [
            `🔑 Initialize your cracking session.\n\nBefore attacking, we identify the hash type and prepare our toolchain. Different hashes require different approaches:\n\n  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐\n  │  Hash File   │────▶│  Identify    │────▶│  Select Tool │\n  │  (input.txt) │     │  Hash Type   │     │  (john)      │\n  └──────────────┘     └──────────────┘     └──────────────┘\n\nFollow the command below to prepare your environment.`,
            `⚡ Launch the cracking attack.\n\nJohn the Ripper iterates through password candidates, hashing each one and comparing against the target hash:\n\n  Password Candidates ──▶ Hash Function ──▶ Compare ──▶ Match?\n       (wordlist)          (MD5/SHA)        (target hash)\n\nExecute the command below to begin cracking.`,
            `🎯 Extract and analyze results.\n\nOnce cracks are found, retrieve the plaintext passwords from the output. These credentials are your foothold into the target system.\n\n  Cracked Hashes ──▶ Plaintext ──▶ Credential Harvest\n\nRun the command below to view your results.`,
            `💀 Advanced cracking techniques.\n\nIf standard dictionary attacks fail, we escalate to rule-based mutations and incremental mode. This遍历 password patterns systematically.\n\n  Rules ──▶ Wordlist Mutations ──▶ New Candidates\n  Aa1 → Aa1! → Aa1@ → ...\n\nApply advanced techniques with the command below.`,
            `🏆 Final credential extraction.\n\nCompile all cracked passwords and verify them against the target. The flag is embedded within the recovered credential data.\n\n  ┌──────────┐     ┌──────────┐     ┌──────────┐\n  │  Cracked  │────▶│  Verify  │────▶│  Extract │\n  │  List     │     │  Access  │     │  Flag    │\n  └──────────┘     └──────────┘     └──────────┘\n\nExecute the final command to complete the exercise.`,
          ];

          return (
            <WalkthroughStep
              key={index}
              stepIndex={index}
              title={`Step ${index + 1}`}
              narrative={narratives[index % narratives.length]}
              commandInstruction={step}
              isLocked={isLocked}
              isCompleted={isCompleted}
              isActive={isActive}
              flagId={`${activeScenario.id}-step-${index}`}
              labId="passwords"
              onFlagSubmit={handleFlagSubmit}
              onComplete={() => handleStepComplete(index)}
            />
          );
        })}

        {flagStatus === 'correct' && (
          <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
              <CheckCircle className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-lg font-black text-accent">Flag Captured!</p>
              <p className="text-sm font-mono text-text-muted mt-1">
                You earned {activeScenario.cpReward} CP for completing this exercise.
              </p>
              <button onClick={exitScenario} className="btn-secondary !rounded-xl !text-[10px] mt-3 px-5 py-2">
                Back to Exercises
              </button>
            </div>
          </div>
        )}
      </WalkthroughLayout>
    </div>
  );
};

export default PasswordLab;
