import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Library } from 'lucide-react';
import { QyvoraMark } from '@/shared/components/brand';
import { getToolByPath } from '@/features/marketing/data/tools/registry';

/**
 * DocsMobileNav — the small-screen header for documentation.
 *
 * Navigation lives in DocsBottomNav, so this bar carries identity only: the
 * site mark, and which tool the reader is in. Keeping it free of a menu button
 * means the header says where you are and the bar below says where you can go,
 * instead of hiding every destination behind one icon.
 */
const DocsMobileNav: React.FC = () => {
  const location = useLocation();
  const activeTool = getToolByPath(location.pathname);

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

      <p className="min-w-0 flex-1 truncate text-sm font-black uppercase tracking-wide text-text-primary">
        {activeTool ? activeTool.displayName : 'Documentation'}
      </p>
    </header>
  );
};

export default DocsMobileNav;
