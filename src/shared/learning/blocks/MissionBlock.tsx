/**
 * MISSION BLOCK
 * =============
 * Displays the student's goal/task for the learning unit.
 * Visually distinct to establish clear learning direction.
 */

import React from 'react';
import { Target } from 'lucide-react';
import type { MissionBlock } from '../types/blocks';
import type { BlockRendererProps } from '../utils/blockRegistry';

export const MissionBlockComponent: React.FC<BlockRendererProps<MissionBlock>> = ({ block }) => {
  return (
    <div className="rounded-xl border border-accent/20 bg-accent/5 px-5 py-4 flex items-start gap-3">
      <Target className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-accent mb-1">
          Mission
        </p>
        <p className="text-sm font-mono text-text-secondary leading-[2]">
          {block.mission}
        </p>
        {block.context && (
          <p className="text-sm font-mono text-text-muted leading-[2] mt-2">
            {block.context}
          </p>
        )}
      </div>
    </div>
  );
};

export default MissionBlockComponent;
