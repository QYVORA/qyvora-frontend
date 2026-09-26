import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Library } from 'lucide-react';
import { TOOLS, type ToolEntry } from '@/features/marketing/data/tools/registry';

interface DocPagerProps {
  slug: string;
}

/**
 * The mark shown on a pager link. Both neighbours are real tools, so each link
 * carries that tool's own logo — the pager becomes a visual index of the
 * toolkit rather than two bare text labels.
 */
const PagerMark: React.FC<{ tool: ToolEntry }> = ({ tool }) =>
  tool.logo ? (
    <img
      src={tool.logo}
      alt=""
      aria-hidden="true"
      loading="lazy"
      className="h-9 w-9 shrink-0 object-contain"
    />
  ) : (
    <span
      aria-hidden="true"
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent/10"
    >
      <Library className="h-4 w-4 text-accent" />
    </span>
  );

/**
 * DocPager — previous/next tool navigation.
 *
 * A quiet two-column row of links. Documentation is read in sequence, so the
 * reader should always be one click from the adjacent page.
 */
const DocPager: React.FC<DocPagerProps> = ({ slug }) => {
  const index = TOOLS.findIndex((tool) => tool.slug === slug);
  if (index === -1) return null;

  const previous = index > 0 ? TOOLS[index - 1] : undefined;
  const next = index < TOOLS.length - 1 ? TOOLS[index + 1] : undefined;

  return (
    <nav
      aria-label="Tool navigation"
      className="grid grid-cols-1 gap-3 border-t border-border-subtle pt-6 sm:grid-cols-2"
    >
      {previous ? (
        <Link
          to={previous.path}
          rel="prev"
          className="group flex min-h-[64px] items-center gap-3 rounded-2xl border border-border/40 px-4 py-3 transition-colors hover:border-accent/50 hover:bg-bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <ChevronLeft
            className="h-4 w-4 shrink-0 text-text-muted transition-transform group-hover:-translate-x-0.5 group-hover:text-accent"
            aria-hidden="true"
          />
          <PagerMark tool={previous} />
          <span className="min-w-0">
            <span className="block font-mono text-[11px] font-black uppercase tracking-[0.16em] text-text-muted">
              Previous
            </span>
            <span className="block truncate text-sm font-black text-text-primary transition-colors group-hover:text-accent">
              {previous.displayName}
            </span>
          </span>
        </Link>
      ) : (
        <span aria-hidden="true" className="hidden sm:block" />
      )}

      {next ? (
        <Link
          to={next.path}
          rel="next"
          className="group flex min-h-[64px] items-center justify-end gap-3 rounded-2xl border border-border/40 px-4 py-3 text-right transition-colors hover:border-accent/50 hover:bg-bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <span className="min-w-0">
            <span className="block font-mono text-[11px] font-black uppercase tracking-[0.16em] text-text-muted">
              Next
            </span>
            <span className="block truncate text-sm font-black text-text-primary transition-colors group-hover:text-accent">
              {next.displayName}
            </span>
          </span>
          <PagerMark tool={next} />
          <ChevronRight
            className="h-4 w-4 shrink-0 text-text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent"
            aria-hidden="true"
          />
        </Link>
      ) : (
        <span aria-hidden="true" className="hidden sm:block" />
      )}
    </nav>
  );
};

export default DocPager;

/** Slim docs footer: a way back to the toolkit index and the docs index. */
export const DocColophon: React.FC = () => (
  <footer className="mt-10 flex flex-col gap-3 border-t border-border-subtle pt-6 sm:flex-row sm:items-center sm:justify-between">
    <p className="font-mono text-xs text-text-muted">
      Part of the{' '}
      <Link
        to="/tools"
        className="text-accent transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        QYVORA open-source toolkit
      </Link>
      .
    </p>
    <Link
      to="/tools"
      className="font-mono text-xs text-text-muted transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      All tools
    </Link>
  </footer>
);
