/**
 * LEARNING CONTENT RENDERER
 * ==========================
 * Renders a complete LearningUnit with all its blocks.
 */

import React from 'react';
import type { LearningUnit } from '../types/content';
import type { BlockRenderContext } from '../utils/blockRegistry';
import { LearningBlockRenderer } from './LearningBlockRenderer';

export interface LearningContentRendererProps {
  unit: LearningUnit;
  context: BlockRenderContext;
  className?: string;
}

/**
 * Renders a complete learning unit.
 * 
 * This component handles:
 * - Iterating through all blocks in the unit
 * - Passing context to each block
 * - Managing layout/spacing between blocks
 */
export const LearningContentRenderer: React.FC<LearningContentRendererProps> = ({
  unit,
  context,
  className,
}) => {
  return (
    <div className={className}>
      {/* Render all blocks in sequence */}
      <div className="space-y-10 md:space-y-14">
        {unit.blocks.map((block) => (
          <LearningBlockRenderer
            key={block.id}
            block={block}
            context={context}
          />
        ))}
      </div>
      
      {/* Optional image (legacy compatibility) */}
      {unit.image && (
        <div className="wc-media mt-10 md:mt-14">
          <img
            src={unit.image.src}
            alt={unit.image.alt}
            className="w-full rounded-xl border border-border/30"
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
};

export default LearningContentRenderer;
