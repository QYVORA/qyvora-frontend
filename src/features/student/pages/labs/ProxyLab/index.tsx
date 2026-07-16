import { useState, useCallback, useMemo } from 'react';
import { Network, ArrowLeft, CheckCircle, AlertTriangle, Terminal } from 'lucide-react';
import { WalkthroughLayout, WalkthroughStep } from '@/shared/components/walkthrough/';
import { LabConnectButton } from '@/features/student/components/lab/LabConnectButton';
import { PROXY_SCENARIOS } from '@/features/student/data/simulations/proxy-data';
import { createProxySimulations } from '@/features/student/components/simulations/labSimulationContent';
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

const ProxyLab = () => {
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
      const result = await verifyLabFlag('proxy', activeScenario.id, flagInput.trim());
      setFlagStatus(result.correct ? 'correct' : 'incorrect');
    } catch {
      setFlagStatus('incorrect');
    } finally {
      setFlagLoading(false);
    }
  }, [activeScenario, flagInput, flagLoading]);

  const handleFlagSubmit = useCallback(async (_stepId: string, flag: string) => {
    if (!activeScenario) return { correct: false };
    try {
      return await verifyLabFlag('proxy', activeScenario.id, flag);
    } catch {
      return { correct: false };
    }
  }, [activeScenario]);

  const allStepsCompleted = activeScenario && completedSteps.size >= activeScenario.tasks.length;

  const simulations = useMemo(
    () => activeScenario ? createProxySimulations(activeScenario.requests) : [],
    [activeScenario],
  );

  if (!activeScenario) {
    return (
      <div className="bg-bg min-h-full">
        <SEO title="Web Proxy Lab" description="Intercept, analyze, and manipulate HTTP traffic." />
        <div className=" px-4 md:px-12 lg:px-16 pt-8 pb-20 lg:pb-24">
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                <Network className="w-7 h-7 text-accent" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tight">
                Web <span className="text-accent">Proxy</span>
              </h1>
            </div>
            <p className="text-base text-text-muted font-mono max-w-2xl">
              Burp Suite Simulator Lab — Intercept, analyze, and manipulate HTTP traffic.
            </p>
          </div>
          <div className="border-t border-border/30 mb-10" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {PROXY_SCENARIOS.map((scenario, index) => (
              <ScenarioCard
                key={scenario.id}
                title={scenario.title}
                difficulty={scenario.difficulty}
                description={scenario.description}
                cpReward={scenario.cpReward}
                onStart={() => startScenario(scenario)}
              />
            ))}
          </div>

          <div className="mt-10"><RelatedContent {...getRelatedContentForLab('proxy')} title="Continue This Topic" /></div>
        </div>
      </div>
    );
  }

  const steps = activeScenario.tasks.map((task, i) => ({
    title: `Task ${i + 1}`,
    narrative: `🔄 Proxy Intercept — Task ${i + 1}\n\n${task.description}\n\nTraffic Flow:\n  ┌──────────┐     ┌──────────┐     ┌──────────┐\n  │  Browser │────▶│  Proxy   │────▶│  Server  │\n  │  (Client)│◀────│  (Burp)  │◀────│  (Target)│\n  └──────────┘     └──────────┘     └──────────┘\n       │                │                │\n       └── Modify ──────┘                │\n              │                          │\n              └──── Tampered ◀───────────┘\n\nSet your browser proxy to 127.0.0.1:8080 and intercept the traffic.`,
    commandInstruction: undefined,
    hint: task.hint,
  }));

  const requestInstructions = activeScenario.requests.map(r =>
    `[${r.method}] ${r.url} — Status: ${r.response.statusCode}`
  ).join('\n');

  return (
    <div className="bg-bg min-h-full">
      <SEO title={`${activeScenario.title} — Proxy Lab`} description={activeScenario.description} />
      <WalkthroughLayout
        title={activeScenario.title}
        subtitle={activeScenario.description}
        icon={<Network className="w-6 h-6" />}
        difficulty={activeScenario.difficulty}
        labId="proxy"
        scenarioId={activeScenario.id}
        onBack={exitScenario}
        completedCount={completedSteps.size}
        totalSteps={activeScenario.tasks.length}
        simulations={simulations}
      >
        <div className="rounded-2xl border border-border/30 bg-bg-card p-4 mb-2">
          <p className="text-xs font-black uppercase tracking-widest text-accent mb-2">Intercepted Requests</p>
          <pre className="text-sm font-mono text-text-muted whitespace-pre-wrap">{requestInstructions}</pre>
        </div>

        {steps.map((step, index) => {
          const isCompleted = completedSteps.has(index);
          const isNextStep = index === 0 ? !completedSteps.has(0) : completedSteps.has(index - 1);
          const isLocked = false;
          const isActive = isNextStep && !isCompleted;

          return (
            <WalkthroughStep
              key={index}
              stepIndex={index}
              title={step.title}
              narrative={step.narrative}
              hint={step.hint}
              commandInstruction={step.commandInstruction}
              isLocked={isLocked}
              isCompleted={isCompleted}
              isActive={isActive}
              flagId={`${activeScenario.id}-step-${index}`}
              labId="proxy"
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
              <p className="text-lg font-black text-accent">Scenario Complete!</p>
              <p className="text-sm font-mono text-text-muted mt-1">+{activeScenario.cpReward} CP earned.</p>
              <button onClick={exitScenario} className="btn-secondary !rounded-xl !text-[10px] mt-3 px-5 py-2">Back to Scenarios</button>
            </div>
          </div>
        )}
      </WalkthroughLayout>
    </div>
  );
};

export default ProxyLab;
