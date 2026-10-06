/**
 * COMMAND BLOCK
 * =============
 * Terminal command with optional explanation and flag details.
 * Includes copy functionality and structured explanation sections.
 */

import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';
import type { CommandBlock } from '../types/blocks';
import type { BlockRendererProps } from '../utils/blockRegistry';

export const CommandBlockComponent: React.FC<BlockRendererProps<CommandBlock>> = ({ block }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(block.command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy command:', err);
    }
  };
  
  return (
    <div className="wc-code rounded-xl border border-border/50 bg-bg overflow-hidden">
      {/* Header with copy button */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border/20 bg-bg-elevated">
        <div className="flex items-center gap-2">
          <Terminal className="w-3 h-3 text-accent" aria-hidden="true" />
          <span className="text-xs font-black uppercase tracking-widest text-accent">
            Command
          </span>
        </div>
        
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-lg border border-border/20 bg-bg px-2 py-1 text-xs font-black uppercase tracking-widest text-text-muted hover:text-accent hover:border-accent/40 transition-colors flex items-center gap-1.5"
          aria-label="Copy command"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3" aria-hidden="true" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" aria-hidden="true" />
              Copy
            </>
          )}
        </button>
      </div>
      
      {/* Command */}
      <pre className="px-3 py-2 font-mono text-xs md:text-sm text-accent overflow-x-auto">
        <code>{block.command}</code>
      </pre>
      
      {/* Explanation sections */}
      {block.explanation && (
        <div className="px-3 py-3 space-y-3 border-t border-border/20 bg-bg-card/50">
          {block.explanation.what && (
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-text-muted mb-1">
                What it does
              </p>
              <p className="text-sm font-mono text-text-secondary leading-[2]">
                {block.explanation.what}
              </p>
            </div>
          )}
          
          {block.explanation.why && (
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-text-muted mb-1">
                Why
              </p>
              <p className="text-sm font-mono text-text-secondary leading-[2]">
                {block.explanation.why}
              </p>
            </div>
          )}
          
          {block.explanation.watch && (
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-text-muted mb-1">
                What to watch for
              </p>
              <p className="text-sm font-mono text-text-secondary leading-[2]">
                {block.explanation.watch}
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* Flag details */}
      {block.flags && block.flags.length > 0 && (
        <div className="px-3 py-3 border-t border-border/20 bg-bg-card/50">
          <p className="text-xs font-black uppercase tracking-widest text-text-muted mb-2">
            Flags
          </p>
          <ul className="space-y-2" role="list">
            {block.flags.map((flag, index) => (
              <li key={index} className="flex items-start gap-2 text-sm font-mono">
                <code className="text-accent shrink-0">{flag.flag}</code>
                <span className="text-text-secondary leading-[2]">
                  {flag.description}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Expected output */}
      {block.expectedOutput && (
        <div className="px-3 py-3 border-t border-border/20 bg-bg-card/50">
          <p className="text-xs font-black uppercase tracking-widest text-text-muted mb-2">
            Expected Output
          </p>
          <pre className="text-xs md:text-sm font-mono text-text-secondary leading-[2] overflow-x-auto">
            <code>{block.expectedOutput}</code>
          </pre>
        </div>
      )}
    </div>
  );
};

export default CommandBlockComponent;
