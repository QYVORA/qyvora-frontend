import React from 'react';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from '../../../../shared/components/ScrollReveal';
import { SITE_CONFIG } from '../../content/siteConfig';
import { SOCIAL_ICON_BY_KEY } from './socialIcons';

const SocialSection: React.FC = () => (
  <section className="py-16 md:py-24 bg-bg border-t border-border">
    <div className="max-w-7xl mx-auto px-4 md:px-8">
      <ScrollReveal className="text-center mb-10 md:mb-14">
        <span className="text-accent text-[11px] font-bold uppercase tracking-[0.3em] mb-3 block">// SIGNAL</span>
        <h2 className="text-3xl md:text-4xl text-text-primary font-bold">Find Us Online</h2>
      </ScrollReveal>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-8">
        {SITE_CONFIG.social.map((social, idx) => {
          const Icon = SOCIAL_ICON_BY_KEY[social.key];
          return (
            <ScrollReveal key={idx} delay={idx * 0.1}>
              <div className="card-hsociety p-6 md:p-8 flex flex-col h-full group">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-bg border border-border flex items-center justify-center mb-4 md:mb-6 group-hover:border-accent group-hover:text-accent transition-all">
                  <Icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-1">{social.label}</span>
                <h4 className="text-base md:text-lg font-bold text-text-primary mb-2 font-mono">{social.handle}</h4>
                <p className="text-xs md:text-sm text-text-muted mb-6">{social.desc}</p>
                <a href={social.href} target="_blank" rel="noreferrer" className="mt-auto flex items-center gap-2 text-accent text-sm font-bold border-b border-accent/20 pb-1 w-fit hover:border-accent transition-all group/btn">
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

