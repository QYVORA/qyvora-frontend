/**
 * @file AdminLayout.tsx
 * @description Shell layout component for ALL admin-facing pages.
 */

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminTopbar from '@/features/admin/components/layout/AdminTopbar';
import AdminSidebar from '@/features/admin/components/layout/AdminSidebar';
import AdminBottomNav from '@/features/admin/components/layout/AdminBottomNav';

const TOPBAR_H = 'pt-20 md:pt-24';
const CONTENT_PB = 'md:pb-6';

const AdminLayout = () => {
  const [railCollapsed, setRailCollapsed] = useState(() => {
    try {
      return localStorage.getItem('qyvora:admin-sidebar-collapsed') === '1';
    } catch {
      return false;
    }
  });

  const toggleRail = () =>
    setRailCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('qyvora:admin-sidebar-collapsed', next ? '1' : '');
      } catch {
        /* storage unavailable */
      }
      return next;
    });

  const railPad = railCollapsed ? 'lg:pl-[76px]' : 'lg:pl-[264px]';

  return (
    <div className="bg-canvas min-h-dvh" data-theme-persist="dark">
      <AdminTopbar railCollapsed={railCollapsed} />
      <AdminSidebar collapsed={railCollapsed} onToggleCollapse={toggleRail} />
      <div
        id="main-content"
        className={`${TOPBAR_H} ${CONTENT_PB} transition-[padding-left] duration-[var(--dur-base)] ease-[var(--ease-smooth)] ${railPad}`}
      >
        <Outlet />
      </div>
      <AdminBottomNav />
    </div>
  );
};

export default AdminLayout;