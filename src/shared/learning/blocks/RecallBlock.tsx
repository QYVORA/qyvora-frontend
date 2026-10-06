/**
 * RECALL BLOCK
 * ============
 * Concise summary for retention — what to remember.
 * Numbered list of key points, visually distinct for easy scanning.
 */

import React from 'react';
import { Bookmark } from 'lucide-react';
import type { RecallBlock } from '../types/blocks';
import type { BlockRendererProps } from '../utils/blockRegistry';

export const RecallBlockComponent: React.FC<BlockRendererProps<RecallBlock>> = ({ block }) => {
  const title = block.title ?? 'Remember';
  
  return (
    <div className="rounded-xl border-2 border-accent/30 bg-accent/5 px-5 py-4">
      <div className="flex items-center gap-2 mb-4">
        <Bookmark className="w-4 h-4 text-accent" aria-hidden="true" />
        <p className="text-xs font-black uppercase tracking-widest text-accent">
          {title}
        </p>
      </div>
      
      <ol className="space-y-3" role="list">
        {block.points.map((point, index) => (
          <li
            key={index}
            className="flex items-start gap-3 text-sm md:text-base font-mono text-text-primary leading-[2] md:leading-[2.2]"
          >
            <span
              className="text-accent font-black shrink-0 select-none"
              aria-label={`Point ${index + 1}`}
            >
              {String(index + 1).padStart(2, '0')}
            </span>
            <span>{point}</span>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default RecallBlockComponent;
