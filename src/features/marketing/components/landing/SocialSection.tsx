import React from 'react';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from '../../../../shared/components/ScrollReveal';
import { SITE_CONFIG } from '../../content/siteConfig';
import { SOCIAL_ICON_BY_KEY } from './socialIcons';

// Fix #19: platform accent colors and a "primary" flag for visual hierarchy
const PLATFORM_META: Record<string, { color: string; bg: string; primary?: boolean }> = {
  x:        { color: '#e2e8f0', bg: 'rgba(226,232,240,0.06)'                },
  linkedin:  { color: '#60a5fa', bg: 'rgba(96,165,250,0.06)',  primary: true },
  youtube:   { color: '#f87171', bg: 'rgba(248,113,113,0.06)'               },
};

const SocialSection: React.FC = () => (
  <section className="py-16 md:py-24 bg-bg border-t border-border">
    <div className="max-w-7xl mx-auto px-4 md:px-8">
      <ScrollReveal className="text-center mb-10 md:mb-14">
        <span className="text-accent text-[11px] font-bold uppercase tracking-[0.3em] mb-3 block">// SIGNAL</span>
        <h2 className="text-3xl md:text-4xl text-text-primary font-bold">Find Us Online</h2>
        <p className="text-text-muted text-sm mt-3 max-w-md mx-auto">Follow the operation across platforms for updates, content, and community.</p>
      </ScrollReveal>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-8">
        {SITE_CONFIG.social.map((social, idx) => {
          const Icon = SOCIAL_ICON_BY_KEY[social.key];
          const meta = PLATFORM_META[social.key] ?? { color: 'var(--color-accent)', bg: 'var(--color-accent-dim)' };
          return (
            <ScrollReveal key={idx} delay={idx * 0.1}>
              {/* Fix #19: each card has platform-specific border accent on hover + primary badge */}
              <div
                className={`card-hsociety p-6 md:p-8 flex flex-col h-full group relative overflow-hidden ${meta.primary ? 'border-blue-500/20' : ''}`}
              >
                {/* Subtle platform-tinted background glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at top left, ${meta.bg} 0%, transparent 70%)` }}
                />
                {meta.primary && (
                  <span className="absolute top-4 right-4 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border border-blue-500/30 text-blue-400">
                    Primary
                  </span>
                )}
                <div
                  className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-bg border border-border flex items-center justify-center mb-4 md:mb-6 transition-all group-hover:border-opacity-60 relative z-10"
                  style={{ '--hover-color': meta.color } as React.CSSProperties}
                >
                  <Icon className="w-5 h-5 md:w-6 md:h-6 transition-colors" style={{ color: meta.color }} />
                </div>
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-1 relative z-10">{social.label}</span>
                <h4 className="text-base md:text-lg font-bold text-text-primary mb-2 font-mono relative z-10">{social.handle}</h4>
                <p className="text-xs md:text-sm text-text-muted mb-6 relative z-10">{social.desc}</p>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-auto flex items-center gap-2 text-sm font-bold border-b pb-1 w-fit hover:gap-3 transition-all group/btn relative z-10"
                  style={{ color: meta.color, borderColor: `${meta.color}33` }}
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
