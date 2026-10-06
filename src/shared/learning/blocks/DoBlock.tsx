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

export const DoBlockComponent: React.FC<BlockRendererProps<DoBlock>> = ({ block }) => {
  const title = block.title ?? 'Try It';
  
  return (
    <div className="rounded-xl border border-accent/20 bg-accent/5 px-5 py-4">
      <div className="flex items-center gap-2 mb-4">
        <Play className="w-4 h-4 text-accent" aria-hidden="true" />
        <p className="text-xs font-black uppercase tracking-widest text-accent">
          {title}
        </p>
      </div>
      
      {/* Numbered instructions */}
      <ol className="space-y-3 mb-4" role="list">
        {block.instructions.map((instruction, index) => (
          <li
            key={index}
            className="flex items-start gap-3 text-sm md:text-base font-mono text-text-secondary leading-[2] md:leading-[2.2]"
          >
            <span
              className="text-accent font-black shrink-0 select-none"
              aria-label={`Step ${index + 1}`}
            >
              {index + 1}.
            </span>
            <span>{instruction}</span>
          </li>
        ))}
      </ol>
      
      {/* Expected result */}
      {block.expectedResult && (
        <div className="pt-3 border-t border-accent/20">
          <p className="text-xs font-black uppercase tracking-widest text-accent/60 mb-1">
            Expected Result
          </p>
          <p className="text-sm font-mono text-text-secondary leading-[2]">
            {block.expectedResult}
          </p>
        </div>
      )}
      
      {/* Verification hint */}
      {block.verificationHint && (
        <div className="pt-3 mt-3 border-t border-accent/20">
          <p className="text-xs font-black uppercase tracking-widest text-accent/60 mb-1">
            How to Verify
          </p>
          <p className="text-sm font-mono text-text-secondary leading-[2]">
            {block.verificationHint}
          </p>
        </div>
      )}
    </div>
  );
};

export default DoBlockComponent;
