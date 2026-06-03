import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Terminal, Shield, Zap, Target } from 'lucide-react';
import AsciiHeading from '../../../../shared/components/ui/AsciiHeading';
import { useAdaptiveUi } from '../../../../core/hooks/useAdaptiveUi';

const STEPS = [
  {
    icon: Terminal,
    title: 'Learn',
    desc: 'Master Linux, networking, and social engineering fundamentals.',
    bg: '/assets/sections/backgrounds/process-learn.webp',
  },
  {
    icon: Target,
    title: 'Operate',
    desc: 'Execute mission-based rooms in browser labs.',
    bg: '/assets/sections/backgrounds/process-operate.webp',
  },
  {
    icon: Zap,
    title: 'Earn',
    desc: 'Capture flags and earn CP on the HSOCIETY Chain.',
    bg: '/assets/sections/backgrounds/process-earn.webp',
  },
  {
    icon: Shield,
    title: 'Prove',
    desc: 'Validate your skills with a permanent, tamper-proof record.',
    bg: '/assets/sections/backgrounds/process-prove.webp',
  },
];

const ProcessSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const { constrainedDevice, isMobile } = useAdaptiveUi();
  const disableAnimations = shouldReduceMotion || constrainedDevice || isMobile;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[0.5fr_1.5fr] gap-16 lg:gap-12 items-center">

          {/* ── Left: Heading Column ── */}
          <div className="lg:pr-6 flex flex-col">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-4 lg:mb-3">
              <div className="h-[1px] w-8" style={{ background: 'rgba(255,255,255,0.4)' }} />
              <span style={{ color: '#ffffff', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.35em' }}>
                The Journey
              </span>
            </div>

            {/* Heading */}
            <AsciiHeading
              text="Process"
              font="ANSI Shadow"
              align="left"
              animated={!disableAnimations}
              compact
              className="mb-5 lg:mb-4"
            />

            {/* Description */}
            <p className="text-text-secondary" style={{ fontSize: '0.875rem', lineHeight: '1.7', fontFamily: 'inherit', marginBottom: '1rem', maxWidth: '24rem' }}>
              From novice to operator in four steps. Phased training designed for maximum practical skill acquisition.
            </p>
          </div>

          {/* ── Right: Cards Grid (2×2 on Desktop) ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-6">
            {STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial={disableAnimations ? false : { opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={disableAnimations ? { duration: 0 } : { duration: 0.5, delay: i * 0.1 }}
                className="relative overflow-hidden rounded-2xl flex flex-col gap-4 group"
                style={{ border: '1px solid rgba(255,255,255,0.12)', padding: '1.5rem' }}
              >
                {/* Real background image — no filter, no opacity */}
                <div
                  className="absolute inset-0 z-0 pointer-events-none"
                  style={{
                    backgroundImage: `url(${step.bg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />

                {/* Dark scrim — keeps white text legible over any image in both themes */}
                <div
                  className="absolute inset-0 z-[1] pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.45) 100%)',
                  }}
                />

                {/* Icon */}
                <div
                  className="relative z-10 group-hover:scale-110 transition-transform"
                  style={{
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '0.75rem',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                  }}
                >
                  <step.icon size={20} />
                </div>

                {/* Text — hardcoded white, immune to theme switching */}
                <div className="relative z-10">
                  <h3 style={{ color: '#ffffff', fontSize: '0.9375rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.01em', marginBottom: '0.5rem' }}>
                    {step.title}
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '11px', lineHeight: '1.6', fontFamily: 'inherit' }}>
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
  );
};

export default ProcessSection;