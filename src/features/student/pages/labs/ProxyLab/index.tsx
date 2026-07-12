import { useState, useCallback } from 'react';
import { Network, ArrowLeft, CheckCircle, AlertTriangle, Terminal } from 'lucide-react';
import { LabConnectButton } from '@/features/student/components/lab/LabConnectButton';
import { PROXY_SCENARIOS } from '@/features/student/data/simulations/proxy-data';
import SEO from '@/shared/components/SEO';
import ScenarioCard from '@/shared/components/ScenarioCard';
import { SCENARIO_DIAGRAMS } from '@/shared/components/ScenarioDiagrams';
import { verifyLabFlag } from '../../../services/lab.service';

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

  const allStepsCompleted = activeScenario && completedSteps.size >= activeScenario.tasks.length;

  if (!activeScenario) {
    return (
      <div className="bg-bg min-h-full">
        <SEO title="Web Proxy Lab" description="Intercept, analyze, and manipulate HTTP traffic." />
        <div className="mx-auto max-w-[1600px] px-4 md:px-6 lg:px-8 pt-8 pb-20 lg:pb-24">
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
                index={index}
                title={scenario.title}
                difficulty={scenario.difficulty}
                description={scenario.description}
                cpReward={scenario.cpReward}
                accentColor="#10B981"
                diagramSvg={SCENARIO_DIAGRAMS[scenario.id]}
                onStart={() => startScenario(scenario)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const steps = activeScenario.tasks.map((task, i) => ({
    title: `Task ${i + 1}`,
    text: task.description,
    hint: task.hint,
  }));

  // Build a list of instructions from the intercepted requests
  const requestInstructions = activeScenario.requests.map(r =>
    `[${r.method}] ${r.url} — Status: ${r.response.statusCode}`
  ).join('\n');

  return (
    <div className="bg-bg min-h-full">
      <div className="mx-auto max-w-[1600px] px-4 md:px-6 lg:px-8 pt-8 pb-20 lg:pb-24">
        <div className="mb-8">
          <button onClick={exitScenario} className="flex items-center gap-2 text-text-muted hover:text-accent transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">All Scenarios</span>
          </button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
              <Network className="w-7 h-7 text-accent" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-text-primary tracking-tight">{activeScenario.title}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${DIFFICULTY_STYLES[activeScenario.difficulty]}`}>{activeScenario.difficulty}</span>
                <LabConnectButton labId="proxy" scenarioId={activeScenario.id} />
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-text-muted font-mono leading-relaxed mb-4">{activeScenario.description}</p>

        <div className="rounded-2xl border border-border/30 bg-bg-card p-4 mb-8">
          <p className="text-xs font-black uppercase tracking-widest text-accent mb-2">Intercepted Requests</p>
          <pre className="text-sm font-mono text-text-muted whitespace-pre-wrap">{requestInstructions}</pre>
        </div>

        <div className="mb-8 space-y-3">
          <div className="flex items-center gap-2 mb-4">
            <Terminal className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-black text-text-primary uppercase tracking-wider">Walkthrough</h2>
          </div>

          <div className="rounded-2xl border border-accent/30 bg-bg-card p-6 mb-4">
            <p className="text-base text-text-secondary font-mono leading-relaxed">
              Set your browser to use Burp Suite proxy (127.0.0.1:8080), intercept the HTTP traffic, and analyze each request/response for vulnerabilities.
            </p>
          </div>

          {steps.map((step, index) => {
            const isCompleted = completedSteps.has(index);
            const isNextStep = index === 0 ? !completedSteps.has(0) : completedSteps.has(index - 1);
            return (
              <div key={index} className={`rounded-2xl border p-6 transition-all ${
                isCompleted ? 'border-accent/30 bg-accent/5' : isNextStep ? 'border-accent/30 bg-bg-card' : 'border-border/20 bg-bg-card opacity-50'
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black ${
                    isCompleted ? 'bg-accent text-white' : isNextStep ? 'bg-accent/20 text-accent' : 'bg-white/5 text-text-muted/30'
                  }`}>
                    {isCompleted ? <CheckCircle className="w-4 h-4" /> : index + 1}
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-accent">{step.title}</span>
                </div>
                <p className="text-base text-text-secondary font-mono leading-relaxed mb-2">{step.text}</p>
                {isNextStep && !isCompleted && (
                  <>
                    <button onClick={() => handleStepComplete(index)} className="btn-primary !rounded-xl !text-[10px] px-5 py-2.5 mt-2">
                      Mark Complete
                    </button>
                  </>
                )}
                {isCompleted && <div className="flex items-center gap-1.5 mt-3 text-accent"><CheckCircle className="w-3.5 h-3.5" /><span className="text-[9px] font-black uppercase tracking-widest">Completed</span></div>}
              </div>
            );
          })}
        </div>

        {allStepsCompleted && (
          <>
            <div className="border-t border-border/30 mb-8" />
            <div className="mb-8">
              <h2 className="text-lg font-black text-text-primary uppercase tracking-wider mb-4">Capture the Flag</h2>
              <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6">
                <p className="text-sm font-black text-accent mb-2">All tasks completed!</p>
                <p className="text-sm text-text-muted font-mono mb-4">Submit the flag to claim your {activeScenario.cpReward} CP reward.</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input type="text" value={flagInput} onChange={(e) => { setFlagInput(e.target.value); setFlagStatus('idle'); }} onKeyDown={(e) => { if (e.key === 'Enter') handleSubmitFlag(); }} placeholder="FLAG{...}" className="flex-1 bg-bg border border-border rounded-xl py-3 px-4 text-text-primary font-mono text-sm focus:border-accent outline-none" />
                  <button onClick={handleSubmitFlag} disabled={!flagInput.trim() || flagLoading} className="btn-primary !rounded-xl !text-[11px] px-8 disabled:opacity-50">
                    {flagLoading ? 'Verifying...' : 'Submit Flag'}
                  </button>
                </div>
                {flagStatus === 'incorrect' && (
                  <div className="flex items-center gap-2 mt-3 text-sm text-red-400 font-mono"><AlertTriangle className="w-4 h-4" />Incorrect flag. Review each task.</div>
                )}
              </div>
            </div>
          </>
        )}

        {!allStepsCompleted && (
          <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-4 flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
            <p className="text-sm font-mono text-text-muted">Complete all tasks to unlock flag submission.</p>
          </div>
        )}

        {flagStatus === 'correct' && (
          <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center shrink-0"><CheckCircle className="w-6 h-6 text-accent" /></div>
            <div>
              <p className="text-lg font-black text-accent">Scenario Complete!</p>
              <p className="text-sm font-mono text-text-muted mt-1">+{activeScenario.cpReward} CP earned.</p>
              <button onClick={exitScenario} className="btn-secondary !rounded-xl !text-[10px] mt-3 px-5 py-2">Back to Scenarios</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProxyLab;
