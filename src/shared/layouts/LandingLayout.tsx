/**
 * LandingLayout — used exclusively by the landing page.
 *
 * The landing page uses scroll-snap (viewport-by-viewport).
 * The snap container inside is h-screen and is the scroll root.
 * The navbar is fixed on top — no padding needed here, HeroSection
 * handles its own top offset (pt-16 md:pt-20) internally.
 *
 * No footer here — the landing page embeds its own footer as the last snap section.
 * No overflow-hidden on main — the snap container manages its own overflow.
 */
import { Outlet } from 'react-router-dom';
import Navbar from '../../features/marketing/components/layout/Navbar';
import PublicBottomNav from '../../features/marketing/components/layout/PublicBottomNav';

const LandingLayout = () => (
  <>
    <Navbar />
    <main className="w-full">
      <Outlet />
    </main>
    <PublicBottomNav />
  </>
);

export default LandingLayout;
