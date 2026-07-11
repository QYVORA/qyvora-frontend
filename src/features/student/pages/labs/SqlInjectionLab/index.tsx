import { useState, useRef, useEffect, useCallback } from 'react';
import { Database, Terminal, ArrowLeft, CheckCircle, AlertTriangle, Play, Copy, Table } from 'lucide-react';
import { SQL_INJECTION_TARGETS, type SqlInjectionTarget } from '@/features/student/data/simulations/sql-injection-data';
import SEO from '@/shared/components/SEO';

const DIFFICULTY_STYLES: Record<string, { bg: string; text: string }> = {
  beginner: { bg: 'bg-accent/10', text: 'text-accent' },
  intermediate: { bg: 'bg-yellow-400/10', text: 'text-yellow-400' },
  advanced: { bg: 'bg-red-400/10', text: 'text-red-400' },
};

const TargetCard = ({ target, onClick }: { target: SqlInjectionTarget; onClick: () => void }) => {
  const difficulty = DIFFICULTY_STYLES[target.difficulty];

  return (
    <button
      onClick={onClick}
      className="group flex flex-col h-full rounded-2xl border border-border/30 bg-bg-card p-5 hover:border-accent/30 transition-all duration-300 text-left w-full"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
          <Database className="w-5 h-5 text-accent" />
        </div>
        <h3 className="text-sm font-black text-text-primary group-hover:text-accent transition-colors leading-snug">
          {target.name}
        </h3>
      </div>

      <p className="text-xs text-text-muted/70 font-mono leading-relaxed mb-4 flex-1 line-clamp-2">
        {target.description}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-accent/10 text-accent">
          {target.injectionType}
        </span>
        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${difficulty.bg} ${difficulty.text}`}>
          {target.difficulty}
        </span>
        <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-white/5 text-text-muted">
          {target.dbms}
        </span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border/20">
        <span className="text-[10px] font-black uppercase tracking-widest text-accent">
          {target.cpReward} CP
        </span>
        <span className="text-[10px] font-black uppercase tracking-widest text-text-muted group-hover:text-accent transition-colors">
          Start Lab
        </span>
      </div>
    </button>
  );
};

const StepTerminal = ({ step, command, output, isExecuted, explanation }: { step: number; command: string; output: string; isExecuted: boolean; explanation: string }) => {
  return (
    <div className="rounded-xl border border-border/30 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-bg-card border-b border-border/20">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <div className="w-2 h-2 rounded-full bg-yellow-400" />
          <div className="w-2 h-2 rounded-full bg-accent" />
        </div>
        <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">
          Step {step}
        </span>
      </div>
      <div className="bg-[#050706] p-4 space-y-1.5 max-h-48 overflow-y-auto">
        <div className="flex items-start gap-2 font-mono text-sm">
          <span className="text-accent shrink-0">$</span>
          <span className="text-accent break-all">{command}</span>
        </div>
        {isExecuted && output.split('\n').map((line, i) => (
          <div key={i} className="font-mono text-sm text-white/80 whitespace-pre-wrap break-all">{line}</div>
        ))}
      </div>
      {isExecuted && explanation && (
        <div className="px-4 py-3 bg-bg-card border-t border-border/20">
          <p className="text-xs text-text-muted/70 font-mono leading-relaxed">{explanation}</p>
        </div>
      )}
    </div>
  );
};

const DatabaseSchemaViewer = ({ target }: { target: SqlInjectionTarget }) => {
  const [expandedTable, setExpandedTable] = useState<string | null>(null);

  return (
    <div className="rounded-2xl border border-border/30 bg-bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Table className="w-4 h-4 text-accent" />
        <span className="text-[9px] font-black uppercase tracking-widest text-accent">Database Schema</span>
        <span className="px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest bg-accent/10 text-accent ml-1">
          {target.database}
        </span>
      </div>
      <div className="space-y-2">
        {target.tables.map((table) => (
          <div key={table.name} className="rounded-xl border border-border/20 overflow-hidden">
            <button
              onClick={() => setExpandedTable(expandedTable === table.name ? null : table.name)}
              className="w-full flex items-center justify-between px-4 py-2.5 bg-[#050706] hover:bg-[#0a0f0d] transition-colors"
            >
              <div className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-accent/70" />
                <span className="font-mono text-xs text-text-primary">{table.name}</span>
                <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest bg-white/5 text-text-muted">
                  {table.rows.length} rows
                </span>
              </div>
              <span className="text-text-muted text-xs">{expandedTable === table.name ? '−' : '+'}</span>
            </button>
            {expandedTable === table.name && (
              <div className="px-4 py-3 bg-bg-card border-t border-border/20">
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {table.columns.map((col) => (
                    <span key={col} className="px-2 py-0.5 rounded text-[9px] font-mono bg-white/5 text-text-muted">
                      {col}
                    </span>
                  ))}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-[10px] font-mono">
                    <thead>
                      <tr className="border-b border-border/20">
                        {table.columns.map((col) => (
                          <th key={col} className="px-2 py-1.5 text-left text-accent/70 font-black uppercase tracking-widest">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {table.rows.map((row, i) => (
                        <tr key={i} className="border-b border-border/10">
                          {table.columns.map((col) => (
                            <td key={col} className="px-2 py-1.5 text-text-muted whitespace-nowrap">
                              {row[col]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const SqlInjectionLab = () => {
  const [activeTarget, setActiveTarget] = useState<SqlInjectionTarget | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [flagInput, setFlagInput] = useState('');
  const [flagSubmitted, setFlagSubmitted] = useState(false);
  const [flagCorrect, setFlagCorrect] = useState(false);
  const stepsRef = useRef<HTMLDivElement>(null);

  const allStepsCompleted = activeTarget && completedSteps.size >= activeTarget.steps.length;

  useEffect(() => {
    if (stepsRef.current) {
      stepsRef.current.scrollTop = stepsRef.current.scrollHeight;
    }
  }, [completedSteps]);

  const handleBack = useCallback(() => {
    setActiveTarget(null);
    setCompletedSteps(new Set());
    setFlagInput('');
    setFlagSubmitted(false);
    setFlagCorrect(false);
  }, []);

  const handleStartTarget = useCallback((target: SqlInjectionTarget) => {
    setActiveTarget(target);
    setCompletedSteps(new Set());
    setFlagInput('');
    setFlagSubmitted(false);
    setFlagCorrect(false);
  }, []);

  const handleExecuteStep = useCallback((stepIndex: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      next.add(stepIndex);
      return next;
    });
  }, []);

  const handleSubmitFlag = useCallback(() => {
    if (!activeTarget) return;
    const correct = flagInput.trim() === activeTarget.flag;
    setFlagCorrect(correct);
    setFlagSubmitted(true);
  }, [activeTarget, flagInput]);

  const handleCopyUrl = useCallback(() => {
    if (!activeTarget) return;
    navigator.clipboard.writeText(activeTarget.url);
  }, [activeTarget]);

  if (!activeTarget) {
    return (
      <div className="bg-bg min-h-full">
        <SEO title="SQL Injection Lab" description="Deep dive into SQL injection techniques and exploitation." />

        <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 pt-8 pb-20 lg:pb-24 space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
                <Database className="w-6 h-6 text-accent" />
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-text-primary tracking-tight">
                SQL Injection <span className="text-accent">Deep Dive</span>
              </h1>
            </div>
            <p className="text-sm text-text-muted font-mono">
              Explore and exploit SQL injection vulnerabilities across different target systems
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SQL_INJECTION_TARGETS.map((target) => (
              <TargetCard
                key={target.id}
                target={target}
                onClick={() => handleStartTarget(target)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const difficulty = DIFFICULTY_STYLES[activeTarget.difficulty];

  return (
    <div className="bg-bg min-h-full">
      <SEO title={`${activeTarget.name} — SQL Injection Lab`} description={activeTarget.description} />

      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 pt-8 pb-20 lg:pb-24 space-y-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-text-muted hover:text-accent transition-colors text-sm font-mono"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">Back to Targets</span>
        </button>

        <div className="rounded-2xl border border-border/30 bg-bg-card p-5">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                <Database className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h2 className="text-lg font-black text-text-primary">{activeTarget.name}</h2>
                <p className="text-xs text-text-muted/70 font-mono mt-1">{activeTarget.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-accent/10 text-accent">
                {activeTarget.injectionType}
              </span>
              <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${difficulty.bg} ${difficulty.text}`}>
                {activeTarget.difficulty}
              </span>
              <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-accent/10 text-accent">
                {activeTarget.cpReward} CP
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border/30 bg-[#050706] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-black uppercase tracking-widest text-accent">Target URL</span>
            <button
              onClick={handleCopyUrl}
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
            >
              <Copy className="w-3 h-3" />
              Copy
            </button>
          </div>
          <div className="font-mono text-sm text-white/80 break-all">
            <span className="text-text-muted">{activeTarget.url.split('?')[0]}</span>
            <span className="text-accent font-black">?{activeTarget.parameter}=&lt;injected&gt;</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-white/5 text-text-muted">
              {activeTarget.method}
            </span>
            <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-white/5 text-text-muted">
              {activeTarget.dbms}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4" ref={stepsRef}>
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-accent" />
              <span className="text-[9px] font-black uppercase tracking-widest text-accent">
                Step-by-Step Walkthrough
              </span>
            </div>

            {activeTarget.steps.map((step, index) => {
              const isCompleted = completedSteps.has(index);
              const isNextStep = index === 0 ? !completedSteps.has(0) : completedSteps.has(index - 1) && !completedSteps.has(index);
              const isLocked = !isNextStep && !isCompleted;

              return (
                <div key={index} className={`transition-opacity duration-300 ${isLocked ? 'opacity-40' : ''}`}>
                  <StepTerminal
                    step={index + 1}
                    command={step.command}
                    output={isCompleted ? step.output : ''}
                    isExecuted={isCompleted}
                    explanation={isCompleted ? step.explanation : ''}
                  />
                  {isNextStep && (
                    <div className="mt-2 flex justify-end">
                      <button
                        onClick={() => handleExecuteStep(index)}
                        className="btn-primary !rounded-xl !text-[10px] !font-black !uppercase !tracking-widest px-5 py-2.5"
                      >
                        Execute
                      </button>
                    </div>
                  )}
                  {isCompleted && (
                    <div className="mt-2 flex items-center gap-1.5 justify-end">
                      <CheckCircle className="w-3.5 h-3.5 text-accent" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-accent">Completed</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="space-y-6">
            <DatabaseSchemaViewer target={activeTarget} />
          </div>
        </div>

        {allStepsCompleted && !flagSubmitted && (
          <div className="rounded-2xl border border-accent/30 bg-accent/5 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-accent" />
              <span className="text-sm font-black text-accent">All Steps Completed</span>
            </div>
            <div>
              <p className="text-xs text-text-muted font-mono mb-2">Submit the flag to claim your {activeTarget.cpReward} CP reward:</p>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={flagInput}
                  onChange={(e) => setFlagInput(e.target.value)}
                  placeholder="FLAG{...}"
                  className="flex-1 bg-bg border border-border rounded-xl py-3 px-4 text-text-primary focus:border-accent outline-none font-mono text-sm"
                />
                <button
                  onClick={handleSubmitFlag}
                  disabled={!flagInput.trim()}
                  className="btn-primary !rounded-xl !text-[10px] !font-black !uppercase !tracking-widest px-6 py-3 disabled:opacity-50"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}

        {flagSubmitted && (
          <div className={`rounded-2xl border p-5 ${flagCorrect ? 'border-accent/30 bg-accent/5' : 'border-red-400/30 bg-red-400/5'}`}>
            {flagCorrect ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span className="text-sm font-black text-accent">Flag Accepted!</span>
                </div>
                <p className="text-xs text-text-muted font-mono">
                  Congratulations! You earned <span className="text-accent font-black">{activeTarget.cpReward} CP</span> for completing this lab.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleBack}
                    className="btn-secondary !rounded-xl !text-[10px] !font-black !uppercase !tracking-widest px-5 py-2.5"
                  >
                    Back to Targets
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <span className="text-sm font-black text-red-400">Incorrect Flag</span>
                </div>
                <p className="text-xs text-text-muted font-mono">
                  The flag you submitted is incorrect. Review the walkthrough and try again.
                </p>
                <button
                  onClick={() => { setFlagSubmitted(false); setFlagInput(''); }}
                  className="btn-secondary !rounded-xl !text-[10px] !font-black !uppercase !tracking-widest px-5 py-2.5"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SqlInjectionLab;
