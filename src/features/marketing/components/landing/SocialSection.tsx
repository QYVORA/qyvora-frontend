import React from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import ScrollReveal from '../../../../shared/components/ScrollReveal';
import { SITE_CONFIG } from '../../content/siteConfig';
import { SOCIAL_ICON_BY_KEY } from './socialIcons';

// Per-platform accent — matches the site's CSS var approach but uses inline styles
// so we don't need arbitrary Tailwind values
const PLATFORM_META: Record<string, {
  accent: string;
  dimAlpha: string; // accent at low opacity for bg
  label: string;
}> = {
  x: {
    accent: '#e2e8f0',
    dimAlpha: 'rgba(226,232,240,0.07)',
    label: 'X / Twitter',
  },
  linkedin: {
    accent: '#60a5fa',
    dimAlpha: 'rgba(96,165,250,0.07)',
    label: 'LinkedIn',
  },
  youtube: {
    accent: '#f87171',
    dimAlpha: 'rgba(248,113,113,0.07)',
    label: 'YouTube',
  },
  whatsapp: {
    accent: '#4ade80',
    dimAlpha: 'rgba(74,222,128,0.07)',
    label: 'WhatsApp',
  },
};

const SocialSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const socials = SITE_CONFIG.social.filter((s) => s.key !== 'x');

  return (
    <section className="
      py-20 bg-bg border-t border-border relative has-bg-image
      md:h-full md:overflow-hidden md:py-0 md:flex md:items-center
    ">
      <div className="absolute inset-0 dot-grid opacity-[0.06] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10 w-full">

        {/* ── Header ── */}
        <ScrollReveal className="mb-10 md:mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="block text-[10px] font-black uppercase tracking-[0.35em] text-accent mb-2">
                // Signal
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-text-primary leading-none tracking-tight">
                Find Us Online
              </h2>
              <p className="mt-2.5 text-sm text-text-muted max-w-sm leading-relaxed">
                Follow the operation across platforms for updates, drops, and community.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* ── Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
          {socials.map((social, idx) => {
            const Icon = SOCIAL_ICON_BY_KEY[social.key as keyof typeof SOCIAL_ICON_BY_KEY];
            const meta = PLATFORM_META[social.key];
            if (!meta || !Icon) return null;

            return (
              <motion.a
                key={idx}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24, filter: 'blur(6px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{
                  duration: 0.5,
                  delay: shouldReduceMotion ? 0 : idx * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                  filter: { duration: 0.3 },
                }}
                className="group relative flex flex-col rounded-xl border border-border bg-bg-card overflow-hidden
                           hover:border-opacity-60 transition-colors duration-300"
                style={{
                  boxShadow: 'var(--card-shimmer)',
                  // @ts-expect-error CSS custom property dynamic keys
                  '--platform-accent': meta.accent,
                  '--platform-dim': meta.dimAlpha,
                }}
              >
                {/* Hover: top accent line */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background: `linear-gradient(90deg, transparent, ${meta.accent}, transparent)` }}
                />

                {/* Radial glow on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none rounded-xl"
                  style={{ background: `radial-gradient(ellipse at top left, ${meta.dimAlpha} 0%, transparent 65%)` }}
                />

                {/* ── Body ── */}
                <div className="relative z-10 flex flex-col flex-1 p-5 lg:p-6">

                  {/* Icon + platform label */}
                  <div className="flex items-start justify-between mb-8">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl border"
                      style={{
                        background: meta.dimAlpha,
                        borderColor: `${meta.accent}30`,
                      }}
                    >
                      <Icon
                        className="w-4.5 h-4.5"
                        style={{ color: meta.accent, width: 18, height: 18 }}
                      />
                    </div>
                    <span
                      className="font-mono text-[8px] font-black uppercase tracking-[0.25em] px-2 py-1 rounded border"
                      style={{ color: meta.accent, borderColor: `${meta.accent}25`, background: meta.dimAlpha }}
                    >
                      {meta.label}
                    </span>
                  </div>

                  {/* Handle */}
                  <div className="mb-2">
                    <p className="font-mono text-base font-black text-text-primary leading-none group-hover:text-[--platform-accent] transition-colors duration-200">
                      {social.handle}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-text-muted leading-relaxed flex-1 mb-5 line-clamp-2">
                    {social.desc}
                  </p>

                  {/* CTA row */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span
                      className="text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-200"
                      style={{ color: meta.accent }}
                    >
                      {social.action}
                    </span>
                    <div
                      className="flex h-7 w-7 items-center justify-center rounded-lg border transition-all duration-200
                                 group-hover:scale-110"
                      style={{
                        borderColor: `${meta.accent}30`,
                        background: meta.dimAlpha,
                      }}
                    >
                      <ExternalLink
                        className="w-3 h-3"
                        style={{ color: meta.accent }}
                      />
                    </div>
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default SocialSection;