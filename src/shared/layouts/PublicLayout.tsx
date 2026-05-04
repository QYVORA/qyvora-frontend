/**
 * PublicLayout — standard public pages (Contact, Services, CyberPoints, etc.)
 * Normal scrolling with Navbar + Footer. Navbar is fixed so pt-[72px] clears it.
 */
import { Outlet } from 'react-router-dom';
import Navbar from '../../features/marketing/components/layout/Navbar';
import Footer from '../../features/marketing/components/layout/Footer';

const PublicLayout = () => (
  <>
    <Navbar />
    <main className="w-full pt-[72px]">
      <Outlet />
    </main>
    <Footer />
  </>
);

export default PublicLayout;
