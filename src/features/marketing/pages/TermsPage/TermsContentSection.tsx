import React from 'react';
import { motion } from 'motion/react';
import ScrollReveal from '@/shared/components/ScrollReveal';
import SimpleHeading from '@/shared/components/ui/SimpleHeading';
import { ContactTrigger } from '@/features/marketing/components/ContactModal';
import { termsData } from './termsData';

const TermsContentSection: React.FC = () => {
  return (
    <div className="min-h-full flex flex-col items-center justify-start md:justify-center py-20 md:py-24">
      <div className="max-w-[1600px] mx-auto px-4 md:px-10 w-full h-full md:h-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start h-full md:h-auto">
          <div className="lg:w-1/3 shrink-0 lg:sticky lg:top-8">
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-4 lg:mb-3">
                <span className="text-[10px] font-black text-accent uppercase tracking-[0.35em]">Legal Framework</span>
              </div>
              <SimpleHeading text="Protocols" align="left" compact className="mb-6" />
              <p className="text-text-secondary text-sm leading-relaxed max-w-sm mt-4">
                These terms govern your use of all QYVORA platforms, training programs, and
                professional services. Questions? Reach out via our{' '}
                <ContactTrigger type="link" className="text-accent hover:underline">contact modal</ContactTrigger>.
              </p>
            </ScrollReveal>
          </div>

          <div className="flex-1 w-full lg:max-h-[calc(100vh-12rem)]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.08 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="terminal-card relative rounded-2xl border border-border bg-bg-card overflow-hidden"
              style={{ boxShadow: 'var(--card-shimmer)' }}
            >
              <div className="overflow-y-auto max-h-[60vh] lg:max-h-[calc(100vh-12rem)] p-6 md:p-8 space-y-8">
                {termsData.sections.map((section, idx) => (
                  <div key={idx} className="relative pb-8 last:pb-0 last:border-b-0">
                    <div
                      className="absolute top-0 right-0 font-mono text-3xl md:text-4xl font-black leading-none select-none pointer-events-none"
                      style={{ color: 'var(--color-accent-dim)' }}
                      aria-hidden="true"
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <h3 className="text-base md:text-lg font-black text-text-primary mb-3 font-mono uppercase tracking-tight pr-12">
                      {section.title}
                    </h3>
                    {section.body ? (
                      <p className="text-sm text-text-secondary leading-relaxed mb-4">{section.body}</p>
                    ) : null}
                    {section.bullets.length > 0 && (
                      <ul className="flex flex-col gap-2">
                        {section.bullets.map((bullet, i) => (
                          <li key={i} className="text-sm text-text-secondary flex items-start gap-3">
                            <span className="text-accent font-mono font-bold flex-none mt-0.5 text-xs">{'>'}</span>
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsContentSection;
export { TermsContentSection };
