import React, { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { SITE_CONFIG } from '../../content/siteConfig';
import BrandWhatsAppIcon from '../../../../shared/components/icons/BrandWhatsAppIcon';
import BrandLinkedinIcon from '../../../../shared/components/icons/BrandLinkedinIcon';
import BrandYoutubeIcon from '../../../../shared/components/icons/BrandYoutubeIcon';
import BrandGithubIcon from '../../../../shared/components/icons/BrandGithubIcon';
import { ContactTrigger } from '../ContactModal';

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

const ASCII_TEXT = ASCII_LINES.join('\n');

/* ─────────────────────────────────────────────
   ASCII WATERMARK
   Uses the same scale-then-measure pattern as
   AsciiHeading so the art never distorts on
   any screen size — it simply scales down.
───────────────────────────────────────────── */

/**
 * The base font-size at which we measure the <pre> naturally.
 * Keep this large so the block characters render crisply before scaling.
 * transform: scale() then shrinks it to fit — no clamp() hacks needed.
 */
const BASE_FONT_PX = 14;

const AsciiWatermark: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const preRef     = useRef<HTMLPreElement>(null);

  const [scale, setScale]           = useState(1);
  const [wrapperHeight, setWrapperHeight] = useState<number | null>(null);

  useLayoutEffect(() => {
    let rafId = 0;

    const measure = () => {
      window.cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(() => {
        const wrapper = wrapperRef.current;
        const pre     = preRef.current;
        if (!wrapper || !pre) return;

        const availableWidth = wrapper.getBoundingClientRect().width;
        if (availableWidth <= 0) return;

        // ── Reset to scale(1) so we read the true natural dimensions ─────────
        const savedTransform = pre.style.transform;
        const savedOrigin    = pre.style.transformOrigin;
        pre.style.transform       = 'scale(1)';
        pre.style.transformOrigin = '0 0';

        const naturalWidth  = pre.scrollWidth;
        const naturalHeight = pre.scrollHeight;

        pre.style.transform       = savedTransform;
        pre.style.transformOrigin = savedOrigin;

        if (naturalWidth <= 0) return;

        // Scale to fill the full container width (no min-scale — we always
        // want this to span edge-to-edge like a watermark band).
        const nextScale = Math.min(1, availableWidth / naturalWidth);

        setScale(prev => (Math.abs(prev - nextScale) > 0.003 ? nextScale : prev));
        // Lock wrapper height to the scaled pre height so nothing below shifts.
        setWrapperHeight(Math.ceil(naturalHeight * nextScale));
      });
    };

    measure();

    const ro = new ResizeObserver(measure);
    if (wrapperRef.current) ro.observe(wrapperRef.current);
    window.addEventListener('resize', measure);

    return () => {
      window.cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative w-full overflow-hidden"
      style={{ height: wrapperHeight !== null ? `${wrapperHeight}px` : undefined }}
      aria-hidden="true"
    >
      <pre
        ref={preRef}
        className="ascii-text-beam m-0 p-0 whitespace-pre select-none"
        style={{
          fontFamily: '"JetBrains Mono", "Courier New", monospace',
          fontSize: `${BASE_FONT_PX}px`,
          lineHeight: 1.05,
          letterSpacing: 0,
          // Scale from top-left, then shift right by half the shrinkage so the
          // block lands visually centred inside the wrapper.
          transform: `scale(${scale})`,
          transformOrigin: '0 0',
          display: 'inline-block',
          marginLeft: `calc(50% - ${scale * 50}%)`,
        }}
      >
        {ASCII_TEXT}
      </pre>
    </div>
  );
};

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */
const Footer: React.FC = () => (
  <footer className="relative flex min-h-full w-full items-center bg-bg border-t border-border/50 overflow-hidden">

    {/* LAYER 0 — dot grid texture */}
    <div className="absolute inset-0 dot-grid opacity-[0.04] pointer-events-none" />

    {/* LAYER 1 — radial accent glow */}
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

    {/* CONTENT */}
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-10 w-full">

      {/* ── Top: brand + nav ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 pt-8 sm:pt-10 md:pt-12 pb-8 md:pb-10">

        {/* Brand column */}
        <div className="sm:col-span-2 lg:col-span-3 flex flex-col gap-5">

          <Link to="/" className="flex items-center w-fit group/logo">
            <img
              src="/assets/branding/logos/hsociety-logo.webp"
              alt="HSOCIETY"
              className="h-14 sm:h-16 md:h-20 w-auto object-contain transition-opacity duration-300 group-hover/logo:opacity-80"
            />
          </Link>

          <p className="text-sm text-text-muted leading-relaxed max-w-[26rem] font-mono">
            An offensive security company focused on building a strong cybersecurity ecosystem in Africa.
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
                  <span className="absolute inset-0 translate-x-[-100%] group-hover/soc:translate-x-[100%] transition-transform duration-500 bg-gradient-to-r from-transparent via-accent/10 to-transparent" />
                  <Icon className="w-4 h-4 relative z-10" />
                </a>
              );
            })}
          </div>

          {/* Live node ticker */}
          <div className="inline-flex max-w-full items-center gap-2.5 bg-accent/5 border border-accent/20 rounded px-3 py-1.5 w-fit mt-1">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent" />
            </span>
            <span className="min-w-0 text-[10px] font-mono font-bold text-accent uppercase tracking-[0.12em] sm:tracking-[0.22em] break-words">
              Ghana | Northern Region | Tamale
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
                  {link.path === '/contact' ? (
                    <ContactTrigger
                      type="link"
                      className="
                        group/link inline-flex items-center gap-1.5
                        text-xs text-text-muted font-mono
                        hover:text-accent transition-all duration-200
                      "
                    >
                      <span className="w-0 overflow-hidden group-hover/link:w-3 transition-all duration-200 text-accent/60 text-[10px]">›</span>
                      {link.label}
                    </ContactTrigger>
                  ) : (
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
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ── ASCII watermark band ── */}
      <AsciiWatermark />

      {/* ── Bottom bar ── */}
      <div className="
        relative flex flex-col sm:flex-row items-center justify-between
        gap-4 mt-5 border-t border-border/20 pt-5
        pb-[calc(5rem+env(safe-area-inset-bottom,0px))]
        md:mt-8 md:pt-7 md:pb-10 md:mb-0
      ">
        <p className="max-w-full text-center text-[10px] font-mono text-text-muted tracking-[0.14em] sm:tracking-[0.22em] uppercase leading-relaxed">
          [<span className="text-accent/60">©</span>] {new Date().getFullYear()}{' '}
          <span className="text-accent/80">HSOCIETY OFFSEC</span>
        </p>

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