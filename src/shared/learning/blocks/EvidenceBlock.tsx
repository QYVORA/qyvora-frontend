/**
 * EVIDENCE BLOCK
 * ==============
 * Terminal output, logs, evidence list.
 * Clean terminal-style display with entry count.
 */

import React from 'react';
import { Search } from 'lucide-react';
import type { EvidenceBlock } from '../types/blocks';
import type { BlockRendererProps } from '../utils/blockRegistry';

export const EvidenceBlockComponent: React.FC<BlockRendererProps<EvidenceBlock>> = ({ block }) => {
  const title = block.title ?? 'Evidence';
  const format = block.format ?? 'terminal';
  
  return (
    <div className="wc-terminal rounded-xl border border-border/50 bg-bg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/20 bg-bg-elevated">
        <div className="flex items-center gap-2">
          <Search className="w-3 h-3 text-accent" aria-hidden="true" />
          <p className="text-xs font-black uppercase tracking-widest text-accent">
            {title}
          </p>
        </div>
        <span className="font-mono text-xs uppercase tracking-widest text-text-muted">
          {block.entries.length} {block.entries.length === 1 ? 'entry' : 'entries'}
        </span>
      </div>
      
      {/* Entries */}
      <ul className="p-4 space-y-1.5" role="list">
        {block.entries.map((entry, index) => (
          <li
            key={index}
            className="flex items-start gap-2 font-mono text-xs md:text-sm text-text-secondary leading-[2] md:leading-[2.2]"
          >
            {format === 'terminal' && (
              <span className="text-accent shrink-0 select-none" aria-hidden="true">
                {'>'}
              </span>
            )}
            <span className="whitespace-pre-wrap break-words min-w-0">{entry}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EvidenceBlockComponent;
