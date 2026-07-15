import { useState, useCallback, useMemo } from 'react';
import { Target, ArrowLeft, CheckCircle, AlertTriangle, Terminal, Radar } from 'lucide-react';
import { WalkthroughLayout, WalkthroughStep } from '@/shared/components/walkthrough/';
import { LabConnectButton } from '@/features/student/components/lab/LabConnectButton';
import SEO from '@/shared/components/SEO';
import ScenarioCard from '@/shared/components/ScenarioCard';
import { KILL_CHAIN_SCENARIOS } from '@/features/student/data/simulations/kill-chain-data';
import { createKillChainSimulations } from '@/features/student/components/simulations/labSimulationContent';
import { verifyLabFlag } from '../../../services/lab.service';
import { getRelatedContentForLab } from '@/shared/constants/topicMap';
import RelatedContent from '@/shared/components/RelatedContent';


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

  const handleFlagSubmit = useCallback(async (_stepId: string, flag: string) => {
    if (!activeScenario) return { correct: false };
    try {
      return await verifyLabFlag('kill-chain', activeScenario.id, flag);
    } catch {
      return { correct: false };
    }
  }, [activeScenario]);

  const currentPhase = activeScenario?.phases[activePhaseIndex] ?? null;
  const allPhasesCompleted = activeScenario && completedPhases.size === activeScenario.phases.length;

  if (!activeScenario) return (
    <div className="bg-bg min-h-full">
      <SEO title="Kill Chain Lab" description="Execute full penetration test simulations." />
      <div className=" px-4 md:px-12 lg:px-16 pt-8 pb-20 lg:pb-24">
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
                onStart={() => startScenario(s)}
            />
          ))}
        </div>

        <div className="mt-10"><RelatedContent {...getRelatedContentForLab('killchain')} title="Continue This Topic" /></div>
      </div>
    </div>
  );

  const simulations = useMemo(
    () => activeScenario ? createKillChainSimulations(activeScenario.phases.map(p => ({ name: p.name, commands: p.commands.map(c => ({ command: c.command, output: c.output })) }))) : [],
    [activeScenario],
  );

  return (
    <div className="bg-bg min-h-full">
      <SEO title={`${activeScenario.title} — Kill Chain`} description={activeScenario.description} />
      <WalkthroughLayout
        title={activeScenario.title}
        subtitle={activeScenario.description}
        icon={<Target className="w-6 h-6" />}
        difficulty={activeScenario.difficulty}
        labId="killchain"
        scenarioId={activeScenario.id}
        onBack={exitScenario}
        completedCount={completedPhases.size}
        totalSteps={activeScenario.phases.length}
        simulations={simulations}
      >
        <div className="rounded-2xl border border-border/30 bg-bg-card p-4 mb-2">
          <p className="text-sm text-text-muted font-mono">🎯 {activeScenario.targetDescription}</p>
        </div>

        <div className="rounded-2xl border border-border/30 bg-bg-card p-5 mb-2">
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
          <>
            {currentPhase.commands.map((cmd, cmdIdx) => {
              const cmdKey = `${currentPhase.id}-${cmdIdx}`;
              const isCompleted = completedCommands.has(cmdKey);
              const allRequiredDone = currentPhase.commands.filter(c => c.isRequired).every((_, i) => completedCommands.has(`${currentPhase.id}-${i}`));
              const isLastRequired = cmd.isRequired && allRequiredDone;

              const phaseEmojis = ['🔎', '💉', '💀', '🔓', '📡', '🏆'];
              const phaseIdx = activeScenario.phases.indexOf(currentPhase);
              const emoji = phaseEmojis[phaseIdx % phaseEmojis.length];

              const narrative = `${emoji} ${currentPhase.name} — Command ${cmdIdx + 1}\n\n${cmd.explanation}\n\nKill Chain Phase:\n  ┌──────────┐     ┌──────────┐     ┌──────────┐\n  │  Phase   │────▶│  Execute │────▶│  Result  │\n  │  ${currentPhase.name.padEnd(7)}│     │  Command │     │  Gained  │\n  └──────────┘     └──────────┘     └──────────┘\n       │                │                │\n       └── Inject ──────┘                │\n              │                          │\n              └──── Access ◀─────────────┘\n\nExecute the command below to advance the kill chain.`;

              return (
                <WalkthroughStep
                  key={cmdIdx}
                  stepIndex={cmdIdx}
                  title={`${currentPhase.name} — Command ${cmdIdx + 1}`}
                  narrative={narrative}
                  commandInstruction={cmd.command}
                  isLocked={false}
                  isCompleted={isCompleted}
                  isActive={!isCompleted}
                  flagId={cmdKey}
                  labId="killchain"
                  onFlagSubmit={handleFlagSubmit}
                  onComplete={() => handleCommandComplete(currentPhase.id, cmdIdx)}
                >
                  {cmd.isRequired && (
                    <span className="inline-flex px-2 py-0.5 rounded bg-yellow-400/10 text-[8px] font-black uppercase tracking-widest text-yellow-400">Required</span>
                  )}
                </WalkthroughStep>
              );
            })}

            {currentPhase.commands.filter(c => c.isRequired).every((_, i) => completedCommands.has(`${currentPhase.id}-${i}`)) && (
              <div className="flex justify-end mt-2">
                <button onClick={handlePhaseComplete} className="btn-primary !rounded-xl !text-[10px] px-6 py-2.5 flex items-center gap-2">
                  {activePhaseIndex < activeScenario.phases.length - 1 ? <>Complete Phase & Move Next</> : <>All Phases Complete <CheckCircle className="w-3.5 h-3.5" /></>}
                </button>
              </div>
            )}
          </>
        )}

        {flagStatus === 'correct' && (
          <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
              <CheckCircle className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-lg font-black text-accent">Mission Complete!</p>
              <p className="text-sm font-mono text-text-muted mt-1">+{activeScenario.cpReward} CP earned.</p>
              <button onClick={exitScenario} className="btn-secondary !rounded-xl !text-[10px] mt-3 px-5 py-2">Back to Scenarios</button>
            </div>
          </div>
        )}
      </WalkthroughLayout>
    </div>
  );
};

export default KillChainLab;
