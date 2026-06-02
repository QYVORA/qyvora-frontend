import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ShieldCheck, Globe, Users, Zap } from 'lucide-react';
import AsciiHeading from '../../../../shared/components/ui/AsciiHeading';
import ScrollReveal from '../../../../shared/components/ScrollReveal';

const PARTNER_FILENAMES: string[] = [
  'RedSpectreAI.webp',
  'Sorbit.webp',
  'WsuitsIndustries.webp',
];

const PARTNER_IMAGES: string[] = PARTNER_FILENAMES.map(
  (name) => `/assets/partners/${name}`
);

const PLACEHOLDER_LABELS = [
  'PARTNER_01', 'PARTNER_02', 'PARTNER_03',
  'PARTNER_04', 'PARTNER_05', 'PARTNER_06',
];

const REPEAT = 6;

// ── Stat items ────────────────────────────────────────────────────────────────
const STATS = [
  { icon: ShieldCheck, value: '100%',   label: 'Ethical Ops'      },
  { icon: Globe,       value: 'Africa', label: 'HQ: Accra, Ghana' },
  { icon: Users,       value: '3+',     label: 'Active Partners'  },
  { icon: Zap,         value: '24/7',   label: 'Threat Coverage'  },
];

// ── Partner logo / placeholder ────────────────────────────────────────────────
interface PartnerLogoProps {
  src?: string;
  label?: string;
  index: number;
}

const PartnerLogo: React.FC<PartnerLogoProps> = ({ src, label, index }) => (
  <div className="flex-none flex items-center justify-center mx-10 md:mx-20 lg:mx-24">
    {src ? (
      <img
        src={src}
        alt={`Partner logo ${index + 1}`}
        className="h-16 md:h-24 lg:h-48 w-auto object-contain block"
        style={{ filter: 'none', mixBlendMode: 'normal' }}
        draggable={false}
        loading="lazy"
      />
    ) : (
      <span
        className="text-text-muted/30"
        style={{
          fontFamily: 'monospace',
          fontSize: '10px',
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: '0.3em',
          userSelect: 'none',
        }}
      >
        {label}
      </span>
    )}
  </div>
);

// ── Main section ──────────────────────────────────────────────────────────────
const PartnersSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const hasImages = PARTNER_IMAGES.length > 0;

  const items = useMemo(() => {
    if (hasImages) {
      return PARTNER_IMAGES.map((src, i) => ({ src, label: undefined, id: i }));
    }
    return PLACEHOLDER_LABELS.map((label, i) => ({ src: undefined, label, id: i }));
  }, [hasImages]);

  const strip = useMemo(
    () =>
      Array.from({ length: REPEAT }, (_, rep) =>
        items.map((item) => ({ ...item, key: `${rep}-${item.id}` }))
      ).flat(),
    [items]
  );

  const baseDuration = Math.max(30, items.length * 8);

  return (
    <div className="w-full min-h-full flex flex-col justify-center py-12 lg:py-0">
      <div className="max-w-7xl mx-auto px-4 md:px-10 w-full">
        <ScrollReveal direction="up" amount={0.15}>
          {/*
            ── Top row: heading LEFT, stat cards RIGHT ──────────────────────────
            On desktop: single flex row — heading takes available space, stat
            cards sit on the right as a 2×2 grid.
            On mobile: stacked column — heading then cards below.
          */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-12 lg:gap-10 mb-8 lg:mb-10">
            {/* ── Heading block ── */}
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-[1px] w-8 bg-accent/40" />
                <span className="text-[10px] font-black text-accent uppercase tracking-[0.35em]">
                  Trusted Network
                </span>
              </div>
              <AsciiHeading
                text="Partners"
                font="ANSI Shadow"
                align="left"
                animated
                compact
                className="mb-1.5"
              />
              <p className="text-text-secondary text-sm max-w-md leading-relaxed opacity-80">
                Securing startups and tech innovators throughout the African Continent
              </p>
            </div>

            {/*
              ── Stat cards: 2×2 grid always ─────────────────────────────────
              Mobile: 2-col grid (full width)
              Desktop: still 2×2 grid, but shrunk and right-aligned
              This gives the grouped "4 cards in a square" look on all screens.
            */}
            <div className="grid grid-cols-2 gap-2 lg:gap-3 lg:shrink-0 lg:w-[260px]">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="terminal-card flex flex-col items-center justify-center gap-1 px-3 py-3 rounded-xl border border-border bg-bg-card text-center"
                >
                  <stat.icon className="w-4 h-4 text-accent/70 mb-0.5" />
                  <span className="text-base font-black text-text-primary leading-none">
                    {stat.value}
                  </span>
                  <span className="text-[9px] font-bold text-text-muted uppercase tracking-[0.18em] leading-tight">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>

      <ScrollReveal direction="up" delay={0.2} amount={0.1}>
        {/*
          ── Partner logos ──────────────────────────────────────────────────────
          A smooth horizontal marquee carousel that loops infinitely.
          Partner images are displayed as transparent PNGs with no background or border.
        */}
        <div className="mt-8 lg:mt-12">
          <div className="relative w-screen -ml-[calc((100vw-100%)/2)] overflow-hidden">
            <div
              className={shouldReduceMotion ? undefined : 'partners-marquee'}
              style={
                shouldReduceMotion
                  ? {
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '40px',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }
                  : ({
                      display: 'flex',
                      alignItems: 'center',
                      '--marquee-duration': `${baseDuration}s`,
                      '--marquee-copies': REPEAT,
                    } as React.CSSProperties)
              }
            >
              {strip.map((item) => (
                <PartnerLogo
                  key={item.key}
                  src={item.src}
                  label={item.label}
                  index={item.id}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom tagline ── */}
        <div className="max-w-7xl mx-auto px-4 md:px-10 w-full">
          <div className="mt-7 lg:mt-8 flex items-center justify-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-accent/40" />
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.25em] opacity-40">
              All engagements are ethically scoped &amp; NDA-covered
            </span>
            <ShieldCheck className="w-3.5 h-3.5 text-accent/40" />
          </div>
        </div >
      </ScrollReveal>
    </div>
  );
};

export default PartnersSection;