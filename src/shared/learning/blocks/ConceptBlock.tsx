/**
 * CONCEPT BLOCK
 * =============
 * Highlights a key idea that deserves emphasis.
 * Visual weight adjusts based on importance level.
 */

import React from 'react';
import type { ConceptBlock } from '../types/blocks';
import type { BlockRendererProps } from '../utils/blockRegistry';

export const ConceptBlockComponent: React.FC<BlockRendererProps<ConceptBlock>> = ({ block }) => {
  const importance = block.importance ?? 'core';
  
  return (
    <div
      className={`rounded-xl border px-5 py-4 ${
        importance === 'core'
          ? 'border-accent/30 bg-accent/5'
          : 'border-border/30 bg-bg-elevated'
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
      
      <p className="text-sm md:text-base font-mono text-text-secondary leading-[2] md:leading-[2.2]">
        {block.content}
      </p>
    </div>
  );
};

export default ConceptBlockComponent;
