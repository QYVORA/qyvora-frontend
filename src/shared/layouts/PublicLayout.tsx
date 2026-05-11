/**
 * PublicLayout — standard public pages (Contact, Services, CyberPoints, etc.)
 * Normal scrolling with Navbar + Footer. Navbar is fixed so pt-[72px] clears it.
 * On mobile, PublicBottomNav is fixed at the bottom — pb adds clearance for it.
 */
import { Outlet } from 'react-router-dom';
import Navbar from '../../features/marketing/components/layout/Navbar';
import Footer from '../../features/marketing/components/layout/Footer';
import PublicBottomNav from '../../features/marketing/components/layout/PublicBottomNav';

const PublicLayout = () => (
  <>
    <Navbar />
    <main className="w-full pb-[calc(60px+env(safe-area-inset-bottom,0px))] md:pb-0">
      <Outlet />
    </main>
    <Footer />
    <PublicBottomNav />
  </>
);

export default PublicLayout;
