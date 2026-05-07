import { Outlet, useMatch } from 'react-router-dom';
import StudentTopbar from '../../features/student/components/layout/StudentTopbar';
import StudentRightRail from '../../features/student/components/layout/StudentRightRail';

// Topbar height tokens — keep in sync with StudentTopbar's h-20 md:h-24
const TOPBAR_H = 'pt-20 md:pt-24';

// Mobile bottom nav height token — min-h-[68px] + safe-area-inset-bottom
// pb-[calc(68px+env(safe-area-inset-bottom,0px))] ensures content never hides under it
const MOBILE_NAV_PB = 'pb-[calc(68px+env(safe-area-inset-bottom,0px))] md:pb-6';

const StudentLayout = () => {
  // Room pages — fixed-height shell so split panes scroll independently
  const roomMatch       = useMatch('/dashboard/bootcamps/:bootcampId/phases/:phaseId/rooms/:roomId');
  const roomMatchLegacy = useMatch('/dashboard/bootcamps/:bootcampId/modules/:moduleId/rooms/:roomId');
  const isRoomPage      = Boolean(roomMatch || roomMatchLegacy);

  // Bootcamp course page (the curriculum/phase overview)
  const bootcampCourseMatch = useMatch('/dashboard/bootcamps/:bootcampId');

  // Bootcamp list page
  const bootcampListMatch = useMatch('/dashboard/bootcamps');

  // Hide the rail on all bootcamp-related pages
  const isBootcampPage = Boolean(isRoomPage || bootcampCourseMatch || bootcampListMatch);
  const marketplaceMatch = useMatch('/dashboard/marketplace');
  const marketplaceLegacyMatch = useMatch('/marketplace');
  const walletMatch = useMatch('/dashboard/wallet');
  const walletLegacyMatch = useMatch('/wallet');
  const notificationsMatch = useMatch('/dashboard/notifications');
  const notificationsLegacyMatch = useMatch('/notifications');
  const settingsMatch = useMatch('/dashboard/settings');
  const settingsLegacyMatch = useMatch('/settings');
  const hasPageOwnedSidebar = Boolean(
    marketplaceMatch
    || marketplaceLegacyMatch
    || walletMatch
    || walletLegacyMatch
    || notificationsMatch
    || notificationsLegacyMatch
    || settingsMatch
    || settingsLegacyMatch,
  );
  const hideRightRail = isBootcampPage || hasPageOwnedSidebar;

  return (
    <div className="bg-bg min-h-screen">
      {/* Topbar is fixed — always rendered on every student page */}
      <StudentTopbar />

      {/*
        Content wrapper:
        - pt-20 md:pt-24  → clears the fixed topbar (80px mobile / 96px desktop)
        - Room pages get no bottom padding — they manage their own split-pane layout
        - All other pages get bottom padding that clears the fixed mobile bottom nav
      */}
      <div className={`${TOPBAR_H} ${isRoomPage ? '' : MOBILE_NAV_PB}`}>
        <Outlet />
      </div>

      {/* Right rail — shown on all student pages except bootcamp pages */}
      {!hideRightRail && <StudentRightRail />}
    </div>
  );
};

export default StudentLayout;
