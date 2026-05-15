import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Shield, ShoppingBag, Terminal, Mail, Trophy, LayoutDashboard, Lock, Zap, Link2, Flag, Maximize2, Minimize2 } from 'lucide-react';
import { useScrollY } from '../../../../core/hooks/useScrollY';
import { useAuth } from '../../../../core/contexts/AuthContext';
import Logo from '../../../../shared/components/brand/Logo';
import { SITE_CONFIG } from '../../content/siteConfig';

const ICON_BY_KEY = {
  bootcamps: Terminal,
  ctf: Flag,
  marketplace: ShoppingBag,
  leaderboard: Trophy,
  zero_day_market: Shield,
  cyber_points: Zap,
  hsociety_chain: Link2,
  contact: Mail,
} as const;

const platformItems = SITE_CONFIG.nav.platform.map((item: { key: string; label: string; path: string; desc: string }) => ({
  ...item,
  icon: ICON_BY_KEY[item.key],
}));
const companyItems = SITE_CONFIG.nav.company.map((item: { key: string; label: string; path: string; desc: string }) => ({
  ...item,
  icon: ICON_BY_KEY[item.key],
}));
const NAV_GROUPS: { label: string; items: typeof platformItems }[] = [];
if (platformItems.length) NAV_GROUPS.push({ label: 'Platform', items: platformItems });
if (companyItems.length) NAV_GROUPS.push({ label: 'Company', items: companyItems });

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = React.useRef(0);
  const scrollY = useScrollY();
  const location = useLocation();
  const isScrolled = scrollY > 80;

  // Handle scroll-to-hide logic
  useEffect(() => {
    // Always show at the top
    if (scrollY < 10) {
      setIsVisible(true);
      lastScrollY.current = scrollY;
      return;
    }

    const diff = scrollY - lastScrollY.current;
    
    // Threshold to prevent jitter (5px)
    if (Math.abs(diff) > 5) {
      const isScrollingDown = diff > 0;
      setIsVisible(!isScrollingDown);
      lastScrollY.current = scrollY;
    }
  }, [scrollY]);

  useEffect(() => { setActiveDropdown(null); }, [location]);

  useEffect(() => {
    const syncFullscreen = () => setIsFullscreen(Boolean(document.fullscreenElement));
    syncFullscreen();
    document.addEventListener('fullscreenchange', syncFullscreen);
    return () => document.removeEventListener('fullscreenchange', syncFullscreen);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      // Ignore when fullscreen is blocked by browser policy.
    }
  };
  return (
    <nav 
      className={`nav-border-beam fixed top-0 left-0 w-full z-50 overflow-visible transition-all duration-300 h-[72px] flex items-center px-4 md:px-8 ${
        isScrolled
          ? 'bg-bg/90 backdrop-blur-md'
          : 'bg-transparent'
      } ${
        !isVisible ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
      }`}
      style={{ outline: 'none' }}
    >
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <Logo size="lg" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-1">
          {NAV_GROUPS.map((group) => (
            <div 
              key={group.label}
              className="relative group h-[72px] flex items-center overflow-visible"
              onMouseEnter={() => group.items && setActiveDropdown(group.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              {'path' in group && group.path ? (
                <Link 
                  to={String(group.path)}
                  className={`px-4 py-2 text-sm font-medium uppercase tracking-wider transition-colors ${
                    location.pathname.startsWith(String(group.path))
                      ? 'text-accent'
                      : 'text-text-primary hover:text-accent'
                  }`}
                >
                  {group.label}
                </Link>
              ) : (
                <button 
                  className={`px-4 py-2 text-sm font-medium uppercase tracking-wider transition-colors flex items-center gap-1 ${
                    activeDropdown === group.label ? 'text-accent' : 'text-text-primary hover:text-accent'
                  }`}
                >
                  {group.label}
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === group.label ? 'rotate-180' : ''}`} />
                </button>
              )}

              {/* Dropdown Desktop */}
              <AnimatePresence>
                {activeDropdown === group.label && group.items && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute z-[80] top-[72px] w-[480px] bg-bg-card border border-border rounded-xl shadow-2xl p-5
                      ${group.label === 'Company'
                        ? 'right-0 left-auto'
                        : 'left-1/2 -translate-x-1/2'
                      }
                      [max-width:min(480px,calc(100vw-2rem))]`}
                    style={
                      group.label !== 'Company'
                        ? { left: 'max(1rem, calc(50% - 240px))', transform: 'none' }
                        : undefined
                    }
                  >
                    <div className="grid grid-cols-2 gap-3">
                      {group.items.map((item) => (
                        <Link
                          key={item.label}
                          to={item.path}
                          className={`flex items-start gap-4 p-3 rounded-md transition-colors group/item ${
                            location.pathname === item.path || location.pathname.startsWith(item.path + '/')
                              ? 'bg-accent-dim text-accent'
                              : 'hover:bg-accent-dim'
                          }`}
                        >
                          <div className="p-2 rounded bg-bg border border-border group-hover/item:border-accent group-hover/item:text-accent transition-colors flex-none">
                            <item.icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm font-bold uppercase tracking-wider text-text-primary mb-0.5">
                              {item.label}
                            </div>
                            <div className="text-xs text-text-muted">
                              {item.desc}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2 md:gap-3">
          <button
            type="button"
            onClick={() => void toggleFullscreen()}
            className="h-10 w-10 md:h-11 md:w-11 rounded-xl border border-border bg-bg-card/70 text-text-muted hover:text-accent hover:border-accent/40 transition-colors flex items-center justify-center"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 md:w-5 md:h-5" /> : <Maximize2 className="w-4 h-4 md:w-5 md:h-5" />}
          </button>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center space-x-3">
          {user ? (
            <div className="flex items-center gap-3">
              {user.isAdmin && (
                <Link to="/mr-robot/dashboard" className="text-sm font-bold uppercase tracking-wider text-accent border border-accent/30 rounded-md px-4 py-2 hover:bg-accent-dim transition-all flex items-center gap-2">
                   <Lock className="w-3.5 h-3.5" /> Admin Console
                </Link>
              )}
              <Link to="/dashboard" className="btn-primary !px-5 !py-2 text-sm flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
              </Link>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm font-bold uppercase tracking-wider text-accent border border-accent rounded-md px-5 py-2 hover:bg-accent-dim transition-all">
                Login
              </Link>
              <Link to="/register" className="btn-primary !px-5 !py-2 text-sm">
                Start Training
              </Link>
            </>
          )}
        </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
