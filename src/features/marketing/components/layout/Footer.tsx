import React from 'react';
import { Link } from 'react-router-dom';
import { SITE_CONFIG } from '../../content/siteConfig';
import BrandWhatsAppIcon from '../../../../shared/components/icons/BrandWhatsAppIcon';
import BrandLinkedinIcon from '../../../../shared/components/icons/BrandLinkedinIcon';
import BrandYoutubeIcon from '../../../../shared/components/icons/BrandYoutubeIcon';
import { useTheme } from '../../../../core/contexts/ThemeContext';
import { DARK_LOGO_SRC, LIGHT_LOGO_SRC } from '../../../../shared/components/brand/Logo';

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
      { label: 'CTF Arena',       path: '/ctf'             },
      { label: 'Leaderboard',     path: '/leaderboard'     },
      { label: 'Marketplace',     path: '/zero-day-market' },
      { label: 'Bootcamps',       path: '/bootcamps'       },
      { label: 'Cyber Points',    path: '/cyber-points'    },
      { label: 'HSOCIETY Chain',  path: '/chain'           },
      { label: 'Services',        path: '/services'        },
      { label: 'Register',        path: '/register'        },
      { label: 'Log In',          path: '/login'           },
    ],
  },
];

const Footer: React.FC = () => {
  const { theme } = useTheme();
  const logoSrc = theme === 'light' ? LIGHT_LOGO_SRC : DARK_LOGO_SRC;

  return (
    <footer className="
      relative bg-bg border-t border-border flex flex-col
      md:h-full md:overflow-hidden
    ">

      {/* ── Logo banner — full-width, prominent ── */}
      <div className="footer-logo-banner relative w-full overflow-hidden flex-none
        h-[120px] sm:h-[150px] md:h-[38%]
        border-b border-border/40
      ">
        {/* Subtle dot grid behind the logo */}
        <div className="absolute inset-0 dot-grid opacity-[0.06] pointer-events-none" />
        {/* Accent glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, var(--color-accent-dim) 0%, transparent 65%)' }}
        />
        {/* Logo — spans the full banner width */}
        <img
          src={logoSrc}
          alt="HSociety"
          className="absolute inset-0 w-full h-full object-contain px-6 md:px-12 lg:px-20"
          style={{ objectPosition: 'center' }}
        />
        {/* Tagline overlay — bottom-left */}
        <div className="absolute bottom-3 left-4 md:bottom-4 md:left-8">
          <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] text-text-muted">
            Africa's Offensive Security Platform
          </p>
        </div>
        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent, var(--color-accent), transparent)' }}
        />
      </div>

      {/* ── Nav columns + social ── */}
      <div className="flex-1 min-h-0 flex flex-col justify-between">
        <div className="max-w-7xl mx-auto px-4 md:px-8 w-full pt-5 md:pt-4 pb-3">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">

            {/* Brand + social */}
            <div className="col-span-2 sm:col-span-2 md:col-span-2 flex flex-col gap-3">
              <p className="text-text-secondary text-xs leading-relaxed max-w-xs">
                {SITE_CONFIG.brand.description}
              </p>
              <div className="flex items-center gap-2">
                {[
                  { icon: BrandLinkedinIcon, href: SITE_CONFIG.social.find((i) => i.key === 'linkedin')?.href || '#', label: 'LinkedIn'  },
                  { icon: BrandYoutubeIcon,  href: SITE_CONFIG.social.find((i) => i.key === 'youtube')?.href  || '#', label: 'YouTube'   },
                  { icon: BrandWhatsAppIcon, href: SITE_CONFIG.social.find((i) => i.key === 'whatsapp')?.href || '#', label: 'WhatsApp' },
                ].map(({ icon: Icon, href, label }, i) => (
                  <a key={i} href={href} target={href.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer" aria-label={label}
                    className="p-1.5 bg-bg-card border border-border rounded-md text-text-muted hover:text-accent hover:border-accent transition-all">
                    <Icon className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Nav columns */}
            {FOOTER_COLS.map((col) => (
              <div key={col.heading}>
                <h4 className="text-accent font-bold uppercase tracking-widest text-[9px] mb-2.5">{col.heading}</h4>
                <ul className="grid grid-cols-1 gap-y-1.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link to={link.path} className="text-text-secondary hover:text-accent text-[10px] transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 w-full py-3 flex flex-col sm:flex-row items-center justify-between text-text-muted text-[9px] gap-2 border-t border-border/30">
          <p>© {new Date().getFullYear()} HSOCIETY OFFSEC. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            {SITE_CONFIG.footer.links.map((item) => (
              <Link key={item.label} to={item.path} className="hover:text-text-secondary transition-colors">{item.label}</Link>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
