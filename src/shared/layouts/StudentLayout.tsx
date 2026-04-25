import { Outlet } from 'react-router-dom';
import StudentTopbar from '../../features/student/components/layout/StudentTopbar';

const StudentLayout = () => (
  <div className="min-h-screen bg-bg">
    <StudentTopbar />
    {/* pt-20 mobile / pt-24 md = topbar height, pb-20 = mobile bottom nav + safe area */}
    <div className="pt-20 md:pt-24 pb-20 md:pb-4">
      <Outlet />
    </div>
  </div>
);

export default StudentLayout;
