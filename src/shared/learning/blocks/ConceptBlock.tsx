/**
 * CONCEPT BLOCK
 * =============
 * Highlights a key idea that deserves emphasis.
 * Visual weight adjusts based on importance level.
 */

import React from 'react';
import type { ConceptBlock } from '../types/blocks';
import type { BlockRendererProps } from '../utils/blockRegistry';
import { GameProse } from './GameProse';

export const ConceptBlockComponent: React.FC<BlockRendererProps<ConceptBlock>> = ({ block }) => {
  const importance = block.importance ?? 'core';
  
  return (
    // Flattened surface: this block already sits inside a task/deck card.
    <div
      className={`border-l-2 pl-4 ${
        importance === 'core' ? 'border-accent/40' : 'border-border/50'
      }`}
    >
      <p
        className={`mb-2 text-[10px] font-black uppercase tracking-[0.18em] ${
          importance === 'core' ? 'text-accent' : 'text-text-muted'
        }`}
      >
        {importance === 'core' ? 'Core Concept' : 'Concept'}
      </p>
      
      <h3 className="mb-2.5 font-display text-lg font-bold leading-snug tracking-tight text-text-primary sm:text-xl md:text-2xl">
        {block.title}
      </h3>
      
      <GameProse text={block.content} />
    </div>
  );
};

export default ConceptBlockComponent;
