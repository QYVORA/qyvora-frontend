import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import DocsMobileNav from '@/shared/components/docs/DocsMobileNav';
import DocsSidebar from '@/shared/components/docs/DocsSidebar';

const STORAGE_KEY = 'qyvora:docs-rail-collapsed';

const readCollapsed = (): boolean => {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
};

/**
 * DocsShell — the shell for tool documentation routes.
 *
 * Documentation replaces the public navbar with the same left rail the
 * dashboard uses, so the article column owns the full viewport height and reads
 * as a document rather than as a marketing page. There is no topbar on desktop
 * (the rail carries navigation) and no footer (a pager at the end of the page
 * carries onward movement) — only the reader needs are kept.
 *
 * The rail's collapse state lives here so the content column's left padding can
 * track it; on mobile the rail is replaced by the shared topbar-style bar whose
 * hamburger opens the full-screen documentation menu.
 */
const DocsShell: React.FC = () => {
  const [collapsed, setCollapsed] = useState(readCollapsed);

  const toggleCollapsed = () =>
    setCollapsed((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? '1' : '');
      } catch {
        // Storage unavailable (private mode) — state stays in memory.
      }
      return next;
    });

  return (
    <div className="min-h-dvh bg-canvas">
      <a
        href="#docs-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent"
      >
        Skip to content
      </a>

      <DocsSidebar collapsed={collapsed} onToggleCollapsed={toggleCollapsed} />
      <DocsMobileNav />

      <main
        id="docs-main"
        className={[
          'w-full pb-16 lg:pb-0',
          'pt-[calc(var(--app-topbar-h,4rem)+var(--app-safe-top,0px))] lg:pt-0',
          'transition-[padding-left] duration-[var(--dur-base)] ease-[var(--ease-smooth)]',
          collapsed ? 'lg:pl-[76px]' : 'lg:pl-[264px]',
        ].join(' ')}
      >
        <Outlet />
      </main>

    </div>
  );
};

export default DocsShell;
