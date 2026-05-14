import React from 'react';
import { Link } from 'react-router-dom';
import { SITE_CONFIG } from '../../content/siteConfig';
import BrandWhatsAppIcon from '../../../../shared/components/icons/BrandWhatsAppIcon';
import BrandLinkedinIcon from '../../../../shared/components/icons/BrandLinkedinIcon';
import BrandYoutubeIcon from '../../../../shared/components/icons/BrandYoutubeIcon';

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
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
      { label: 'CTF Arena',   path: '/ctf'        },
      { label: 'Leaderboard', path: '/leaderboard' },
      { label: 'Bootcamps',   path: '/bootcamps'   },
      { label: 'Register',    path: '/register'    },
      { label: 'Log In',      path: '/login'       },
    ],
  },
];

const SOCIAL = [
  { icon: BrandLinkedinIcon, key: 'linkedin', label: 'LinkedIn' },
  { icon: BrandYoutubeIcon,  key: 'youtube',  label: 'YouTube'  },
  { icon: BrandWhatsAppIcon, key: 'whatsapp', label: 'WhatsApp' },
];

const ASCII_LINES = [
  ' █████   █████  █████████     ███████      █████████  █████ ██████████ ███████████ █████ █████',
  '▒▒███   ▒▒███  ███▒▒▒▒▒███  ███▒▒▒▒▒███   ███▒▒▒▒▒███▒▒███ ▒▒███▒▒▒▒▒█▒█▒▒▒███▒▒▒█▒▒███ ▒▒███ ',
  ' ▒███    ▒███ ▒███    ▒▒▒  ███     ▒▒███ ███     ▒▒▒  ▒███  ▒███  █ ▒ ▒   ▒███  ▒  ▒▒███ ███  ',
  ' ▒███████████ ▒▒█████████ ▒███      ▒███▒███          ▒███  ▒██████       ▒███      ▒▒█████   ',
  ' ▒███▒▒▒▒▒███  ▒▒▒▒▒▒▒▒███▒███      ▒███▒███          ▒███  ▒███▒▒█       ▒███       ▒▒███    ',
  ' ▒███    ▒███  ███    ▒███▒▒███     ███ ▒▒███     ███ ▒███  ▒███ ▒   █    ▒███        ▒███    ',
  ' █████   █████▒▒█████████  ▒▒▒███████▒   ▒▒█████████  █████ ██████████    █████       █████   ',
  '▒▒▒▒▒   ▒▒▒▒▒  ▒▒▒▒▒▒▒▒▒     ▒▒▒▒▒▒▒      ▒▒▒▒▒▒▒▒▒  ▒▒▒▒▒ ▒▒▒▒▒▒▒▒▒▒    ▒▒▒▒▒       ▒▒▒▒▒   ',
];

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */
const Footer: React.FC = () => (
  <footer className="relative bg-bg border-t border-border/50 overflow-hidden">

    {/* ══════════════════════════════════════════
        LAYER 0 — dot grid texture
    ══════════════════════════════════════════ */}
    <div className="absolute inset-0 dot-grid opacity-[0.04] pointer-events-none" />

    {/* ══════════════════════════════════════════
        LAYER 1 — radial accent glow from bottom-left
    ══════════════════════════════════════════ */}
    <div
      className="absolute pointer-events-none"
      style={{
        bottom: '-120px',
        left: '-80px',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(136,173,124,0.07) 0%, transparent 65%)',
      }}
      aria-hidden="true"
    />

    {/* ══════════════════════════════════════════
        LAYER 2 — top hairline glow
    ══════════════════════════════════════════ */}
    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent shadow-[0_0_30px_var(--color-accent-glow)]" />

    {/* ══════════════════════════════════════════
        CONTENT
    ══════════════════════════════════════════ */}
    <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 w-full">

      {/* ── Top section: brand + nav ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12 pt-10 md:pt-14 pb-10 md:pb-12">

        {/* Brand column */}
        <div className="col-span-2 flex flex-col gap-5">

          <Link to="/" className="flex items-center w-fit group/logo">
            <img
              src="/assets/branding/logos/hsociety-logo.webp"
              alt="HSociety"
              className="h-16 md:h-20 w-auto object-contain transition-opacity duration-300 group-hover/logo:opacity-80"
            />
          </Link>

          <p className="text-sm text-text-muted leading-relaxed max-w-[26rem] font-mono">
            Africa's leading offensive security ecosystem. We train the next generation of operators
            and secure the continent's most critical infrastructure.
          </p>

          {/* Social row */}
          <div className="flex items-center gap-2 mt-1">
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
                    group/soc relative flex h-9 w-9 items-center justify-center
                    rounded-lg border border-border bg-bg-card/40
                    text-text-muted overflow-hidden
                    transition-all duration-300
                    hover:border-accent/50 hover:text-accent hover:-translate-y-0.5
                    hover:shadow-[0_6px_18px_var(--color-accent-glow)]
                  "
                >
                  {/* sweep shine on hover */}
                  <span className="absolute inset-0 translate-x-[-100%] group-hover/soc:translate-x-[100%] transition-transform duration-500 bg-gradient-to-r from-transparent via-accent/10 to-transparent" />
                  <Icon className="w-4 h-4 relative z-10" />
                </a>
              );
            })}
          </div>

          {/* Live node ticker */}
          <div className="inline-flex items-center gap-2.5 bg-accent/5 border border-accent/20 rounded px-3 py-1.5 w-fit mt-1">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent" />
            </span>
            <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-[0.22em]">
              Node: Tamale // 09.40′N // 00.85′W
            </span>
          </div>
        </div>

        {/* Nav columns */}
        {FOOTER_COLS.map((col) => (
          <div key={col.heading} className="flex flex-col gap-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-accent/70 border-l-2 border-accent/35 pl-3">
              {col.heading}
            </h4>
            <ul className="flex flex-col gap-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="
                      group/link inline-flex items-center gap-1.5
                      text-xs text-text-muted font-mono
                      hover:text-accent transition-all duration-200
                    "
                  >
                    <span className="w-0 overflow-hidden group-hover/link:w-3 transition-all duration-200 text-accent/60 text-[10px]">›</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ── ASCII watermark band ── */}
      <div className="relative w-full" style={{ height: 'clamp(72px, 10vw, 140px)' }} aria-hidden="true">
        <div className="absolute inset-0 flex items-center justify-center">
          <pre
            style={{
              fontFamily: '"JetBrains Mono", "Courier New", monospace',
              fontSize: 'clamp(9px, 1.6vw, 22px)',
              lineHeight: 1.05,
              whiteSpace: 'pre',
              margin: 0,
              padding: 0,
              color: 'var(--color-accent)',
              letterSpacing: 0,
              userSelect: 'none',
            }}
          >
            {ASCII_LINES.join('\n')}
          </pre>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="
        relative flex flex-col sm:flex-row items-center justify-between
        gap-4 mt-6 border-t border-border/20 pt-6 pb-8 mb-[60px]
        md:mt-8 md:pt-7 md:pb-10 md:mb-0
      ">
        {/* Left: copyright */}
        <p className="text-[10px] font-mono text-text-muted tracking-[0.22em] uppercase">
          [<span className="text-accent/60">©</span>] {new Date().getFullYear()}{' '}
          <span className="text-accent/80">HSOCIETY OFFSEC</span>
          {' '}// SHADOWS UNBOUND
        </p>

        {/* Centre: mission line — hidden on very small screens */}
        <p className="hidden md:block text-[9px] font-mono text-text-muted/40 tracking-[0.3em] uppercase select-none">
          ── TRAIN · BREACH · SECURE ──
        </p>

        {/* Right: legal links */}
        <div className="flex items-center gap-5 flex-wrap justify-center">
          {SITE_CONFIG.footer.links.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="text-[9px] font-mono text-text-muted hover:text-accent transition-colors uppercase tracking-[0.28em]"
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
