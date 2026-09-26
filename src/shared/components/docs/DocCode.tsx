import React from 'react';
import { Check, Copy, ExternalLink } from 'lucide-react';
import CodeBlock from '@/shared/components/CodeBlock';
import { useCopyToClipboard } from '@/shared/hooks/useCopyToClipboard';
import { cn } from '@/shared/utils/cn';
import type { DocCodeLang } from '@/features/marketing/data/tools/types';

interface DocCodeProps {
  code: string;
  lang?: DocCodeLang;
  /** Path shown in the header, e.g. `internal/risk/risk.go`. */
  filename?: string;
  /** Absolute URL to the file on GitHub — renders a "source" link. */
  sourceUrl?: string;
  /** Sentence rendered under the block, explaining what the excerpt shows. */
  caption?: string;
  maxHeight?: string;
  copyable?: boolean;
  className?: string;
}

/**
 * DocCode — the code presentation for documentation pages.
 *
 * A real source excerpt, not a terminal mock: a quiet header with the file
 * path, an optional link to the file on GitHub, and a copy control. The block
 * itself is a flat bordered panel, so a page can stack many of them without
 * reading as a pile of cards.
 */
const DocCode: React.FC<DocCodeProps> = ({
  code,
  lang = 'text',
  filename,
  sourceUrl,
  caption,
  maxHeight,
  copyable = true,
  className,
}) => {
  const { copied, copy } = useCopyToClipboard();

  return (
    <figure className={cn('m-0 min-w-0', className)}>
      {(filename || sourceUrl || copyable) && (
        <div className="flex min-w-0 items-center justify-between gap-3 rounded-t-xl border border-b-0 border-border/50 bg-bg-elevated px-3 py-1.5">
          <span className="min-w-0 truncate font-mono text-xs text-text-muted">{filename}</span>
          <div className="flex shrink-0 items-center gap-1">
            {sourceUrl && (
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[32px] items-center gap-1.5 rounded-lg px-2 font-mono text-[11px] uppercase tracking-widest text-text-muted transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Source
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </a>
            )}
            {copyable && (
              <button
                type="button"
                onClick={() => void copy(code)}
                aria-label={copied ? 'Copied' : `Copy ${filename ?? 'code'}`}
                className="inline-flex min-h-[32px] items-center gap-1.5 rounded-lg px-2 font-mono text-[11px] uppercase tracking-widest text-text-muted transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {copied ? (
                  <Check className="h-3 w-3" aria-hidden="true" />
                ) : (
                  <Copy className="h-3 w-3" aria-hidden="true" />
                )}
                {copied ? 'Copied' : 'Copy'}
              </button>
            )}
          </div>
        </div>
      )}
      <CodeBlock
        code={code}
        lang={lang}
        copyable={false}
        maxHeight={maxHeight}
        className={cn(
          (filename || sourceUrl || copyable) && 'rounded-t-none',
        )}
      />
      {caption && (
        <figcaption className="mt-2 text-xs font-mono leading-relaxed text-text-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

export default DocCode;
