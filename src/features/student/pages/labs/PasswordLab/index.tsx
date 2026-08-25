import { Key, CheckCircle, FileText, Search, Zap, KeyRound, Book, Settings, Scale, Target, Skull, NotebookPen, Trophy } from 'lucide-react';
import { WalkthroughLayout, WalkthroughStep } from '@/shared/components/walkthrough/';
import { PASSWORD_EXERCISES } from '@/features/student/data/simulations';
import SEO from '@/shared/components/SEO';
import LearningAccordion from '@/shared/components/learning/LearningAccordion';
import { getRelatedContentForLab } from '@/shared/constants/topicMap';
import RelatedContent from '@/shared/components/RelatedContent';
import StudentHeroSection from '@/shared/components/StudentHeroSection';
import { FlowDiagram, type FlowNode, type FlowArrow } from '@/shared/components/diagrams/FlowDiagram';
import { LabCelebration } from '@/shared/components/LabCelebration';
import useLabAccess from '@/features/student/hooks/useLabAccess';
import useLabScenario from '@/features/student/hooks/useLabScenario';
import { getLabCpCost } from '@/features/student/data/simulations/labAccess';

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

type PasswordExercise = typeof PASSWORD_EXERCISES[number];

const PasswordLab = () => {
  const { activeScenario, completedSteps, handleFlagSubmit, getStepState, allDone, startScenario, exitScenario } =
    useLabScenario<PasswordExercise>({
      labId: 'passwords',
      getScenarioId: (s) => s.id,
      getStepIds: (s) => s.steps.map((_, i) => `${s.id}-step-${i}`),
    });
  const { isLocked, purchaseLab } = useLabAccess();

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

          <LearningAccordion
            items={PASSWORD_EXERCISES.map((scenario) => {
              const cpCost = getLabCpCost(scenario.id);
              const locked = isLocked(scenario.id);
              return {
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
                locked,
                cpCost: locked ? cpCost ?? undefined : undefined,
                onUnlock: cpCost ? async () => {
                  const success = await purchaseLab(scenario.id, 'passwords');
                  if (success) startScenario(scenario);
                } : undefined,
              };
            })}
          />

          <RelatedContent {...getRelatedContentForLab('passwords')} title="Continue This Topic" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg min-h-full">
      <SEO title={`${activeScenario.title}. Password Lab`} description={activeScenario.description} noindex />
      <WalkthroughLayout
        title={activeScenario.title}
        subtitle={`${activeScenario.hashType} | ${activeScenario.description}`}
        icon={<Key className="w-6 h-6" />}
        difficulty={activeScenario.difficulty}
        labId="passwords"
        scenarioId={activeScenario.id}
        onBack={exitScenario}
        completedCount={completedSteps.size}
        totalSteps={activeScenario.steps.length + 2}
      >
        <WalkthroughStep
          stepIndex={0}
          title="Mission Briefing"
          narrative={`## ${activeScenario.title}\n\n${activeScenario.description}\n\n**Hash Type:** ${activeScenario.hashType}\n\n**Wordlist:** ${activeScenario.wordlist}`}
          mission={activeScenario.description}
          objectives={[
            `Identify the ${activeScenario.hashType} hash type`,
            'Select the appropriate cracking tool',
            'Recover the plaintext password',
            'Capture the flag',
          ]}
          isLocked={false}
          isCompleted={true}
          isActive={false}
          flagId="briefing"
          labId="passwords"
          onFlagSubmit={async () => ({ correct: false })}
          onComplete={() => {}}
          skipFlag
        />

        {activeScenario.steps.map((step, index) => {
          const { isLocked, isCompleted, isActive } = getStepState(index);

          const narratives = [
            `## Prepare the Attack Environment

Before we run a single crack, we identify the hash type and prepare our toolchain. Different hashes are handled by different Hashcat modes, so getting this right determines whether the attack finishes in seconds or never finds a match.

Start by writing the captured hash to a file and confirming it is intact. A single mistyped character changes the hash completely, and the cracking tool silently wastes hours hunting for a plaintext that can never match.`,
            `## Launch the Attack

John the Ripper and Hashcat both work by iterating through password candidates, hashing each one, and comparing the result against the target hash. A dictionary attack feeds candidates from a wordlist such as \`rockyou.txt\`; a brute-force or rule-based attack mutates them on the fly.

Execute the command below to begin cracking. Keep the output in mind, the tools report status, speed, and any recoveries in real time.`,
            `## Extract and Analyze Results

Once a password is recovered, we retrieve the plaintext from the tool's output. This is your foothold into the target system, so record it carefully, it is usually reused across other accounts and services.

Run the command below to view your results. The \`--show\` flag replays previously cracked hashes without re-running the attack, which is the fastest way to confirm what we already recovered.`,
            `## Escalate the Attack

If a standard dictionary attack comes up empty, we escalate to rule-based mutations and incremental mode. Rule-based attacks take every word in the wordlist and apply transformations: appending digits, swapping letters, capitalizing, mirroring how real users build "strong" passwords.

Apply advanced techniques with the command below. This is where attacker patience pays off: the weak hash types fall in seconds, but the stronger ones reward a targeted, rules-driven approach.`,
            `## Recover the Credential

Compile all cracked passwords and verify them against the target system. The flag is embedded within the recovered credential data, proof that the account belongs to you now.

Execute the final command to complete the exercise.`,
          ];

          const flow = PASSWORD_FLOWS[index % PASSWORD_FLOWS.length];

          return (
            <WalkthroughStep
              key={index}
              stepIndex={index + 1}
              title={`Step ${index + 1}`}
              narrative={narratives[index % narratives.length]}
              commandInstruction={step}
              isLocked={isLocked}
              isCompleted={isCompleted}
              isActive={isActive}
              flagId={`${activeScenario.id}-step-${index}`}
              labId="passwords"
              onFlagSubmit={handleFlagSubmit}
              onComplete={() => {}}
            >
              <FlowDiagram nodes={flow.nodes} arrows={flow.arrows} direction="horizontal" />
            </WalkthroughStep>
          );
        })}

        <WalkthroughStep
          stepIndex={activeScenario.steps.length + 1}
          title="Mission Debrief"
          narrative={`## Exercise Complete\n\nYou successfully cracked the **${activeScenario.hashType}** hash and recovered the plaintext password.\n\n### Key Takeaways\n\n- **${activeScenario.hashType}** hashes are vulnerable to dictionary and rule-based attacks\n- Weak passwords fall quickly to modern cracking tools\n- Password complexity and length are critical for defense\n- Organizations should enforce strong password policies\n\n### What to Remember\n\nPassword cracking is a fundamental skill for penetration testers and security auditors. Understanding the attack helps build better defenses.`}
          reflection={`What did you learn about ${activeScenario.hashType} hash cracking? How would you improve password security in an organization?`}
          isLocked={false}
          isCompleted={allDone}
          isActive={false}
          flagId="debrief"
          labId="passwords"
          onFlagSubmit={async () => ({ correct: false })}
          onComplete={() => {}}
          skipFlag
        />
      </WalkthroughLayout>

      <LabCelebration
        trigger={allDone}
        title={activeScenario.title}
        rewardCp={activeScenario.cpReward}
      />
    </div>
  );
};

export default PasswordLab;
