import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import ScrollReveal from '../../../../shared/components/ScrollReveal';
import { SITE_CONFIG } from '../../content/siteConfig';
import { SOCIAL_ICON_BY_KEY } from './socialIcons';

const PLATFORM_META: Record<string, {
  accent: string;
  border: string;
  img: string;
  label: string;
}> = {
  x: {
    accent: '#e2e8f0',
    border: 'rgba(226,232,240,0.25)',
    img: '/assets/social/x-social.png',
    label: 'X / TWITTER',
  },
  linkedin: {
    accent: '#60a5fa',
    border: 'rgba(96,165,250,0.35)',
    img: '/assets/social/linkedin-social.png',
    label: 'LINKEDIN',
  },
  youtube: {
    accent: '#f87171',
    border: 'rgba(248,113,113,0.35)',
    img: '/assets/social/youtube-social.png',
    label: 'YOUTUBE',
  },
  whatsapp: {
    accent: '#4ade80',
    border: 'rgba(37,211,102,0.35)',
    img: '/assets/sections/backgrounds/corperate-team.png',
    label: 'WHATSAPP',
  },
};

const SocialSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-20 md:py-32 bg-bg border-t border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <ScrollReveal className="text-center mb-10 md:mb-14">
          <span className="text-accent text-[11px] font-bold uppercase tracking-[0.3em] mb-3 block">// SIGNAL</span>
          <h2 className="text-3xl md:text-4xl text-text-primary font-bold">Find Us Online</h2>
          <p className="text-text-muted text-sm mt-3 max-w-md mx-auto">
            Follow the operation across platforms for updates, content, and community.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
          {SITE_CONFIG.social.map((social, idx) => {
            const Icon = SOCIAL_ICON_BY_KEY[social.key as keyof typeof SOCIAL_ICON_BY_KEY];
            const meta = PLATFORM_META[social.key];
            if (!meta || !Icon) return null;

            return (
              <motion.a
                key={idx}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 40, scale: 0.94, filter: 'blur(6px)' }}
                whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{
                  duration: 0.65,
                  delay: shouldReduceMotion ? 0 : idx * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                  filter: { duration: 0.4 },
                }}
                whileHover={shouldReduceMotion ? {} : { y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative rounded-xl overflow-hidden flex flex-col min-h-[280px] md:min-h-[360px] cursor-pointer"
                style={{ border: `1px solid ${meta.border}` }}
              >
                {/* Background image — zoom on group hover via CSS */}
                <img
                  src={meta.img}
                  alt=""
                  aria-hidden
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none transition-transform duration-700 ease-out group-hover:scale-[1.07]"
                />

                {/* Gradient overlay — deepens on hover */}
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-400"
                  style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.94) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.12) 100%)',
                  }}
                />

                {/* Accent glow on hover */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(ellipse at bottom left, ${meta.accent}18 0%, transparent 65%)`,
                  }}
                />

                {/* Top-left platform pill */}
                <div className="relative z-10 p-4 md:p-5">
                  <span
                    className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.25em] px-2.5 py-1 rounded-full backdrop-blur-sm"
                    style={{
                      color: meta.accent,
                      background: 'rgba(0,0,0,0.45)',
                      border: `1px solid ${meta.border}`,
                    }}
                  >
                    <Icon className="w-3 h-3" style={{ color: meta.accent }} />
                    {meta.label}
                  </span>
                </div>

                <div className="flex-1" />

                {/* Bottom content */}
                <div className="relative z-10 p-5 md:p-6 space-y-3">
                  <div>
                    <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] mb-0.5">
                      {social.label}
                    </p>
                    <h4 className="text-base md:text-lg font-black text-white font-mono leading-tight">
                      {social.handle}
                    </h4>
                  </div>

                  <p className="text-xs text-white/65 leading-relaxed">{social.desc}</p>

                  <div
                    className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-lg transition-all"
                    style={{
                      color: meta.accent,
                      background: 'rgba(0,0,0,0.50)',
                      border: `1px solid ${meta.border}`,
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    {social.action}
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
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
