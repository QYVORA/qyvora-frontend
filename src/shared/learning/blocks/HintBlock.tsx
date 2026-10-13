/**
 * HINT BLOCK
 * ==========
 * Standalone progressive hints — reveal levels one at a time.
 */

import React, { useState } from 'react';
import { Lightbulb } from 'lucide-react';
import type { HintBlock } from '../types/blocks';
import type { BlockRendererProps } from '../utils/blockRegistry';

export const HintBlockComponent: React.FC<BlockRendererProps<HintBlock>> = ({ block }) => {
  const [visibleLevel, setVisibleLevel] = useState(0);
  const hints = block.hints;

  if (hints.length === 0) return null;

  return (
    <div className="space-y-2">
      {hints.slice(0, visibleLevel).map((hint) => (
        <div key={hint.level} className="rounded-xl border border-warning/20 bg-warning/5 px-4 py-3">
          {hint.label && (
            <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-warning/60">{hint.label}</p>
          )}
          <p className="text-base font-mono text-warning/80 leading-relaxed">{hint.content}</p>
        </div>
      ))}

      {visibleLevel < hints.length && (
        <button
          type="button"
          onClick={() => setVisibleLevel((v) => v + 1)}
          className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-text-muted transition-colors hover:text-warning"
        >
          <Lightbulb className="h-3 w-3" />
          {visibleLevel === 0 ? 'Need a hint?' : 'Need another hint?'}
        </button>
      )}
    </div>
  );
};

export default HintBlockComponent;