import { useState, useCallback } from 'react';
import { Database, ArrowLeft, CheckCircle, AlertTriangle, Terminal } from 'lucide-react';
import { SQL_INJECTION_TARGETS } from '@/features/student/data/simulations/sql-injection-data';
import SEO from '@/shared/components/SEO';
import ScenarioCard from '@/shared/components/ScenarioCard';
import { verifyLabFlag } from '../../../services/lab.service';

const DIFFICULTY_STYLES: Record<string, string> = {
  beginner: 'bg-green-400/10 text-green-400 border-green-400/20',
  intermediate: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
  advanced: 'bg-red-400/10 text-red-400 border-red-400/20',
};

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

  const allStepsCompleted = activeTarget && completedSteps.size >= activeTarget.steps.length;

  if (!activeTarget) {
    return (
      <div className="bg-bg min-h-full">
        <SEO title="SQL Injection Lab" description="Deep dive into SQL injection techniques." />
        <div className="mx-auto max-w-[1600px] px-4 md:px-6 lg:px-8 pt-8 pb-20 lg:pb-24">
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                <Database className="w-7 h-7 text-accent" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tight">
                SQL Injection <span className="text-accent">Deep Dive</span>
              </h1>
            </div>
            <p className="text-base text-text-muted font-mono max-w-2xl">
              Explore and exploit SQL injection vulnerabilities across different target systems.
            </p>
          </div>
          <div className="border-t border-border/30 mb-10" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {SQL_INJECTION_TARGETS.map((target, index) => (
              <ScenarioCard
                key={target.id}
                index={index}
                title={target.name}
                difficulty={target.difficulty}
                description={target.description}
                cpReward={target.cpReward}
                subtitle={`${target.injectionType} · ${target.dbms}`}
                accentColor="#06B66F"
                onStart={() => startTarget(target)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg min-h-full">
      <SEO title={`${activeTarget.name} — SQL Injection Lab`} description={activeTarget.description} />
      <div className="mx-auto max-w-[1600px] px-4 md:px-6 lg:px-8 pt-8 pb-20 lg:pb-24">
        <div className="mb-8">
          <button onClick={exitTarget} className="flex items-center gap-2 text-text-muted hover:text-accent transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">All Targets</span>
          </button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
              <Database className="w-7 h-7 text-accent" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-text-primary tracking-tight">{activeTarget.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-[11px] font-black uppercase tracking-widest text-accent">{activeTarget.injectionType}</span>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${DIFFICULTY_STYLES[activeTarget.difficulty]}`}>
                  {activeTarget.difficulty}
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-text-muted font-mono leading-relaxed mb-4">{activeTarget.description}</p>

        <div className="rounded-2xl border border-border/30 bg-bg-card p-4 mb-8">
          <p className="text-sm font-mono text-text-muted">
            <span className="text-accent font-black">Target:</span> {activeTarget.url}
          </p>
        </div>

        <div className="mb-8 space-y-3">
          <div className="flex items-center gap-2 mb-4">
            <Terminal className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-black text-text-primary uppercase tracking-wider">Walkthrough</h2>
          </div>
          {activeTarget.steps.map((step, index) => {
            const isCompleted = completedSteps.has(index);
            const isNextStep = index === 0 ? !completedSteps.has(0) : completedSteps.has(index - 1);
            const isLocked = !isNextStep && !isCompleted;

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
                  <span className="text-xs font-black uppercase tracking-widest text-accent">Step {index + 1}</span>
                </div>
                <p className="text-base text-text-secondary font-mono leading-relaxed mb-3">
                  <strong>Command:</strong>{' '}
                  <code className="px-2 py-0.5 bg-white/5 rounded text-accent text-sm">{step.command}</code>
                </p>
                {isCompleted && (
                  <>
                    <div className="rounded-xl bg-white/5 p-3 mb-2">
                      <pre className="text-sm font-mono text-text-muted/70 whitespace-pre-wrap">{step.output}</pre>
                    </div>
                    <p className="text-sm text-text-muted font-mono leading-relaxed">{step.explanation}</p>
                  </>
                )}
                {isNextStep && !isCompleted && (
                  <button onClick={() => handleStepComplete(index)} className="btn-primary !rounded-xl !text-[10px] px-5 py-2.5 mt-3">
                    Execute Step
                  </button>
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
                <p className="text-sm font-black text-accent mb-2">All steps completed!</p>
                <p className="text-sm text-text-muted font-mono mb-4">Submit the flag to claim your {activeTarget.cpReward} CP reward.</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input type="text" value={flagInput} onChange={(e) => { setFlagInput(e.target.value); setFlagStatus('idle'); }} onKeyDown={(e) => { if (e.key === 'Enter') handleSubmitFlag(); }} placeholder="FLAG{...}" className="flex-1 bg-bg border border-border rounded-xl py-3 px-4 text-text-primary font-mono text-sm focus:border-accent outline-none" />
                  <button onClick={handleSubmitFlag} disabled={!flagInput.trim() || flagLoading} className="btn-primary !rounded-xl !text-[11px] px-8 disabled:opacity-50">
                    {flagLoading ? 'Verifying...' : 'Submit Flag'}
                  </button>
                </div>
                {flagStatus === 'incorrect' && (
                  <div className="flex items-center gap-2 mt-3 text-sm text-red-400 font-mono"><AlertTriangle className="w-4 h-4" />Incorrect flag. Review the walkthrough and try again.</div>
                )}
              </div>
            </div>
          </>
        )}

        {!allStepsCompleted && (
          <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-4 flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
            <p className="text-sm font-mono text-text-muted">Execute all steps to unlock flag submission.</p>
          </div>
        )}

        {flagStatus === 'correct' && (
          <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center shrink-0"><CheckCircle className="w-6 h-6 text-accent" /></div>
            <div>
              <p className="text-lg font-black text-accent">Flag Accepted!</p>
              <p className="text-sm font-mono text-text-muted mt-1">+{activeTarget.cpReward} CP earned.</p>
              <button onClick={exitTarget} className="btn-secondary !rounded-xl !text-[10px] mt-3 px-5 py-2">Back to Targets</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SqlInjectionLab;
