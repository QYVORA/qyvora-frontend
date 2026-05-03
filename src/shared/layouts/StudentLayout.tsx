import { Outlet, useMatch } from 'react-router-dom';
import StudentTopbar from '../../features/student/components/layout/StudentTopbar';
import StudentRightRail from '../../features/student/components/layout/StudentRightRail';

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

  return (
    <div className="bg-bg min-h-screen">
      <StudentTopbar />
      {/* pt-20 md:pt-24 clears the fixed topbar height */}
      <div className={`pt-20 md:pt-24 ${isRoomPage ? '' : 'pb-20 md:pb-4'}`}>
        <Outlet />
      </div>
      {/* Right rail — shown on all student pages except bootcamp pages */}
      {!isBootcampPage && <StudentRightRail />}
    </div>
  );
};

export default StudentLayout;
