import React from 'react';
import Button from '@/shared/components/ui/Button';
import ScrollReveal from '@/shared/components/ScrollReveal';
import finalCtaDobia from '@/assets/backgrounds/final-cta-dobia.webp';

/**
 * FinalCtaBlock — the last conversion point on the landing. One CTA, calm.
 * The mapped background lands on this final conversion card only — it stays
 * off the normal content sections above.
 */
const FinalCtaBlock: React.FC = () => {

  return (
    <section className="w-full bg-surface">
      <div className="mx-auto w-full max-w-[1320px] px-3 py-20 md:px-4 md:py-24 lg:px-6">
        <ScrollReveal>
          <div className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-accent/40" data-theme-persist="dark">
            <img
              src={finalCtaDobia}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
            />
            <div className="relative flex min-h-[360px] flex-col items-start justify-center gap-6 px-6 py-14 md:items-center md:px-12 md:py-16 md:text-center">
              <p className="type-label uppercase tracking-[0.12em] text-accent">
                {"Start learning"}
              </p>
              <h2 className="type-h2 max-w-2xl text-3xl font-black uppercase tracking-tight text-text-primary md:text-5xl">
                {"Your first module is minutes away."}
              </h2>
              <p className="type-body max-w-xl">{"Create a free account, pick a path, and earn your first CyberPoints today."}</p>
              <Button to="/register" size="lg">
                {"Start learning"}
              </Button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default FinalCtaBlock;