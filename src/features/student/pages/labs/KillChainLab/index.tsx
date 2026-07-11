import { useState, useCallback, useRef, useEffect } from 'react';
import {
  Target, Terminal, ArrowLeft, CheckCircle,
  Play, Shield, Database, Download, Network, Radar, Search,
  Zap, Flag,
} from 'lucide-react';
import SEO from '@/shared/components/SEO';
import { KILL_CHAIN_SCENARIOS } from '@/features/student/data/simulations/kill-chain-data';
import type { KillChainScenario, KillChainPhase, KillChainCommand } from '@/features/student/data/simulations/kill-chain-data';
import { verifyLabFlag } from '../../../services/lab.service';

const DIFFICULTY_STYLES: Record<string, string> = {
  beginner: 'bg-green-400/10 text-green-400',
  intermediate: 'bg-yellow-400/10 text-yellow-400',
  advanced: 'bg-red-400/10 text-red-400',
};

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  radar: Radar,
  search: Search,
  key: Shield,
  shield: Shield,
  network: Network,
  download: Download,
  database: Database,
  zap: Zap,
  flag: Flag,
};

interface TerminalLine {
  id: number;
  type: 'input' | 'output' | 'error' | 'success' | 'info';
  content: string;
}

interface PhaseProgress {
  requiredExecuted: Set<number>;
}

const KillChainLab = () => {
  const [selectedScenario, setSelectedScenario] = useState<KillChainScenario | null>(null);
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [phaseProgress, setPhaseProgress] = useState<Record<string, PhaseProgress>>({});
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [flagInput, setFlagInput] = useState('');
  const [flagStatus, setFlagStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [flagLoading, setFlagLoading] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const lineIdRef = useRef(0);

  const nextLineId = useCallback(() => {
    lineIdRef.current += 1;
    return lineIdRef.current;
  }, []);

  const addLine = useCallback((type: TerminalLine['type'], content: string) => {
    const id = nextLineId();
    setTerminalLines((prev) => [...prev, { id, type, content }]);
  }, [nextLineId]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLines]);

  const startScenario = useCallback((scenario: KillChainScenario) => {
    setSelectedScenario(scenario);
    setActivePhaseIndex(0);
    const progress: Record<string, PhaseProgress> = {};
    scenario.phases.forEach((p) => {
      progress[p.id] = { requiredExecuted: new Set() };
    });
    setPhaseProgress(progress);
    setTerminalLines([]);
    setFlagInput('');
    setFlagStatus('idle');
    setFlagLoading(false);
    lineIdRef.current = 0;
    setTimeout(() => {
      addLine('info', `[ Kill Chain Simulation: ${scenario.title} ]`);
      addLine('info', `[ Target: ${scenario.targetDescription} ]`);
      addLine('info', `[ ${scenario.phases.length} phases | ${scenario.cpReward} CP reward ]\n`);
    }, 50);
  }, [addLine]);

  const exitScenario = useCallback(() => {
    setSelectedScenario(null);
    setTerminalLines([]);
    setFlagInput('');
    setFlagStatus('idle');
    setFlagLoading(false);
  }, []);

  const allPhasesCompleted = selectedScenario?.phases.every(
    (phase) => {
      const progress = phaseProgress[phase.id];
      if (!progress) return false;
      const requiredCommands = phase.commands.filter((c) => c.isRequired);
      return requiredCommands.length > 0 && progress.requiredExecuted.size >= requiredCommands.length;
    },
  ) ?? false;

  const currentPhase = selectedScenario?.phases[activePhaseIndex] ?? null;
  const currentProgress = currentPhase ? phaseProgress[currentPhase.id] : null;

  const executeCommand = useCallback((phase: KillChainPhase, cmdIndex: number) => {
    const cmd: KillChainCommand = phase.commands[cmdIndex];
    addLine('input', `$ ${cmd.command}`);
    addLine('output', cmd.output);
    addLine('info', `[ ${cmd.explanation} ]\n`);

    if (cmd.isRequired) {
      setPhaseProgress((prev) => {
        const existing = prev[phase.id] || { requiredExecuted: new Set() };
        const nextSet = new Set(existing.requiredExecuted);
        nextSet.add(cmdIndex);
        return { ...prev, [phase.id]: { requiredExecuted: nextSet } };
      });
    }
  }, [addLine]);

  const completePhase = useCallback(() => {
    if (!selectedScenario || !currentPhase) return;
    const nextIndex = activePhaseIndex + 1;
    if (nextIndex < selectedScenario.phases.length) {
      setActivePhaseIndex(nextIndex);
      addLine('info', `\n--- Moving to Phase: ${selectedScenario.phases[nextIndex].name} ---\n`);
    }
  }, [selectedScenario, currentPhase, activePhaseIndex, addLine]);

  const submitFlag = useCallback(async () => {
    if (!selectedScenario || !flagInput.trim() || flagLoading) return;
    setFlagLoading(true);
    try {
      const result = await verifyLabFlag('kill-chain', selectedScenario.id, flagInput.trim());
      if (result.correct) {
        setFlagStatus('correct');
        addLine('success', '\n🎉 Kill Chain Complete! Full penetration chain executed successfully!');
      } else {
        setFlagStatus('incorrect');
        addLine('error', `\n✗ ${result.message}`);
      }
    } catch {
      setFlagStatus('incorrect');
      addLine('error', '\n✗ Verification failed. Please try again.');
    } finally {
      setFlagLoading(false);
    }
  }, [selectedScenario, flagInput, flagLoading, addLine]);

  const getPhaseIcon = (iconName: string) => {
    return ICON_MAP[iconName] || Target;
  };

  const getRequiredCount = (phase: KillChainPhase) => phase.commands.filter((c) => c.isRequired).length;
  const getExecutedRequiredCount = (phase: KillChainPhase) => {
    const progress = phaseProgress[phase.id];
    return progress ? progress.requiredExecuted.size : 0;
  };

  if (!selectedScenario) {
    return (
      <div className="bg-bg min-h-full">
        <SEO title="Kill Chain Lab" description="Execute full penetration test simulations through every kill chain phase." />
        <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 pt-8 pb-20 lg:pb-24 space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
                <Target className="w-6 h-6 text-accent" />
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-text-primary tracking-tight">
                Kill <span className="text-accent">Chain</span> Lab
              </h1>
            </div>
            <p className="text-sm text-text-muted font-mono">
              Execute full kill chain simulations — from reconnaissance to exfiltration
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {KILL_CHAIN_SCENARIOS.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => startScenario(scenario)}
                className="group text-left flex flex-col h-full rounded-2xl border border-border/30 bg-bg-card p-5 hover:border-accent/30 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                    <Target className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="text-sm font-black text-text-primary group-hover:text-accent transition-colors leading-snug">
                    {scenario.title}
                  </h3>
                </div>
                <p className="text-xs text-text-muted/70 font-mono leading-relaxed mb-4 flex-1 line-clamp-3">
                  {scenario.description}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-border/20">
                  <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${DIFFICULTY_STYLES[scenario.difficulty]}`}>
                    {scenario.difficulty}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-mono text-text-muted">
                      {scenario.phases.length} phases
                    </span>
                    <span className="text-[9px] font-black text-accent">
                      {scenario.cpReward} CP
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg min-h-full">
      <SEO title={`${selectedScenario.title} — Kill Chain`} description={selectedScenario.description} />
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 pt-8 pb-20 lg:pb-24 space-y-6">
        {/* Header */}
        <div>
          <button
            onClick={exitScenario}
            className="flex items-center gap-2 text-text-muted hover:text-accent transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Back to Scenarios</span>
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-4xl md:text-6xl font-black text-text-primary tracking-tight">
                {selectedScenario.title}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${DIFFICULTY_STYLES[selectedScenario.difficulty]}`}>
                  {selectedScenario.difficulty}
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-accent">
                  {selectedScenario.cpReward} CP
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Kill Chain Progress */}
        <div className="rounded-2xl border border-border/30 bg-bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Radar className="w-4 h-4 text-accent" />
            <span className="text-[9px] font-black uppercase tracking-widest text-accent">Kill Chain Progress</span>
          </div>
          <div className="flex items-start justify-between gap-0">
            {selectedScenario.phases.map((phase, idx) => {
              const PhaseIcon = getPhaseIcon(phase.icon);
              const required = getRequiredCount(phase);
              const executed = getExecutedRequiredCount(phase);
              const isCompleted = required > 0 && executed >= required;
              const isCurrent = idx === activePhaseIndex;
              const isFuture = idx > activePhaseIndex;

              let stepColor = 'border-border/30 text-text-muted/40';
              let iconBg = 'bg-bg-elevated';
              if (isCompleted) {
                stepColor = 'border-green-400 bg-green-400/10 text-green-400';
                iconBg = 'bg-green-400/10';
              } else if (isCurrent) {
                stepColor = 'border-accent bg-accent/10 text-accent';
                iconBg = 'bg-accent/10';
              }

              return (
                <div key={phase.id} className="flex items-start flex-1 last:flex-none">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center ${stepColor}`}>
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <PhaseIcon className={`w-5 h-5 ${isCurrent ? 'text-accent' : 'text-text-muted/40'}`} />
                      )}
                    </div>
                    <span className={`mt-2 text-[9px] font-black uppercase tracking-widest text-center leading-tight max-w-[80px] ${
                      isCompleted ? 'text-green-400' : isCurrent ? 'text-accent' : 'text-text-muted/40'
                    }`}>
                      {phase.name}
                    </span>
                    {isCurrent && (
                      <span className="mt-1 text-[8px] font-mono text-accent/70">
                        {executed}/{required} cmds
                      </span>
                    )}
                  </div>
                  {idx < selectedScenario.phases.length - 1 && (
                    <div className={`flex items-center pt-5 px-1 ${
                      isCompleted ? 'text-green-400' : 'text-text-muted/20'
                    }`}>
                      <div className={`w-6 h-px ${isCompleted ? 'bg-green-400' : 'bg-border/30'}`} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Phase Panel */}
        {currentPhase && (
          <div className="rounded-2xl border border-border/30 bg-bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  {(() => {
                    const PhaseIcon = getPhaseIcon(currentPhase.icon);
                    return <PhaseIcon className="w-5 h-5 text-accent" />;
                  })()}
                </div>
                <div>
                  <h2 className="text-lg font-black text-text-primary">{currentPhase.name}</h2>
                  <p className="text-xs font-mono text-text-muted">{currentPhase.description}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-mono text-text-muted">
                  {getExecutedRequiredCount(currentPhase)}/{getRequiredCount(currentPhase)} required
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {currentPhase.commands.map((cmd, cmdIdx) => {
                const isExecuted = currentProgress?.requiredExecuted.has(cmdIdx) ?? false;
                return (
                  <div
                    key={cmdIdx}
                    className={`rounded-xl border p-4 transition-all ${
                      isExecuted
                        ? 'border-green-400/20 bg-green-400/5'
                        : 'border-border/20 bg-bg-elevated/30'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <code className="text-xs font-mono text-text-primary break-all">{cmd.command}</code>
                      <div className="flex items-center gap-2 shrink-0">
                        {cmd.isRequired && (
                          <span className="text-[8px] font-black uppercase tracking-widest text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-lg">
                            Required
                          </span>
                        )}
                        {isExecuted ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <button
                            onClick={() => executeCommand(currentPhase, cmdIdx)}
                            className="btn-primary !rounded-xl !text-[10px] !font-black !uppercase !tracking-widest px-3 py-1.5 flex items-center gap-1.5"
                          >
                            <Play className="w-3 h-3" />
                            Execute
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Phase Complete Button */}
            {getExecutedRequiredCount(currentPhase) >= getRequiredCount(currentPhase) && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={completePhase}
                  className="btn-primary !rounded-xl !text-[10px] !font-black !uppercase !tracking-widest px-6 py-2.5 flex items-center gap-2"
                >
                  {activePhaseIndex < selectedScenario.phases.length - 1 ? (
                    <>
                      <span>Next Phase</span>
                      <Zap className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      <span>All Phases Complete</span>
                      <CheckCircle className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Terminal Display */}
        <div className="flex flex-col rounded-2xl border border-border/30 bg-bg-card overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border/20 bg-bg-elevated/30">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
              <div className="w-3 h-3 rounded-full bg-green-400/80" />
            </div>
            <div className="flex items-center gap-2 ml-3">
              <Terminal className="w-4 h-4 text-accent" />
              <span className="text-[10px] font-mono text-text-muted">kill-chain-sim@qyvora:~$</span>
            </div>
          </div>

          <div
            ref={terminalRef}
            className="flex-1 p-4 overflow-y-auto min-h-[250px] max-h-[500px] font-mono text-sm"
          >
            {terminalLines.map((line) => (
              <div key={line.id} className={`whitespace-pre-wrap break-words ${
                line.type === 'input' ? 'text-accent font-bold' :
                line.type === 'error' ? 'text-red-400/80' :
                line.type === 'success' ? 'text-green-400 font-bold' :
                line.type === 'info' ? 'text-yellow-400/70' :
                'text-text-muted/80'
              }`}>
                {line.content}
              </div>
            ))}
            {terminalLines.length === 0 && (
              <div className="text-text-muted/30 text-xs">Terminal output will appear here as you execute commands...</div>
            )}
          </div>
        </div>

        {/* Flag Submission */}
        {allPhasesCompleted && (
          <div className="rounded-2xl border border-border/30 bg-bg-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Flag className="w-4 h-4 text-accent" />
              <span className="text-[9px] font-black uppercase tracking-widest text-accent">Submit Flag</span>
            </div>
            {flagStatus === 'correct' ? (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-green-400/10 border border-green-400/20">
                <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                <div>
                  <p className="text-sm font-black text-green-400">Kill Chain Complete!</p>
                  <p className="text-xs font-mono text-text-muted mt-1">
                    Full penetration chain executed. +{selectedScenario.cpReward} CP earned.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={flagInput}
                  onChange={(e) => { setFlagInput(e.target.value); setFlagStatus('idle'); }}
                  onKeyDown={(e) => { if (e.key === 'Enter') submitFlag(); }}
                  placeholder="FLAG{...}"
                  className="flex-1 bg-bg border border-border rounded-xl py-3 px-4 text-text-primary font-mono text-sm focus:border-accent outline-none"
                />
                <button
                  onClick={submitFlag}
                  disabled={!flagInput.trim() || flagLoading}
                  className="btn-primary !rounded-xl !text-[10px] !font-black !uppercase !tracking-widest px-6 disabled:opacity-50"
                >
                  {flagLoading ? 'Verifying...' : 'Submit'}
                </button>
              </div>
            )}
            {flagStatus === 'incorrect' && (
              <p className="text-xs text-red-400 mt-2 font-mono">Incorrect flag. Review the full chain.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default KillChainLab;
