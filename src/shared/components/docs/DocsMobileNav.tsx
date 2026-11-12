import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { BookOpen, Github, Library, Menu } from 'lucide-react';
import { getToolByPath, TOOLS, TOOL_DOMAIN_LABELS, TOOL_DOMAIN_ORDER } from '@/features/marketing/data/tools/registry';
import { useScrollDirection } from '@/shared/hooks/useScrollDirection';
import MobileMenu from '@/shared/components/layout/MobileMenu';
import type { NavItem } from '@/shared/components/layout/NavDropdown';

/**
 * DocsMobileNav — the small-screen header for documentation.
 *
 * Uses the same shell as SiteTopbar: fixed topbar height, surface-raised bar,
 * 48px hamburger and a single identity cluster. Navigation lives in the shared
 * full-screen MobileMenu; the desktop rail owns branding at lg+.
 */
const DocsMobileNav: React.FC = () => {
  const location = useLocation();
  const activeTool = getToolByPath(location.pathname);
  const [menuOpen, setMenuOpen] = useState(false);
  const hidden = useScrollDirection({
    disabled: menuOpen,
    forceVisible: menuOpen,
    resetKey: location.pathname,
  });

  const menuItems: NavItem[] = TOOL_DOMAIN_ORDER.map((domain) => ({
    key: domain,
    label: TOOL_DOMAIN_LABELS[domain],
    icon: Library,
    children: TOOLS.filter((tool) => tool.domain === domain).map((tool) => ({
      label: tool.displayName,
      to: tool.path,
      icon: BookOpen,
    })),
  })).filter((item) => item.children && item.children.length > 0);

  const isDomainActive = (item: NavItem, pathname: string) =>
    TOOLS.some((tool) => tool.domain === item.key && tool.path === pathname);

  return (
    <>
      <header
        style={{ transform: hidden ? 'translateY(-100%)' : 'translateY(0)' }}
        className="chrome-fixed chrome-fixed-overflow fixed inset-x-0 top-0 z-[100] border-b border-border-subtle bg-surface-raised pt-[var(--app-safe-top,0px)] transition-transform duration-200 ease-out motion-reduce:duration-0 lg:hidden"
      >
        <div className="flex h-[var(--app-topbar-h,4rem)] min-w-0 items-center gap-2 px-[var(--app-gutter,12px)]">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open documentation menu"
            aria-expanded={menuOpen}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md text-accent transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>

          <div className="flex min-w-0 flex-1 items-center gap-2">
            {activeTool?.logo ? (
              <img
                src={activeTool.logo}
                alt=""
                aria-hidden="true"
                className="h-5 w-5 shrink-0 object-contain"
              />
            ) : (
              <Library className="h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
            )}
            <p className="min-w-0 truncate text-base font-medium text-text-primary">
              {activeTool ? activeTool.name : 'Documentation'}
            </p>
          </div>

          {activeTool?.github && (
            <a
              href={activeTool.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${activeTool.name} repository on GitHub`}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <Github className="h-5 w-5" aria-hidden="true" />
            </a>
          )}
        </div>
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        items={menuItems}
        title="Documentation"
        variant="fullscreen"
        activeMatcher={isDomainActive}
      />
    </>
  );
};

export default DocsMobileNav;
