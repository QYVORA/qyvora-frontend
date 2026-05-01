import { Outlet, useMatch } from 'react-router-dom';
import StudentTopbar from '../../features/student/components/layout/StudentTopbar';

const StudentLayout = () => {
  // On room pages:
  // - Mobile/tablet should scroll naturally.
  // - Desktop keeps fixed-height shell so room split panes can scroll independently.
  const roomMatch = useMatch('/bootcamps/:bootcampId/phases/:phaseId/rooms/:roomId');
  const roomMatchLegacy = useMatch('/bootcamps/:bootcampId/modules/:moduleId/rooms/:roomId');
  const isRoomPage = Boolean(roomMatch || roomMatchLegacy);

  return (
    <div className={`bg-bg ${isRoomPage ? 'min-h-screen lg:h-svh lg:overflow-hidden' : 'min-h-screen'}`}>
      <StudentTopbar />
      {/* pt-20 md:pt-24 clears the fixed topbar height */}
      <div className={`pt-20 md:pt-24 ${isRoomPage ? 'lg:h-full lg:overflow-hidden' : 'pb-20 md:pb-4'}`}>
        <Outlet />
      </div>
    </div>
  );
};

export default StudentLayout;
