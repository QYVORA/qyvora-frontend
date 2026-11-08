/**
 * DO BLOCK
 * ========
 * Action instructions — turn explanation into practice.
 * Numbered steps with optional expected result and verification hint.
 */

import React from 'react';
import { Play } from 'lucide-react';
import type { DoBlock } from '../types/blocks';
import type { BlockRendererProps } from '../utils/blockRegistry';
import { GameProse } from './GameProse';

export const DoBlockComponent: React.FC<BlockRendererProps<DoBlock>> = ({ block }) => {
  const title = block.title ?? 'Try It';
  
  // Flattened surface: instructions stay in the reading flow, not a nested card.
  return (
    <div className="border-l-2 border-accent/40 pl-4">
      <div className="flex items-center gap-2 mb-4">
        <Play className="w-4 h-4 text-accent" aria-hidden="true" />
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-accent sm:text-xs">
          {title}
        </p>
      </div>
      
      {/* Numbered instructions */}
      <ol className="space-y-3 mb-4" role="list">
        {block.instructions.map((instruction, index) => (
          <li key={index} className="flex items-start gap-3">
            <span
              className="shrink-0 select-none pt-0.5 font-mono text-xs font-black text-accent"
              aria-label={`Step ${index + 1}`}
            >
              {index + 1}.
            </span>
            <GameProse text={instruction} className="min-w-0 flex-1" />
          </li>
        ))}
      </ol>
      
      {/* Expected result */}
      {block.expectedResult && (
        <div className="pt-3 border-t border-accent/20">
          <p className="mb-1 text-[10px] font-black uppercase tracking-[0.18em] text-accent/70">
            Expected result
          </p>
          <GameProse text={block.expectedResult} />
        </div>
      )}
      
      {/* Verification hint */}
      {block.verificationHint && (
        <div className="pt-3 mt-3 border-t border-accent/20">
          <p className="mb-1 text-[10px] font-black uppercase tracking-[0.18em] text-accent/70">
            How to verify
          </p>
          <GameProse text={block.verificationHint} />
        </div>
      )}
    </div>
  );
};

export default DoBlockComponent;
