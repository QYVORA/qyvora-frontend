/**
 * COMPARISON BLOCK
 * ================
 * Side-by-side before/after (vulnerable vs safe) code with the key difference.
 */

import React from 'react';
import { Scale } from 'lucide-react';
import type { ComparisonBlock } from '../types/blocks';
import type { BlockRendererProps } from '../utils/blockRegistry';

export const ComparisonBlockComponent: React.FC<BlockRendererProps<ComparisonBlock>> = ({ block }) => {
  const title = block.title ?? 'Comparison';
  const leftCode = block.left.code.split('\n');
  const rightCode = block.right.code.split('\n');

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Scale className="w-4 h-4 text-accent" aria-hidden="true" />
        <p className="text-xs font-black uppercase tracking-widest text-accent">{title}</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {[
          { side: block.left, tone: 'left', lines: leftCode },
          { side: block.right, tone: 'right', lines: rightCode },
        ].map(({ side, tone, lines }, idx) => (
          <div key={idx} className={`overflow-hidden rounded-xl border bg-bg ${tone === 'left' ? 'border-danger/30' : 'border-accent/30'}`}>
            <div className={`border-b px-3 py-2 ${tone === 'left' ? 'border-danger/20 bg-danger/5' : 'border-accent/20 bg-accent-dim'}`}>
              <span className={`text-[10px] font-black uppercase tracking-widest ${tone === 'left' ? 'text-danger' : 'text-accent'}`}>
                {side.label}
              </span>
            </div>
            <pre className="overflow-x-auto p-3 text-xs font-mono leading-[2] text-text-secondary">
              {lines.map((l, i) => (
                <div key={i}><span className="whitespace-pre text-text-primary">{l || ' '}</span></div>
              ))}
            </pre>
            {side.explanation && (
              <p className="border-t border-border/30 bg-bg-elevated px-3 py-2 text-xs font-mono text-text-secondary leading-[2]">
                {side.explanation}
              </p>
            )}
          </div>
        ))}
      </div>

      {block.keyDifference && (
        <div className="rounded-xl border border-warning/30 bg-warning/5 px-4 py-3">
          <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-warning">Key Difference</p>
          <p className="text-sm font-mono text-warning/90 leading-[2]">{block.keyDifference}</p>
        </div>
      )}
    </div>
  );
};

export default ComparisonBlockComponent;