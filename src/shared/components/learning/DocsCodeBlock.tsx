import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

/**
 * DocsCodeBlock - Clean, documentation-style code block
 * inspired by React Learn documentation design.
 * 
 * Key differences from standard CodeBlock:
 * - Lighter, cleaner appearance matching React docs
 * - Inline copy button (top-right, always visible)
 * - Optional line numbers
 * - Better spacing for readability
 * - Subtle borders, elevated background
 */

interface DocsCodeBlockProps {
  code: string;
  language?: 'bash' | 'python' | 'javascript' | 'typescript' | 'json' | 'text';
  showLineNumbers?: boolean;
  highlightLines?: number[];
  filename?: string;
  className?: string;
}

export function DocsCodeBlock({
  code,
  language = 'text',
  showLineNumbers = false,
  highlightLines = [],
  filename,
  className,
}: DocsCodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard not available
    }
  };

  const lines = code.split('\n');

  return (
    <div
      className={cn(
        'wc-code group relative my-6 overflow-hidden rounded-2xl border border-border/30 bg-bg-elevated',
        className
      )}
    >
      {/* Optional filename header */}
      {filename && (
        <div className="border-b border-border/20 px-4 py-2.5 bg-bg-card">
          <span className="text-xs font-mono text-text-muted">{filename}</span>
        </div>
      )}

      {/* Copy button - always visible on desktop, appears on mobile hover/focus */}
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? 'Copied!' : 'Copy code'}
        className={cn(
          'absolute right-3 top-3 z-10 flex min-h-[44px] w-10 items-center justify-center rounded-lg border border-border/30 bg-bg backdrop-blur-sm transition-all',
          'md:min-h-[32px] md:w-8',
          'hover:border-accent/40 hover:bg-accent/10',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50',
          'opacity-0 group-hover:opacity-100 focus-visible:opacity-100',
          'md:opacity-100'
        )}
      >
        {copied ? (
          <Check className="h-4 w-4 text-accent" strokeWidth={2.5} />
        ) : (
          <Copy className="h-4 w-4 text-text-muted" />
        )}
      </button>

      {/* Code content */}
      <div className="overflow-x-auto">
        <pre className="p-4 text-[13px] leading-[1.8] font-mono">
          <code className="text-text-secondary">
            {showLineNumbers ? (
              <table className="w-full border-collapse">
                <tbody>
                  {lines.map((line, index) => {
                    const lineNum = index + 1;
                    const isHighlighted = highlightLines.includes(lineNum);
                    
                    return (
                      <tr
                        key={index}
                        className={cn(
                          'group/line',
                          isHighlighted && 'bg-accent/5'
                        )}
                      >
                        <td
                          className={cn(
                            'select-none pr-4 text-right align-top text-text-muted/50',
                            'w-8 min-w-8'
                          )}
                        >
                          <span className="block">{lineNum}</span>
                        </td>
                        <td className="pl-4 align-top">
                          <span className={cn(
                            'block',
                            isHighlighted && 'text-text-primary'
                          )}>
                            {line || '\n'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              lines.map((line, index) => (
                <div key={index} className="min-h-[1.8em]">
                  {line || '\n'}
                </div>
              ))
            )}
          </code>
        </pre>
      </div>
    </div>
  );
}

/**
 * DocsInlineCode - Inline code snippet styled like React docs
 * Uses accent color for inline code mentions in documentation text
 */
export function DocsInlineCode({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <code
      className={cn(
        'rounded-md bg-accent/10 px-1.5 py-0.5 font-mono text-[0.9em] text-accent font-medium',
        className
      )}
    >
      {children}
    </code>
  );
}

/**
 * DocsCommandBlock - Terminal command display styled for documentation
 * Single command with optional output, compact padding, prominent $ prompt
 */
interface DocsCommandBlockProps {
  command: string;
  output?: string;
  className?: string;
}

export function DocsCommandBlock({ command, output, className }: DocsCommandBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard not available
    }
  };

  return (
    <div className={cn('wc-terminal group relative my-6 overflow-hidden rounded-2xl border border-border/30 bg-bg-elevated', className)}>
      {/* Copy button - always visible on desktop, appears on mobile hover/focus */}
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? 'Copied!' : 'Copy command'}
        className={cn(
          'absolute right-3 top-3 z-10 flex min-h-[44px] w-10 items-center justify-center rounded-lg border border-border/30 bg-bg backdrop-blur-sm transition-all',
          'md:min-h-[32px] md:w-8',
          'hover:border-accent/40 hover:bg-accent/10',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50',
          'opacity-0 group-hover:opacity-100 focus-visible:opacity-100',
          'md:opacity-100'
        )}
      >
        {copied ? (
          <Check className="h-4 w-4 text-accent" strokeWidth={2.5} />
        ) : (
          <Copy className="h-4 w-4 text-text-muted" />
        )}
      </button>

      {/* Command */}
      <div className="px-3 py-2 font-mono text-[13px] leading-[1.8]">
        <div className="flex items-start gap-2">
          <span className="select-none text-accent font-bold">$</span>
          <span className="flex-1 text-text-primary">{command}</span>
        </div>

        {/* Optional output */}
        {output && (
          <div className="mt-1.5 pl-4 text-text-muted/70 space-y-1.5">
            {output.split('\n').map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DocsCodeBlock;
