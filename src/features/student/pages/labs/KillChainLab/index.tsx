import { useState, useCallback } from 'react';
import { Target, ArrowLeft, CheckCircle, AlertTriangle, Terminal, Radar } from 'lucide-react';
import SEO from '@/shared/components/SEO';
import ScenarioCard from '@/shared/components/ScenarioCard';
import { SCENARIO_DIAGRAMS } from '@/shared/components/ScenarioDiagrams';
import { KILL_CHAIN_SCENARIOS } from '@/features/student/data/simulations/kill-chain-data';
import { verifyLabFlag } from '../../../services/lab.service';

const DIFFICULTY_STYLES: Record<string, string> = {
  beginner: 'bg-green-400/10 text-green-400 border-green-400/20',
  intermediate: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
  advanced: 'bg-red-400/10 text-red-400 border-red-400/20',
};

const KillChainLab = () => {
  const [activeScenario, setActiveScenario] = useState(null);
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [completedCommands, setCompletedCommands] = useState(new Set());
  const [completedPhases, setCompletedPhases] = useState(new Set());
  const [flagInput, setFlagInput] = useState('');
  const [flagStatus, setFlagStatus] = useState('idle');
  const [flagLoading, setFlagLoading] = useState(false);

  const startScenario = useCallback((scenario) => {
    setActiveScenario(scenario); setActivePhaseIndex(0);
    setCompletedCommands(new Set()); setCompletedPhases(new Set());
    setFlagInput(''); setFlagStatus('idle'); setFlagLoading(false);
  }, []);

  const exitScenario = useCallback(() => {
    setActiveScenario(null); setActivePhaseIndex(0);
    setCompletedCommands(new Set()); setCompletedPhases(new Set());
    setFlagInput(''); setFlagStatus('idle'); setFlagLoading(false);
  }, []);

  const handleCommandComplete = useCallback((phaseId, cmdIndex) => {
    setCompletedCommands(prev => new Set(prev).add(`${phaseId}-${cmdIndex}`));
  }, []);

  const handlePhaseComplete = useCallback(() => {
    if (!activeScenario) return;
    setCompletedPhases(prev => new Set(prev).add(activeScenario.phases[activePhaseIndex].id));
    if (activePhaseIndex < activeScenario.phases.length - 1) setActivePhaseIndex(prev => prev + 1);
  }, [activeScenario, activePhaseIndex]);

  const handleSubmitFlag = useCallback(async () => {
    if (!activeScenario || !flagInput.trim() || flagLoading) return;
    setFlagLoading(true);
    try {
      const result = await verifyLabFlag('kill-chain', activeScenario.id, flagInput.trim());
      setFlagStatus(result.correct ? 'correct' : 'incorrect');
    } catch { setFlagStatus('incorrect'); } finally { setFlagLoading(false); }
  }, [activeScenario, flagInput, flagLoading]);

  const currentPhase = activeScenario?.phases[activePhaseIndex] ?? null;
  const allPhasesCompleted = activeScenario && completedPhases.size === activeScenario.phases.length;

  if (!activeScenario) return (
    <div className="bg-bg min-h-full">
      <SEO title="Kill Chain Lab" description="Execute full penetration test simulations." />
      <div className="mx-auto max-w-[1600px] px-4 md:px-6 lg:px-8 pt-8 pb-20 lg:pb-24">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
              <Target className="w-7 h-7 text-accent" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tight">Kill <span className="text-accent">Chain</span> Lab</h1>
          </div>
          <p className="text-base text-text-muted font-mono max-w-2xl">Execute full kill chain simulations — from reconnaissance to exfiltration.</p>
        </div>
        <div className="border-t border-border/30 mb-10" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {KILL_CHAIN_SCENARIOS.map((s, i) => (
              <ScenarioCard
                key={s.id}
                index={i}
                title={s.title}
                difficulty={s.difficulty}
                description={s.description}
                cpReward={s.cpReward}
                accentColor="#DC2626"
                diagramSvg={SCENARIO_DIAGRAMS[s.id]}
                onStart={() => startScenario(s)}
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-bg min-h-full">
      <SEO title={`${activeScenario.title} — Kill Chain`} description={activeScenario.description} />
      <div className="mx-auto max-w-[1600px] px-4 md:px-6 lg:px-8 pt-8 pb-20 lg:pb-24">
        <div className="mb-8">
          <button onClick={exitScenario} className="flex items-center gap-2 text-text-muted hover:text-accent transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> <span className="text-[10px] font-black uppercase tracking-widest">All Scenarios</span>
          </button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
              <Target className="w-7 h-7 text-accent" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-text-primary tracking-tight">{activeScenario.title}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${DIFFICULTY_STYLES[activeScenario.difficulty]}`}>{activeScenario.difficulty}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border/30 bg-bg-card p-4 mb-8">
          <p className="text-sm text-text-muted font-mono">{activeScenario.targetDescription}</p>
        </div>

        <div className="rounded-2xl border border-border/30 bg-bg-card p-5 mb-8">
          <div className="flex items-center gap-2 mb-4"><Radar className="w-4 h-4 text-accent" /><span className="text-[9px] font-black uppercase tracking-widest text-accent">Kill Chain Progress</span></div>
          <div className="flex items-center gap-2 flex-wrap">
            {activeScenario.phases.map((phase, idx) => {
              const done = completedPhases.has(phase.id);
              const current = idx === activePhaseIndex;
              return (
                <div key={phase.id} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  done ? 'bg-accent/10 text-accent border border-accent/30' : current ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/30' : 'bg-white/5 text-text-muted/40 border border-border/20'
                }`}>
                  {done ? <CheckCircle className="w-3.5 h-3.5" /> : <span>{idx + 1}</span>}
                  {phase.name}
                </div>
              );
            })}
          </div>
        </div>

        {currentPhase && (
          <div className="mb-8 space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-black text-text-primary uppercase tracking-wider">{currentPhase.name}</h2>
              <span className="text-sm font-mono text-text-muted">({currentPhase.description})</span>
            </div>
            {currentPhase.commands.map((cmd, cmdIdx) => {
              const cmdKey = `${currentPhase.id}-${cmdIdx}`;
              const isCompleted = completedCommands.has(cmdKey);
              return (
                <div key={cmdIdx} className={`rounded-2xl border p-6 transition-all ${isCompleted ? 'border-accent/30 bg-accent/5' : 'border-accent/30 bg-bg-card'}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black ${isCompleted ? 'bg-accent text-white' : 'bg-accent/20 text-accent'}`}>
                      {isCompleted ? <CheckCircle className="w-4 h-4" /> : cmdIdx + 1}
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-accent">Command</span>
                    {cmd.isRequired && <span className="px-2 py-0.5 rounded bg-yellow-400/10 text-[8px] font-black uppercase tracking-widest text-yellow-400">Required</span>}
                  </div>
                  <p className="text-base text-text-secondary font-mono leading-relaxed mb-2">
                    Run: <code className="px-2 py-0.5 bg-white/5 rounded text-accent">{cmd.command}</code>
                  </p>
                  {isCompleted && (
                    <><div className="rounded-xl bg-white/5 p-3 mb-2"><pre className="text-sm font-mono text-text-muted/70 whitespace-pre-wrap">{cmd.output}</pre></div><p className="text-sm text-text-muted font-mono">{cmd.explanation}</p></>
                  )}
                  {!isCompleted && <button onClick={() => handleCommandComplete(currentPhase.id, cmdIdx)} className="btn-primary !rounded-xl !text-[10px] px-5 py-2.5 mt-2">Execute Command</button>}
                  {isCompleted && <div className="flex items-center gap-1.5 mt-3 text-accent"><CheckCircle className="w-3.5 h-3.5" /><span className="text-[9px] font-black uppercase tracking-widest">Executed</span></div>}
                </div>
              );
            })}
            {currentPhase.commands.filter(c => c.isRequired).every((_, i) => completedCommands.has(`${currentPhase.id}-${i}`)) && (
              <div className="flex justify-end mt-4">
                <button onClick={handlePhaseComplete} className="btn-primary !rounded-xl !text-[10px] px-6 py-2.5 flex items-center gap-2">
                  {activePhaseIndex < activeScenario.phases.length - 1 ? <>Complete Phase & Move Next</> : <>All Phases Complete <CheckCircle className="w-3.5 h-3.5" /></>}
                </button>
              </div>
            )}
          </div>
        )}

        {allPhasesCompleted && (
          <><div className="border-t border-border/30 mb-8" /><div className="mb-8">
            <h2 className="text-lg font-black text-text-primary uppercase tracking-wider mb-4">Capture the Flag</h2>
            <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6">
              <p className="text-sm font-black text-accent mb-2">Kill Chain Complete!</p>
              <p className="text-sm text-text-muted font-mono mb-4">Submit the flag to claim your {activeScenario.cpReward} CP reward.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input type="text" value={flagInput} onChange={(e) => { setFlagInput(e.target.value); setFlagStatus('idle'); }} onKeyDown={(e) => { if (e.key === 'Enter') handleSubmitFlag(); }} placeholder="FLAG{...}" className="flex-1 bg-bg border border-border rounded-xl py-3 px-4 text-text-primary font-mono text-sm focus:border-accent outline-none" />
                <button onClick={handleSubmitFlag} disabled={!flagInput.trim() || flagLoading} className="btn-primary !rounded-xl !text-[11px] px-8 disabled:opacity-50">{flagLoading ? 'Verifying...' : 'Submit Flag'}</button>
              </div>
              {flagStatus === 'incorrect' && <div className="flex items-center gap-2 mt-3 text-sm text-red-400 font-mono"><AlertTriangle className="w-4 h-4" />Incorrect flag. Review the full chain.</div>}
            </div>
          </div></>
        )}

        {!allPhasesCompleted && (
          <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-4 flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
            <p className="text-sm font-mono text-text-muted">Complete all phases to unlock flag submission.</p>
          </div>
        )}

        {flagStatus === 'correct' && (
          <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center shrink-0"><CheckCircle className="w-6 h-6 text-accent" /></div>
            <div>
              <p className="text-lg font-black text-accent">Mission Complete!</p>
              <p className="text-sm font-mono text-text-muted mt-1">+{activeScenario.cpReward} CP earned.</p>
              <button onClick={exitScenario} className="btn-secondary !rounded-xl !text-[10px] mt-3 px-5 py-2">Back to Scenarios</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KillChainLab;
