/**
 * DEBRIEF BLOCK
 * =============
 * Post-activity explanation — what happened and why it matters.
 * Helps students understand the lesson beyond the mechanics.
 */

import React from 'react';
import { MessageSquare } from 'lucide-react';
import type { DebriefBlock } from '../types/blocks';
import type { BlockRendererProps } from '../utils/blockRegistry';
import { GameProse } from './GameProse';

export const DebriefBlockComponent: React.FC<BlockRendererProps<DebriefBlock>> = ({ block }) => {
  const title = block.title ?? 'Debrief';
  
  // Flattened surface: no nested card around debrief text.
  return (
    <div className="border-l-2 border-border/50 pl-4">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare className="w-4 h-4 text-accent" aria-hidden="true" />
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-accent">
          {title}
        </p>
      </div>
      
      <GameProse text={block.content} />
      
      {block.keyTakeaways && block.keyTakeaways.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border/20">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.18em] text-text-muted">
            Key Takeaways
          </p>
          <ul className="space-y-2" role="list">
            {block.keyTakeaways.map((takeaway, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="shrink-0 select-none pt-0.5 text-accent" aria-hidden="true">•</span>
                <GameProse text={takeaway} className="min-w-0 flex-1" />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DebriefBlockComponent;
