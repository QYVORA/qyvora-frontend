/**
 * LAB BLOCK
 * =========
 * Lab handoff card — the bridge from what was just learned into the attack lab.
 */

import React from 'react';
import { FlaskConical, Clock } from 'lucide-react';
import type { LabBlock } from '../types/blocks';
import type { BlockRendererProps } from '../utils/blockRegistry';
import { GameProse } from './GameProse';

export const LabBlockComponent: React.FC<BlockRendererProps<LabBlock>> = ({ block }) => {
  return (
    <div className="rounded-2xl border-2 border-accent/30 bg-accent-dim px-5 py-4">
      <div className="flex items-center gap-2 mb-2">
        <FlaskConical className="w-4 h-4 text-accent" aria-hidden="true" />
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-accent">Lab</p>
        <span className="ml-auto rounded-md border border-accent/30 bg-accent/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-accent">
          {block.labId}
        </span>
      </div>

      <h3 className="mb-2 font-display text-lg font-bold leading-snug tracking-tight text-text-primary sm:text-xl">{block.title}</h3>
      <GameProse text={block.summary} className="mb-4" />

      <div className="mb-3">
        <p className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-accent/70">What you'll do</p>
        <ol className="space-y-2" role="list">
          {block.objectives.map((obj, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="shrink-0 select-none pt-0.5 font-mono text-xs font-black text-accent" aria-label={`Objective ${i + 1}`}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <GameProse text={obj} className="min-w-0 flex-1 text-text-primary" />
            </li>
          ))}
        </ol>
      </div>

      {block.estimatedMinutes !== undefined && (
        <p className="flex items-center gap-1.5 text-xs font-mono text-text-muted">
          <Clock className="h-3 w-3" aria-hidden="true" /> ~{block.estimatedMinutes} min
        </p>
      )}
    </div>
  );
};

export default LabBlockComponent;