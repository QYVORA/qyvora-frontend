import React from 'react';
import { Link } from 'react-router-dom';
import { SITE_CONFIG } from '../../content/siteConfig';
import BrandWhatsAppIcon from '../../../../shared/components/icons/BrandWhatsAppIcon';
import BrandLinkedinIcon from '../../../../shared/components/icons/BrandLinkedinIcon';
import BrandYoutubeIcon from '../../../../shared/components/icons/BrandYoutubeIcon';
import BrandGithubIcon from '../../../../shared/components/icons/BrandGithubIcon';
import { ContactTrigger } from '../ContactModal';
import AdinkraBackground from '../../../../shared/components/backgrounds/AdinkraBackground';

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const FOOTER_COLS = [
  {
    heading: 'Company',
    links: SITE_CONFIG.nav.company.map((item) => ({ label: item.label, path: item.path })),
  },
  {
    heading: 'Quick Links',
    links: [
      { label: 'Register', path: '/register' },
      { label: 'Log In',   path: '/login'    },
    ],
  },
];

const SOCIAL = [
  { icon: BrandLinkedinIcon, key: 'linkedin', label: 'LinkedIn' },
  { icon: BrandGithubIcon,   key: 'github',   label: 'GitHub'   },
  { icon: BrandYoutubeIcon,  key: 'youtube',  label: 'YouTube'  },
  { icon: BrandWhatsAppIcon, key: 'whatsapp', label: 'WhatsApp' },
];

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */
const Footer: React.FC = () => (
  <footer className="relative w-full min-h-screen bg-bg border-t border-border/50 overflow-hidden flex items-center">

    {/* Adinkra Background Layer */}
    <AdinkraBackground opacity={0.25} includeGradients={true} includeDotGrid={true} />

    {/* CONTENT */}
    <div className="relative z-10 max-w-7xl mx-auto px-2 sm:px-6 md:px-10 w-full py-8">

      {/* ── Top: brand + nav ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 pt-24 sm:pt-28 md:pt-32 pb-8 md:pb-10">

        {/* Brand column */}
        <div className="sm:col-span-2 lg:col-span-3 flex flex-col gap-6">

          <p className="text-lg text-text-muted leading-relaxed max-w-[28rem] font-mono">
            An offensive security company focused on building a strong cybersecurity ecosystem in Africa.
          </p>

          {/* Social row */}
          <div className="flex items-center gap-4 mt-1">
            {SOCIAL.map(({ icon: Icon, key, label }) => {
              const href = SITE_CONFIG.social.find((i) => i.key === key)?.href || '#';
              return (
                <a
                  key={key}
                  href={href}
                  target={href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noreferrer"
                  aria-label={label}
                  className="
                    group/soc relative flex h-12 w-12 items-center justify-center
                    rounded-lg border border-border bg-bg-card/40
                    text-text overflow-hidden
                    transition-all duration-300
                    hover:border-accent/50 hover:text-accent hover:-translate-y-0.5
                    hover:shadow-[0_6px_18px_var(--color-accent-glow)]
                  "
                >
                  <span className="absolute inset-0 translate-x-[-100%] group-hover/soc:translate-x-[100%] transition-transform duration-500 bg-gradient-to-r from-transparent via-accent/10 to-transparent" />
                  <Icon className="w-6 h-6 relative z-10" />
                </a>
              );
            })}
          </div>

          {/* Live node ticker */}
          <div className="inline-flex max-w-full items-center gap-2.5 bg-accent/5 border border-accent/20 rounded px-4 py-2 w-fit mt-1">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            <span className="min-w-0 text-xs font-mono font-bold text-accent uppercase tracking-[0.12em] sm:tracking-[0.22em] break-words">
              Ghana | Northern Region | Tamale
            </span>
          </div>
        </div>

        {/* Nav columns */}
        {FOOTER_COLS.map((col) => (
          <div key={col.heading} className="flex flex-col gap-5">
            <h4 className="text-xs font-black uppercase tracking-[0.4em] text-accent border-l-2 border-accent/50 pl-3">
              {col.heading}
            </h4>
            <ul className="flex flex-col gap-4">
              {col.links.map((link) => (
                <li key={link.label}>
                  {link.path === '/contact' ? (
                    <ContactTrigger
                      type="link"
                      className="
                        group/link inline-flex items-center gap-2
                        text-base text-text font-mono
                        hover:text-accent transition-all duration-200
                      "
                    >
                      <span className="w-0 overflow-hidden group-hover/link:w-3 transition-all duration-200 text-accent text-sm">›</span>
                      {link.label}
                    </ContactTrigger>
                  ) : (
                    <Link
                      to={link.path}
                      className="
                        group/link inline-flex items-center gap-2
                        text-base text-text font-mono
                        hover:text-accent transition-all duration-200
                      "
                    >
                      <span className="w-0 overflow-hidden group-hover/link:w-3 transition-all duration-200 text-accent text-sm">›</span>
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ── Bottom bar ── */}
      <div className="
        relative flex flex-col sm:flex-row items-center justify-between
        gap-4 mt-5 border-t border-border/30 pt-6
        pb-5 sm:pb-6
        md:mt-8 md:pt-7 md:pb-6
      ">
        <p className="max-w-full text-center text-xs font-mono text-text-muted tracking-[0.14em] sm:tracking-[0.22em] uppercase leading-relaxed">
          [<span className="text-accent/80">©</span>] {new Date().getFullYear()}{' '}
          <span className="text-accent">HSOCIETY OFFSEC</span>
        </p>

        <div className="flex items-center gap-6 flex-wrap justify-center">
          {SITE_CONFIG.footer.links.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="text-[11px] font-mono text-text-muted hover:text-accent transition-colors uppercase tracking-[0.28em]"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;