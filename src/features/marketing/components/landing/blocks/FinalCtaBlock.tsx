import React from 'react';
import Button from '@/shared/components/ui/Button';
import ScrollReveal from '@/shared/components/ScrollReveal';

/**
 * FinalCtaBlock — the last conversion point on the landing. One CTA, calm.
 */
const FinalCtaBlock: React.FC = () => {

  return (
    <section className="w-full bg-surface">
      <div className="mx-auto w-full max-w-[1320px] px-3 py-20 md:px-4 md:py-24 lg:px-6">
        <ScrollReveal>
          <div className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-accent/40 bg-accent/5 px-6 py-14 md:px-12 md:py-16">
            <div className="flex flex-col items-start gap-6 md:items-center md:text-center">
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