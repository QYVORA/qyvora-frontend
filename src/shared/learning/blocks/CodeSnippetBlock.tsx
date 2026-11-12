/**
 * CODE SNIPPET BLOCK
 * ==================
 * Syntax-highlighted code snippet with a filename header and copy button.
 * Comments render inline (green); the copy button strips comment-only lines
 * so the copied payload stays clean.
 */

import React, { useMemo, useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { IconTerminal } from '@/shared/components/icons';
import type { CodeBlock } from '../types/blocks';
import type { BlockRendererProps } from '../utils/blockRegistry';
import { CommandExplanation } from '@/shared/components/learning/CommandExplanation';
import { CodeSurface } from '@/shared/components/courses/markdown/CodeSurface';
import { extractShellComments, isShellLanguage } from '@/shared/components/courses/markdown/shellComments';
import { GameProse } from './GameProse';

export const CodeSnippetBlockComponent: React.FC<BlockRendererProps<CodeBlock>> = ({ block }) => {
  const [copied, setCopied] = useState(false);
  const isShell = isShellLanguage(block.language);
  const copyPayload = useMemo(
    () => (isShell ? extractShellComments(block.code).code : block.code),
    [block.code, isShell],
  );
  const heading = block.filename?.replace(/[:：]\s*$/, '').trim();
  const hasCode = block.code.trim().length > 0;

  const copy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(copyPayload);
    } catch { /* Clipboard unavailable — ignore */ }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="space-y-3">
      {heading && (
        <h3 className="text-lg font-bold leading-snug tracking-tight text-text-primary sm:text-xl md:text-2xl">
          {heading}
        </h3>
      )}

      {hasCode ? (
        <div className="wc-code overflow-hidden rounded-xl border border-border bg-code-bg">
          <div className="flex items-center justify-between gap-2 border-b border-border/40 bg-bg-elevated px-3 py-2">
            <div className="flex min-w-0 items-center gap-2">
              <IconTerminal size={14} className="shrink-0 text-accent opacity-70" />
              <span className="truncate font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted sm:text-xs">
                {block.language}
              </span>
            </div>
            <button
              type="button"
              onClick={copy}
              aria-label="Copy code"
              className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-border/30 bg-bg px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-text-muted transition-colors hover:border-accent/40 hover:text-accent"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          <CodeSurface code={block.code} language={block.language} highlights={block.highlights} />
        </div>
      ) : null}

      {block.explanation && (
        <div className="rounded-xl border border-border/40 bg-bg-card/60 px-4 py-3">
          <GameProse text={block.explanation} className="text-sm leading-6 sm:text-[15px] sm:leading-7" />
        </div>
      )}

      {isShell && hasCode && <CommandExplanation command={copyPayload} collapsible />}
    </div>
  );
};

export default CodeSnippetBlockComponent;
