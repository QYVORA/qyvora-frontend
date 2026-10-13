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

export const ChallengeBlockComponent: React.FC<BlockRendererProps<ChallengeBlock>> = ({ block }) => {
  return (
    <div className="rounded-2xl border-2 border-warning/30 bg-warning/5 px-5 py-4">
      <div className="flex items-center gap-2 mb-1">
        <ShieldAlert className="w-4 h-4 text-warning" aria-hidden="true" />
        <p className="text-[10px] font-black uppercase tracking-widest text-warning">Challenge</p>
      </div>

      <h3 className="mb-2 text-lg md:text-xl font-black text-text-primary tracking-tight">{block.title}</h3>
      <p className="mb-4 text-base md:text-lg font-mono text-text-secondary leading-relaxed">{block.description}</p>

      {block.constraints && block.constraints.length > 0 && (
        <div className="mb-4">
          <div className="mb-2 flex items-center gap-2">
            <Minus className="w-3 h-3 text-text-muted" aria-hidden="true" />
            <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Constraints</p>
          </div>
          <ol className="space-y-2" role="list">
            {block.constraints.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-base font-mono text-text-secondary leading-relaxed">
                <span className="shrink-0 select-none text-text-muted" aria-hidden="true">·</span>
                <span>{c}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {block.successCriteria && block.successCriteria.length > 0 && (
        <div className="mb-4 rounded-xl border border-warning/20 bg-bg-card px-4 py-3">
          <div className="mb-2 flex items-center gap-2">
            <ListChecks className="w-3 h-3 text-warning" aria-hidden="true" />
            <p className="text-[10px] font-black uppercase tracking-widest text-warning">Success Criteria</p>
          </div>
          <ol className="space-y-2" role="list">
            {block.successCriteria.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-base font-mono text-text-primary leading-relaxed">
                <CheckCircle2 className="mt-1 w-3.5 h-3.5 shrink-0 text-accent" aria-hidden="true" />
                <span>{c}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {block.resources && block.resources.length > 0 && (
        <div>
          <div className="mb-2 flex items-center gap-2">
            <BookOpen className="w-3 h-3 text-text-muted" aria-hidden="true" />
            <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">You have</p>
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