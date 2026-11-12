/**
 * CODE BREAKDOWN BLOCK
 * =====================
 * Shows a whole script with a single Copy button, then breaks it into numbered
 * parts that each explain what the code does and why it was written that way.
 * Selecting a part highlights its line range in the code and scrolls it into
 * view. Mobile stacks the parts under the code; desktop shows them alongside.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Copy } from 'lucide-react';
import type { BreakdownBlock } from '../types/blocks';
import type { BlockRendererProps } from '../utils/blockRegistry';
import { CodeSurface } from '@/shared/components/courses/markdown/CodeSurface';
import { GameProse } from './GameProse';
import { cn } from '@/shared/utils/cn';

const PART_LABEL = 'text-[10px] font-black uppercase tracking-[0.18em] text-text-muted';

/** Split a `;`-separated `what` value into a small definition list. */
const WhatContent: React.FC<{ value: string }> = ({ value }) => {
  const items = value
    .split(';')
    .map((item) => item.trim())
    .filter(Boolean);

  if (items.length <= 1) {
    return <GameProse text={value} className="text-sm leading-6 md:text-[15px] md:leading-7" />;
  }

  return (
    <ul className="space-y-1.5" role="list">
      {items.map((item, index) => {
        const split = item.match(/^(.+?)\s*(?:—|–|::?|\s-\s)\s*(.+)$/);
        return (
          <li key={index} className="flex items-start gap-2 text-sm leading-6 text-text-secondary">
            {split ? (
              <>
                <code className="shrink-0 font-mono text-accent">{split[1].trim()}</code>
                <span>{split[2].trim()}</span>
              </>
            ) : (
              <span>{item}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export const CodeBreakdownBlockComponent: React.FC<BlockRendererProps<BreakdownBlock>> = ({ block }) => {
  const [copied, setCopied] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(block.parts[0]?.id ?? null);
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    block.parts[0] ? { [block.parts[0].id]: true } : {},
  );
  const codeWrapRef = useRef<HTMLDivElement>(null);

  const heading = block.title ?? block.filename?.replace(/[:：]\s*$/, '').trim();

  const highlights = useMemo(() => {
    const part = block.parts.find((p) => p.id === activeId);
    if (!part) return [];
    const out: number[] = [];
    for (let line = part.lines[0]; line <= part.lines[1]; line += 1) out.push(line);
    return out;
  }, [activeId, block.parts]);

  useEffect(() => {
    if (!activeId) return;
    const wrap = codeWrapRef.current;
    const pre = wrap?.querySelector('pre');
    const line = wrap?.querySelector(`[data-line="${block.parts.find((p) => p.id === activeId)?.lines[0]}"]`);
    if (!pre || !line) return;
    const preRect = pre.getBoundingClientRect();
    const lineRect = line.getBoundingClientRect();
    const delta = lineRect.top - preRect.top;
    pre.scrollTo({ top: Math.max(0, pre.scrollTop + delta - 24), behavior: 'smooth' });
  }, [activeId, block.parts]);

  const copy = async (event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(block.code);
    } catch {
      /* Clipboard unavailable — ignore */
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const activate = (id: string) => {
    setActiveId(id);
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="wc-code space-y-3">
      {heading && (
        <h3 className="text-lg font-bold leading-snug tracking-tight text-text-primary sm:text-xl md:text-2xl">
          {heading}
        </h3>
      )}

      {block.intro && (
        <GameProse text={block.intro} className="text-sm leading-6 md:text-[15px] md:leading-7" />
      )}

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-start">
        <div className="overflow-hidden rounded-xl border border-border bg-code-bg">
          <div className="flex items-center justify-between gap-2 border-b border-border/40 bg-bg-elevated px-3 py-2">
            <span className="truncate font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted sm:text-xs">
              {block.language}
            </span>
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
          <div ref={codeWrapRef}>
            <CodeSurface
              code={block.code}
              language={block.language}
              highlights={highlights}
              className="max-h-[min(70vh,32rem)] overflow-y-auto"
            />
          </div>
        </div>

        <ol className="space-y-2" role="list">
          {block.parts.map((part, index) => {
            const isActive = part.id === activeId;
            const isOpen = Boolean(open[part.id]);
            return (
              <li
                key={part.id}
                className={cn(
                  'overflow-hidden rounded-xl border transition-colors',
                  isActive ? 'border-accent/50 bg-bg-card' : 'border-border/50 bg-bg-card/50',
                )}
              >
                <button
                  type="button"
                  onClick={() => activate(part.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left"
                >
                  <span
                    className={cn(
                      'flex h-6 w-6 shrink-0 items-center justify-center rounded-md font-mono text-xs font-bold',
                      isActive ? 'bg-accent text-on-accent' : 'bg-bg-elevated text-text-muted',
                    )}
                  >
                    {index + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-text-primary">{part.title}</span>
                    <span className="block font-mono text-[10px] text-text-muted">
                      L{part.lines[0]}
                      {part.lines[1] !== part.lines[0] ? `–${part.lines[1]}` : ''}
                    </span>
                  </span>
                  <ChevronDown
                    className={cn('h-4 w-4 shrink-0 text-text-muted transition-transform', isOpen && 'rotate-180')}
                    aria-hidden="true"
                  />
                </button>

                {isOpen && (
                  <div className="space-y-2.5 border-t border-border/40 px-3 py-2.5">
                    {part.what && (
                      <div>
                        <p className={PART_LABEL}>What it does</p>
                        <div className="mt-1">
                          <WhatContent value={part.what} />
                        </div>
                      </div>
                    )}
                    {part.why && (
                      <div>
                        <p className={PART_LABEL}>Why</p>
                        <div className="mt-1">
                          <GameProse text={part.why} className="text-sm leading-6 md:text-[15px] md:leading-7" />
                        </div>
                      </div>
                    )}
                    {part.watch && (
                      <div>
                        <p className={PART_LABEL}>Watch for</p>
                        <div className="mt-1">
                          <GameProse text={part.watch} className="text-sm leading-6 md:text-[15px] md:leading-7" />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
};

export default CodeBreakdownBlockComponent;
