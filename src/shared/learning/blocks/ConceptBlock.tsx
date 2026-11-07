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
        className={`text-xs font-black uppercase tracking-widest mb-2 ${
          importance === 'core' ? 'text-accent' : 'text-text-muted'
        }`}
      >
        {importance === 'core' ? 'Core Concept' : 'Concept'}
      </p>
      
      <h3 className="text-lg md:text-xl font-black text-text-primary tracking-tight mb-3">
        {block.title}
      </h3>
      
      <GameProse text={block.content} />
    </div>
  );
};

export default ConceptBlockComponent;
