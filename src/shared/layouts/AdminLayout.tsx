import { Outlet } from 'react-router-dom';
import AdminTopbar from '../../features/admin/components/layout/AdminTopbar';
import AdminRightRail from '../../features/admin/components/layout/AdminRightRail';

// Topbar height tokens — keep in sync with AdminTopbar's h-20 md:h-24
const TOPBAR_H = 'pt-20 md:pt-24';

// Mobile bottom nav height token — min-h-[68px] + safe-area-inset-bottom
const MOBILE_NAV_PB = 'pb-[calc(68px+env(safe-area-inset-bottom,0px))] md:pb-6';

const AdminLayout = () => (
  <div className="bg-bg min-h-screen">
    {/* Fixed topbar + mobile bottom nav */}
    <AdminTopbar />

    {/* Content wrapper — clears the fixed topbar and mobile bottom nav */}
    <div className={`${TOPBAR_H} ${MOBILE_NAV_PB}`}>
      <Outlet />
    </div>

    {/* Right rail — desktop only */}
    <AdminRightRail />
  </div>
);

export default AdminLayout;
