import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicNavigation from '@/shared/components/layout/PublicNavigation';
import PublicBottomNav from '@/shared/components/layout/PublicBottomNav';
import PublicFooter from '@/shared/components/layout/PublicFooter';

interface PublicShellProps {
  /** Feature-owned overlay hosts to mount at shell level (e.g. contact modals). */
  overlayHosts?: React.ReactNode;
}

/**
 * PublicShell — the calm public shell (landing + marketing pages). Fixed
 * navigation, natural document flow (`<Outlet />` sections own their own
 * clearance), compact footer. Overlay gating runs through the single canonical
 * queue in `usePopupManager` (one blocking overlay at a time, prioritised).
 *
 * No page-level max-width containers; content spans the viewport with the
 * standard gutters (`px-3 md:px-4 lg:px-6`).
 */
const PublicShell: React.FC<PublicShellProps> = ({ overlayHosts }) => (
  <>
    <PublicNavigation />
    <main id="main-content" className="flex min-h-dvh w-full flex-col">
      <Outlet />
    </main>
    <PublicFooter />
    <PublicBottomNav />
    {overlayHosts}
  </>
);

export default PublicShell;