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

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const FOOTER_COLS = [
  {
    title: 'Platform',
    links: [
      { key: 'learn', label: 'Learn', path: '/learn' },
      { key: 'anansi', label: 'Anansi CLI', path: '/anansi' },
      { key: 'blogs', label: 'Blogs', path: '/blogs' },
      { key: 'news', label: 'News', path: '/news' },
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

/* ─────────────────────────────────────────────
   SOCIAL ICONS
───────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────
   PULSE TEXT — alt to "Live" badge
───────────────────────────────────────────── */
const PULSE_TEXT = 'QYVORA • LIVE NODE • TAMALE, GHANA';

const Footer: React.FC = () => {
  return (
    <footer className="relative w-full overflow-hidden select-none bg-bg">
      {/* Background layer */}
      <AdinkraBackground
        opacity={0.55}
        className="absolute inset-0 z-0"
      />

      {/* Main grid content wrapper */}
      <div className="relative z-10 w-full flex flex-col px-6 md:px-12 lg:px-20 py-12 md:py-20 backdrop-blur-sm bg-bg/30">
        {/* Top Section: Brand Columns */}
        <div className="flex flex-col md:flex-row justify-between gap-y-10 md:gap-16 xl:gap-20 w-full max-w-[1600px] mx-auto">
          {/* Left Column — Brand */}
          <div className="max-w-sm space-y-6">
            <Logo size="xl" variant="full" className="block" />
            <p className="text-sm text-text-muted font-mono leading-relaxed max-w-xs">
              Offensive Security Platform — discover, exploit, report. Africa&apos;s first dedicated offensive operations ecosystem.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3 pt-4">
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

          {/* Right Columns — Nav Links pushed to far right */}
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

        {/* Bottom Bar */}
        <div className="w-full max-w-[1600px] mx-auto pt-10 border-t border-border/40 mt-10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Pulse text */}
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
              <span className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                </span>
                <span className="tracking-[0.3em]">{PULSE_TEXT}</span>
              </span>
            </div>

            {/* Footer legal + Contact — far right */}
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
    </footer>
  );
};

export default Footer;
