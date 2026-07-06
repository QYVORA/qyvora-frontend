/**
 * @file AdminLayout.tsx
 * @description Shell layout component for ALL admin-facing pages.
 */

import { Outlet } from 'react-router-dom';
import AdminTopbar from '@/features/admin/components/layout/AdminTopbar';
import AdminRightRail from '@/features/admin/components/layout/AdminRightRail';

const TOPBAR_H = 'pt-20 md:pt-24';
const MOBILE_NAV_PB = 'pb-[calc(68px+env(safe-area-inset-bottom,0px))] md:pb-6';

const AdminLayout = () => (
  <div className="bg-bg min-h-screen">
    <AdminTopbar />
    <div id="main-content" className={`${TOPBAR_H} ${MOBILE_NAV_PB}`}>
      <Outlet />
    </div>
    <AdminRightRail />
  </div>
);

export default AdminLayout;
