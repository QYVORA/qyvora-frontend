import React from 'react';
import { Check, Copy } from 'lucide-react';
import { useCopyToClipboard } from '@/shared/hooks/useCopyToClipboard';
import InlineCode from '@/shared/components/docs/InlineCode';
import { cn } from '@/shared/utils/cn';

interface DocCommandProps {
  command: string;
  /** Optional explanation rendered under the command. */
  note?: string;
  /** Small label rendered before the prompt, e.g. `sh` or `go`. */
  label?: string;
  className?: string;
}

/**
 * DocCommand — one copyable shell command, rendered as a single quiet row.
 *
 * This is the only command presentation on documentation pages: a prompt, the
 * command, and a copy control. Multiple commands are stacked as separate rows
 * rather than bundled into one multi-line block, so each one can be copied on
 * its own.
 */
const DocCommand: React.FC<DocCommandProps> = ({ command, note, label, className }) => {
  const { copied, copy } = useCopyToClipboard();

  return (
    <div className={cn('min-w-0', className)}>
      <div className="flex min-w-0 items-center gap-2 rounded-xl border border-border/50 bg-bg px-3 py-1.5">
        <span className="shrink-0 select-none font-mono text-xs text-text-muted" aria-hidden="true">
          {label ? `${label} $` : '$'}
        </span>
        <code className="min-w-0 flex-1 overflow-x-auto whitespace-pre font-mono text-xs sm:text-[13px]">
          <InlineCode code={command} lang="sh" />
        </code>
        <button
          type="button"
          onClick={() => void copy(command)}
          aria-label={copied ? 'Copied' : `Copy command: ${command}`}
          className="inline-flex min-h-[32px] shrink-0 items-center gap-1.5 rounded-lg px-2 font-mono text-[11px] uppercase tracking-widest text-text-muted transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {copied ? (
            <Check className="h-3 w-3" aria-hidden="true" />
          ) : (
            <Copy className="h-3 w-3" aria-hidden="true" />
          )}
          <span className="sr-only sm:not-sr-only">{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      {note && <p className="mt-1.5 text-xs font-mono leading-relaxed text-text-muted">{note}</p>}
    </div>
  );
};

export default DocCommand;
