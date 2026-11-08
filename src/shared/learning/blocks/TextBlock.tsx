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
    <div className="space-y-2.5">
      {block.title && (
        <h2 className="font-display text-xl font-bold leading-snug tracking-tight text-text-primary sm:text-2xl md:text-[26px]">
          {block.title}
        </h2>
      )}
      <GameProse text={block.content} />
    </div>
  );
};

export default TextBlockComponent;
