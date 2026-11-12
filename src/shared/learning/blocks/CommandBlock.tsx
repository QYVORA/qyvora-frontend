/**
 * COMMAND BLOCK
 * =============
 * Terminal command with optional explanation and flag details.
 * Comments are lifted out of the copyable command and shown as prose.
 */

import React, { useMemo, useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';
import type { CommandBlock } from '../types/blocks';
import type { BlockRendererProps } from '../utils/blockRegistry';
import { CommandExplanation } from '@/shared/components/learning/CommandExplanation';
import { CodeSurface } from '@/shared/components/courses/markdown/CodeSurface';
import { extractShellComments } from '@/shared/components/courses/markdown/shellComments';

export const CommandBlockComponent: React.FC<BlockRendererProps<CommandBlock>> = ({ block }) => {
  const [copied, setCopied] = useState(false);
  const code = useMemo(() => extractShellComments(block.command).code, [block.command]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy command:', err);
    }
  };

  return (
    <div className="wc-code overflow-hidden rounded-xl border border-border/50 bg-bg">
      <div className="flex items-center justify-between border-b border-border/20 bg-bg-elevated px-3 py-1.5">
        <div className="flex items-center gap-2">
          <Terminal className="h-3 w-3 text-accent" aria-hidden="true" />
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-accent">
            Terminal
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg border border-border/20 bg-bg px-2 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-text-muted transition-colors hover:border-accent/40 hover:text-accent"
          aria-label="Copy command"
        >
          {copied ? <Check className="h-3 w-3" aria-hidden="true" /> : <Copy className="h-3 w-3" aria-hidden="true" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <CodeSurface code={block.command} language="bash" prompt />

      {!block.explanation && (
        <div className="border-t border-border/20 p-3">
          <CommandExplanation command={code} />
        </div>
      )}

      {block.explanation && (
        <div className="space-y-3 border-t border-border/20 bg-bg-card/50 px-3 py-3">
          {block.explanation.what && (
            <div>
              <p className="mb-1 text-[10px] font-black uppercase tracking-[0.18em] text-text-muted">
                What it does
              </p>
              <p className="text-sm leading-6 text-text-secondary sm:text-[15px] sm:leading-7">
                {block.explanation.what}
              </p>
            </div>
          )}

          {block.explanation.why && (
            <div>
              <p className="mb-1 text-[10px] font-black uppercase tracking-[0.18em] text-text-muted">
                Why
              </p>
              <p className="text-sm leading-6 text-text-secondary sm:text-[15px] sm:leading-7">
                {block.explanation.why}
              </p>
            </div>
          )}

          {block.explanation.watch && (
            <div>
              <p className="mb-1 text-[10px] font-black uppercase tracking-[0.18em] text-text-muted">
                What to watch for
              </p>
              <p className="text-sm leading-6 text-text-secondary sm:text-[15px] sm:leading-7">
                {block.explanation.watch}
              </p>
            </div>
          )}
        </div>
      )}

      {block.flags && block.flags.length > 0 && (
        <div className="border-t border-border/20 bg-bg-card/50 px-3 py-3">
          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-text-muted">
            Flags
          </p>
          <ul className="space-y-2" role="list">
            {block.flags.map((flag, index) => (
              <li key={index} className="flex items-start gap-2 text-sm leading-6">
                <code className="shrink-0 font-mono text-accent">{flag.flag}</code>
                <span className="text-text-secondary">{flag.description}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {block.expectedOutput && (
        <div className="border-t border-border/20 bg-bg-card/50 px-3 py-3">
          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-text-muted">
            Expected output
          </p>
          <CodeSurface code={block.expectedOutput} language="text" className="px-0 py-0" />
        </div>
      )}
    </div>
  );
};

export default CommandBlockComponent;
