import React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

export interface BreadcrumbItem {
  /** Visible label. Keep it short — crumbs are truncated, never wrapped. */
  label: React.ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  /** Accessible name for the nav landmark. */
  label?: string;
}

/**
 * Breadcrumb — the shared nested-route hierarchy for the dashboard shell.
 *
 * On deep learning pages the topbar BackButton owns the single exit link, so
 * these crumbs are pure *context* — a static location marker (phase › room,
 * course, lab), deliberately not a set of secondary links. Ancestors read in
 * muted type, the current page in bold primary, separated by a quiet chevron.
 *
 * - ancestors  — small uppercase mono labels in muted text
 * - separator  — a single muted chevron, never dominant
 * - current    — the same small uppercase scale in primary text at full weight,
 *                marked with `aria-current="page"`
 *
 * On small screens only the immediate parent and the current page are kept, so a
 * deep hierarchy never wraps or overflows the topbar.
 */
const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className, label = 'Breadcrumb' }) => {
  const lastIndex = items.length - 1;
  if (items.length === 0) return null;

  return (
    <nav aria-label={label} className={cn('flex min-w-0 items-center gap-1.5', className)}>
      {items.map((item, index) => {
        const isCurrent = index === lastIndex;
        const isDeep = index < lastIndex - 1;

        return (
          <React.Fragment key={`${String(item.label)}-${index}`}>
            <span
              className={cn(
                'flex min-w-0 items-center gap-1.5',
                isDeep ? 'hidden sm:flex' : 'flex',
              )}
            >
              <span
                aria-current={isCurrent ? 'page' : undefined}
                className={cn(
                  'type-label truncate uppercase tracking-widest',
                  isCurrent ? 'font-black text-text-primary' : 'text-text-muted',
                )}
              >
                {item.label}
              </span>

              {!isCurrent && (
                <ChevronRight
                  className="h-3 w-3 shrink-0 text-text-tertiary/50"
                  aria-hidden="true"
                />
              )}
            </span>
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
