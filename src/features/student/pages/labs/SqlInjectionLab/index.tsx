import { useState, useCallback, useMemo } from 'react';
import { Database, CheckCircle } from 'lucide-react';
import { WalkthroughLayout, WalkthroughStep } from '@/shared/components/walkthrough/';
import { SQL_INJECTION_TARGETS } from '@/features/student/data/simulations/sql-injection-data';
import { createSqlInjectionSimulations } from '@/features/student/components/simulations/labSimulationContent';
import SEO from '@/shared/components/SEO';
import ScenarioCard from '@/shared/components/ScenarioCard';
import { verifyLabFlag } from '../../../services/lab.service';
import { getRelatedContentForLab } from '@/shared/constants/topicMap';
import RelatedContent from '@/shared/components/RelatedContent';
import LabHeroSection from '@/shared/components/LabHeroSection';
import { FlowDiagram } from '@/shared/components/diagrams/FlowDiagram';


const DIFFICULTY_STYLES: Record<string, string> = {
  beginner: 'bg-green-400/10 text-green-400 border-green-400/20',
  intermediate: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
  advanced: 'bg-red-400/10 text-red-400 border-red-400/20',
};

const SQL_ATTACK_FLOW_NODES = [
  { id: 'input', label: 'Input Field', icon: '⌨️', status: 'warning' as const },
  { id: 'query', label: 'Query Builder', icon: '🔍', status: 'danger' as const },
  { id: 'db', label: 'DB Server', icon: '🗄️', status: 'default' as const },
];

const SQL_ATTACK_FLOW_ARROWS = [
  { from: 'input', to: 'query', label: 'Inject', type: 'solid' as const },
  { from: 'query', to: 'db', label: 'Execute', type: 'dashed' as const },
];

const SqlInjectionLab = () => {
  const [activeTarget, setActiveTarget] = useState(null);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [flagInput, setFlagInput] = useState('');
  const [flagStatus, setFlagStatus] = useState('idle');
  const [flagLoading, setFlagLoading] = useState(false);

  const startTarget = useCallback((target) => {
    setActiveTarget(target);
    setCompletedSteps(new Set());
    setFlagInput('');
    setFlagStatus('idle');
    setFlagLoading(false);
  }, []);

  const exitTarget = useCallback(() => {
    setActiveTarget(null);
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
    if (!activeTarget || !flagInput.trim() || flagLoading) return;
    setFlagLoading(true);
    try {
      const result = await verifyLabFlag('sql-injection', activeTarget.id, flagInput.trim());
      setFlagStatus(result.correct ? 'correct' : 'incorrect');
    } catch {
      setFlagStatus('incorrect');
    } finally {
      setFlagLoading(false);
    }
  }, [activeTarget, flagInput, flagLoading]);

  const handleFlagSubmit = useCallback(async (_stepId: string, flag: string) => {
    if (!activeTarget) return { correct: false };
    try {
      return await verifyLabFlag('sql-injection', activeTarget.id, flag);
    } catch {
      return { correct: false };
    }
  }, [activeTarget]);

  const allStepsCompleted = activeTarget && completedSteps.size >= activeTarget.steps.length;

  const simulations = useMemo(
    () => activeTarget ? createSqlInjectionSimulations(activeTarget.tables, activeTarget.url) : [],
    [activeTarget],
  );

  if (!activeTarget) {
    const firstTargetWithVillain = SQL_INJECTION_TARGETS.find(t => t.villain);
    return (
      <div className="bg-bg min-h-full">
        <SEO title="SQL Injection Lab" description="Deep dive into SQL injection techniques." noindex />

        <LabHeroSection
          icon={<Database className="w-8 h-8 text-accent" />}
          title="SQL Injection"
          accentWord="Deep Dive"
          description="Explore and exploit SQL injection vulnerabilities across different target systems."
          villain={firstTargetWithVillain?.villain}
        />

        <div className="px-3 md:px-4 lg:px-6 pb-20 lg:pb-24 space-y-8">
          <div className="border-t border-border/30" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {SQL_INJECTION_TARGETS.map((target) => (
              <ScenarioCard
                key={target.id}
                title={target.name}
                difficulty={target.difficulty}
                description={target.description}
                cpReward={target.cpReward}
                subtitle={`${target.injectionType} · ${target.dbms}`}
                onStart={() => startTarget(target)}
              />
            ))}
          </div>

          <RelatedContent {...getRelatedContentForLab('sql-injection')} title="Continue This Topic" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg min-h-full">
      <SEO title={`${activeTarget.name} — SQL Injection Lab`} description={activeTarget.description} noindex />
      <WalkthroughLayout
        title={activeTarget.name}
        subtitle={`${activeTarget.injectionType} — ${activeTarget.description}`}
        icon={<Database className="w-6 h-6" />}
        difficulty={activeTarget.difficulty}
        labId="sql-injection"
        scenarioId={activeTarget.id}
        onBack={exitTarget}
        completedCount={completedSteps.size}
        totalSteps={activeTarget.steps.length}
        simulations={simulations}
      >
        <div className="rounded-2xl border border-border/30 bg-bg-card p-4 mb-2">
          <p className="text-sm font-mono text-text-muted">
            <span className="text-accent font-black">Target:</span> {activeTarget.url}
          </p>
        </div>

        {activeTarget.steps.map((step, index) => {
          const isCompleted = completedSteps.has(index);
          const firstIncomplete = activeTarget.steps.findIndex((_: string, i: number) => !completedSteps.has(i));
          const isActive = index === firstIncomplete;
          const isLocked = !isCompleted && index > firstIncomplete;

          const emojis = ['💉', '🗄️', '🔓', '💀', '🎯', '🏆'];
          const emoji = emojis[index % emojis.length];

          const narrative = `${emoji} SQL Injection — Step ${index + 1}\n\n${step.explanation}\n\nExecute the command below to proceed.`;

          return (
            <WalkthroughStep
              key={index}
              stepIndex={index}
              title={`Step ${index + 1}`}
              narrative={narrative}
              commandInstruction={step.command}
              isLocked={isLocked}
              isCompleted={isCompleted}
              isActive={isActive}
              flagId={`${activeTarget.id}-step-${index}`}
              labId="sql-injection"
              onFlagSubmit={handleFlagSubmit}
              onComplete={() => handleStepComplete(index)}
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

        {flagStatus === 'correct' && (
          <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
              <CheckCircle className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-lg font-black text-accent">Flag Accepted!</p>
              <p className="text-sm font-mono text-text-muted mt-1">+{activeTarget.cpReward} CP earned.</p>
              <button onClick={exitTarget} className="btn-secondary !rounded-xl !text-[10px] mt-3 px-5 py-2">Back to Targets</button>
            </div>
          </div>
        )}
      </WalkthroughLayout>
    </div>
  );
};

export default SqlInjectionLab;
