import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import AsciiHeading from '../../../../shared/components/ui/AsciiHeading';

const PARTNER_FILENAMES: string[] = [
  'RedSpectreAI.png',
  'Sorbit.png',
  'WsuitsIndustries.png',
];

const PARTNER_IMAGES: string[] = PARTNER_FILENAMES.map(
  (name) => `/images/patners/${name}`
);

const PLACEHOLDER_LABELS = [
  'PARTNER_01', 'PARTNER_02', 'PARTNER_03',
  'PARTNER_04', 'PARTNER_05', 'PARTNER_06',
];

const REPEAT = 6;

interface PartnerLogoProps {
  src?: string;
  label?: string;
  index: number;
}

const PartnerLogo: React.FC<PartnerLogoProps> = ({ src, label, index }) => (
  <div
    style={{
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: '80px',
      marginRight: '80px',
    }}
  >
    {src ? (
      <img
        src={src}
        alt={`Partner logo ${index + 1}`}
        style={{
          height: '120px',
          width: 'auto',
          objectFit: 'contain',
          display: 'block',
          opacity: 1,
          filter: 'none',
          mixBlendMode: 'normal',
        }}
        draggable={false}
        loading="lazy"
      />
    ) : (
      <span
        style={{
          fontFamily: 'monospace',
          fontSize: '10px',
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: '0.3em',
          color: 'rgba(238,240,238,0.3)',
          userSelect: 'none',
        }}
      >
        {label}
      </span>
    )}
  </div>
);

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
    <div className="w-full h-full flex flex-col justify-center py-8 lg:py-0">

      {/* Heading — stays inside the centered container */}
      <div className="max-w-7xl mx-auto px-4 md:px-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col mb-8 lg:mb-10"
        >
          <AsciiHeading
            text="Partners"
            font="ANSI Shadow"
            align="left"
            animated
            compact
            className="mb-1.5"
          />
          <p className="text-text-secondary text-sm max-w-lg leading-relaxed opacity-80">
            Trusted by organisations at the frontier of offensive security and
            cyber operations.
          </p>
        </motion.div>
      </div>

      {/* Carousel — full viewport width, no container clipping it */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{
          position: 'relative',
          width: '100vw',
          left: '50%',
          right: '50%',
          marginLeft: '-50vw',
          marginRight: '-50vw',
          overflow: 'hidden',
        }}
      >
        <div
          className={shouldReduceMotion ? undefined : 'partners-marquee'}
          style={
            shouldReduceMotion
              ? { display: 'flex', flexWrap: 'wrap', gap: '40px', justifyContent: 'center', alignItems: 'center' }
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
      </motion.div>

      {/* Divider — back inside the centered container */}
      <div className="max-w-7xl mx-auto px-4 md:px-10 w-full">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 lg:mt-10 flex items-center gap-3"
        >
          <div className="ascii-divider flex-1" />
          <span className="ascii-kicker opacity-30 whitespace-nowrap">
            Trusted by the industry
          </span>
          <div className="ascii-divider flex-1" />
        </motion.div>
      </div>

    </div>
  );
};

export default PartnersSection;