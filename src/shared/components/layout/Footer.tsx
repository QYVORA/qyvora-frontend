import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Copy } from 'lucide-react';
import { BrandWhatsAppIcon } from '@/shared/components/icons';
import { BrandLinkedinIcon } from '@/shared/components/icons';
import { BrandYoutubeIcon } from '@/shared/components/icons';
import { BrandGithubIcon } from '@/shared/components/icons';
import { BrandXIcon } from '@/shared/components/icons';
import { BrandMediumIcon } from '@/shared/components/icons';
import { ContactTrigger } from '@/features/marketing/components/ContactModal';
import { Logo } from '@/shared/components/brand';
import LanguageSwitcher from '@/shared/components/LanguageSwitcher';
import { useToast } from '@/core/contexts/ToastContext';
import { SITE_CONFIG } from '@/features/marketing/content/siteConfig';

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
  { key: 'medium',   label: 'Medium',   href: 'https://medium.com/@qyvorasec',       Icon: BrandMediumIcon },
  { key: 'whatsapp', label: 'WhatsApp', href: 'https://wa.me/233535535222',          Icon: BrandWhatsAppIcon },
];

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
  const { addToast } = useToast();
  const companyEmail = SITE_CONFIG.contact.opsEmail;

  const handleCopyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(companyEmail);
      addToast(t('button.emailCopied'), 'success');
    } catch {
      addToast(companyEmail, 'info');
    }
  }, [companyEmail, addToast, t]);

  return (
    <footer className="relative flex min-h-dvh w-full flex-col overflow-hidden bg-bg select-none">
      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex w-full flex-1 flex-col justify-center px-3 md:px-4 lg:px-6 pt-24 pb-8 md:pb-10 lg:pb-12">
        <div className="flex w-full flex-1 flex-col">

          {/* ── Top: Brand | Nav grid ─────────────────────────────────────── */}
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,300px)_1fr] lg:gap-20 xl:grid-cols-[minmax(0,340px)_1fr] xl:gap-28">

            {/* Brand */}
            <div className="space-y-6">
              <Logo size="lg" variant="full" className="block" />
              <p className="max-w-sm font-mono text-sm leading-relaxed text-text-muted">
                {t('body.footerDesc')}
              </p>
              <div className="flex max-w-sm flex-wrap gap-2.5">
                {SOCIAL_LINKS.map(({ key, label, href, Icon }) => (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border text-text-muted transition-colors hover:border-accent/40 hover:text-accent active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
                <a
                  href={`mailto:${companyEmail}`}
                  aria-label={t('button.emailUs')}
                  title={companyEmail}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border text-text-muted transition-colors hover:border-accent/40 hover:text-accent active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <Mail className="h-4 w-4" />
                </a>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  aria-label={t('button.copyEmail')}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border text-text-muted transition-colors hover:border-accent/40 hover:text-accent active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>

              {/* Account access — compact pair, keeps auth reachable */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Link
                  to="/register"
                  className="rounded-lg border border-border px-3.5 py-2 text-sm font-bold text-text-primary transition-colors hover:border-accent/40 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {t(FOOTER_LINK_KEYS.register)}
                </Link>
                <Link
                  to="/login"
                  className="rounded-lg border border-border px-3.5 py-2 text-sm font-bold text-text-primary transition-colors hover:border-accent/40 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {t(FOOTER_LINK_KEYS.login)}
                </Link>
              </div>
            </div>

            {/* Nav columns — balanced categories, stable grid */}
            <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4 md:gap-x-6 lg:gap-x-10">
              {FOOTER_COLS.map((col) => (
                <div key={col.title}>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                    {t(FOOTER_COL_KEYS[col.title] || col.title)}
                  </h3>
                  <ul className="mt-5 space-y-3.5">
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

          {/* ── Status banner: location line · language · contact ────────── */}
          <div className="mt-10 flex flex-col gap-6 pt-8 md:flex-row md:items-center md:justify-between lg:mt-12 lg:pt-10">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-muted">
              <span>QYVORA - GHANA, TAMALE</span>
              <span className="mx-2 h-3 w-px bg-border/60" aria-hidden="true" />
              <span>{CURRENT_YEAR}</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
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
