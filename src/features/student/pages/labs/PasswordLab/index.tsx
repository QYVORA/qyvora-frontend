import { useState, useRef, useEffect, useCallback } from 'react';
import { Key, Terminal, ArrowLeft, CheckCircle, FileText, Copy, AlertTriangle } from 'lucide-react';
import { PASSWORD_EXERCISES, getShadowFileContent } from '@/features/student/data/simulations/password-exercises';
import SEO from '@/shared/components/SEO';

interface PasswordExercise {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  hashType: string;
  hashFile: string;
  hashContent: string;
  crackedPassword: string;
  wordlist: string;
  steps: string[];
  flag: string;
  cpReward: number;
}

const DIFFICULTY_STYLES: Record<string, { bg: string; text: string }> = {
  beginner: { bg: 'bg-accent/10', text: 'text-accent' },
  intermediate: { bg: 'bg-yellow-400/10', text: 'text-yellow-400' },
  advanced: { bg: 'bg-red-400/10', text: 'text-red-400' },
};

const TerminalLine = ({ text, isCommand }: { text: string; isCommand?: boolean }) => {
  if (isCommand) {
    return (
      <div className="flex items-start gap-2 font-mono text-sm">
        <span className="text-accent shrink-0">operator@qyvora:~$</span>
        <span className="text-accent break-all">{text}</span>
      </div>
    );
  }
  return (
    <div className="font-mono text-sm text-white/80 whitespace-pre-wrap break-all">{text}</div>
  );
};

const StepTerminal = ({ step, output, isExecuted, command }: { step: number; output: string; isExecuted: boolean; command: string }) => {
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
        <TerminalLine text={command} isCommand />
        {isExecuted && output.split('\n').map((line, i) => (
          <TerminalLine key={i} text={line} />
        ))}
      </div>
    </div>
  );
};

const ExerciseCard = ({ exercise, onClick }: { exercise: PasswordExercise; onClick: () => void }) => {
  const difficulty = DIFFICULTY_STYLES[exercise.difficulty];

  return (
    <button
      onClick={onClick}
      className="group flex flex-col h-full rounded-2xl border border-border/30 bg-bg-card p-5 hover:border-accent/30 transition-all duration-300 text-left w-full"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
          <Key className="w-5 h-5 text-accent" />
        </div>
        <h3 className="text-sm font-black text-text-primary group-hover:text-accent transition-colors leading-snug">
          {exercise.title}
        </h3>
      </div>

      <p className="text-xs text-text-muted/70 font-mono leading-relaxed mb-4 flex-1 line-clamp-2">
        {exercise.description}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-accent/10 text-accent">
          {exercise.hashType}
        </span>
        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${difficulty.bg} ${difficulty.text}`}>
          {exercise.difficulty}
        </span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border/20">
        <span className="text-[10px] font-black uppercase tracking-widest text-accent">
          {exercise.cpReward} CP
        </span>
        <span className="text-[10px] font-black uppercase tracking-widest text-text-muted group-hover:text-accent transition-colors">
          Start Lab
        </span>
      </div>
    </button>
  );
};

const PasswordLab = () => {
  const [activeExercise, setActiveExercise] = useState<PasswordExercise | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [flagInput, setFlagInput] = useState('');
  const [flagSubmitted, setFlagSubmitted] = useState(false);
  const [flagCorrect, setFlagCorrect] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  const isShadowExercise = activeExercise?.id === 'pwd-crack-shadow-extract';
  const allStepsCompleted = activeExercise && completedSteps.size >= activeExercise.steps.length;

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [completedSteps]);

  const handleBack = useCallback(() => {
    setActiveExercise(null);
    setCompletedSteps(new Set());
    setFlagInput('');
    setFlagSubmitted(false);
    setFlagCorrect(false);
    setCopiedHash(false);
  }, []);

  const handleStartExercise = useCallback((exercise: PasswordExercise) => {
    setActiveExercise(exercise);
    setCompletedSteps(new Set());
    setFlagInput('');
    setFlagSubmitted(false);
    setFlagCorrect(false);
    setCopiedHash(false);
  }, []);

  const handleExecuteStep = useCallback((stepIndex: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      next.add(stepIndex);
      return next;
    });
  }, []);

  const handleSubmitFlag = useCallback(() => {
    if (!activeExercise) return;
    const correct = flagInput.trim() === activeExercise.flag;
    setFlagCorrect(correct);
    setFlagSubmitted(true);
  }, [activeExercise, flagInput]);

  const handleCopyHash = useCallback(() => {
    if (!activeExercise) return;
    navigator.clipboard.writeText(activeExercise.hashContent);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  }, [activeExercise]);

  const getStepOutput = useCallback((exercise: PasswordExercise, stepIndex: number): string => {
    const step = exercise.steps[stepIndex];
    const isLastCrackStep = stepIndex === exercise.steps.length - 2 && step.includes('--show');
    const isShowStep = step.includes('--show');
    const isJohnShow = step.includes('john --show');

    if (isJohnShow || isLastCrackStep) {
      return `${exercise.hashFile}:${exercise.crackedPassword}`;
    }
    if (isShowStep) {
      return `${exercise.hashContent}:${exercise.crackedPassword}`;
    }

    if (step.includes('echo') && step.includes('>')) {
      return '';
    }
    if (step.includes('hashcat') && !step.includes('--show')) {
      return `Session..........: hashcat\nStatus...........: Cracked\nHash.Mode........: (${exercise.hashType})\nRecovered........: 1/1 (100.00%)\nSpeed.#1...........: 1234.5 kH/s`;
    }
    if (step.includes('john') && !step.includes('--show') && !step.includes('unshadow')) {
      return `Loaded 1 password hash [${exercise.hashType}]\n1g 0:00:00:02 100.00%\nSession completed`;
    }
    if (step.includes('cat') && step.includes('shadow')) {
      return 'shadow file extracted (21 entries)';
    }
    if (step.includes('unshadow')) {
      return 'unshadowed.txt created (6 crackable entries)';
    }
    if (step.includes('cat >')) {
      return '';
    }
    if (step.includes('EOF')) {
      return '';
    }

    return 'done';
  }, []);

  if (!activeExercise) {
    return (
      <div className="bg-bg min-h-full">
        <SEO title="Password Cracking Lab" description="Crack password hashes using John the Ripper and Hashcat." />

        <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 pt-8 pb-20 lg:pb-24 space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
                <Key className="w-6 h-6 text-accent" />
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-text-primary tracking-tight">
                Password <span className="text-accent">Cracking</span>
              </h1>
            </div>
            <p className="text-sm text-text-muted font-mono">
              Extract and crack password hashes using John the Ripper and Hashcat
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PASSWORD_EXERCISES.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                onClick={() => handleStartExercise(exercise)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const difficulty = DIFFICULTY_STYLES[activeExercise.difficulty];

  return (
    <div className="bg-bg min-h-full">
      <SEO title={`${activeExercise.title} — Password Lab`} description={activeExercise.description} />

      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 pt-8 pb-20 lg:pb-24 space-y-6">
        {/* Back button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-text-muted hover:text-accent transition-colors text-sm font-mono"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">Back to Exercises</span>
        </button>

        {/* Exercise info */}
        <div className="rounded-2xl border border-border/30 bg-bg-card p-5">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                <Key className="w-5 h-5 text-accent" />
              </div>
              <h2 className="text-lg font-black text-text-primary">{activeExercise.title}</h2>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-accent/10 text-accent">
                {activeExercise.hashType}
              </span>
              <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${difficulty.bg} ${difficulty.text}`}>
                {activeExercise.difficulty}
              </span>
              <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-accent/10 text-accent">
                {activeExercise.cpReward} CP
              </span>
            </div>
          </div>
          <p className="text-xs text-text-muted/70 font-mono leading-relaxed">
            {activeExercise.description}
          </p>
        </div>

        {/* Hash file content */}
        <div className="rounded-2xl border border-border/30 bg-bg-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-accent" />
              <span className="text-[9px] font-black uppercase tracking-widest text-accent">
                {isShadowExercise ? 'Shadow File Content' : `Hash File: ${activeExercise.hashFile}`}
              </span>
            </div>
            {!isShadowExercise && (
              <button
                onClick={handleCopyHash}
                className="btn-secondary flex items-center gap-1.5 px-3 py-1.5 !rounded-xl !text-[10px] !font-black !uppercase !tracking-widest text-accent hover:bg-accent/20 transition-colors"
              >
                <Copy className="w-3 h-3" />
                {copiedHash ? 'Copied' : 'Copy'}
              </button>
            )}
          </div>
          <div className="bg-[#050706] rounded-xl p-4 max-h-64 overflow-y-auto" ref={terminalRef}>
            <pre className="font-mono text-xs text-accent/80 whitespace-pre-wrap break-all">
              {isShadowExercise ? getShadowFileContent() : activeExercise.hashContent}
            </pre>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-accent" />
            <span className="text-[9px] font-black uppercase tracking-widest text-accent">
              Step-by-Step Walkthrough
            </span>
          </div>

          {activeExercise.steps.map((step, index) => {
            const isCompleted = completedSteps.has(index);
            const isNextStep = index === 0 ? !completedSteps.has(0) : completedSteps.has(index - 1) && !completedSteps.has(index);
            const isLocked = !isNextStep && !isCompleted;

            return (
              <div key={index} className={`transition-opacity duration-300 ${isLocked ? 'opacity-40' : ''}`}>
                <StepTerminal
                  step={index + 1}
                  command={step}
                  output={isCompleted ? getStepOutput(activeExercise, index) : ''}
                  isExecuted={isCompleted}
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

        {/* Cracked password reveal */}
        {allStepsCompleted && !flagSubmitted && (
          <div className="rounded-2xl border border-accent/30 bg-accent/5 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-accent" />
              <span className="text-sm font-black text-accent">All Steps Completed</span>
            </div>
            <div className="rounded-xl border border-border/30 bg-[#050706] p-4">
              <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-2">Cracked Password(s)</p>
              <p className="font-mono text-lg font-black text-accent">{activeExercise.crackedPassword}</p>
            </div>

            <div>
              <p className="text-xs text-text-muted font-mono mb-2">Submit the flag to claim your {activeExercise.cpReward} CP reward:</p>
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

        {/* Flag result */}
        {flagSubmitted && (
          <div className={`rounded-2xl border p-5 ${flagCorrect ? 'border-accent/30 bg-accent/5' : 'border-red-400/30 bg-red-400/5'}`}>
            {flagCorrect ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span className="text-sm font-black text-accent">Flag Accepted!</span>
                </div>
                <p className="text-xs text-text-muted font-mono">
                  Congratulations! You earned <span className="text-accent font-black">{activeExercise.cpReward} CP</span> for completing this exercise.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleBack}
                    className="btn-secondary !rounded-xl !text-[10px] !font-black !uppercase !tracking-widest px-5 py-2.5"
                  >
                    Back to Exercises
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
                  The flag you submitted is incorrect. Review the cracked output and try again.
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

export default PasswordLab;
