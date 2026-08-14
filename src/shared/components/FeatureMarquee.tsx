import React from 'react';
import { useReducedMotion } from 'motion/react';

export interface FeatureMarqueeItem {
  id: string;
  meta?: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  commands?: string;
}

const CapabilityCard: React.FC<{ item: FeatureMarqueeItem }> = ({ item }) => (
  <div className="w-[min(70vw,270px)] sm:w-[min(44vw,300px)] lg:w-[min(32vw,340px)] h-[220px] md:h-[240px] shrink-0 flex flex-col rounded-2xl border border-border/30 bg-bg-card p-4 md:p-5 transition-all duration-300 hover:border-accent/40 hover:shadow-[var(--card-shadow)]">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 shrink-0 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
        {item.icon}
      </div>
      <div className="min-w-0">
        {item.meta && (
          <span className="block text-[8px] font-black uppercase tracking-widest text-accent/70 truncate">{item.meta}</span>
        )}
        <h5 className="text-sm font-black uppercase tracking-tight text-text-primary leading-tight truncate">{item.title}</h5>
      </div>
    </div>
    <p className="text-[10px] md:text-xs text-text-secondary leading-relaxed font-mono line-clamp-3">{item.description}</p>
    {item.commands && (
      <div className="mt-auto pt-3">
        <code className="block text-[9px] md:text-[10px] font-mono text-accent/80 truncate">{item.commands}</code>
      </div>
    )}
  </div>
);

/**
 * Infinite horizontal marquee of compact capability cards — the same
 * pattern as the landing-page team carousel. Each item becomes a card
 * showing an icon, title, one-line description and (optionally) the
 * commands it maps to. Reduced-motion users get a static wrapping grid.
 */
const FeatureMarquee: React.FC<{ items: FeatureMarqueeItem[] }> = ({ items }) => {
  const shouldReduceMotion = useReducedMotion();

  if (!items.length) return null;

  if (shouldReduceMotion) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
        {items.map((item) => (
          <CapabilityCard key={item.id} item={item} />
        ))}
      </div>
    );
  }

  return (
    <div className="relative h-[260px] md:h-[280px] lg:h-[300px] overflow-x-clip overflow-y-visible flex items-center py-3">
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <div key={copy} aria-hidden={copy === 1} className="h-full flex items-center shrink-0">
            {items.map((item) => (
              <div key={`${copy}-${item.id}`} className="mr-3 md:mr-4 h-full flex items-center">
                <CapabilityCard item={item} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureMarquee;
