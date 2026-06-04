import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
        'transition-all duration-500',
        isScrolled 
          ? 'bg-bg/80 backdrop-blur-xl border-b border-border/50 shadow-2xl shadow-black/20' 
          : 'bg-transparent border-b border-transparent',
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
                className="px-8 py-3 bg-accent text-bg font-black uppercase tracking-[0.25em] text-[11px] rounded-sm transition-all hover:brightness-110 active:scale-95 shadow-[0_0_24px_var(--color-accent-glow)] border border-accent/20"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                to="/register"
                className="group relative px-10 py-3.5 bg-accent text-bg font-black uppercase tracking-[0.25em] text-[11px] overflow-hidden rounded-sm transition-all hover:brightness-110 active:scale-95 shadow-[0_0_28px_var(--color-accent-glow)] border border-accent/30"
              >
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </Link>
            )}
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
