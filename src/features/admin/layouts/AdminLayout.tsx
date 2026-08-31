/**
 * @file AdminLayout.tsx
 * @description Shell layout component for ALL admin-facing pages.
 */

import { Outlet } from 'react-router-dom';
import AdminTopbar from '@/features/admin/components/layout/AdminTopbar';

const TOPBAR_H = 'pt-20 md:pt-24';
const CONTENT_PB = 'md:pb-6';

const AdminLayout = () => (
  <div className="bg-bg min-h-screen" data-theme-persist="dark">
    <AdminTopbar />
    <div id="main-content" className={`${TOPBAR_H} ${CONTENT_PB}`}>
      <Outlet />
    </div>
  </div>
);

export default AdminLayout;
