import { Outlet } from 'react-router-dom';
import Navbar from '../../features/marketing/components/layout/Navbar';
import Footer from '../../features/marketing/components/layout/Footer';

const PublicLayout = () => (
  <>
    <Navbar />
    {/* pt-16 md:pt-20 clears the fixed navbar height */}
    <main className="pt-16 md:pt-20">
      <Outlet />
    </main>
    <Footer />
  </>
);

export default PublicLayout;
