import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, X } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { useScrollLock } from '@/core/hooks/useScrollLock';
import type { NavItem } from './NavDropdown';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  items: NavItem[];
  footer?: React.ReactNode;
  title?: string;
}

/**
 * MobileMenu — the one hamburger drawer for public and app shells.
 * Full-screen panel, 48px rows, expandable groups, focus trap, Esc and body
 * scroll lock. Closes on route change.
 */
const MobileMenu: React.FC<MobileMenuProps> = ({
  open,
  onClose,
  items,
  footer,
  title = 'Menu',
}) => {
  const { pathname } = useLocation();
  const panelRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useScrollLock(open);

  useEffect(() => {
    onClose();
    setExpanded(new Set());
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>('a,button')?.focus();
    }, 30);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !panelRef.current) return;
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.offsetParent !== null);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      window.clearTimeout(id);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] lg:hidden">
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="absolute inset-y-0 left-0 flex w-full max-w-[380px] flex-col border-r border-border-subtle bg-surface"
      >
        <div className="flex h-[var(--app-topbar-h,4rem)] shrink-0 items-center justify-between border-b border-border-subtle px-[var(--app-gutter,12px)]">
          <span className="text-base font-bold text-text-primary">{title}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-10 w-10 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-surface-raised hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <nav aria-label={title} className="flex-1 overflow-y-auto px-2 py-3">
          {items.map((item) => {
            const Icon = item.icon;
            const isExpanded = expanded.has(item.key);
            if (item.children?.length) {
              return (
                <div key={item.key}>
                  <button
                    type="button"
                    aria-expanded={isExpanded}
                    onClick={() =>
                      setExpanded((current) => {
                        const next = new Set(current);
                        if (next.has(item.key)) next.delete(item.key);
                        else next.add(item.key);
                        return next;
                      })
                    }
                    className="flex min-h-[48px] w-full items-center gap-3 rounded-md px-3 text-base text-text-secondary transition-colors hover:bg-surface-raised hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
                  >
                    <Icon className="h-5 w-5 text-text-muted" aria-hidden="true" />
                    <span className="flex-1 text-left">{item.label}</span>
                    <ChevronDown
                      className={cn('h-4 w-4 transition-transform', isExpanded && 'rotate-180')}
                      aria-hidden="true"
                    />
                  </button>
                  {isExpanded && (
                    <div className="ml-4 border-l border-border-subtle pl-2">
                      {item.to && (
                        <NavLink
                          to={item.to}
                          className="flex min-h-[44px] items-center rounded-md px-3 text-[15px] text-text-secondary hover:bg-surface-raised hover:text-text-primary"
                        >
                          All {item.label}
                        </NavLink>
                      )}
                      {item.children.map((child) => {
                        const ChildIcon = child.icon;
                        return (
                          <Link
                            key={child.to}
                            to={child.to}
                            className="flex min-h-[44px] items-center gap-2 rounded-md px-3 text-[15px] text-text-secondary hover:bg-surface-raised hover:text-text-primary"
                          >
                            {ChildIcon && <ChildIcon className="h-4 w-4 text-text-muted" aria-hidden="true" />}
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }
            return (
              <NavLink
                key={item.key}
                to={item.to ?? '/'}
                className={({ isActive }) =>
                  cn(
                    'flex min-h-[48px] items-center gap-3 rounded-md px-3 text-base transition-colors',
                    'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent',
                    isActive
                      ? 'border-l-2 border-accent bg-accent/10 text-accent'
                      : 'text-text-secondary hover:bg-surface-raised hover:text-text-primary',
                  )
                }
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {footer && (
          <div className="shrink-0 border-t border-border-subtle px-[var(--app-gutter,12px)] py-4 pb-[max(16px,env(safe-area-inset-bottom))]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
