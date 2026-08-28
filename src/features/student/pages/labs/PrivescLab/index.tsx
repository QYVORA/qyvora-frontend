import { Shield, User, Folder, Cog, Crown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LearningAccordion from '@/shared/components/learning/LearningAccordion';
import LabPage from '@/shared/components/learning/LabPage';
import { WalkthroughLayout } from '@/shared/components/walkthrough/WalkthroughLayout';
import { WalkthroughStep } from '@/shared/components/walkthrough/WalkthroughStep';
import { PRIVESC_SCENARIOS } from '@/features/student/data/simulations';
import type { PrivescScenario } from '@/features/student/data/simulations';
import { getRelatedContentForLab } from '@/shared/constants/topicMap';
import RelatedContent from '@/shared/components/RelatedContent';
import { FlowDiagram } from '@/shared/components/diagrams/FlowDiagram';
import { LabListingSkeleton } from '@/features/student/components/StudentSkeletons';
import useLabAccess from '@/features/student/hooks/useLabAccess';
import useLabScenario from '@/features/student/hooks/useLabScenario';
import { getLabCpCost } from '@/features/student/data/simulations/labAccess';

const DIFFICULTY_STYLES: Record<string, string> = {
  beginner: 'bg-success/10 text-success border-success/20',
  intermediate: 'bg-warning/10 text-warning border-warning/20',
  advanced: 'bg-danger/10 text-danger border-danger/20',
};

const PRIVESC_FLOW_NODES = [
  { id: 'you', label: 'You', icon: <User className="w-4 h-4" />, status: 'active' as const },
  { id: 'filesystem', label: 'Filesystem', icon: <Folder className="w-4 h-4" />, status: 'default' as const },
  { id: 'suid', label: 'SUID Binary', icon: <Cog className="w-4 h-4" />, status: 'warning' as const },
  { id: 'root', label: 'Root', icon: <Crown className="w-4 h-4" />, status: 'success' as const },
];

const PRIVESC_FLOW_ARROWS = [
  { from: 'you', to: 'filesystem', label: 'ls', type: 'solid' as const },
  { from: 'filesystem', to: 'suid', label: 'identify', type: 'dashed' as const },
  { from: 'suid', to: 'root', label: 'exploit', type: 'solid' as const },
];

const PrivescLab = () => {
  const { t } = useTranslation();
  const { activeScenario, completedSteps, handleComplete, handleFlagSubmit, getStepState, allDone, startScenario, exitScenario } =
    useLabScenario<PrivescScenario>({
      labId: 'privesc',
      getScenarioId: (s) => s.id,
      getStepIds: (s) => (s.story?.chapters ?? []).map((ch) => ch.id),
    });
  const { isLocked, purchaseLab, loading } = useLabAccess();

  const chapters = activeScenario?.story?.chapters ?? [];
  const firstScenarioWithVillain = PRIVESC_SCENARIOS.find(s => s.villain);

  if (loading) return <LabListingSkeleton />;

  return (
    <LabPage
      title="Privilege"
      accentWord="Escalation"
      description="Escalate from low-privilege user to root using Linux misconfigurations."
      villain={firstScenarioWithVillain?.villain}
      activeScenario={activeScenario}
      celebrationShow={allDone}
      celebrationTitle={activeScenario?.title || ''}
      celebrationCp={50}
      listingContent={
        <LearningAccordion
          items={PRIVESC_SCENARIOS.map((scenario) => {
            const cpCost = getLabCpCost(scenario.id);
            const locked = isLocked(scenario.id);
            return {
              id: scenario.id,
              title: scenario.title,
              subtitle: scenario.technique,
              description: scenario.description,
              difficulty: scenario.difficulty,
              meta: (
                <span className="text-[9px] font-black uppercase tracking-widest text-accent">
                  {cpCost ? `${cpCost} CP` : '50 CP'}
                </span>
              ),
              onStart: () => {
                startScenario(scenario);
              },
              startLabel: t('labs.enterRoom', 'Enter Room'),
              locked,
              cpCost: locked ? cpCost ?? undefined : undefined,
              onUnlock: cpCost ? async () => {
                const success = await purchaseLab(scenario.id, 'privesc');
                if (success) {
                  startScenario(scenario);
                }
              } : undefined,
            };
          })}
        />
      }
      relatedContent={<RelatedContent {...getRelatedContentForLab('privesc')} title="Continue This Topic" />}
      walkthroughContent={
        activeScenario ? (
          <WalkthroughLayout
            title={activeScenario.title}
            subtitle={activeScenario.technique}
            icon={<Shield className="w-6 h-6" />}
            difficulty={activeScenario.difficulty}
            difficultyColor={DIFFICULTY_STYLES[activeScenario.difficulty]}
            labId="privesc"
            scenarioId={activeScenario.id}
            onBack={exitScenario}
            completedCount={completedSteps.size}
            totalSteps={chapters.length + 2}
          >
            <WalkthroughStep
              stepIndex={0}
              title="Mission Briefing"
              narrative={`## ${activeScenario.title}\n\n${activeScenario.description}\n\n**Technique:** ${activeScenario.technique}\n\n**Difficulty:** ${activeScenario.difficulty.charAt(0).toUpperCase() + activeScenario.difficulty.slice(1)}`}
              mission={activeScenario.description}
              objectives={[
                `Understand the ${activeScenario.technique} technique`,
                'Identify the vulnerable configuration',
                'Escalate privileges to root',
                'Capture the flag',
              ]}
              isLocked={false}
              isCompleted={true}
              isActive={false}
              flagId="briefing"
              labId="privesc"
              onFlagSubmit={async () => ({ correct: false })}
              onComplete={() => {}}
              skipFlag
            />

            {chapters.map((chapter, i) => {
              const { isLocked, isCompleted, isActive } = getStepState(i);
              return (
                <WalkthroughStep
                  key={chapter.id}
                  stepIndex={i + 1}
                  title={chapter.title}
                  narrative={chapter.narrative}
                  hint={chapter.hint}
                  commandInstruction={chapter.hint}
                  quiz={chapter.quiz}
                  isLocked={isLocked}
                  isCompleted={isCompleted}
                  isActive={isActive}
                  flagId={chapter.id}
                  labId="privesc"
                  onFlagSubmit={handleFlagSubmit}
                  onComplete={handleComplete}
                >
                  {i === 0 && (
                    <FlowDiagram
                      nodes={PRIVESC_FLOW_NODES}
                      arrows={PRIVESC_FLOW_ARROWS}
                      direction="horizontal"
                    />
                  )}
                </WalkthroughStep>
              );
            })}

            <WalkthroughStep
              stepIndex={chapters.length + 1}
              title="Mission Debrief"
              narrative={`## Mission Complete\n\nYou successfully exploited the **${activeScenario.technique}** vulnerability to escalate from a low-privilege user to root.\n\n### Key Takeaways\n\n- **${activeScenario.technique}** is a common privilege escalation vector\n- Always audit SUID binaries and their configurations\n- Understanding the underlying technique is critical for both attack and defense\n\n### What to Remember\n\nThis technique applies to real-world Linux environments. Always follow responsible disclosure when discovering vulnerabilities.`}
              reflection={`What did you learn about the ${activeScenario.technique} technique? How would you defend against this in a production environment?`}
              isLocked={false}
              isCompleted={allDone}
              isActive={false}
              flagId="debrief"
              labId="privesc"
              onFlagSubmit={async () => ({ correct: false })}
              onComplete={() => {}}
              skipFlag
            />
          </WalkthroughLayout>
        ) : null
      }
    />
  );
};

export default PrivescLab;
