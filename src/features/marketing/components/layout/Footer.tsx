import React from 'react';
import { Link } from 'react-router-dom';
import { SITE_CONFIG } from '../../content/siteConfig';
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
    relative bg-bg border-t border-border/50
    pb-[calc(60px+env(safe-area-inset-bottom,0px))] md:pb-12
    group/footer
  ">
    {/* ── Background layers ── */}
    <div className="absolute inset-0 dot-grid opacity-[0.05] pointer-events-none" />
    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent shadow-[0_0_20px_var(--color-accent-glow)]" />
    
    <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 w-full py-12 md:py-16">

      {/* ── Main grid ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-12 mb-12 md:mb-16">

        {/* Brand column — spans 2 on desktop */}
        <div className="col-span-2 flex flex-col gap-6 relative">
          <Link to="/" className="flex items-center w-fit group/logo relative z-10">
            <img 
              src="/assets/branding/logos/hsociety-logo.webp" 
              alt="HSociety" 
              className="h-10 md:h-12 w-auto object-contain"
            />
          </Link>

          <p className="text-sm md:text-base text-text-muted leading-relaxed max-w-sm">
            Africa's leading offensive security ecosystem. We train the next generation of operators and secure the continent's most critical infrastructure.
          </p>

          {/* Social icons — LARGER and more interactive */}
          <div className="flex items-center gap-3">
            {SOCIAL.map(({ icon: Icon, key, label }) => {
              const href = SITE_CONFIG.social.find((i) => i.key === key)?.href || '#';
              return (
                <a
                  key={key}
                  href={href}
                  target={href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-bg-card/50
                             text-text-muted hover:text-accent hover:border-accent/50 hover:bg-accent-dim
                             transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_var(--color-accent-glow)]"
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>

          {/* Status/Location ticker */}
          <div className="inline-flex items-center gap-3 bg-accent-dim border border-accent/20 rounded-lg px-3 py-1.5 w-fit">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            <span className="text-[11px] font-mono font-black text-accent uppercase tracking-[0.2em]">
              Node: Tamale // 09.40' N // 00.85' W
            </span>
          </div>
        </div>

        {/* Nav columns — LARGER links */}
        {FOOTER_COLS.map((col) => (
          <div key={col.heading} className="flex flex-col gap-6">
            <h4 className="text-[11px] font-black uppercase tracking-[0.35em] text-accent/80 border-l-2 border-accent/40 pl-3">
              {col.heading}
            </h4>
            <ul className="flex flex-col gap-4">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-sm md:text-base text-text-muted hover:text-accent hover:translate-x-1 inline-block transition-all duration-200"
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-border/20">
        <p className="text-[11px] font-mono text-text-muted tracking-[0.2em] uppercase">
          [<span className="text-accent/60">©</span>] {new Date().getFullYear()} HSOCIETY OFFSEC // SHADOWS UNBOUND
        </p>
        <div className="flex items-center gap-6 flex-wrap justify-center">
          {SITE_CONFIG.footer.links.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="text-[10px] md:text-[11px] font-mono text-text-muted hover:text-accent transition-colors uppercase tracking-[0.25em]"
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