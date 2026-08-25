import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import SimpleHeading from '@/shared/components/ui/SimpleHeading';
import { ContactTrigger } from '@/features/marketing/components/ContactModal';
import { termsData } from './termsData';

const TermsContentSection: React.FC = () => {
  const [openSections, setOpenSections] = useState<Set<number>>(new Set([0]));

  const toggleSection = (idx: number) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  return (
    <div className="min-h-full flex flex-col py-12 md:py-16 lg:py-20">
      <div className="w-full px-3 md:px-4 lg:px-6">
        {/* Page header */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[10px] font-black text-accent uppercase tracking-[0.35em]">Legal Framework</span>
          </div>
          <SimpleHeading text="Terms of Service" align="left" compact accentWords={1} accentPlacement="end" className="mb-4" />
          <p className="text-text-secondary text-sm leading-relaxed max-w-2xl">
            These terms govern your use of all QYVORA platforms, training programs, and professional services.
            Effective: {termsData.effectiveDate} &middot; Jurisdiction: {termsData.jurisdiction}
          </p>
          <p className="text-text-muted text-xs mt-3">
            Questions? Reach out via our{' '}
            <ContactTrigger type="link" className="text-accent hover:underline">contact modal</ContactTrigger>.
          </p>
        </div>

        {/* Desktop: horizontal accordion strips */}
        <div className="hidden md:flex flex-col gap-2">
          {termsData.sections.map((section, idx) => {
            const isOpen = openSections.has(idx);
            return (
              <div
                key={idx}
                className="rounded-xl border border-border/50 bg-bg-card overflow-hidden transition-colors hover:border-border/50"
              >
                {/* Strip header — always visible */}
                <button
                  onClick={() => toggleSection(idx)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="text-[10px] font-black text-accent/60 font-mono w-6 shrink-0">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-sm font-black text-text-primary uppercase tracking-tight truncate">
                      {section.title}
                    </h3>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-text-muted shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Expandable content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pl-15">
                        {section.body && (
                          <p className="text-sm text-text-secondary leading-relaxed mb-4 pl-10">
                            {section.body}
                          </p>
                        )}
                        {section.bullets.length > 0 && (
                          <ul className="flex flex-col gap-2 pl-10">
                            {section.bullets.map((bullet, i) => (
                              <li key={i} className="text-sm text-text-secondary flex items-start gap-3">
                                <span className="text-accent font-mono font-bold flex-none mt-0.5 text-xs">{'>'}</span>
                                {bullet}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Mobile: stacked cards (always expanded) */}
        <div className="md:hidden flex flex-col gap-4">
          {termsData.sections.map((section, idx) => (
            <div
              key={idx}
              className="terminal-card relative rounded-2xl border border-border bg-bg-card overflow-hidden"
            >
              <div className="relative p-5">
                <div
                  className="absolute top-3 right-4 font-mono text-2xl font-black leading-none select-none pointer-events-none"
                  style={{ color: 'var(--color-accent-dim)' }}
                  aria-hidden="true"
                >
                  {String(idx + 1).padStart(2, '0')}
                </div>
                <h3 className="text-sm font-black text-text-primary mb-3 font-mono uppercase tracking-tight pr-10">
                  {section.title}
                </h3>
                {section.body && (
                  <p className="text-sm text-text-secondary leading-relaxed mb-4">{section.body}</p>
                )}
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TermsContentSection;
export { TermsContentSection };
