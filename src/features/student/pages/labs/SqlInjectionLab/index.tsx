import { Database, Keyboard, Search, Server } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { WalkthroughLayout, WalkthroughStep } from '@/shared/components/walkthrough/';
import { SQL_INJECTION_TARGETS } from '@/features/student/data/simulations';
import LearningAccordion from '@/shared/components/learning/LearningAccordion';
import LabPage from '@/shared/components/learning/LabPage';
import { getRelatedContentForLab } from '@/shared/constants/topicMap';
import RelatedContent from '@/shared/components/RelatedContent';
import { FlowDiagram } from '@/shared/components/diagrams/FlowDiagram';
import { LabListingSkeleton } from '@/features/student/components/StudentSkeletons';
import useLabAccess from '@/features/student/hooks/useLabAccess';
import useLabScenario from '@/features/student/hooks/useLabScenario';
import { getLabCpCost } from '@/features/student/data/simulations/labAccess';

const SQL_ATTACK_FLOW_NODES = [
  { id: 'input', label: 'Input Field', icon: <Keyboard className="w-4 h-4" />, status: 'warning' as const },
  { id: 'query', label: 'Query Builder', icon: <Search className="w-4 h-4" />, status: 'danger' as const },
  { id: 'db', label: 'DB Server', icon: <Server className="w-4 h-4" />, status: 'default' as const },
];

const SQL_ATTACK_FLOW_ARROWS = [
  { from: 'input', to: 'query', label: 'Inject', type: 'solid' as const },
  { from: 'query', to: 'db', label: 'Execute', type: 'dashed' as const },
];

type SqlInjectionTarget = typeof SQL_INJECTION_TARGETS[number];

const SqlInjectionLab = () => {
  const { t } = useTranslation();
  const { activeScenario: activeTarget, completedSteps, handleFlagSubmit, getStepState, allDone, startScenario, exitScenario } =
    useLabScenario<SqlInjectionTarget>({
      labId: 'sql-injection',
      getScenarioId: (t) => t.id,
      getStepIds: (t) => t.steps.map((_, i) => `${t.id}-step-${i}`),
    });
  const { isLocked, purchaseLab, loading } = useLabAccess();

  const firstTargetWithVillain = SQL_INJECTION_TARGETS.find(t => t.villain);

  if (loading) return <LabListingSkeleton />;

  return (
    <LabPage
      title="SQL Injection"
      accentWord="Deep Dive"
      description="Explore and exploit SQL injection vulnerabilities across different target systems."
      villain={firstTargetWithVillain?.villain}
      activeScenario={activeTarget}
      celebrationShow={allDone}
      celebrationTitle={activeTarget?.name || ''}
      celebrationCp={activeTarget?.cpReward || 0}
      listingContent={
        <LearningAccordion
          items={SQL_INJECTION_TARGETS.map((target) => {
            const cpCost = getLabCpCost(target.id);
            const locked = isLocked(target.id);
            return {
              id: target.id,
              title: target.name,
              subtitle: `${target.injectionType} · ${target.dbms}`,
              description: target.description,
              difficulty: target.difficulty,
              meta: (
                <span className="text-[9px] font-black uppercase tracking-widest text-accent">
                  {target.cpReward} CP
                </span>
              ),
              onStart: () => startScenario(target),
              startLabel: t('labs.startAttack', 'Start Attack'),
              locked,
              cpCost: locked ? cpCost ?? undefined : undefined,
              onUnlock: cpCost ? async () => {
                const success = await purchaseLab(target.id, 'sql-injection');
                if (success) startScenario(target);
              } : undefined,
            };
          })}
        />
      }
      relatedContent={<RelatedContent {...getRelatedContentForLab('sql-injection')} title="Continue This Topic" />}
      walkthroughContent={
        activeTarget ? (
          <WalkthroughLayout
            title={activeTarget.name}
            subtitle={`${activeTarget.injectionType} | ${activeTarget.description}`}
            icon={<Database className="w-6 h-6" />}
            difficulty={activeTarget.difficulty}
            labId="sql-injection"
            scenarioId={activeTarget.id}
            onBack={exitScenario}
            completedCount={completedSteps.size}
            totalSteps={activeTarget.steps.length + 2}
          >
            <WalkthroughStep
              stepIndex={0}
              title="Mission Briefing"
              narrative={`## ${activeTarget.name}\n\n${activeTarget.description}\n\n**Target URL:** ${activeTarget.url}\n\n**Injection Type:** ${activeTarget.injectionType}\n\n**Database:** ${activeTarget.dbms}`}
              mission={activeTarget.description}
              objectives={[
                `Exploit the ${activeTarget.injectionType} vulnerability`,
                'Extract sensitive data from the database',
                'Capture the flag',
              ]}
              isLocked={false}
              isCompleted={true}
              isActive={false}
              flagId="briefing"
              labId="sql-injection"
              onFlagSubmit={async () => ({ correct: false })}
              onComplete={() => {}}
              skipFlag
            />

            <div className="rounded-2xl border border-border/50 bg-bg-card p-4 mb-2">
              <p className="text-sm font-mono text-text-muted">
                <span className="text-accent font-black">Target:</span> {activeTarget.url}
              </p>
            </div>

            {activeTarget.steps.map((step, index) => {
              const { isLocked, isCompleted, isActive } = getStepState(index);
              const stepId = `${activeTarget.id}-step-${index}`;

              const narrative = `## SQL Injection. Step ${index + 1}\n\n${step.explanation}\n\nExecute the command below to proceed.`;

              return (
                <WalkthroughStep
                  key={index}
                  stepIndex={index + 1}
                  title={`Step ${index + 1}`}
                  narrative={narrative}
                  commandInstruction={step.command}
                  isLocked={isLocked}
                  isCompleted={isCompleted}
                  isActive={isActive}
                  flagId={stepId}
                  labId="sql-injection"
                  onFlagSubmit={handleFlagSubmit}
                  onComplete={() => {}}
                >
                  {index === 0 && (
                    <FlowDiagram
                      nodes={SQL_ATTACK_FLOW_NODES}
                      arrows={SQL_ATTACK_FLOW_ARROWS}
                      direction="horizontal"
                    />
                  )}
                </WalkthroughStep>
              );
            })}

            <WalkthroughStep
              stepIndex={activeTarget.steps.length + 1}
              title="Mission Debrief"
              narrative={`## Attack Complete\n\nYou successfully exploited the **${activeTarget.injectionType}** vulnerability on ${activeTarget.name}.\n\n### Key Takeaways\n\n- **${activeTarget.injectionType}** injection allows data extraction through crafted queries\n- Always validate and sanitize user input\n- Use parameterized queries to prevent SQL injection\n- The ${activeTarget.dbms} database was vulnerable to this technique\n\n### What to Remember\n\nSQL injection remains one of the most common web vulnerabilities. Understanding the attack vector is essential for building secure applications.`}
              reflection={`What did you learn about ${activeTarget.injectionType} injection? How would you secure this application against this attack?`}
              isLocked={false}
              isCompleted={allDone}
              isActive={false}
              flagId="debrief"
              labId="sql-injection"
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

export default SqlInjectionLab;
