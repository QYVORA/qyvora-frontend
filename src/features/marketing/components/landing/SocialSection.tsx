import React from 'react';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from '../../../../shared/components/ScrollReveal';
import { SITE_CONFIG } from '../../content/siteConfig';
import { SOCIAL_ICON_BY_KEY } from './socialIcons';

// L15, L16, L17: platform colors now have dark/light variants
// dark = original colors, light = darker versions readable on light bg
const PLATFORM_META: Record<string, {
  colorDark: string; colorLight: string;
  bgDark: string;   bgLight: string;
  img: string;
  primary?: boolean;
}> = {
  x: {
    colorDark:  '#e2e8f0',
    colorLight: '#ffffff',
    bgDark:     'rgba(226,232,240,0.06)',
    bgLight:    'rgba(26,32,44,0.06)',
    img: '/socials-images/X-social.png',
  },
  linkedin: {
    colorDark:  '#60a5fa',
    colorLight: '#ffffff',
    bgDark:     'rgba(96,165,250,0.06)',
    bgLight:    'rgba(29,78,216,0.06)',
    img: '/socials-images/linkedin-social.png',
    primary: true,
  },
  youtube: {
    colorDark:  '#f87171',
    colorLight: '#ffffff',
    bgDark:     'rgba(248,113,113,0.06)',
    bgLight:    'rgba(185,28,28,0.06)',
    img: '/socials-images/youtube-social.png',
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-8">
        {SITE_CONFIG.social.map((social, idx) => {
          const Icon = SOCIAL_ICON_BY_KEY[social.key];
          const meta = PLATFORM_META[social.key];
          if (!meta) return null;
          return (
            <ScrollReveal key={idx} delay={idx * 0.1}>
              <div className={`relative rounded-xl overflow-hidden flex flex-col h-full group min-h-[280px] border ${meta.primary ? 'border-blue-500/30' : 'border-border'}`}>

                {/* Background image */}
                <img
                  src={meta.img}
                  alt=""
                  aria-hidden
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
                />

                {/* Dark gradient overlay — always present so text is readable */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10 pointer-events-none" />

                {/* Inject theme-aware CSS vars */}
                <style>{`
                  [data-theme="light"] .social-card-${social.key} { --card-icon-color: ${meta.colorLight}; }
                  [data-theme="dark"]  .social-card-${social.key}, .social-card-${social.key} { --card-icon-color: ${meta.colorDark}; }
                `}</style>

                {meta.primary && (
                  <span className="absolute top-4 right-4 z-10 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border border-blue-400/50 text-blue-300 bg-black/40 backdrop-blur-sm">
                    Primary
                  </span>
                )}

                {/* Content — pinned to bottom */}
                <div className={`social-card-${social.key} relative z-10 mt-auto p-6 md:p-7`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center flex-none">
                      <Icon
                        className="w-4 h-4"
                        style={{ color: `var(--card-icon-color, ${meta.colorDark})` }}
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] block">{social.label}</span>
                      <h4 className="text-sm font-bold text-white font-mono leading-tight">{social.handle}</h4>
                    </div>
                  </div>

                  <p className="text-xs text-white/70 mb-5 leading-relaxed">{social.desc}</p>

                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-lg bg-black/40 backdrop-blur-sm border border-white/15 text-white hover:bg-black/60 transition-all group/btn"
                    style={{ borderColor: `color-mix(in srgb, var(--card-icon-color, ${meta.colorDark}) 40%, transparent)` }}
                  >
                    {social.action} <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
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
