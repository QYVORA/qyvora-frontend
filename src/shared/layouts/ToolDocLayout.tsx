import { Outlet } from 'react-router-dom';

/**
 * Layout wrapper for tool documentation pages (Anansi, Toha3ee, Jabari, Aksum).
 * No public Navbar — tool doc pages have their own fixed ToolDocTopbar.
 * No snap sections — documentation is single-scroll.
 */
const ToolDocLayout = () => (
  <div className="min-h-screen flex flex-col bg-bg">
    <Outlet />
  </div>
);

export default ToolDocLayout;
