import React from 'react';
import Button from '@/shared/components/ui/Button';
import ScrollReveal from '@/shared/components/ScrollReveal';

/**
 * FinalCtaBlock — the last conversion point on the landing. One CTA, calm.
 */
const FinalCtaBlock: React.FC = () => {

  return (
    <section className="w-full bg-surface">
      <div className="mx-auto flex w-full max-w-[1320px] flex-col items-start gap-6 px-3 py-20 md:items-center md:px-4 md:py-24 md:text-center lg:px-6">
        <ScrollReveal className="flex flex-col items-start gap-6 md:items-center">
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
        </ScrollReveal>
      </div>
    </section>
  );
};

export default FinalCtaBlock;