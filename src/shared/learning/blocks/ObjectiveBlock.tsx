/**
 * OBJECTIVE BLOCK
 * ===============
 * Numbered learning outcomes — what the student should be able to do.
 * Vertical stepper visual with connecting lines.
 */

import React from 'react';
import { ClipboardList } from 'lucide-react';
import type { ObjectiveBlock } from '../types/blocks';
import type { BlockRendererProps } from '../utils/blockRegistry';

export const ObjectiveBlockComponent: React.FC<BlockRendererProps<ObjectiveBlock>> = ({ block }) => {
  const title = block.title ?? 'Objectives';
  
  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <ClipboardList className="w-4 h-4 text-accent" aria-hidden="true" />
        <p className="text-xs font-black uppercase tracking-widest text-accent">
          {title}
        </p>
      </div>
      
      <ol className="space-y-5" role="list">
        {block.objectives.map((objective, index) => (
          <li key={index} className="flex items-start gap-4">
            {/* Number badge with connecting line */}
            <div className="relative flex flex-col items-center self-stretch shrink-0">
              <span
                className="relative z-10 w-7 h-7 rounded-lg border border-accent/40 bg-bg flex items-center justify-center font-mono text-xs font-black text-accent"
                aria-label={`Objective ${index + 1}`}
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              
              {/* Connecting line (except for last item) */}
              {index < block.objectives.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute top-7 -bottom-5 left-1/2 -translate-x-1/2 w-px bg-border/40"
                />
              )}
            </div>
            
            <p className="text-sm md:text-base font-mono text-text-secondary leading-[2] md:leading-[2.2] pt-1 min-w-0">
              {objective}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default ObjectiveBlockComponent;
