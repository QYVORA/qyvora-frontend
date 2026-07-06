import React from 'react';
import { Link } from 'react-router-dom';
import { SITE_CONFIG } from '@/features/marketing/content/siteConfig';
import { BrandWhatsAppIcon } from '@/shared/components/icons';
import { BrandLinkedinIcon } from '@/shared/components/icons';
import { BrandYoutubeIcon } from '@/shared/components/icons';
import { BrandGithubIcon } from '@/shared/components/icons';
import { BrandXIcon } from '@/shared/components/icons';
import { ContactTrigger } from '@/features/marketing/components/ContactModal';
import { AdinkraBackground } from '@/shared/components/backgrounds';
import { Logo } from '@/shared/components/brand';

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

const PULSE_TEXT = 'QYVORA • LIVE NODE • TAMALE, GHANA';

const Footer: React.FC = () => {
  return (
    <footer className="relative w-full overflow-hidden select-none bg-bg flex flex-col">
      <AdinkraBackground
        opacity={0.55}
        className="absolute inset-0 z-0"
      />

      <div className="relative z-10 w-full flex flex-col flex-1 px-6 md:px-12 lg:px-20 py-12 md:py-20 backdrop-blur-sm bg-bg/30">
        <div className="w-full max-w-[1600px] mx-auto">

          {/* ── Brand + Nav Columns (same row on desktop) ──────────────────── */}
          <div className="flex flex-col lg:flex-row lg:justify-between gap-10 lg:gap-20 xl:gap-32">
            {/* Brand — left (logo acts as header to description) */}
            <div className="max-w-xs space-y-3">
              <Logo size="lg" variant="full" className="block" />
              <p className="text-sm text-text-muted font-mono leading-relaxed">
                Offensive Security Platform — discover, exploit, report. Africa&apos;s first dedicated offensive operations ecosystem.
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
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">
                    {col.title}
                  </h3>
                  <ul className="space-y-3">
                    {col.links.map((link: { key: string; label: string; path: string }) => (
                      <li key={link.key}>
                        <Link
                          to={link.path}
                          onClick={() => window.scrollTo(0, 0)}
                          className="text-sm font-bold text-text-primary hover:text-accent transition-colors"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* ── Bottom Bar ────────────────────────────────────────────────── */}
          <div className="pt-10 mt-12 md:mt-16 border-t border-border/40">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
                <span className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                  </span>
                  <span className="tracking-[0.3em]">{PULSE_TEXT}</span>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 md:ml-auto">
                {SITE_CONFIG.footer.links.map((link, idx) => (
                  <Link
                    key={idx}
                    to={link.path}
                    onClick={() => window.scrollTo(0, 0)}
                    className="text-[11px] text-text-muted/60 hover:text-text-muted transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <span className="text-[11px] text-text-muted/40">
                  &copy; {new Date().getFullYear()} QYVORA
                </span>
                <ContactTrigger
                  type="button"
                  className="px-5 py-2.5 bg-accent text-bg text-[11px] font-black uppercase tracking-[0.2em] rounded-xl hover:brightness-110 transition-all active:scale-95"
                >
                  Contact Us
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
