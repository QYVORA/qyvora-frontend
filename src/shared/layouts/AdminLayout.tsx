import { Outlet } from 'react-router-dom';

// Admin layout — pages handle their own sidebar/chrome
const AdminLayout = () => (
  <div className="min-h-screen bg-bg">
    <Outlet />
  </div>
);

export default AdminLayout;
