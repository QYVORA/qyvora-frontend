import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Library, Menu } from 'lucide-react';
import { QyvoraMark } from '@/shared/components/brand';
import { getToolByPath, TOOLS, TOOL_DOMAIN_LABELS, TOOL_DOMAIN_ORDER } from '@/features/marketing/data/tools/registry';
import MobileMenu from '@/shared/components/layout/MobileMenu';
import type { NavItem } from '@/shared/components/layout/NavDropdown';

/**
 * DocsMobileNav — the small-screen header for documentation.
 *
 * Navigation lives in the shared MobileMenu drawer, opened from the hamburger
 * here; the bar itself carries identity and the current tool.
 */
const DocsMobileNav: React.FC = () => {
  const location = useLocation();
  const activeTool = getToolByPath(location.pathname);
  const [menuOpen, setMenuOpen] = useState(false);

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

  return (
    <header className="sticky top-0 z-[90] flex h-14 items-center gap-3 border-b border-border-subtle bg-canvas/95 px-3 backdrop-blur-sm lg:hidden">
      <Link
        to="/"
        aria-label="QYVORA home"
        className="shrink-0 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <QyvoraMark className="h-6 w-6" />
      </Link>

      {activeTool?.logo ? (
        <img
          src={activeTool.logo}
          alt=""
          aria-hidden="true"
          className="h-6 w-6 shrink-0 object-contain"
        />
      ) : (
        <Library className="h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
      )}

      <p className="min-w-0 flex-1 truncate text-base font-medium text-text-primary">
        {activeTool ? activeTool.displayName : 'Documentation'}
      </p>

      <button
        type="button"
        onClick={() => setMenuOpen(true)}
        aria-label="Open documentation menu"
        aria-expanded={menuOpen}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-surface-raised hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        items={menuItems}
        title="Documentation"
      />
    </header>
  );
};

export default DocsMobileNav;
