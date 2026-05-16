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

// ─────────────────────────────────────────────
// Icon map — ties each nav item key to its icon
// ─────────────────────────────────────────────
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

// Build the platform nav items by merging site config with icons.
// item.key is typed as `string` by the config shape, but ICON_BY_KEY only
// accepts its own literal keys, so we cast to `keyof typeof ICON_BY_KEY`.
const platformItems = SITE_CONFIG.nav.platform.map(
  (item: { key: string; label: string; path: string; desc: string }) => ({
    ...item,
    icon: ICON_BY_KEY[item.key as keyof typeof ICON_BY_KEY],
  })
);

// NAV_GROUPS drives the desktop nav — currently only the Platform group
const NAV_GROUPS: { label: string; items: typeof platformItems }[] = [];
if (platformItems.length) NAV_GROUPS.push({ label: 'Platform', items: platformItems });

// ─────────────────────────────────────────────
// Navbar component
// ─────────────────────────────────────────────
const Navbar: React.FC = () => {
  const { user } = useAuth();

  // Tracks which dropdown group is open (by label), or null if none
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Controls hide-on-scroll-down / show-on-scroll-up behaviour
  const [isVisible, setIsVisible] = useState(true);

  // Ref to compare against previous scroll position without triggering re-renders
  const lastScrollY = React.useRef(0);

  const scrollY = useScrollY();
  const location = useLocation();

  // ── Hide / show logic ──────────────────────
  // The navbar hides when the user scrolls down and reappears when they scroll up.
  // A 5 px dead-zone prevents jitter from tiny scroll fluctuations.
  useEffect(() => {
    // Always show the bar when the page is near the very top
    if (scrollY < 10) {
      setIsVisible(true);
      lastScrollY.current = scrollY;
      return;
    }

    const diff = scrollY - lastScrollY.current;

    // Only act when the scroll delta is meaningful enough (> 5 px)
    if (Math.abs(diff) > 5) {
      const isScrollingDown = diff > 0;
      setIsVisible(!isScrollingDown); // hide on down, show on up
      lastScrollY.current = scrollY;
    }
  }, [scrollY]);

  // Close any open dropdown whenever the route changes
  useEffect(() => {
    setActiveDropdown(null);
  }, [location]);

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────
  return (
    <nav
      className={`
        fixed top-0 left-0 w-full z-50 overflow-visible
        border-b border-border/50
        transition-all duration-300
        h-[72px] flex items-center px-4 md:px-8

        /*
         * TRANSPARENT BACKGROUND
         * ─────────────────────────────────────────
         * Previously, the navbar switched between:
         *   • bg-transparent  (when scrollY <= 80)
         *   • bg-bg/90 + backdrop-blur-md  (when scrollY > 80)
         *
         * Now the background is always transparent at every scroll
         * position.  The border and text still appear; only the
         * coloured/blurred background fill is removed.
         *
         * To restore the frosted-glass look, bring back:
         *   isScrolled ? 'bg-bg/90 backdrop-blur-md' : 'bg-transparent'
         * ─────────────────────────────────────────
         */
        bg-transparent

        /* Slide up when scrolling down; slide back in when scrolling up */
        ${!isVisible ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}
      `}
      style={{ outline: 'none' }}
    >
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">

        {/* ── Logo ─────────────────────────────── */}
        <Link to="/" className="flex items-center">
          <Logo size="lg" />
        </Link>

        {/* ── Desktop Navigation ───────────────── */}
        <div className="hidden md:flex items-center space-x-1">
          {NAV_GROUPS.map((group) => (
            <div
              key={group.label}
              className="relative group h-[72px] flex items-center overflow-visible"
              // Open dropdown on hover, close when the cursor leaves
              onMouseEnter={() => group.items && setActiveDropdown(group.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              {/* Render a <Link> if the group has a direct path, otherwise a <button> */}
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
                  {/* Chevron rotates 180° when the dropdown is open */}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      activeDropdown === group.label ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              )}

              {/* ── Desktop Dropdown ─────────────── */}
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
                    // Keep the panel within viewport on smaller screens
                    style={{ left: 'max(1rem, calc(50% - 240px))', transform: 'none' }}
                  >
                    {/* Two-column grid of platform links */}
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
                                ? 'bg-accent-dim text-accent'   // active route highlight
                                : 'hover:bg-accent-dim'         // hover highlight
                            }
                          `}
                        >
                          {/* Icon badge */}
                          <div className="p-2 rounded bg-bg border border-border group-hover/item:border-accent group-hover/item:text-accent transition-colors flex-none">
                            <item.icon className="w-4 h-4" />
                          </div>

                          {/* Label + description */}
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
        </div>

        {/* ── Right Controls ───────────────────── */}
        <div className="flex items-center gap-2 md:gap-3">

          {/* Desktop auth buttons — shown only on md+ screens */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              /* Authenticated: show Dashboard link (and Admin Console if admin) */
              <div className="flex items-center gap-3">
                {user.isAdmin && (
                  <Link
                    to="/mr-robot/dashboard"
                    className="text-sm font-bold uppercase tracking-wider text-accent border border-accent/30 rounded-md px-4 py-2 hover:bg-accent-dim transition-all flex items-center gap-2"
                  >
                    <Lock className="w-3.5 h-3.5" /> Admin Console
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className="btn-primary !px-5 !py-2 text-sm flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
                </Link>
              </div>
            ) : (
              /* Unauthenticated: show CTA to register */
              <Link to="/register" className="btn-primary !px-5 !py-2 text-sm">
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