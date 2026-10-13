/**
 * TEXT BLOCK
 * ==========
 * Plain explanatory text — the primary reading flow of a card.
 * Rendered inline-only (no heading/list promotion) with compact game rhythm.
 */

import React from 'react';
import type { TextBlock } from '../types/blocks';
import type { BlockRendererProps } from '../utils/blockRegistry';
import { GameProse } from './GameProse';

export const TextBlockComponent: React.FC<BlockRendererProps<TextBlock>> = ({ block }) => {
  return (
    <div className="space-y-3">
      {block.title && (
        <h2 className="text-lg md:text-xl font-black uppercase tracking-tight text-text-primary">
          {block.title}
        </h2>
      )}
      <GameProse text={block.content} />
    </div>
  );
};

export default TextBlockComponent;
