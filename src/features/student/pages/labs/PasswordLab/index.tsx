import { useState, useCallback, useMemo } from 'react';
import { Key, CheckCircle } from 'lucide-react';
import { WalkthroughLayout, WalkthroughStep } from '@/shared/components/walkthrough/';
import { PASSWORD_EXERCISES } from '@/features/student/data/simulations/password-exercises';
import { createPasswordSimulations } from '@/features/student/components/simulations/labSimulationContent';
import SEO from '@/shared/components/SEO';
import ScenarioCard from '@/shared/components/ScenarioCard';
import { verifyLabFlag } from '../../../services/lab.service';
import { getRelatedContentForLab } from '@/shared/constants/topicMap';
import RelatedContent from '@/shared/components/RelatedContent';
import LabHeroSection from '@/shared/components/LabHeroSection';
import { FlowDiagram, type FlowNode, type FlowArrow } from '@/shared/components/diagrams/FlowDiagram';


const DIFFICULTY_STYLES: Record<string, string> = {
  beginner: 'bg-green-400/10 text-green-400 border-green-400/20',
  intermediate: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
  advanced: 'bg-red-400/10 text-red-400 border-red-400/20',
};

const HASH_CRACKING_NODES: FlowNode[] = [
  { id: 'hash', label: 'Hash File', icon: '\u{1F4C4}', status: 'warning' },
  { id: 'identify', label: 'Identify Type', icon: '\u{1F50D}', status: 'active' },
  { id: 'attack', label: 'Dictionary', icon: '\u{26A1}', status: 'danger' },
  { id: 'result', label: 'Plaintext', icon: '\u{1F513}', status: 'success' },
];
const HASH_CRACKING_ARROWS: FlowArrow[] = [
  { from: 'hash', to: 'identify', type: 'solid' },
  { from: 'identify', to: 'attack', type: 'solid' },
  { from: 'attack', to: 'result', type: 'solid' },
];

const ITERATION_NODES: FlowNode[] = [
  { id: 'wordlist', label: 'Wordlist', icon: '\u{1F4D6}', status: 'default' },
  { id: 'hashfn', label: 'Hash Function', icon: '\u{2699}\u{FE0F}', status: 'active' },
  { id: 'compare', label: 'Compare', icon: '\u{2696}\u{FE0F}', status: 'warning' },
  { id: 'match', label: 'Match', icon: '\u{1F3AF}', status: 'success' },
];
const ITERATION_ARROWS: FlowArrow[] = [
  { from: 'wordlist', to: 'hashfn', type: 'solid' },
  { from: 'hashfn', to: 'compare', type: 'solid' },
  { from: 'compare', to: 'match', type: 'dashed' },
];

const HARVEST_NODES: FlowNode[] = [
  { id: 'cracked', label: 'Cracked', icon: '\u{1F480}', status: 'danger' },
  { id: 'plain', label: 'Plaintext', icon: '\u{1F4DD}', status: 'active' },
  { id: 'harvest', label: 'Harvest', icon: '\u{1F3C6}', status: 'success' },
];
const HARVEST_ARROWS: FlowArrow[] = [
  { from: 'cracked', to: 'plain', type: 'solid' },
  { from: 'plain', to: 'harvest', type: 'solid' },
];

const PASSWORD_FLOWS: { nodes: FlowNode[]; arrows: FlowArrow[] }[] = [
  { nodes: HASH_CRACKING_NODES, arrows: HASH_CRACKING_ARROWS },
  { nodes: ITERATION_NODES, arrows: ITERATION_ARROWS },
  { nodes: HARVEST_NODES, arrows: HARVEST_ARROWS },
  { nodes: HASH_CRACKING_NODES, arrows: HASH_CRACKING_ARROWS },
  { nodes: HARVEST_NODES, arrows: HARVEST_ARROWS },
];

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
    const firstScenarioWithVillain = PASSWORD_EXERCISES.find(s => s.villain);
    return (
      <div className="bg-bg min-h-full">
        <SEO title="Password Cracking Lab" description="Crack password hashes using John the Ripper and Hashcat." noindex />

        <LabHeroSection
          icon={<Key className="w-8 h-8 text-accent" />}
          title="Password"
          accentWord="Cracking"
          description="Extract and crack password hashes using John the Ripper and Hashcat."
          villain={firstScenarioWithVillain?.villain}
        />

        <div className="px-3 md:px-4 lg:px-6 pb-20 lg:pb-24 space-y-8">
          <div className="border-t border-border/30" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {PASSWORD_EXERCISES.map((scenario) => (
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

          <RelatedContent {...getRelatedContentForLab('passwords')} title="Continue This Topic" />
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
            `\u{1F511} Initialize your cracking session.\n\nBefore attacking, we identify the hash type and prepare our toolchain. Different hashes require different approaches.\n\nFollow the command below to prepare your environment.`,
            `\u{26A1} Launch the cracking attack.\n\nJohn the Ripper iterates through password candidates, hashing each one and comparing against the target hash.\n\nExecute the command below to begin cracking.`,
            `\u{1F3AF} Extract and analyze results.\n\nOnce cracks are found, retrieve the plaintext passwords from the output. These credentials are your foothold into the target system.\n\nRun the command below to view your results.`,
            `\u{1F480} Advanced cracking techniques.\n\nIf standard dictionary attacks fail, we escalate to rule-based mutations and incremental mode.\n\nApply advanced techniques with the command below.`,
            `\u{1F3C6} Final credential extraction.\n\nCompile all cracked passwords and verify them against the target. The flag is embedded within the recovered credential data.\n\nExecute the final command to complete the exercise.`,
          ];

          const flow = PASSWORD_FLOWS[index % PASSWORD_FLOWS.length];

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
            >
              <FlowDiagram nodes={flow.nodes} arrows={flow.arrows} direction="horizontal" />
            </WalkthroughStep>
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
