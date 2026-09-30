import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

export interface BreadcrumbItem {
  /** Visible label. Keep it short — crumbs are truncated, never wrapped. */
  label: React.ReactNode;
  /** Router destination. The last item is the current page and needs no link. */
  to?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  /** Accessible name for the nav landmark. */
  label?: string;
  /** Render the parent link at the start (topbar back affordance). */
  leading?: React.ReactNode;
}

/**
 * Breadcrumb — the shared nested-route hierarchy for the dashboard shell.
 *
 * Courses, labs and bootcamp rooms used to each hand-roll their own chain of
 * `<Link> › <span>` inside the topbar, with different separators, different
 * casing and no shared active state. This one implementation defines the visual
 * system instead:
 *
 * - ancestors  — small uppercase mono labels in tertiary text, accent on hover
 * - separator  — a single muted chevron, never dominant
 * - current    — the same small uppercase scale in primary text at full weight,
 *                marked with `aria-current="page"` so it reads as state, not a button
 *
 * On small screens only the immediate parent and the current page are kept, so a
 * deep hierarchy never wraps or overflows the topbar.
 */
const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  className,
  label = 'Breadcrumb',
  leading,
}) => {
  const lastIndex = items.length - 1;
  if (items.length === 0) return null;

  return (
    <nav aria-label={label} className={cn('flex min-w-0 items-center gap-1.5', className)}>
      {leading}

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
              {item.to && !isCurrent ? (
                <Link
                  to={item.to}
                  className="type-label shrink-0 truncate uppercase tracking-widest text-text-muted transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isCurrent ? 'page' : undefined}
                  className={cn(
                    'type-label truncate uppercase tracking-widest',
                    isCurrent
                      ? 'font-black text-text-primary'
                      : 'text-text-muted',
                  )}
                >
                  {item.label}
                </span>
              )}

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
