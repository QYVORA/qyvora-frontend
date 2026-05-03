import React from 'react';
import { Link } from 'react-router-dom';
import { LinkedinIcon, YoutubeIcon, Mail, ArrowUpRight } from 'lucide-react';
import { SITE_CONFIG } from '../../content/siteConfig';
import BrandXIcon from '../../../../shared/components/icons/BrandXIcon';
import BrandWhatsAppIcon from '../../../../shared/components/icons/BrandWhatsAppIcon';
import { useTheme } from '../../../../core/contexts/ThemeContext';
import Logo, { DARK_LOGO_SRC, LIGHT_LOGO_SRC } from '../../../../shared/components/brand/Logo';

// ── Nav columns ───────────────────────────────────────────────────────────────
const FOOTER_COLS = [
  {
    heading: 'Platform',
    links: SITE_CONFIG.nav.platform.map((item) => ({ label: item.label, path: item.path })),
  },
  {
    heading: 'Company',
    links: [
      ...SITE_CONFIG.nav.company.map((item) => ({ label: item.label, path: item.path })),
      { label: 'Services',  path: '/services'  },
      { label: 'Register',  path: '/register'  },
      { label: 'Log In',    path: '/login'     },
    ],
  },
];

// ── Social links ──────────────────────────────────────────────────────────────
const SOCIALS = [
  { icon: BrandXIcon,        href: SITE_CONFIG.social.find((s) => s.key === 'x')?.href        || '#', label: 'X'        },
  { icon: LinkedinIcon,      href: SITE_CONFIG.social.find((s) => s.key === 'linkedin')?.href || '#', label: 'LinkedIn' },
  { icon: YoutubeIcon,       href: SITE_CONFIG.social.find((s) => s.key === 'youtube')?.href  || '#', label: 'YouTube'  },
  { icon: BrandWhatsAppIcon, href: SITE_CONFIG.social.find((s) => s.key === 'whatsapp')?.href || '#', label: 'WhatsApp' },
  { icon: Mail,              href: `mailto:${SITE_CONFIG.contact.opsEmail}`,                           label: 'Email'    },
];

// ── Component ─────────────────────────────────────────────────────────────────
const Footer: React.FC = () => {
  const { theme } = useTheme();
  const bannerLogoSrc = theme === 'light' ? LIGHT_LOGO_SRC : DARK_LOGO_SRC;

  return (
    <footer className="relative bg-bg border-t border-border overflow-hidden">

      {/* ── Ambient glow ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full blur-[120px] opacity-20"
        style={{ background: 'radial-gradient(ellipse, var(--color-accent) 0%, transparent 70%)' }}
      />

      {/* ── Main grid ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-14 md:pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">

          {/* Brand column */}
          <div className="md:col-span-4 flex flex-col gap-5">
            <Logo size="lg" />

            <p className="text-text-secondary text-xs leading-relaxed max-w-xs">
              {SITE_CONFIG.brand.description}
            </p>

            {/* Status badge */}
            <div className="flex items-center gap-2 w-fit px-3 py-1.5 rounded-lg border border-accent/20 bg-accent/5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shrink-0" />
              <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-widest">
                Systems Operational
              </span>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-2 flex-wrap">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noreferrer"
                  aria-label={label}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-bg-card text-text-muted hover:text-accent hover:border-accent/50 hover:bg-accent-dim transition-all"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Spacer */}
          <div className="hidden md:block md:col-span-1" />

          {/* Nav columns */}
          {FOOTER_COLS.map((col) => (
            <div key={col.heading} className="md:col-span-3">
              <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-accent mb-4">
                {col.heading}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="group flex items-center gap-1 text-xs text-text-secondary hover:text-accent transition-colors w-fit"
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight className="w-2.5 h-2.5 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-150" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact column */}
          <div className="md:col-span-3">
            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-accent mb-4">
              Contact
            </h4>
            <div className="space-y-3">
              <a
                href={`mailto:${SITE_CONFIG.contact.opsEmail}`}
                className="group flex items-start gap-2 text-xs text-text-secondary hover:text-accent transition-colors"
              >
                <Mail className="w-3.5 h-3.5 mt-0.5 shrink-0 text-text-muted group-hover:text-accent transition-colors" />
                <span className="break-all">{SITE_CONFIG.contact.opsEmail}</span>
              </a>
              <div className="pt-2 border-t border-border/50">
                <p className="text-[10px] text-text-muted uppercase tracking-widest mb-2">Response time</p>
                <p className="text-xs text-text-secondary">{SITE_CONFIG.contact.responseTime}</p>
              </div>
              <div>
                <p className="text-[10px] text-text-muted uppercase tracking-widest mb-2">Operations</p>
                <p className="text-xs text-text-secondary">{SITE_CONFIG.contact.headquarters}</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Divider ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* ── Logo banner ── */}
      <div className="relative w-full overflow-hidden h-[90px] sm:h-[120px] md:h-[160px]">
        {/* Fade top edge so it blends into the divider */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-10 z-10"
          style={{ background: 'linear-gradient(to bottom, var(--color-bg), transparent)' }}
        />
        {/* Fade bottom edge */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-10 z-10"
          style={{ background: 'linear-gradient(to top, var(--color-bg), transparent)' }}
        />
        <img
          src={bannerLogoSrc}
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            width: '110%',
            maxWidth: '860px',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            objectFit: 'contain',
            opacity: 0.06,
          }}
        />
      </div>

      {/* ── Bottom bar ── */}
      <div className="relative z-10 border-t border-border/30">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[10px] font-mono text-text-muted tracking-wider">
            © {new Date().getFullYear()} HSOCIETY OFFSEC — ALL RIGHTS RESERVED
          </p>
          <div className="flex items-center gap-5 flex-wrap justify-center">
            {SITE_CONFIG.footer.links.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="text-[10px] text-text-muted hover:text-text-secondary transition-colors tracking-wide"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
