/**
 * TEXT BLOCK
 * ==========
 * Plain explanatory text — the primary reading flow.
 * Supports Markdown for backward compatibility with legacy content.
 */

import React from 'react';
import type { TextBlock } from '../types/blocks';
import type { BlockRendererProps } from '../utils/blockRegistry';
import { EducationalMarkdownRenderer } from '@/shared/components/courses/CodeBlockRenderer';

export const TextBlockComponent: React.FC<BlockRendererProps<TextBlock>> = ({ block }) => {
  return (
    <div className="w-full text-sm md:text-base text-text-secondary font-mono leading-[2] md:leading-[2.2] max-w-none">
      <EducationalMarkdownRenderer text={block.content} />
    </div>
  );
};

export default TextBlockComponent;
