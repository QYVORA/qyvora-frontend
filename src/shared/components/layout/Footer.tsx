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
      { key: 'hpb', label: 'HPB', path: '/hpb' },
      { key: 'anansi', label: 'Anansi', path: '/anansi' },
      { key: 'blogs', label: 'Blogs', path: '/blogs' },
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
  { key: 'x',        label: 'X',        href: 'https://x.com/qyvorasec',             Icon: BrandXIcon },
  { key: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/company/qyvora', Icon: BrandLinkedinIcon },
  { key: 'github',   label: 'GitHub',   href: 'https://github.com/QYVORA',           Icon: BrandGithubIcon },
  { key: 'youtube',  label: 'YouTube',  href: 'https://www.youtube.com/@QYVORA',     Icon: BrandYoutubeIcon },
  { key: 'whatsapp', label: 'WhatsApp', href: 'https://wa.me/233535535222',          Icon: BrandWhatsAppIcon },
];

const PULSE_TEXT_KEY = 'body.liveNode';

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

const CURRENT_YEAR = new Date().getFullYear();

const Footer: React.FC = React.memo(() => {
  const { t } = useTranslation();

  return (
    <footer className="relative w-full overflow-hidden select-none bg-bg">
      <div className="px-3 py-10 md:px-12 md:py-20 lg:px-20">
        <div className="mx-auto max-w-[1600px]">

          {/* ── Top: Brand | Nav grid ─────────────────────────────────────── */}
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-20 xl:gap-32">

            {/* Brand */}
            <div className="space-y-5">
              <Logo size="lg" variant="full" className="block" />
              <p className="max-w-xs font-mono text-sm leading-relaxed text-text-muted">
                {t('body.footerDesc')}
              </p>
              <div className="flex items-center gap-3">
                {SOCIAL_LINKS.map(({ key, label, href, Icon }) => (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-border text-text-muted transition-colors hover:border-accent/40 hover:text-accent active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Nav columns — fixed grid so it never reflows unevenly */}
            <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 sm:gap-x-12">
              {FOOTER_COLS.map((col) => (
                <div key={col.title}>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                    {t(FOOTER_COL_KEYS[col.title] || col.title)}
                  </h3>
                  <ul className="mt-5 space-y-3">
                    {col.links.map((link) => (
                      <li key={link.key}>
                        <Link
                          to={link.path}
                          className="text-sm font-bold text-text-primary transition-colors hover:text-accent active:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                        >
                          {t(FOOTER_LINK_KEYS[link.key] || link.label)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>

          {/* ── Legal / secondary links row ──────────────────────────────── */}
          <div className="mt-12 flex flex-wrap gap-x-6 gap-y-2 border-t border-border/40 pt-8 md:mt-16">
            {SITE_CONFIG.footer.links.map((link, idx) => (
              <Link
                key={idx}
                to={link.path}
                className="text-[11px] text-text-muted/60 transition-colors hover:text-text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {t(FOOTER_BOTTOM_LINK_KEYS[link.label] || link.label)}
              </Link>
            ))}
          </div>

          {/* ── Utility bar: status · language · copyright · contact ────── */}
          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-muted">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              <span>{t(PULSE_TEXT_KEY)}</span>
              <span className="mx-2 h-3 w-px bg-border/60" aria-hidden="true" />
              <span className="text-text-muted/40 normal-case tracking-normal">
                &copy; {CURRENT_YEAR} QYVORA
              </span>
            </div>

            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <ContactTrigger type="button" className="btn-primary">
                {t('button.contactUs')}
              </ContactTrigger>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;