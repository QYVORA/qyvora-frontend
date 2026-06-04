import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ArrowRight } from 'lucide-react';
import { useScrollY } from '../../../../core/hooks/useScrollY';
import { useAuth } from '../../../../core/contexts/AuthContext';
import Logo from '../../../../shared/components/brand/Logo';
import { SITE_CONFIG } from '../../content/siteConfig';

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const [isVisible, setIsVisible]           = useState(true);
  const lastScrollY                          = React.useRef(0);
  const scrollY                              = useScrollY();
  const location                             = useLocation();

  const isScrolled = scrollY > 20;

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

  return (
    <nav
      className={[
        'fixed top-0 left-0 w-full z-50 overflow-visible',
        'h-[80px] flex items-center px-4 md:px-8',
        'transition-all duration-500 bg-transparent border-none',
        !isVisible ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100',
      ].join(' ')}
      style={{ outline: 'none' }}
    >
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">

        {/* ── Logo ─────────────────────────────────────────────────────────── */}
        <Link to="/" className="flex items-center transition-transform hover:scale-105 duration-300">
          <Logo size="lg" />
        </Link>

        {/* ── Desktop Navigation ───────────────────────────────────────────── */}
        <div className="hidden md:flex items-center space-x-10">
          {SITE_CONFIG.nav.platform.map((item) => (
            <Link
              key={item.key}
              to={item.path}
              className={`text-[11px] font-black uppercase tracking-[0.3em] transition-all hover:text-accent relative group ${
                location.pathname === item.path ? 'text-accent' : 'text-text-primary/70'
              }`}
            >
              {item.label}
              <span className={`absolute -bottom-1 left-0 w-0 h-[2px] bg-accent transition-all duration-300 group-hover:w-full ${
                location.pathname === item.path ? 'w-full' : ''
              }`} />
            </Link>
          ))}
        </div>

        {/* ── Right controls ───────────────────────────────────────────────── */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center">
            {user ? (
              <Link
                to="/dashboard"
                className="btn-primary flex items-center justify-center gap-2 text-xs !px-7 !py-2.5"
              >
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
            ) : (
              <Link
                to="/register"
                className="btn-primary flex items-center justify-center gap-2 text-xs !px-7 !py-2.5"
              >
                Start Training <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
