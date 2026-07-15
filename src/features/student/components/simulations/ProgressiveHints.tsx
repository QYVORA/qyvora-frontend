import { useState } from 'react';
import { Lightbulb, ChevronDown, ChevronRight } from 'lucide-react';
import type { ProgressiveHint } from './types';

interface ProgressiveHintsProps {
  hints: ProgressiveHint[];
  maxLevel?: 1 | 2 | 3 | 4;
}

export function ProgressiveHints({ hints, maxLevel = 4 }: ProgressiveHintsProps) {
  const [revealedLevel, setRevealedLevel] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const visibleHints = hints.filter(h => h.level <= revealedLevel && h.level <= maxLevel);
  const nextHint = hints.find(h => h.level === revealedLevel + 1 && h.level <= maxLevel);

  return (
    <div className="rounded-xl border border-border/20 bg-bg-elevated overflow-hidden">
      <button onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-white/5 transition-colors">
        <Lightbulb size={12} className="text-yellow-400" />
        <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">
          Hints ({visibleHints.length}/{hints.filter(h => h.level <= maxLevel).length})
        </span>
        <span className="ml-auto">
          {expanded ? <ChevronDown size={12} className="text-text-muted" /> : <ChevronRight size={12} className="text-text-muted" />}
        </span>
      </button>

      {expanded && (
        <div className="px-3 pb-3 space-y-2">
          {visibleHints.map(hint => (
            <div key={hint.level} className="p-2 rounded bg-black/30 border border-border/10">
              <p className="text-[8px] font-black uppercase tracking-widest text-yellow-400 mb-1">
                Hint {hint.level}
              </p>
              <p className="text-[10px] font-mono text-text-muted leading-relaxed">{hint.content}</p>
            </div>
          ))}

          {nextHint && (
            <button onClick={() => setRevealedLevel(prev => prev + 1)}
              className="w-full px-3 py-1.5 rounded bg-yellow-400/5 border border-yellow-400/20 text-[9px] font-black uppercase tracking-wider text-yellow-400 hover:bg-yellow-400/10 transition-colors">
              Reveal Hint {nextHint.level}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
