import { Outlet } from 'react-router-dom';

const AdminLayout = () => (
  <div className="min-h-screen bg-bg">
    <Outlet />
  </div>
);

export default AdminLayout;
