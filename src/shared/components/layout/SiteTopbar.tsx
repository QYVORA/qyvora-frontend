import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu as MenuIcon } from 'lucide-react';
import { Logo } from '@/shared/components/brand';
import { useScrollDirection } from '@/shared/hooks/useScrollDirection';
import NavDropdown from './NavDropdown';
import type { NavItem } from './NavDropdown';

export type { NavItem, NavChild } from './NavDropdown';

interface SiteTopbarProps {
  items: NavItem[];
  activeMatcher: (item: NavItem, pathname: string) => boolean;
  rightSlot?: React.ReactNode;
  mobileMenu?: React.ReactNode;
  onMobileMenuOpen?: () => void;
  mobileMenuOpen?: boolean;
  logoTo?: string;
  logoLabel?: string;
}

/**
 * SiteTopbar — the one navigation bar for public and signed-in surfaces.
 *
 * Same height (`--app-topbar-h`), logo, icon-above-label items, dropdown
 * surface, right cluster slot and hide-on-scroll behaviour everywhere; only
 * the items and right cluster differ per shell.
 */
const SiteTopbar: React.FC<SiteTopbarProps> = ({
  items,
  activeMatcher,
  rightSlot,
  mobileMenu,
  onMobileMenuOpen,
  mobileMenuOpen = false,
  logoTo = '/',
  logoLabel = 'QYVORA home',
}) => {
  const { pathname } = useLocation();
  const headerRef = useRef<HTMLElement | null>(null);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [focusWithin, setFocusWithin] = useState(false);

  useEffect(() => {
    setOpenKey(null);
    setFocusWithin(false);
  }, [pathname]);

  const hidden = useScrollDirection({
    disabled: mobileMenuOpen,
    forceVisible: focusWithin || openKey !== null || mobileMenuOpen,
    resetKey: pathname,
  });

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[200] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-on-accent focus:outline-none"
      >
        Skip to content
      </a>

      <header
        ref={headerRef}
        onFocusCapture={() => setFocusWithin(true)}
        onBlurCapture={(event) => {
          if (!headerRef.current?.contains(event.relatedTarget as Node | null)) {
            setFocusWithin(false);
          }
        }}
        style={{ transform: hidden ? 'translateY(-100%)' : 'translateY(0)' }}
        className="chrome-fixed chrome-fixed-overflow fixed inset-x-0 top-0 z-[100] border-b border-border-subtle bg-surface-raised pt-[env(safe-area-inset-top)] transition-transform duration-200 ease-out motion-reduce:duration-0"
      >
        <div className="flex h-[var(--app-topbar-h,4rem)] min-w-0 items-center gap-2 px-[var(--app-gutter,12px)] md:gap-3">
          <button
            type="button"
            onClick={onMobileMenuOpen}
            aria-label="Open menu"
            aria-expanded={mobileMenuOpen}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-surface hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:hidden"
          >
            <MenuIcon className="h-5 w-5" aria-hidden="true" />
          </button>

          <Link
            to={logoTo}
            aria-label={logoLabel}
            className="flex shrink-0 items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <Logo variant="mark" size="sm" className="lg:hidden" />
            <Logo variant="full" size="sm" className="hidden lg:block" />
          </Link>

          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex" aria-label="Primary">
            {items.map((item) => {
              const active = activeMatcher(item, pathname);
              if (item.children?.length) {
                return (
                  <NavDropdown
                    key={item.key}
                    item={item}
                    active={active}
                    open={openKey === item.key}
                    onOpenChange={(open) => setOpenKey(open ? item.key : null)}
                  />
                );
              }
              return (
                <NavLink
                  key={item.key}
                  to={item.to ?? '/'}
                  className={() =>
                    [
                      'flex h-[52px] w-[84px] flex-col items-center justify-center gap-1 rounded-md px-2 py-1.5 text-base font-medium transition-colors',
                      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                      active ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary',
                    ].join(' ')
                  }
                >
                  <item.icon
                    className={`h-6 w-6 shrink-0 ${active ? 'text-accent' : 'text-text-muted'}`}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  <span className="whitespace-nowrap">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="flex flex-1 justify-end lg:flex-none">
            <div className="flex shrink-0 items-center gap-1">{rightSlot}</div>
          </div>
        </div>
      </header>

      {mobileMenu}
    </>
  );
};

export default SiteTopbar;
