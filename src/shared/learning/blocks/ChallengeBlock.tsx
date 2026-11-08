/**
 * CHALLENGE BLOCK
 * ===============
 * Reduced-scaffolding exercise: constraints to respect and concrete
 * success criteria, with optional resources.
 */

import React from 'react';
import { ShieldAlert, ListChecks, BookOpen, Minus, CheckCircle2 } from 'lucide-react';
import type { ChallengeBlock } from '../types/blocks';
import type { BlockRendererProps } from '../utils/blockRegistry';
import { GameProse } from './GameProse';

export const ChallengeBlockComponent: React.FC<BlockRendererProps<ChallengeBlock>> = ({ block }) => {
  return (
    <div className="rounded-2xl border-2 border-warning/30 bg-warning/5 px-5 py-4">
      <div className="flex items-center gap-2 mb-1">
        <ShieldAlert className="w-4 h-4 text-warning" aria-hidden="true" />
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-warning">Challenge</p>
      </div>

      <h3 className="mb-2 font-display text-lg font-bold leading-snug tracking-tight text-text-primary sm:text-xl">{block.title}</h3>
      <GameProse text={block.description} className="mb-4" />

      {block.constraints && block.constraints.length > 0 && (
        <div className="mb-4">
          <div className="mb-2 flex items-center gap-2">
            <Minus className="w-3 h-3 text-text-muted" aria-hidden="true" />
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-text-muted">Constraints</p>
          </div>
          <ol className="space-y-2" role="list">
            {block.constraints.map((c, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="shrink-0 select-none pt-0.5 text-text-muted" aria-hidden="true">·</span>
                <GameProse text={c} className="min-w-0 flex-1" />
              </li>
            ))}
          </ol>
        </div>
      )}

      {block.successCriteria && block.successCriteria.length > 0 && (
        <div className="mb-4 rounded-xl border border-warning/20 bg-bg-card px-4 py-3">
          <div className="mb-2 flex items-center gap-2">
            <ListChecks className="w-3 h-3 text-warning" aria-hidden="true" />
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-warning">Success criteria</p>
          </div>
          <ol className="space-y-2" role="list">
            {block.successCriteria.map((c, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="mt-1 h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
                <GameProse text={c} className="min-w-0 flex-1 text-text-primary" />
              </li>
            ))}
          </ol>
        </div>
      )}

      {block.resources && block.resources.length > 0 && (
        <div>
          <div className="mb-2 flex items-center gap-2">
            <BookOpen className="w-3 h-3 text-text-muted" aria-hidden="true" />
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-text-muted">You have</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {block.resources.map((r, i) => (
              <span key={i} className="rounded-lg border border-border/30 bg-bg-elevated px-3 py-1 text-xs font-mono text-text-secondary">
                {r}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengeBlockComponent;