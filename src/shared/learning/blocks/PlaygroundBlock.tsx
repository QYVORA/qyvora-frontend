/**
 * PLAYGROUND BLOCK
 * ================
 * Inline code playground — run snippets in the QYVORA sandbox.
 */

import React from 'react';
import { Brackets } from 'lucide-react';
import CodePlayground from '@/shared/components/courses/CodePlayground';
import type { PlaygroundBlock } from '../types/blocks';
import type { BlockRendererProps } from '../utils/blockRegistry';

export const PlaygroundBlockComponent: React.FC<BlockRendererProps<PlaygroundBlock>> = ({ block }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Brackets className="w-4 h-4 text-accent" aria-hidden="true" />
        <p className="text-xs font-black uppercase tracking-widest text-accent">Code Playground</p>
        <span className="ml-auto rounded-md border border-border/30 bg-bg-elevated px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-text-muted">
          {block.language}
        </span>
      </div>
      <CodePlayground
        initialCode={block.initialCode}
        language={block.language}
        expectedOutput={block.expectedOutput}
        title={block.title ?? 'Code Playground'}
      />
    </div>
  );
};

export default PlaygroundBlockComponent;