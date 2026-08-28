import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useScrollLock } from '@/core/hooks/useScrollLock';
import { useAuth } from '@/core/contexts/AuthContext';
import { Logo } from '@/shared/components/brand';
import { SITE_CONFIG } from '@/features/marketing/content/siteConfig';
import { ContactTrigger } from '@/features/marketing/components/ContactModal';
import LanguageSwitcher from '@/shared/components/LanguageSwitcher';
import Identicon from '@/shared/components/Identicon';
import { IconMenu, IconX, IconChevronRight } from '@/shared/components/icons';
import { LogIn, BookOpen } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

export interface ToolDocSection {
  id: string;
  label: string;
}

interface ToolDocTopbarProps {
  toolName: string;
  accentWord?: string;
  sections: ToolDocSection[];
  githubUrl?: string;
  installLabel?: string;
  onInstall?: () => void;
}

const NAV_GROUP_LABELS: Record<string, string> = {
  learning: 'nav.learning',
  community: 'nav.community',
  company: 'nav.company',
  platform: 'nav.platform',
};

const NAV_ITEM_LABELS: Record<string, string> = {
  courses: 'nav.courses',
  bootcamp: 'nav.bootcamp',
  labs: 'nav.labs',
  cp: 'nav.cp',
  simulations: 'nav.simulations',
  blogs: 'nav.blogs',
  leaderboard: 'nav.leaderboard',
  market: 'nav.market',
  team: 'nav.team',
  quiteroot: 'nav.quiteroot',
  terms: 'footer.termsOfService',
  anansi: 'nav.anansi',
  toha3ee: 'nav.toha3ee',
  jabari: 'nav.jabari',
  aksum: 'nav.aksum',
  shaka: 'nav.shaka',
  services: 'nav.services',
};

const ToolDocTopbar: React.FC<ToolDocTopbarProps> = ({
  toolName,
  accentWord,
  sections,
  githubUrl,
  installLabel = 'Install',
  onInstall,
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const location = useLocation();

  const [activeSection, setActiveSection] = useState(sections[0]?.id || '');
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openMobileGroup, setOpenMobileGroup] = useState<string | null>(null);
  const [openDocSections, setOpenDocSections] = useState(true);

  useScrollLock(isMenuOpen);

  // Close mobile menu on route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setOpenMobileGroup(null);
  }, [location.pathname]);

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const handleMenuToggle = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const toggleMobileGroup = useCallback((key: string, isOpen: boolean) => {
    setOpenMobileGroup(isOpen ? null : key);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);

      const offsets = sections.map((s) => {
        const el = document.getElementById(s.id);
        return { id: s.id, top: el ? el.getBoundingClientRect().top : Infinity };
      });

      const current = offsets.reduce(
        (closest, s) => {
          if (s.top <= 130 && s.top > closest.top) return s;
          return closest;
        },
        { id: sections[0]?.id || '', top: -Infinity }
      );

      if (current.id) setActiveSection(current.id);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [sections]);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const isMobile = window.innerWidth < 768;
      const offset = isMobile ? 120 : 75;
      const y = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, []);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 w-full z-[100] transition-all duration-200',
          scrolled || isMenuOpen
            ? 'bg-bg/95 backdrop-blur-xl border-b border-border/50'
            : 'bg-bg/80 md:bg-transparent backdrop-blur-md md:backdrop-blur-none border-b border-border/20 md:border-transparent'
        )}
      >
        <div className="flex items-center justify-between h-14 md:h-16 px-3 md:px-4 lg:px-6">
          {/* Brand Logo + Tool Name */}
          <div className="flex items-center gap-2.5 min-w-0 relative z-[110]">
            <Link
              to="/"
              aria-label="QYVORA - Return to Home"
              className="flex items-center gap-2.5 min-w-0 transition-transform hover:scale-105 duration-200"
            >
              <Logo size="sm" variant="mark" color="#06B66F" className="!w-7 !h-7 shrink-0" />
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-sm font-black uppercase tracking-tight text-text-primary truncate">
                  {toolName}
                </span>
                {accentWord && (
                  <span className="text-sm font-black uppercase tracking-tight text-accent shrink-0">
                    {accentWord}
                  </span>
                )}
              </div>
            </Link>
          </div>

          {/* Section links — desktop (centered) */}
          <nav className="hidden md:flex items-center gap-1 flex-1 min-w-0 justify-center overflow-x-auto no-scrollbar mx-4">
            {sections.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => scrollTo(s.id)}
                className={cn(
                  'relative px-3 py-1.5 text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-colors shrink-0',
                  activeSection === s.id
                    ? 'text-accent'
                    : 'text-text-muted hover:text-text-primary'
                )}
              >
                {s.label}
                {activeSection === s.id && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-accent" />
                )}
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0 relative z-[110]">
            <LanguageSwitcher inverted={false} />

            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest text-text-muted hover:text-text-primary border border-border/50 hover:border-border transition-colors"
                aria-label="GitHub Repository"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <span>GitHub</span>
              </a>
            )}

            {onInstall && (
              <button
                type="button"
                onClick={onInstall}
                className="btn-primary !w-auto !px-3.5 !py-1.5 !text-[10px] !rounded-lg shrink-0"
              >
                {installLabel}
              </button>
            )}

            {/* Mobile hamburger button */}
            <button
              type="button"
              onClick={handleMenuToggle}
              className="md:hidden p-2 -mr-1 transition-colors relative z-[110] text-text-primary hover:text-accent flex items-center justify-center min-h-[44px] min-w-[44px]"
              aria-label={isMenuOpen ? t('aria.closeMenu', 'Close Menu') : t('aria.openMenu', 'Open Menu')}
            >
              {isMenuOpen ? <IconX size={22} /> : <IconMenu size={22} />}
            </button>
          </div>
        </div>

        {/* Section links — mobile sub-bar (horizontal quick jump when menu is closed) */}
        {!isMenuOpen && sections.length > 0 && (
          <nav
            aria-label="Document Sections"
            className="flex md:hidden items-center gap-1.5 px-3 py-1.5 border-t border-border/20 bg-bg-card/90 backdrop-blur-md overflow-x-auto no-scrollbar"
          >
            {sections.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => scrollTo(s.id)}
                className={cn(
                  'px-2.5 py-1 text-[9px] font-black uppercase tracking-widest whitespace-nowrap rounded-lg transition-colors shrink-0',
                  activeSection === s.id
                    ? 'bg-accent/10 text-accent border border-accent/40'
                    : 'text-text-muted hover:text-text-primary bg-bg-elevated/40 border border-border/30'
                )}
              >
                {s.label}
              </button>
            ))}
          </nav>
        )}
      </header>

      {/* ── Mobile Menu Overlay (matches Navbar design) ──────────── */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[90] md:hidden bg-bg/95 backdrop-blur-xl"
          >
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col h-full pt-20 px-6 pb-10 overflow-y-auto"
            >
              {/* Document Sections Group */}
              {sections.length > 0 && (
                <div className="border-b border-border/10 pb-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setOpenDocSections((prev) => !prev)}
                    className="w-full flex items-center justify-between pl-4 pr-2 py-3 text-sm font-black uppercase tracking-[0.25em] text-accent min-h-[44px]"
                  >
                    <span className="flex items-center gap-2">
                      <BookOpen size={16} className="text-accent" />
                      {toolName} {accentWord || 'Docs'}
                    </span>
                    <IconChevronRight
                      size={16}
                      className={cn(
                        'transition-transform duration-200',
                        openDocSections ? 'rotate-90' : ''
                      )}
                    />
                  </button>
                  <AnimatePresence>
                    {openDocSections && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-6 pb-2 flex flex-col gap-1">
                          {sections.map((s) => (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => {
                                closeMenu();
                                scrollTo(s.id);
                              }}
                              className={cn(
                                'text-left relative pl-4 py-2.5 text-xs font-bold uppercase tracking-[0.2em] transition-colors border-l-2 min-h-[44px] flex items-center',
                                activeSection === s.id
                                  ? 'text-accent border-accent'
                                  : 'text-text-secondary border-transparent hover:text-accent hover:border-accent/50'
                              )}
                            >
                              {s.label}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Home link */}
              <Link
                to="/"
                onClick={closeMenu}
                className={cn(
                  'relative pl-4 py-3 text-sm font-black uppercase tracking-[0.25em] transition-colors border-l-2 min-h-[44px] flex items-center',
                  isActive('/')
                    ? 'text-accent border-accent'
                    : 'text-text-primary/70 border-transparent hover:text-accent hover:border-accent/50'
                )}
              >
                {t('nav.home', 'Home')}
              </Link>

              {/* Grouped nav links (Learning, Community, Company, Platform) */}
              {SITE_CONFIG.nav.groups.map((group) => {
                const isOpen = openMobileGroup === group.key;
                return (
                  <div key={group.key} className="border-b border-border/10 last:border-b-0">
                    <button
                      type="button"
                      onClick={() => toggleMobileGroup(group.key, isOpen)}
                      className="w-full flex items-center justify-between pl-4 pr-2 py-3 text-sm font-black uppercase tracking-[0.25em] transition-colors text-text-primary/70 hover:text-accent min-h-[44px]"
                    >
                      {t(NAV_GROUP_LABELS[group.key] || group.label)}
                      <IconChevronRight
                        size={16}
                        className={cn(
                          'transition-transform duration-200',
                          isOpen ? 'rotate-90' : ''
                        )}
                      />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="pl-6 pb-2 flex flex-col gap-1">
                            {group.items.map((item) => {
                              const linkClasses = cn(
                                'relative pl-4 py-2.5 text-xs font-bold uppercase tracking-[0.2em] transition-colors border-l-2 text-left min-h-[44px] flex items-center',
                                isActive(item.path)
                                  ? 'text-accent border-accent'
                                  : 'text-text-secondary border-transparent hover:text-accent hover:border-accent/50'
                              );

                              if ((item as any).modal) {
                                return (
                                  <ContactTrigger
                                    key={item.key}
                                    className={linkClasses}
                                    onOpen={closeMenu}
                                  >
                                    {t(NAV_ITEM_LABELS[item.key] || item.label)}
                                  </ContactTrigger>
                                );
                              }

                              return (
                                <Link
                                  key={item.key}
                                  to={item.path}
                                  onClick={closeMenu}
                                  className={linkClasses}
                                >
                                  {t(NAV_ITEM_LABELS[item.key] || item.label)}
                                </Link>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              {/* GitHub Link in Mobile Menu if available */}
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                  className="relative pl-4 py-3 text-sm font-black uppercase tracking-[0.25em] transition-colors border-l-2 border-transparent text-text-primary/70 hover:text-accent hover:border-accent/50 min-h-[44px] flex items-center gap-2"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  <span>GitHub Repository</span>
                </a>
              )}

              {/* Auth / Action Buttons */}
              <div className="flex flex-col gap-3 mt-6">
                {user ? (
                  <>
                    <Link
                      to="/dashboard/profile"
                      onClick={closeMenu}
                      className="w-full flex items-center justify-center gap-3 bg-accent text-on-accent font-bold uppercase tracking-widest rounded-xl px-6 py-3.5 text-sm transition-[filter,transform] duration-200 hover:brightness-110 active:scale-[0.98] min-h-[48px]"
                    >
                      <Identicon
                        value={user.username || '?'}
                        size={20}
                        className="w-5 h-5 rounded-lg bg-black border-black"
                      />
                      {user.username}
                    </Link>
                    <ContactTrigger
                      className="w-full flex items-center justify-center gap-2.5 border border-accent/50 text-accent font-bold uppercase tracking-widest rounded-xl px-6 py-3.5 text-sm transition-[background-color,color] duration-200 hover:bg-accent/10 active:scale-[0.98] min-h-[48px]"
                      onOpen={closeMenu}
                    >
                      {t('nav.contact', 'Contact')}
                    </ContactTrigger>
                  </>
                ) : (
                  <>
                    <ContactTrigger
                      className="w-full flex items-center justify-center gap-2.5 bg-accent text-on-accent font-bold uppercase tracking-widest rounded-xl px-6 py-3.5 text-sm transition-[filter,transform] duration-200 hover:brightness-110 active:scale-[0.98] min-h-[48px]"
                      onOpen={closeMenu}
                    >
                      {t('nav.contact', 'Contact')}
                    </ContactTrigger>
                    <Link
                      to="/login"
                      onClick={closeMenu}
                      className="w-full flex items-center justify-center gap-2.5 border border-accent/50 text-accent font-bold uppercase tracking-widest rounded-xl px-6 py-3.5 text-sm transition-[background-color,color] duration-200 hover:bg-accent/10 active:scale-[0.98] min-h-[48px]"
                    >
                      <LogIn className="w-4 h-4" /> {t('button.logIn', 'Log In')}
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ToolDocTopbar;
