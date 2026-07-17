import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SITE_CONFIG } from '@/features/marketing/content/siteConfig';
import { BrandWhatsAppIcon } from '@/shared/components/icons';
import { BrandLinkedinIcon } from '@/shared/components/icons';
import { BrandYoutubeIcon } from '@/shared/components/icons';
import { BrandGithubIcon } from '@/shared/components/icons';
import { BrandXIcon } from '@/shared/components/icons';
import { ContactTrigger } from '@/features/marketing/components/ContactModal';
import { Logo } from '@/shared/components/brand';
import LanguageSwitcher from '@/shared/components/LanguageSwitcher';

const FOOTER_COLS = [
  {
    title: 'Platform',
    links: [
      { key: 'events', label: 'Events', path: '/events' },
      { key: 'hpb', label: 'HPB', path: '/hpb' },
      { key: 'anansi', label: 'Anansi', path: '/anansi' },
      { key: 'blogs', label: 'Blogs', path: '/blogs' },
      { key: 'news', label: 'News', path: '/news' },
      { key: 'market', label: 'Market', path: '/zero-day-market' },
      { key: 'leaderboard', label: 'Leaderboard', path: '/leaderboard' },
      { key: 'services', label: 'Services', path: '/services' },
    ],
  },
  {
    title: 'Company',
    links: [
      { key: 'team', label: 'Team', path: '/team' },
    ],
  },
  {
    title: 'Account',
    links: [
      { key: 'register', label: 'Register', path: '/register' },
      { key: 'login', label: 'Log In', path: '/login' },
    ],
  },
];

interface SocialLink {
  key: string;
  label: string;
  href: string;
  Icon: React.ComponentType<{ className?: string }>;
}

const SOCIAL_LINKS: SocialLink[] = [
  { key: 'x',       label: 'X',          href: 'https://x.com/qyvorasec',              Icon: BrandXIcon },
  { key: 'linkedin', label: 'LinkedIn',   href: 'https://linkedin.com/company/qyvora', Icon: BrandLinkedinIcon },
  { key: 'github',   label: 'GitHub',     href: 'https://github.com/QYVORA',           Icon: BrandGithubIcon },
  { key: 'youtube',  label: 'YouTube',    href: 'https://www.youtube.com/@QYVORA',      Icon: BrandYoutubeIcon },
  { key: 'whatsapp', label: 'WhatsApp',   href: 'https://wa.me/233535535222',           Icon: BrandWhatsAppIcon },
];

const PULSE_TEXT_KEY = 'body.liveNode';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  const FOOTER_COL_KEYS: Record<string, string> = {
    Platform: 'footer.platform',
    Company: 'footer.company',
    Account: 'footer.account',
  };

  const FOOTER_LINK_KEYS: Record<string, string> = {
    events: 'nav.events',
    hpb: 'nav.hpb',
    anansi: 'nav.anansi',
    blogs: 'nav.blogs',
    news: 'nav.news',
    market: 'nav.market',
    leaderboard: 'nav.leaderboard',
    services: 'nav.services',
    team: 'nav.team',
    register: 'nav.signUp',
    login: 'button.logIn',
  };

  const FOOTER_BOTTOM_LINK_KEYS: Record<string, string> = {
    'Terms of Service': 'footer.termsOfService',
    'Cyber Feed': 'nav.cyberFeed',
    'Anansi': 'nav.anansi',
    'Learn': 'nav.learn',
    'Market': 'nav.market',
    'Blogs': 'nav.blogs',
    'Team': 'nav.team',
    'Leaderboard': 'nav.leaderboard',
    'Services': 'nav.services',
  };

  return (
    <footer className="relative w-full overflow-hidden select-none bg-bg flex flex-col">

      <div className="relative z-10 w-full flex flex-col flex-1 px-3 md:px-12 lg:px-20 py-8 md:py-20">
        <div className="w-full max-w-[1600px] mx-auto">

          {/* ── Brand + Nav Columns (same row on desktop) ──────────────────── */}
          <div className="flex flex-col lg:flex-row lg:justify-between gap-6 lg:gap-20 xl:gap-32">
            {/* Brand — left (logo acts as header to description) */}
            <div className="max-w-xs space-y-3">
              <Logo size="lg" variant="full" className="block" />
              <p className="text-sm text-text-muted font-mono leading-relaxed">
                {t('body.footerDesc')}
              </p>
              <div className="flex items-center gap-3 pt-1">
                {SOCIAL_LINKS.map(({ key, label, href, Icon }) => (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="w-11 h-11 flex items-center justify-center rounded-xl border border-border text-text-muted hover:text-accent hover:border-accent/40 transition-all group hover:scale-105 active:scale-95"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>

            {/* Nav columns — right */}
            <div className="flex flex-wrap gap-x-16 gap-y-10">
              {FOOTER_COLS.map((col) => (
                <div key={col.title} className="space-y-5">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                    {t(FOOTER_COL_KEYS[col.title] || col.title)}
                  </h3>
                  <ul className="space-y-3">
                    {col.links.map((link: { key: string; label: string; path: string }) => (
                      <li key={link.key}>
                        <Link
                          to={link.path}
                          onClick={() => window.scrollTo(0, 0)}
                          className="text-sm font-bold text-text-primary hover:text-accent transition-colors"
                        >
                          {t(FOOTER_LINK_KEYS[link.key] || link.label)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* ── Bottom Bar ────────────────────────────────────────────────── */}
          <div className="pt-8 md:pt-10 mt-8 md:mt-16 border-t border-border/40">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-text-muted">
                <span className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                  </span>
                    <span className="tracking-widest">{t(PULSE_TEXT_KEY)}</span>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 md:ml-auto">
                <LanguageSwitcher />
                {SITE_CONFIG.footer.links.map((link, idx) => (
                  <Link
                    key={idx}
                    to={link.path}
                    onClick={() => window.scrollTo(0, 0)}
                    className="text-[11px] text-text-muted/60 hover:text-text-muted transition-colors"
                  >
                    {t(FOOTER_BOTTOM_LINK_KEYS[link.label] || link.label)}
                  </Link>
                ))}
                <span className="text-[11px] text-text-muted/40">
                  &copy; {new Date().getFullYear()} QYVORA
                </span>
                <ContactTrigger
                  type="button"
                  className="btn-primary"
                >
                  {t('button.contactUs')}
                </ContactTrigger>
              </div>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
