import { useState, useCallback, useMemo } from 'react';
import { Key, CheckCircle, FileText, Search, Zap, KeyRound, Book, Settings, Scale, Target, Skull, NotebookPen, Trophy } from 'lucide-react';
import { WalkthroughLayout, WalkthroughStep } from '@/shared/components/walkthrough/';
import { PASSWORD_EXERCISES } from '@/features/student/data/simulations';
import { createPasswordSimulations } from '@/features/student/components/simulations/labSimulationContent';
import SEO from '@/shared/components/SEO';
import LearningAccordion from '@/shared/components/learning/LearningAccordion';
import { verifyLabFlag } from '../../../services/lab.service';
import { getRelatedContentForLab } from '@/shared/constants/topicMap';
import RelatedContent from '@/shared/components/RelatedContent';
import StudentHeroSection from '@/shared/components/StudentHeroSection';
import { FlowDiagram, type FlowNode, type FlowArrow } from '@/shared/components/diagrams/FlowDiagram';

const HASH_CRACKING_NODES: FlowNode[] = [
  { id: 'hash', label: 'Hash File', icon: <FileText className="w-4 h-4" />, status: 'warning' },
  { id: 'identify', label: 'Identify Type', icon: <Search className="w-4 h-4" />, status: 'active' },
  { id: 'attack', label: 'Dictionary', icon: <Zap className="w-4 h-4" />, status: 'danger' },
  { id: 'result', label: 'Plaintext', icon: <KeyRound className="w-4 h-4" />, status: 'success' },
];
const HASH_CRACKING_ARROWS: FlowArrow[] = [
  { from: 'hash', to: 'identify', type: 'solid' },
  { from: 'identify', to: 'attack', type: 'solid' },
  { from: 'attack', to: 'result', type: 'solid' },
];

const ITERATION_NODES: FlowNode[] = [
  { id: 'wordlist', label: 'Wordlist', icon: <Book className="w-4 h-4" />, status: 'default' },
  { id: 'hashfn', label: 'Hash Function', icon: <Settings className="w-4 h-4" />, status: 'active' },
  { id: 'compare', label: 'Compare', icon: <Scale className="w-4 h-4" />, status: 'warning' },
  { id: 'match', label: 'Match', icon: <Target className="w-4 h-4" />, status: 'success' },
];
const ITERATION_ARROWS: FlowArrow[] = [
  { from: 'wordlist', to: 'hashfn', type: 'solid' },
  { from: 'hashfn', to: 'compare', type: 'solid' },
  { from: 'compare', to: 'match', type: 'dashed' },
];

const HARVEST_NODES: FlowNode[] = [
  { id: 'cracked', label: 'Cracked', icon: <Skull className="w-4 h-4" />, status: 'danger' },
  { id: 'plain', label: 'Plaintext', icon: <NotebookPen className="w-4 h-4" />, status: 'active' },
  { id: 'harvest', label: 'Harvest', icon: <Trophy className="w-4 h-4" />, status: 'success' },
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

        <StudentHeroSection
          fullHeight={false}
          title="Password"
          accentWord="Cracking"
          description="Extract and crack password hashes using John the Ripper and Hashcat."
          villain={firstScenarioWithVillain?.villain}
        />

        <div className="px-3 md:px-4 lg:px-6 pb-20 lg:pb-24 space-y-8">
          <div className="border-t border-border/30" />

          <LearningAccordion
            items={PASSWORD_EXERCISES.map((scenario) => ({
              id: scenario.id,
              title: scenario.title,
              subtitle: scenario.hashType,
              description: scenario.description,
              difficulty: scenario.difficulty,
              meta: (
                <span className="text-[9px] font-black uppercase tracking-widest text-accent">
                  {scenario.cpReward} CP
                </span>
              ),
              onStart: () => startScenario(scenario),
              startLabel: 'Start Attack',
            }))}
          />

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
            `## Prepare the Attack Environment

Before we run a single crack, we identify the hash type and prepare our toolchain. Different hashes are handled by different Hashcat modes, so getting this right determines whether the attack finishes in seconds or never finds a match.

Start by writing the captured hash to a file and confirming it is intact. A single mistyped character changes the hash completely, and the cracking tool silently wastes hours hunting for a plaintext that can never match.`,
            `## Launch the Attack

John the Ripper and Hashcat both work by iterating through password candidates, hashing each one, and comparing the result against the target hash. A dictionary attack feeds candidates from a wordlist such as \`rockyou.txt\`; a brute-force or rule-based attack mutates them on the fly.

Execute the command below to begin cracking. Keep the output in mind — the tools report status, speed, and any recoveries in real time.`,
            `## Extract and Analyze Results

Once a password is recovered, we retrieve the plaintext from the tool's output. This is your foothold into the target system, so record it carefully — it is usually reused across other accounts and services.

Run the command below to view your results. The \`--show\` flag replays previously cracked hashes without re-running the attack, which is the fastest way to confirm what we already recovered.`,
            `## Escalate the Attack

If a standard dictionary attack comes up empty, we escalate to rule-based mutations and incremental mode. Rule-based attacks take every word in the wordlist and apply transformations — appending digits, swapping letters, capitalizing — mirroring how real users build "strong" passwords.

Apply advanced techniques with the command below. This is where attacker patience pays off: the weak hash types fall in seconds, but the stronger ones reward a targeted, rules-driven approach.`,
            `## Recover the Credential

Compile all cracked passwords and verify them against the target system. The flag is embedded within the recovered credential data — proof that the account belongs to you now.

Execute the final command to complete the exercise.`,
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
          <div className="rounded-2xl border border-accent/30 bg-accent/5 p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
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
