/**
 * @file StudentLayout.tsx
 * @description Shell layout for ALL authenticated student-facing pages inside
 *              the /dashboard route tree.
 */

import { Outlet, useMatch } from 'react-router-dom';
import { useAuth } from '@/core/contexts/AuthContext';
import StudentTopbar from '@/features/student/components/layout/StudentTopbar';
import UsernameChangeModal from '@/features/student/components/UsernameChangeModal';
import ConsentBanner from '@/shared/components/ConsentBanner';

const TOPBAR_H = 'pt-20 md:pt-24';
const MOBILE_NAV_PB = 'pb-[calc(68px+env(safe-area-inset-bottom,0px))] md:pb-6';

const StudentLayout = () => {
  const roomMatch = useMatch('/dashboard/bootcamps/:bootcampId/phases/:phaseId/rooms/:roomId');
  const roomMatchLegacy = useMatch('/dashboard/bootcamps/:bootcampId/modules/:moduleId/rooms/:roomId');
  const isRoomPage = Boolean(roomMatch || roomMatchLegacy);

  return (
    <div className="bg-bg min-h-screen">
      <StudentTopbar />
      <div id="main-content" className={`${TOPBAR_H} ${isRoomPage ? '' : MOBILE_NAV_PB}`}>
        <Outlet />
      </div>
      <ConsentBanner />
      <UsernameChangeModal />
    </div>
  );
};

export default StudentLayout;
