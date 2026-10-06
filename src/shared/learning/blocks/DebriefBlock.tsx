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

export const DebriefBlockComponent: React.FC<BlockRendererProps<DebriefBlock>> = ({ block }) => {
  const title = block.title ?? 'Debrief';
  
  return (
    <div className="rounded-xl border border-border/20 bg-bg-elevated px-5 py-4">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare className="w-4 h-4 text-accent" aria-hidden="true" />
        <p className="text-xs font-black uppercase tracking-widest text-accent">
          {title}
        </p>
      </div>
      
      <div className="text-sm md:text-base font-mono text-text-secondary leading-[2] md:leading-[2.2] whitespace-pre-wrap">
        {block.content}
      </div>
      
      {block.keyTakeaways && block.keyTakeaways.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border/20">
          <p className="text-xs font-black uppercase tracking-widest text-text-muted mb-3">
            Key Takeaways
          </p>
          <ul className="space-y-2" role="list">
            {block.keyTakeaways.map((takeaway, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm font-mono text-text-secondary leading-[2]"
              >
                <span className="text-accent shrink-0 select-none" aria-hidden="true">
                  •
                </span>
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DebriefBlockComponent;
