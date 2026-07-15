import { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, Check } from 'lucide-react';
import type { PasswordHash, CrackAttempt } from './types';

interface PasswordCrackerProps {
  hashes: PasswordHash[];
  wordlist: string[];
}

export function PasswordCracker({ hashes, wordlist }: PasswordCrackerProps) {
  const [selectedHash, setSelectedHash] = useState(0);
  const [attempts, setAttempts] = useState<CrackAttempt[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const hash = hashes[selectedHash];

  const stop = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const reset = useCallback(() => {
    stop();
    setAttempts([]);
    setCurrentWord('');
    setProgress(0);
  }, [stop]);

  const startCrack = useCallback(() => {
    reset();
    setIsRunning(true);
    let idx = 0;

    intervalRef.current = setInterval(() => {
      if (idx >= wordlist.length) {
        stop();
        return;
      }
      const word = wordlist[idx];
      const hit = hash.plaintext === word;
      setCurrentWord(word);
      setAttempts(prev => [...prev, { word, result: hit ? 'hit' : 'miss', attemptNumber: idx + 1 }]);
      setProgress(Math.round(((idx + 1) / wordlist.length) * 100));

      if (hit) stop();
      idx++;
    }, 80);
  }, [hash, wordlist, reset, stop]);

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const found = attempts.find(a => a.result === 'hit');

  return (
    <div className="flex flex-col h-full rounded-2xl border border-border/30 bg-bg-card overflow-hidden">
      <div className="px-4 py-3 bg-bg-elevated border-b border-border/20">
        <p className="text-[10px] font-black uppercase tracking-widest text-accent">Password Cracker</p>
      </div>

      {/* Hash Selection */}
      <div className="px-4 py-2 border-b border-border/20 flex items-center gap-2 overflow-auto">
        {hashes.map((h, i) => (
          <button key={i} onClick={() => { setSelectedHash(i); reset(); }}
            className={`px-2 py-1 rounded text-[9px] font-mono shrink-0 ${
              selectedHash === i ? 'bg-accent/20 text-accent' : 'text-text-muted hover:text-text-primary'
            }`}>
            {h.algorithm}
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-0 flex flex-col p-4">
        {/* Current Hash */}
        <div className="mb-4 p-3 bg-black/40 rounded-lg">
          <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-1">Target Hash</p>
          <p className="text-[10px] font-mono text-accent break-all">{hash.hash}</p>
          <p className="text-[9px] font-mono text-text-muted/50 mt-1">Algorithm: {hash.algorithm}</p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 mb-4">
          <button onClick={isRunning ? stop : startCrack}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider ${
              isRunning ? 'bg-yellow-400/10 border border-yellow-400/30 text-yellow-400' :
              'bg-accent/10 border border-accent/30 text-accent'
            }`}>
            {isRunning ? <><Pause size={10} /> Stop</> : <><Play size={10} /> Crack</>}
          </button>
          <button onClick={reset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-elevated border border-border/30 text-[9px] font-black uppercase tracking-wider text-text-muted">
            <RotateCcw size={10} /> Reset
          </button>
          {found && (
            <span className="flex items-center gap-1 text-[9px] font-black text-green-400">
              <Check size={10} /> Found: {found.word}
            </span>
          )}
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-[9px] font-mono text-text-muted mb-1">
            <span>{attempts.length} / {wordlist.length} attempts</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-bg-elevated overflow-hidden">
            <div className="h-full rounded-full bg-accent transition-all duration-100" style={{ width: `${progress}%` }} />
          </div>
          {currentWord && (
            <p className="text-[10px] font-mono text-text-muted mt-1">
              Testing: <span className="text-text-primary">{currentWord}</span>
            </p>
          )}
        </div>

        {/* Attempt Log */}
        <div className="flex-1 overflow-auto">
          <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-2">Attempts</p>
          <div className="space-y-0.5">
            {attempts.slice(-30).map((a, i) => (
              <div key={i} className={`text-[10px] font-mono ${a.result === 'hit' ? 'text-green-400' : 'text-text-muted/50'}`}>
                #{a.attemptNumber} {a.word} {a.result === 'hit' && '✓ MATCH'}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
