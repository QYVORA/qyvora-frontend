/**
 * LAB BLOCK
 * =========
 * Lab handoff card — the bridge from what was just learned into the attack lab.
 */

import React from 'react';
import { FlaskConical, Clock } from 'lucide-react';
import type { LabBlock } from '../types/blocks';
import type { BlockRendererProps } from '../utils/blockRegistry';

export const LabBlockComponent: React.FC<BlockRendererProps<LabBlock>> = ({ block }) => {
  return (
    <div className="rounded-2xl border-2 border-accent/30 bg-accent-dim px-5 py-4">
      <div className="flex items-center gap-2 mb-2">
        <FlaskConical className="w-4 h-4 text-accent" aria-hidden="true" />
        <p className="text-[10px] font-black uppercase tracking-widest text-accent">Lab</p>
        <span className="ml-auto rounded-md border border-accent/30 bg-accent/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-accent">
          {block.labId}
        </span>
      </div>

      <h3 className="mb-2 text-lg md:text-xl font-black text-text-primary tracking-tight">{block.title}</h3>
      <p className="mb-4 text-sm md:text-base font-mono text-text-secondary leading-relaxed">{block.summary}</p>

      <div className="mb-3">
        <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-accent/70">What you'll do</p>
        <ol className="space-y-2" role="list">
          {block.objectives.map((obj, i) => (
            <li key={i} className="flex items-start gap-2 text-sm font-mono text-text-primary leading-relaxed">
              <span className="shrink-0 select-none font-black text-accent" aria-label={`Objective ${i + 1}`}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span>{obj}</span>
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