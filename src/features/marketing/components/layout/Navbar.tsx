import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronDown,
  Shield,
  ShoppingBag,
  Terminal,
  Mail,
  Trophy,
  LayoutDashboard,
  Lock,
  Zap,
  Link2,
  Flag,
} from 'lucide-react';
import { useScrollY } from '../../../../core/hooks/useScrollY';
import { useAuth } from '../../../../core/contexts/AuthContext';
import Logo from '../../../../shared/components/brand/Logo';
import { SITE_CONFIG } from '../../content/siteConfig';
import { ContactTrigger } from '../ContactModal';

// ─── Icon map ────────────────────────────────────────────────────────────────

const ICON_BY_KEY = {
  bootcamps:       Terminal,
  ctf:             Flag,
  marketplace:     ShoppingBag,
  leaderboard:     Trophy,
  zero_day_market: Shield,
  cyber_points:    Zap,
  hsociety_chain:  Link2,
  contact:         Mail,
} as const;

const platformItems = SITE_CONFIG.nav.platform.map(
  (item: { key: string; label: string; path: string; desc: string }) => ({
    ...item,
    icon: ICON_BY_KEY[item.key as keyof typeof ICON_BY_KEY],
  })
);

const NAV_GROUPS: { label: string; items: typeof platformItems }[] = [];
if (platformItems.length) NAV_GROUPS.push({ label: 'Platform', items: platformItems });

// ─── Navbar ──────────────────────────────────────────────────────────────────

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isVisible, setIsVisible]           = useState(true);
  const lastScrollY                          = React.useRef(0);
  const scrollY                              = useScrollY();
  const location                             = useLocation();

  // Hide on scroll-down, reveal on scroll-up
  useEffect(() => {
    if (scrollY < 10) {
      setIsVisible(true);
      lastScrollY.current = scrollY;
      return;
    }
    const diff = scrollY - lastScrollY.current;
    if (Math.abs(diff) > 5) {
      setIsVisible(diff <= 0);
      lastScrollY.current = scrollY;
    }
  }, [scrollY]);

  // Close dropdown on route change
  useEffect(() => { setActiveDropdown(null); }, [location]);

  return (
    <nav
      className={[
        'fixed top-0 left-0 w-full z-50 overflow-visible',
        'h-[72px] flex items-center px-4 md:px-8',
        'transition-all duration-300',

        // ── Fully transparent background — no fill, no blur, no border ──────
        // The original had:
        //   border-b border-border/50   ← removed: invisible-border rule
        //   bg-transparent              ← kept and made unconditional
        //
        // `border-transparent` renders the border-box at zero opacity so
        // layout is not affected, but no colour bleeds through on any screen.
        'bg-transparent border-b border-transparent',

        // Slide-hide behaviour — unchanged
        !isVisible ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100',
      ].join(' ')}
      style={{ outline: 'none' }}
    >
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">

        {/* ── Logo ─────────────────────────────────────────────────────────── */}
        <Link to="/" className="flex items-center">
          <Logo size="lg" />
        </Link>

        {/* ── Desktop Navigation ───────────────────────────────────────────── */}
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
                    activeDropdown === group.label
                      ? 'text-accent'
                      : 'text-text-primary hover:text-accent'
                  }`}
                >
                  {group.label}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      activeDropdown === group.label ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              )}

              {/* ── Dropdown panel ───────────────────────────────────────── */}
              <AnimatePresence>
                {activeDropdown === group.label && group.items && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="
                      absolute z-[80] top-[72px]
                      w-[480px] [max-width:min(480px,calc(100vw-2rem))]
                      bg-bg-card border border-border rounded-xl shadow-2xl p-5
                    "
                    style={{ left: 'max(1rem, calc(50% - 240px))', transform: 'none' }}
                  >
                    <div className="grid grid-cols-2 gap-3">
                      {group.items.map((item) => (
                        <ContactTrigger
                          key={item.label}
                          type="link"
                          className={`
                            flex items-start gap-4 p-3 rounded-md transition-colors group/item
                            ${
                              location.pathname === item.path ||
                              location.pathname.startsWith(item.path + '/')
                                ? 'bg-accent-dim text-accent'
                                : 'hover:bg-accent-dim'
                            }
                          `}
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
                        </ContactTrigger>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          {/* ── Static Contact Link ── */}
          <ContactTrigger
            type="link"
            className="px-4 py-2 text-sm font-medium uppercase tracking-wider text-text-primary hover:text-accent transition-colors"
          >
            Contact
          </ContactTrigger>
        </div>

        {/* ── Right controls ───────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center gap-3">
                {user.isAdmin && (
                  // Admin Console button
                  // Was: px-4 py-2 text-sm — now px-4 py-2.5 text-sm font-bold
                  // The extra vertical padding (py-2 → py-2.5) keeps it optically
                  // even with the primary CTA beside it, and min-h-[40px] ensures
                  // a comfortable touch target on all screen sizes.
                  <Link
                    to="/mr-robot/dashboard"
                    className="
                      inline-flex items-center gap-2
                      text-sm font-bold uppercase tracking-wider
                      text-accent border border-accent/30 rounded-md
                      px-4 py-2.5 min-h-[40px]
                      hover:bg-accent-dim transition-all
                    "
                  >
                    <Lock className="w-3.5 h-3.5" /> Admin Console
                  </Link>
                )}

                {/* Dashboard button — same height treatment as Admin Console */}
                <Link
                  to="/dashboard"
                  className="btn-primary inline-flex items-center gap-2 !px-5 !py-2.5 text-sm min-h-[40px]"
                >
                  <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
                </Link>
              </div>
            ) : (
              // "Start Training" CTA
              // Was: !px-5 !py-2 text-sm — now adds min-h-[40px] and py-2.5
              // so the button has consistent height across breakpoints and
              // meets the recommended 40 px minimum touch target.
              <Link
                to="/register"
                className="btn-primary !px-5 !py-2.5 text-sm min-h-[40px]"
              >
                Start Training
              </Link>
            )}
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;