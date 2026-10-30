/**
 * CODE SNIPPET BLOCK
 * ==================
 * Syntax-highlighted code snippet with a filename header and copy button.
 * Visual language matches the shared CodeBlock surfaces (plain token colouring).
 */

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { IconTerminal } from '@/shared/components/icons';
import type { CodeBlock } from '../types/blocks';
import type { BlockRendererProps } from '../utils/blockRegistry';
import { CommandExplanation } from '@/shared/components/learning/CommandExplanation';

export const CodeSnippetBlockComponent: React.FC<BlockRendererProps<CodeBlock>> = ({ block }) => {
  const [copied, setCopied] = useState(false);
  const lines = block.code.split('\n');
  const highlightSet = new Set(block.highlights ?? []);
  const isShell = ['bash', 'sh', 'shell'].includes(block.language.toLowerCase());

  const copy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(block.code);
    } catch { /* Clipboard unavailable — ignore */ }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="wc-code overflow-hidden rounded-xl border border-border bg-bg">
      <div className="flex items-center justify-between gap-2 border-b border-border/30 bg-bg-elevated px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <IconTerminal size={14} className="shrink-0 text-accent opacity-70" />
          <span className="truncate font-mono text-xs text-text-muted">{block.filename ?? block.language}</span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-accent">{block.language}</span>
          <button
            type="button"
            onClick={copy}
            aria-label="Copy code"
            className="inline-flex items-center gap-1 rounded-lg border border-border/30 bg-bg px-2 py-1 text-[10px] font-black uppercase tracking-widest text-text-muted transition-colors hover:border-accent/40 hover:text-accent"
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <pre className="px-4 py-4 text-base font-mono leading-relaxed md:text-lg">
          {lines.map((line, i) => (
            <div key={i} className={`flex rounded-sm ${highlightSet.has(i + 1) ? 'bg-accent-dim' : ''}`}>
              <span className="mr-3 w-4 shrink-0 select-none text-right text-xs text-text-muted/30">{i + 1}</span>
              <span className="whitespace-pre text-text-primary">{line || ' '}</span>
            </div>
          ))}
        </pre>
      </div>

      {isShell && <CommandExplanation command={block.code} collapsible />}

      {block.explanation && (
        <p className="border-t border-border/30 bg-bg-elevated px-4 py-3 text-base font-mono text-text-secondary leading-relaxed">
          {block.explanation}
        </p>
      )}
    </div>
  );
};

export default CodeSnippetBlockComponent;