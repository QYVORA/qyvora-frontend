import React from 'react';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from '../../../../shared/components/ScrollReveal';
import { SITE_CONFIG } from '../../content/siteConfig';
import { SOCIAL_ICON_BY_KEY } from './socialIcons';

// Platform brand colors and background images
const PLATFORM_META: Record<string, {
  accent: string;       // icon + CTA color
  border: string;       // card border tint
  img: string;
  label: string;        // pill label
}> = {
  x: {
    accent: '#e2e8f0',
    border: 'rgba(226,232,240,0.25)',
    img: '/socials-images/X-social.png',
    label: 'X / TWITTER',
  },
  linkedin: {
    accent: '#60a5fa',
    border: 'rgba(96,165,250,0.35)',
    img: '/socials-images/linkedin-social.png',
    label: 'LINKEDIN',
  },
  youtube: {
    accent: '#f87171',
    border: 'rgba(248,113,113,0.35)',
    img: '/socials-images/youtube-social.png',
    label: 'YOUTUBE',
  },
};

const SocialSection: React.FC = () => (
  <section className="py-16 md:py-24 bg-bg border-t border-border">
    <div className="max-w-7xl mx-auto px-4 md:px-8">

      <ScrollReveal className="text-center mb-10 md:mb-14">
        <span className="text-accent text-[11px] font-bold uppercase tracking-[0.3em] mb-3 block">// SIGNAL</span>
        <h2 className="text-3xl md:text-4xl text-text-primary font-bold">Find Us Online</h2>
        <p className="text-text-muted text-sm mt-3 max-w-md mx-auto">
          Follow the operation across platforms for updates, content, and community.
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-6">
        {SITE_CONFIG.social.map((social, idx) => {
          const Icon = SOCIAL_ICON_BY_KEY[social.key];
          const meta = PLATFORM_META[social.key];
          if (!meta || !Icon) return null;

          return (
            <ScrollReveal key={idx} delay={idx * 0.1}>
              <div
                className="group relative rounded-xl overflow-hidden flex flex-col h-full min-h-[320px] sm:min-h-[360px]"
                style={{ border: `1px solid ${meta.border}` }}
              >
                {/* Background image — always full color, no grayscale */}
                <img
                  src={meta.img}
                  alt=""
                  aria-hidden
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none select-none"
                />

                {/* Gradient — strong at bottom for text legibility, light at top */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.15) 100%)',
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

                {/* Spacer pushes content to bottom */}
                <div className="flex-1" />

                {/* Bottom content */}
                <div className="relative z-10 p-5 md:p-6 space-y-3">
                  {/* Handle */}
                  <div>
                    <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] mb-0.5">
                      {social.label}
                    </p>
                    <h4 className="text-base md:text-lg font-black text-white font-mono leading-tight">
                      {social.handle}
                    </h4>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-white/65 leading-relaxed">
                    {social.desc}
                  </p>

                  {/* CTA */}
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-lg transition-all group/btn"
                    style={{
                      color: meta.accent,
                      background: 'rgba(0,0,0,0.50)',
                      border: `1px solid ${meta.border}`,
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    {social.action}
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </div>
  </section>
);

export default SocialSection;
