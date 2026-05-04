/**
 * SnapPublicLayout — for public pages that use scroll-snap (viewport-by-viewport).
 *
 * The navbar is fixed at 72px. pt-[72px] on <main> pushes the snap container
 * below the navbar. The snap container fills the remaining viewport height
 * (100dvh - 72px) via h-full. Each snap section fills h-full of the container,
 * so content is always below the navbar — no overlap with the transparent navbar.
 *
 * No footer rendered here — each snap page embeds its own footer as the last section.
 */
import { Outlet } from 'react-router-dom';
import Navbar from '../../features/marketing/components/layout/Navbar';

const SnapPublicLayout = () => (
  <>
    <Navbar />
    {/* pt-[72px] clears the fixed navbar. height: 100dvh fills the full viewport. */}
    <main
      className="w-full pt-[72px]"
      style={{ height: '100dvh' }}
    >
      {/* h-full = 100dvh - 72px — the snap container fills exactly this */}
      <div className="h-full w-full">
        <Outlet />
      </div>
    </main>
  </>
);

export default SnapPublicLayout;
