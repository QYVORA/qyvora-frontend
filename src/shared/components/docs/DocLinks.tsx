import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

export interface DocLink {
  label: string;
  href: string;
  /** What the destination is, e.g. `Risk scoring implementation`. */
  note?: string;
  /** Renders the raw URL under the label — useful for install commands. */
  showHref?: boolean;
}

interface DocLinksProps {
  items: DocLink[];
  className?: string;
}

/**
 * DocLinks — outbound references, primarily into the tool's own repository.
 *
 * Rows rather than tiles: a list of paths and URLs is reference material, and
 * it should sit in the text flow instead of interrupting it.
 */
const DocLinks: React.FC<DocLinksProps> = ({ items, className }) => {
  if (!items.length) return null;

  return (
    <ul className={cn('min-w-0 border-t border-border-subtle', className)}>
      {items.map((item) => (
        <li key={item.href} className="border-b border-border-subtle">
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex min-h-[56px] items-center gap-3 py-2.5 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
          >
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-1.5 text-sm font-black text-text-primary transition-colors group-hover:text-accent">
                {item.label}
                <ArrowUpRight
                  className="h-3.5 w-3.5 shrink-0 text-text-muted transition-colors group-hover:text-accent"
                  aria-hidden="true"
                />
              </span>
              {item.note && (
                <span className="mt-0.5 block text-xs leading-relaxed text-text-muted">
                  {item.note}
                </span>
              )}
              {item.showHref && (
                <span className="mt-0.5 block break-all font-mono text-xs text-text-muted">
                  {item.href}
                </span>
              )}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
};

export default DocLinks;
