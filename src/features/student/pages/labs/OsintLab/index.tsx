import { useState, useCallback, useRef, useEffect } from 'react';
import {
  Search, Terminal, ArrowLeft, CheckCircle, Globe, User, Mail,
  Server, Shield, AlertTriangle,
} from 'lucide-react';
import { OSINT_CHALLENGES } from '@/features/student/data/simulations/osint-data';
import type { OsintChallenge, OsintStep } from '@/features/student/data/simulations/osint-data';

const DIFFICULTY_STYLES: Record<string, { bg: string; text: string }> = {
  beginner: { bg: 'bg-accent/10', text: 'text-accent' },
  intermediate: { bg: 'bg-yellow-400/10', text: 'text-yellow-400' },
  advanced: { bg: 'bg-red-400/10', text: 'text-red-400' },
};

const TOOL_ICONS: Record<string, typeof Globe> = {
  whois: Globe,
  dig: Globe,
  theHarvester: Search,
  sherlock: User,
  'github-dork': Search,
  curl: Terminal,
  exiftool: Search,
  subfinder: Globe,
  amass: Globe,
  nmap: Server,
  grep: Search,
  'breach-check': Shield,
  analysis: Terminal,
};

const SuccessCelebration = ({ challenge, onBack }: { challenge: OsintChallenge; onBack: () => void }) => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-lg">
        <div className="w-20 h-20 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-accent" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-text-primary mb-2">
          Challenge Complete!
        </h1>
        <p className="text-text-muted font-mono mb-2">{challenge.title}</p>
        <p className="text-accent text-2xl font-black mb-6">{challenge.cpReward} CP</p>
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {challenge.skills.map((skill) => (
            <span key={skill} className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-accent/10 text-accent">
              {skill}
            </span>
          ))}
        </div>
        <button onClick={onBack} className="btn-primary !rounded-xl !text-[10px] !font-black !uppercase !tracking-widest px-6 py-3">
          Back to Challenges
        </button>
      </div>
    </div>
  );
};

const ChallengeCard = ({ challenge, onClick }: { challenge: OsintChallenge; onClick: () => void }) => {
  const diff = DIFFICULTY_STYLES[challenge.difficulty];

  return (
    <button
      onClick={onClick}
      className="group flex flex-col h-full rounded-2xl border border-border/30 bg-bg-card p-5 hover:border-accent/30 transition-all duration-300 text-left w-full"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
          <Search className="w-5 h-5 text-accent" />
        </div>
        <h3 className="text-sm font-black text-text-primary group-hover:text-accent transition-colors leading-snug">
          {challenge.title}
        </h3>
      </div>

      <p className="text-xs text-text-muted/70 font-mono leading-relaxed mb-4 flex-1 line-clamp-2">
        {challenge.description}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${diff.bg} ${diff.text}`}>
          {challenge.difficulty}
        </span>
        {challenge.skills.slice(0, 3).map((skill) => (
          <span key={skill} className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-purple-500/10 text-purple-400">
            {skill}
          </span>
        ))}
        {challenge.skills.length > 3 && (
          <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-bg-elevated text-text-muted">
            +{challenge.skills.length - 3}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border/20">
        <span className="text-[10px] font-black uppercase tracking-widest text-accent">
          {challenge.cpReward} CP
        </span>
        <span className="text-[10px] font-black uppercase tracking-widest text-text-muted group-hover:text-accent transition-colors">
          Start Challenge
        </span>
      </div>
    </button>
  );
};

const OsintLab = () => {
  const [activeChallenge, setActiveChallenge] = useState<OsintChallenge | null>(null);
  const [executedSteps, setExecutedSteps] = useState<Set<number>>(new Set());
  const [flagInput, setFlagInput] = useState('');
  const [flagStatus, setFlagStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [executedSteps]);

  const handleStart = useCallback((challenge: OsintChallenge) => {
    setActiveChallenge(challenge);
    setExecutedSteps(new Set());
    setFlagInput('');
    setFlagStatus('idle');
  }, []);

  const handleBack = useCallback(() => {
    setActiveChallenge(null);
    setExecutedSteps(new Set());
    setFlagInput('');
    setFlagStatus('idle');
  }, []);

  const executeStep = useCallback((index: number) => {
    setExecutedSteps((prev) => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  }, []);

  const submitFlag = useCallback(() => {
    if (!activeChallenge || !flagInput.trim()) return;
    if (flagInput.trim() === activeChallenge.flag) {
      setFlagStatus('correct');
    } else {
      setFlagStatus('incorrect');
    }
  }, [activeChallenge, flagInput]);

  const allStepsCompleted = activeChallenge
    ? executedSteps.size >= activeChallenge.steps.length
    : false;

  if (!activeChallenge) {
    return (
      <div className="bg-bg min-h-full">
        <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 pt-8 pb-20 lg:pb-24 space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
                <Globe className="w-6 h-6 text-accent" />
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-text-primary tracking-tight">
                OSINT Recon <span className="text-accent">Challenge</span>
              </h1>
            </div>
            <p className="text-sm text-text-muted font-mono">
              Master open-source intelligence gathering with guided reconnaissance exercises.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {OSINT_CHALLENGES.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onClick={() => handleStart(challenge)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (flagStatus === 'correct') {
    return (
      <div className="bg-bg min-h-full">
        <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 pt-8 pb-20 lg:pb-24">
          <SuccessCelebration challenge={activeChallenge} onBack={handleBack} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg min-h-full">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 pt-8 pb-20 lg:pb-24 space-y-6">
        <div>
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-text-muted hover:text-accent transition-colors text-sm mb-5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Back to Challenges</span>
          </button>

          <div className="rounded-2xl border border-border/30 bg-bg-card p-4 mb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                  <Search className="w-5 h-5 text-accent" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm font-black text-text-primary truncate">{activeChallenge.title}</h2>
                  <p className="text-xs text-text-muted/80 font-mono line-clamp-1">{activeChallenge.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${DIFFICULTY_STYLES[activeChallenge.difficulty].bg} ${DIFFICULTY_STYLES[activeChallenge.difficulty].text}`}>
                  {activeChallenge.difficulty}
                </span>
                <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-accent/10 text-accent">
                  {activeChallenge.cpReward} CP
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/30 bg-bg-card p-4 mb-4">
            <div className="flex items-center gap-2 mb-1">
              <User className="w-4 h-4 text-accent" />
              <span className="text-xs font-black text-text-primary">{activeChallenge.targetName}</span>
            </div>
            <p className="text-xs text-text-muted font-mono ml-6">{activeChallenge.targetDescription}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-4">
          <div className="flex flex-col rounded-2xl border border-border/30 bg-bg-card overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/20">
              <Terminal className="w-4 h-4 text-accent" />
              <span className="text-[10px] font-mono text-text-muted">recon@osint:~$</span>
              <span className="ml-auto text-[9px] font-mono text-text-muted">
                {executedSteps.size}/{activeChallenge.steps.length} steps
              </span>
            </div>

            <div ref={terminalRef} className="flex-1 overflow-y-auto max-h-[500px]">
              {activeChallenge.steps.map((step, index) => {
                const isExecuted = executedSteps.has(index);
                const isUnlocked = index === 0 || executedSteps.has(index - 1);
                const ToolIcon = TOOL_ICONS[step.tool] || Terminal;

                return (
                  <StepBlock
                    key={index}
                    step={step}
                    index={index}
                    isExecuted={isExecuted}
                    isUnlocked={isUnlocked}
                    onExecute={() => executeStep(index)}
                    ToolIcon={ToolIcon}
                  />
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-border/30 bg-bg-card overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border/20">
                <Shield className="w-4 h-4 text-accent" />
                <span className="text-[9px] font-black uppercase tracking-widest text-accent">Skills Learned</span>
              </div>
              <div className="p-3 space-y-2">
                {activeChallenge.skills.map((skill, i) => {
                  const skillStep = Math.floor((i / activeChallenge.skills.length) * activeChallenge.steps.length);
                  const learned = executedSteps.has(skillStep);

                  return (
                    <div
                      key={skill}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-colors ${
                        learned
                          ? 'bg-accent/10 border border-accent/20'
                          : 'bg-bg border border-border/20'
                      }`}
                    >
                      {learned ? (
                        <CheckCircle className="w-3.5 h-3.5 text-accent shrink-0" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-border/50 shrink-0" />
                      )}
                      <span className={`text-xs font-mono ${learned ? 'text-accent' : 'text-text-muted/60'}`}>
                        {skill}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-border/30 bg-bg-card overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border/20">
                <Mail className="w-4 h-4 text-accent" />
                <span className="text-[9px] font-black uppercase tracking-widest text-accent">Progress</span>
              </div>
              <div className="p-3">
                <div className="w-full h-2 rounded-full bg-bg-elevated overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-500"
                    style={{ width: `${(executedSteps.size / activeChallenge.steps.length) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] font-mono text-text-muted mt-2 text-center">
                  {Math.round((executedSteps.size / activeChallenge.steps.length) * 100)}% complete
                </p>
              </div>
            </div>
          </div>
        </div>

        {allStepsCompleted && (
          <div className="rounded-2xl border border-accent/30 bg-accent/5 p-5">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-5 h-5 text-accent" />
              <span className="text-sm font-black text-accent">All steps completed!</span>
            </div>
            <p className="text-xs text-text-muted font-mono mb-3">
              Submit the completion flag to earn {activeChallenge.cpReward} CP
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                value={flagInput}
                onChange={(e) => { setFlagInput(e.target.value); setFlagStatus('idle'); }}
                onKeyDown={(e) => { if (e.key === 'Enter') submitFlag(); }}
                placeholder="FLAG{...}"
                className="flex-1 bg-bg border border-border rounded-xl py-3 px-4 text-text-primary focus:border-accent outline-none font-mono text-sm"
              />
              <button
                onClick={submitFlag}
                disabled={!flagInput.trim()}
                className="btn-primary !rounded-xl !text-[10px] !font-black !uppercase !tracking-widest px-6 py-3 disabled:opacity-50"
              >
                Submit
              </button>
            </div>
            {flagStatus === 'incorrect' && (
              <div className="mt-4 p-4 rounded-xl bg-red-400/10 border border-red-400/30">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-red-400">Incorrect flag. Try again.</span>
                </div>
              </div>
            )}
          </div>
        )}

        {!allStepsCompleted && (
          <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
              <p className="text-xs text-text-muted font-mono">
                Execute all steps above to unlock the flag submission.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StepBlock = ({
  step,
  index,
  isExecuted,
  isUnlocked,
  onExecute,
  ToolIcon,
}: {
  step: OsintStep;
  index: number;
  isExecuted: boolean;
  isUnlocked: boolean;
  onExecute: () => void;
  ToolIcon: typeof Globe;
}) => {
  const [showOutput, setShowOutput] = useState(false);

  useEffect(() => {
    if (isExecuted) {
      setShowOutput(true);
    }
  }, [isExecuted]);

  return (
    <div className={`border-b border-border/20 last:border-b-0 transition-colors ${!isUnlocked ? 'opacity-40 pointer-events-none' : ''}`}>
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-accent/10 flex items-center justify-center text-[10px] font-black text-accent shrink-0">
              {index + 1}
            </span>
            <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-bg-elevated text-text-muted flex items-center gap-1.5">
              <ToolIcon className="w-3 h-3" />
              {step.tool}
            </span>
          </div>
          {!isExecuted && isUnlocked && (
            <button
              onClick={onExecute}
              className="btn-primary !rounded-xl !text-[10px] !font-black !uppercase !tracking-widest px-4 py-2"
            >
              Execute
            </button>
          )}
          {isExecuted && (
            <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-accent">
              <CheckCircle className="w-3.5 h-3.5" />
              Executed
            </span>
          )}
        </div>

        <div className="rounded-xl bg-[#0d1117] p-3 font-mono text-sm mb-2">
          <span className="text-green-400">root@osint</span>
          <span className="text-text-muted">:</span>
          <span className="text-blue-400">~</span>
          <span className="text-text-muted">$ </span>
          <span className="text-green-300">{step.command}</span>
        </div>

        {isExecuted && showOutput && (
          <div className="space-y-2 mt-2">
            <div className="rounded-xl bg-[#0d1117] p-3 font-mono text-xs overflow-x-auto">
              <pre className="text-text-muted/70 whitespace-pre-wrap break-words">{step.output}</pre>
            </div>
            <div className="px-3 py-2 rounded-xl bg-accent/5 border border-accent/10">
              <p className="text-xs text-text-muted/80 font-mono leading-relaxed">{step.explanation}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OsintLab;
