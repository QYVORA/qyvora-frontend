import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
    title: 'Learning',
    links: [
      { key: 'courses', label: 'Courses', path: '/courses' },
      { key: 'bootcamp', label: 'Bootcamp', path: '/hpb' },
      { key: 'labs', label: 'Labs', path: '/labs' },
      { key: 'blogs', label: 'Blogs', path: '/blogs' },
    ],
  },
  {
    title: 'Platform',
    links: [
      { key: 'anansi', label: 'Anansi', path: '/anansi' },
      { key: 'toha3ee', label: 'Toha3ee', path: '/toha3ee' },
      { key: 'jabari', label: 'Jabari', path: '/jabari' },
      { key: 'services', label: 'Services', path: '/services' },
    ],
  },
  {
    title: 'Community',
    links: [
      { key: 'leaderboard', label: 'Leaderboard', path: '/leaderboard' },
      { key: 'market', label: 'Market', path: '/zero-day-market' },
    ],
  },
  {
    title: 'Company',
    links: [
      { key: 'team', label: 'Team', path: '/team' },
      { key: 'terms', label: 'Terms of Service', path: '/terms' },
    ],
  },
];

interface SocialLink {
  key: string;
  label: string;
  href: string;
  Icon: React.ComponentType<{ className?: string }>;
}

export const SOCIAL_LINKS: SocialLink[] = [
  { key: 'x',        label: 'X',        href: 'https://x.com/qyvorasec',             Icon: BrandXIcon },
  { key: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/company/qyvora', Icon: BrandLinkedinIcon },
  { key: 'github',   label: 'GitHub',   href: 'https://github.com/QYVORA',           Icon: BrandGithubIcon },
  { key: 'youtube',  label: 'YouTube',  href: 'https://www.youtube.com/@QYVORA',     Icon: BrandYoutubeIcon },
  { key: 'whatsapp', label: 'WhatsApp', href: 'https://wa.me/233535535222',          Icon: BrandWhatsAppIcon },
];

const PULSE_TEXT_KEY = 'body.liveNode';

const FOOTER_COL_KEYS: Record<string, string> = {
  Platform: 'footer.platform',
  Learning: 'footer.learning',
  Community: 'footer.community',
  Company: 'footer.company',
};

const FOOTER_LINK_KEYS: Record<string, string> = {
  courses: 'nav.courses',
  bootcamp: 'nav.bootcamp',
  labs: 'nav.labs',
  services: 'nav.services',
  anansi: 'nav.anansi',
  toha3ee: 'nav.toha3ee',
  jabari: 'nav.jabari',
  blogs: 'nav.blogs',
  leaderboard: 'nav.leaderboard',
  market: 'nav.market',
  team: 'nav.team',
  terms: 'footer.termsOfService',
  register: 'nav.signUp',
  login: 'button.logIn',
};

const CURRENT_YEAR = new Date().getFullYear();

const Footer: React.FC = React.memo(() => {
  const { t } = useTranslation();

  return (
    <footer className="relative w-full min-h-dvh overflow-hidden select-none bg-bg flex flex-col">
      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex-1 w-full h-full px-3 py-10 md:px-4 md:py-20 lg:px-6 flex flex-col">
        <div className="w-full flex-1 flex flex-col">

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

              {/* Account access — compact pair, keeps auth reachable */}
              <div className="flex items-center gap-5 pt-1">
                <Link
                  to="/register"
                  className="text-sm font-bold text-text-primary transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {t(FOOTER_LINK_KEYS.register)}
                </Link>
                <span className="h-3 w-px bg-border/60" aria-hidden="true" />
                <Link
                  to="/login"
                  className="text-sm font-bold text-text-primary transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {t(FOOTER_LINK_KEYS.login)}
                </Link>
              </div>
            </div>

            {/* Nav columns — balanced categories, stable grid */}
            <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4 lg:gap-x-10">
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

          {/* ── Spacer pushes status banner to bottom ────────────────────── */}
          <div className="flex-1 min-h-6" />

          {/* ── Status banner: system status · language · contact ────────── */}
          <div className="mt-10 flex flex-col gap-5 pt-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-muted">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              <span>{t(PULSE_TEXT_KEY)}</span>
              <span className="mx-2 h-3 w-px bg-border/60" aria-hidden="true" />
              <span className="normal-case tracking-normal">{CURRENT_YEAR}</span>
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