/**
 * SnapPublicLayout — public pages with viewport-locked snap scroll.
 *
 * Mobile (< md): normal scrolling page — snap is disabled, content stacks
 * naturally. pt-[72px] clears the fixed navbar.
 *
 * Tablet/Desktop (md+): snap scroll. pt-[72px] on <main> pushes the snap
 * container below the navbar. The container fills the remaining viewport
 * height (100dvh - 72px). Each snap section fills h-full of the container.
 */
import { Outlet } from 'react-router-dom';
import Navbar from '../../features/marketing/components/layout/Navbar';
import Footer from '../../features/marketing/components/layout/Footer';

const SnapPublicLayout = () => (
  <>
    <Navbar />
    {/*
      Mobile: normal scroll, pt-[72px] clears navbar, footer renders normally.
      md+: snap scroll, height: 100dvh, footer is embedded in each page's last section.
    */}
    <main
      className="w-full pt-[72px] md:pt-[72px]"
      style={{ height: undefined }}
    >
      {/* On md+, this div becomes the snap container host */}
      <div className="w-full md:h-[calc(100dvh-72px)]">
        <Outlet />
      </div>
    </main>
    {/* Footer only on mobile — desktop snap pages embed their own footer */}
    <div className="md:hidden">
      <Footer />
    </div>
  </>
);

export default SnapPublicLayout;
