import { Outlet } from 'react-router-dom';
import Navbar from '../../features/marketing/components/layout/Navbar';
import Footer from '../../features/marketing/components/layout/Footer';

const PublicLayout = () => (
  <>
    <Navbar />
    <main>
      <Outlet />
    </main>
    <Footer />
  </>
);

export default PublicLayout;
