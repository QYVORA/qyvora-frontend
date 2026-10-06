/**
 * OBSERVE BLOCK
 * =============
 * Directs students to observe something specific.
 * Shows an artifact (terminal, HTTP, code, etc.) with optional callouts.
 */

import React from 'react';
import { Search } from 'lucide-react';
import type { ObserveBlock } from '../types/blocks';
import type { BlockRendererProps } from '../utils/blockRegistry';

export const ObserveBlockComponent: React.FC<BlockRendererProps<ObserveBlock>> = ({ block }) => {
  const title = block.title ?? 'Observe';
  
  return (
    <div className="space-y-4">
      {/* Observation prompt */}
      <div className="rounded-xl border border-accent/20 bg-accent/5 px-5 py-4">
        <div className="flex items-center gap-2 mb-2">
          <Search className="w-4 h-4 text-accent" aria-hidden="true" />
          <p className="text-xs font-black uppercase tracking-widest text-accent">
            {title}
          </p>
        </div>
        <p className="text-sm font-mono text-text-secondary leading-[2]">
          {block.content}
        </p>
      </div>
      
      {/* Artifact display */}
      <div className="wc-terminal rounded-xl border border-border/50 bg-bg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b border-border/20 bg-bg-elevated">
          <span className="font-mono text-xs uppercase tracking-widest text-text-muted">
            {block.artifact}
          </span>
        </div>
        
        <pre className="p-4 font-mono text-xs md:text-sm text-text-secondary leading-[2] overflow-x-auto">
          <code>{block.artifactContent}</code>
        </pre>
      </div>
      
      {/* Optional callouts */}
      {block.callouts && block.callouts.length > 0 && (
        <div className="space-y-2">
          {block.callouts.map((callout, index) => (
            <div
              key={index}
              className="flex items-start gap-2 px-4 py-2 rounded-lg bg-bg-elevated border border-border/30"
            >
              <span className="text-accent shrink-0 select-none font-bold" aria-hidden="true">
                →
              </span>
              <p className="text-sm font-mono text-text-secondary leading-[2]">
                {callout.text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ObserveBlockComponent;
