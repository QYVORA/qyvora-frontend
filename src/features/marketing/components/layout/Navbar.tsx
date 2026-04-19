import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronDown, Monitor, Shield, ShoppingBag, Terminal, Users, BookOpen, Mail, Trophy, LayoutDashboard, Lock, ArrowRight } from 'lucide-react';
import { useScrollY } from '../../../../core/hooks/useScrollY';
import { useAuth } from '../../../../core/contexts/AuthContext';
import Logo from '../../../../shared/components/brand/Logo';

const NAV_GROUPS = [
  {
    label: 'Platform',
    items: [
      { label: 'Bootcamps', icon: Terminal, desc: 'Intensive operator training', path: '/bootcamps' },
      { label: 'Rooms', icon: Monitor, desc: 'Real environments, real techniques', path: '/rooms' },
      { label: 'Marketplace', icon: ShoppingBag, desc: 'The hacker economy', path: '/marketplace' },
      { label: 'Leaderboard', icon: Trophy, desc: 'Hall of Shadows', path: '/leaderboard' },
      { label: 'Zero-Day Market', icon: Shield, desc: 'Exclusive findings', path: '/zero-day-market' },
    ]
  },
  {
    label: 'Tools',
    items: [
      { label: 'Domain Recon', icon: Monitor, desc: 'Visualise the attack surface', path: '/domain-recon' },
      { label: 'Field Playbooks', icon: BookOpen, desc: 'Operator methodology', path: '/field-playbooks' },
      { label: 'OWASP Top 10', icon: Shield, desc: 'Critical vulnerabilities', path: '/owasp-top-10' },
    ]
  },
  { label: 'Services', path: '/services' },
  {
    label: 'Company',
    items: [
      { label: 'Team', icon: Users, desc: 'The operators behind HSOCIETY', path: '/team' },
      { label: 'Blog', icon: BookOpen, desc: 'Latest research & findings', path: '/blog' },
      { label: 'Contact', icon: Mail, desc: 'Get in touch', path: '/contact' },
    ]
  }
];

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const scrollY = useScrollY();
  const location = useLocation();
  const isScrolled = scrollY > 80;

  useEffect(() => { setIsOpen(false); setActiveDropdown(null); setMobileExpanded(null); }, [location]);

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 h-[72px] flex items-center px-4 md:px-8 ${
        isScrolled ? 'bg-bg/85 backdrop-blur-md border-bottom border-border' : 'bg-transparent'
      }`}
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
              className="relative group h-[72px] flex items-center"
              onMouseEnter={() => group.items && setActiveDropdown(group.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              {group.path ? (
                <Link 
                  to={group.path}
                  className="px-4 py-2 text-sm font-medium uppercase tracking-wider text-text-primary hover:text-accent transition-colors"
                >
                  {group.label}
                </Link>
              ) : (
                <button 
                  className="px-4 py-2 text-sm font-medium uppercase tracking-wider text-text-primary hover:text-accent transition-colors flex items-center gap-1"
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
                    className="absolute top-[72px] left-1/2 -translate-x-1/2 w-[520px] bg-bg-card border border-border rounded-lg shadow-2xl p-5"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      {group.items.map((item) => (
                        <Link
                          key={item.label}
                          to={item.path}
                          className="flex items-start gap-4 p-3 rounded-md hover:bg-accent-dim transition-colors group/item"
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

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="flex items-center gap-3">
              {user.isAdmin && (
                <Link to="/mr-robot" className="text-sm font-bold uppercase tracking-wider text-accent border border-accent/30 rounded-md px-4 py-2 hover:bg-accent-dim transition-all flex items-center gap-2">
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
                Log In
              </Link>
              <Link to="/register" className="btn-primary !px-5 !py-2 text-sm">
                Start Training
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-text-primary p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed top-0 right-0 h-full w-[88vw] max-w-sm bg-bg border-l border-border z-50 flex flex-col md:hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <Logo size="md" />
                <button onClick={() => setIsOpen(false)} className="p-2 text-text-muted hover:text-accent transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Nav items — scrollable */}
              <div className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
                {NAV_GROUPS.map((group) => (
                  <div key={group.label}>
                    {group.path ? (
                      /* Direct link (Services) */
                      <Link
                        to={group.path}
                        className="flex items-center justify-between w-full px-3 py-3 rounded-lg text-sm font-bold uppercase tracking-wider text-text-primary hover:bg-accent-dim hover:text-accent transition-colors"
                      >
                        {group.label}
                        <ArrowRight className="w-4 h-4 text-text-muted" />
                      </Link>
                    ) : (
                      /* Accordion group */
                      <div>
                        <button
                          onClick={() => setMobileExpanded(mobileExpanded === group.label ? null : group.label)}
                          className="flex items-center justify-between w-full px-3 py-3 rounded-lg text-sm font-bold uppercase tracking-wider text-text-primary hover:bg-accent-dim hover:text-accent transition-colors"
                        >
                          <span>{group.label}</span>
                          <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-200 ${mobileExpanded === group.label ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {mobileExpanded === group.label && group.items && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="grid grid-cols-2 gap-2 px-2 pb-3 pt-1">
                                {group.items.map((item) => (
                                  <Link
                                    key={item.label}
                                    to={item.path}
                                    className="flex flex-col gap-1.5 p-3 rounded-lg bg-bg-card border border-border hover:border-accent/40 hover:bg-accent-dim transition-all active:scale-95"
                                  >
                                    <div className="flex items-center gap-2">
                                      <item.icon className="w-3.5 h-3.5 text-accent flex-none" />
                                      <span className="text-xs font-bold uppercase tracking-tight text-text-primary leading-tight">{item.label}</span>
                                    </div>
                                    <span className="text-[10px] text-text-muted leading-tight">{item.desc}</span>
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Auth buttons pinned to bottom */}
              <div className="px-4 py-5 border-t border-border space-y-3">
                {user ? (
                  <>
                    {user.isAdmin && (
                      <Link to="/mr-robot" className="w-full flex items-center justify-center gap-2 border border-accent text-accent rounded-lg py-3 text-sm font-bold uppercase tracking-widest hover:bg-accent-dim transition-all">
                        <Lock className="w-4 h-4" /> Admin Console
                      </Link>
                    )}
                    <Link to="/dashboard" className="w-full flex items-center justify-center gap-2 bg-accent text-bg rounded-lg py-3 text-sm font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-accent/20">
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link to="/login" className="flex items-center justify-center border border-accent text-accent rounded-lg py-3 text-sm font-bold uppercase tracking-widest hover:bg-accent-dim transition-all">
                      Log In
                    </Link>
                    <Link to="/register" className="flex items-center justify-center bg-accent text-bg rounded-lg py-3 text-sm font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-accent/20">
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
