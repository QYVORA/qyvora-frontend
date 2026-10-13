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
  return <GameProse text={block.content} />;
};

export default TextBlockComponent;
