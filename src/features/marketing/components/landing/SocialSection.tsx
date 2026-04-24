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
  primary?: boolean;
}> = {
  x: {
    colorDark:  '#e2e8f0',
    colorLight: '#1a202c',
    bgDark:     'rgba(226,232,240,0.06)',
    bgLight:    'rgba(26,32,44,0.06)',
  },
  linkedin: {
    colorDark:  '#60a5fa',
    colorLight: '#1d4ed8',
    bgDark:     'rgba(96,165,250,0.06)',
    bgLight:    'rgba(29,78,216,0.06)',
    primary: true,
  },
  youtube: {
    colorDark:  '#f87171',
    colorLight: '#b91c1c',
    bgDark:     'rgba(248,113,113,0.06)',
    bgLight:    'rgba(185,28,28,0.06)',
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
              <div className={`card-hsociety p-6 md:p-8 flex flex-col h-full group relative overflow-hidden ${meta.primary ? 'border-blue-500/20' : ''}`}>

                {/* L16: hover glow — uses CSS custom props set per-card for theme awareness */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at top left, var(--card-bg-glow, ${meta.bgDark}) 0%, transparent 70%)`,
                  }}
                />

                {/* Inject theme-aware CSS vars on the card element */}
                <style>{`
                  [data-theme="light"] .social-card-${social.key} { --card-icon-color: ${meta.colorLight}; --card-bg-glow: ${meta.bgLight}; }
                  [data-theme="dark"]  .social-card-${social.key}, .social-card-${social.key} { --card-icon-color: ${meta.colorDark}; --card-bg-glow: ${meta.bgDark}; }
                `}</style>

                {meta.primary && (
                  <span className="absolute top-4 right-4 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border border-blue-500/30 text-blue-500 dark:text-blue-400">
                    Primary
                  </span>
                )}

                {/* L15: icon color via CSS var — adapts to theme */}
                <div className={`social-card-${social.key} w-10 h-10 md:w-12 md:h-12 rounded-lg bg-bg border border-border flex items-center justify-center mb-4 md:mb-6 relative z-10`}>
                  <Icon
                    className="w-5 h-5 md:w-6 md:h-6"
                    style={{ color: `var(--card-icon-color, ${meta.colorDark})` }}
                  />
                </div>

                <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-1 relative z-10">{social.label}</span>
                <h4 className="text-base md:text-lg font-bold text-text-primary mb-2 font-mono relative z-10">{social.handle}</h4>
                <p className="text-xs md:text-sm text-text-muted mb-6 relative z-10">{social.desc}</p>

                {/* L17: link color via CSS var — readable in both themes */}
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`social-card-${social.key} mt-auto flex items-center gap-2 text-sm font-bold border-b pb-1 w-fit hover:gap-3 transition-all group/btn relative z-10`}
                  style={{
                    color: `var(--card-icon-color, ${meta.colorDark})`,
                    borderColor: `color-mix(in srgb, var(--card-icon-color, ${meta.colorDark}) 30%, transparent)`,
                  }}
                >
                  {social.action} <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </a>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </div>
  </section>
);

export default SocialSection;
