import React from 'react';
import { Link } from 'react-router-dom';
import { SITE_CONFIG } from '../../content/siteConfig';
import Logo from '../../../../shared/components/brand/Logo';
import BrandWhatsAppIcon from '../../../../shared/components/icons/BrandWhatsAppIcon';
import BrandLinkedinIcon from '../../../../shared/components/icons/BrandLinkedinIcon';
import BrandYoutubeIcon from '../../../../shared/components/icons/BrandYoutubeIcon';

const FOOTER_COLS = [
  {
    heading: 'Company',
    links: SITE_CONFIG.nav.company.map((item) => ({ label: item.label, path: item.path })),
  },
  {
    heading: 'Platform',
    links: SITE_CONFIG.nav.platform.map((item) => ({ label: item.label, path: item.path })),
  },
  {
    heading: 'Quick Links',
    links: [
      { label: 'CTF Arena',    path: '/ctf'         },
      { label: 'Leaderboard', path: '/leaderboard' },
      { label: 'Bootcamps',   path: '/bootcamps'   },
      { label: 'Register',    path: '/register'    },
      { label: 'Log In',      path: '/login'       },
    ],
  },
];

const SOCIAL = [
  { icon: BrandLinkedinIcon, key: 'linkedin', label: 'LinkedIn'  },
  { icon: BrandYoutubeIcon,  key: 'youtube',  label: 'YouTube'   },
  { icon: BrandWhatsAppIcon, key: 'whatsapp', label: 'WhatsApp'  },
];

const Footer: React.FC = () => (
  <footer className="
    relative bg-bg border-t border-border
    pb-[calc(60px+env(safe-area-inset-bottom,0px))] md:pb-0
    md:h-full md:overflow-hidden md:flex md:flex-col md:justify-center
  ">
    <div className="absolute inset-0 dot-grid opacity-[0.04] pointer-events-none" />

    <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 w-full py-10 md:py-0">

      {/* ── Main grid ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-10 mb-10 md:mb-12">

        {/* Brand column — spans 2 on desktop */}
        <div className="col-span-2 flex flex-col gap-5">
          {/* Image logo — same component as Navbar */}
          <Link to="/" className="flex items-center w-fit">
            <Logo size="lg" />
          </Link>

          <p className="text-sm text-text-muted leading-relaxed max-w-[240px]">
            Africa's offensive security training and penetration testing platform. Built in Accra, Ghana.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-2">
            {SOCIAL.map(({ icon: Icon, key, label }) => {
              const href = SITE_CONFIG.social.find((i) => i.key === key)?.href || '#';
              return (
                <a
                  key={key}
                  href={href}
                  target={href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-bg-card
                             text-text-muted hover:text-accent hover:border-accent/40 transition-colors duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>

          {/* Location tag */}
          <div className="inline-flex items-center gap-1.5 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse flex-none" />
            <span className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-[0.2em]">
              Tamale, Ghana
            </span>
          </div>
        </div>

        {/* Nav columns */}
        {FOOTER_COLS.map((col) => (
          <div key={col.heading} className="flex flex-col gap-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">
              {col.heading}
            </h4>
            <ul className="flex flex-col gap-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-sm text-text-muted hover:text-text-primary transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ── Bottom bar ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 border-t border-border/40">
        <p className="text-[10px] font-mono text-text-muted tracking-widest uppercase">
          © {new Date().getFullYear()} HSOCIETY OFFSEC. All rights reserved.
        </p>
        <div className="flex items-center gap-5 flex-wrap justify-center">
          {SITE_CONFIG.footer.links.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="text-[10px] font-mono text-text-muted hover:text-accent transition-colors uppercase tracking-widest"
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