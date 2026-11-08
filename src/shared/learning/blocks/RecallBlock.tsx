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
import { GameProse } from './GameProse';

export const RecallBlockComponent: React.FC<BlockRendererProps<RecallBlock>> = ({ block }) => {
  const title = block.title ?? 'Remember';
  
  // Flattened surface: avoid a nested card inside the task accordion.
  return (
    <div className="border-l-2 border-accent/40 pl-4">
      <div className="flex items-center gap-2 mb-4">
        <Bookmark className="w-4 h-4 text-accent" aria-hidden="true" />
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-accent sm:text-xs">
          {title}
        </p>
      </div>
      
      <ol className="space-y-3" role="list">
        {block.points.map((point, index) => (
          <li key={index} className="flex items-start gap-3">
            <span
              className="shrink-0 select-none pt-0.5 font-mono text-xs font-black text-accent"
              aria-label={`Point ${index + 1}`}
            >
              {String(index + 1).padStart(2, '0')}
            </span>
            <GameProse text={point} className="min-w-0 flex-1 text-text-primary" />
          </li>
        ))}
      </ol>
    </div>
  );
};

export default RecallBlockComponent;
