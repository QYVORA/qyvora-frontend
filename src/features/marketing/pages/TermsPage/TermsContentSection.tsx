import React from 'react';
import PageHeader from '@/shared/components/ui/PageHeader';
import PublicContainer from '@/shared/components/layout/PublicContainer';
import DocTocNav from '@/shared/components/tools/DocTocNav';
import { ContactTrigger } from '@/features/marketing/components/ContactModal';
import { termsData } from './termsData';

const TOC_SECTIONS = termsData.sections.map((section, idx) => ({
  id: `terms-${idx + 1}`,
  label: section.shortTitle ?? section.title,
}));

const TermsContentSection: React.FC = () => {
  return (
    <div className="min-h-full flex flex-col pb-12 md:pb-16 lg:pb-20">
      <PublicContainer>
        <PageHeader
          kicker="Legal Framework"
          title="Terms of Service"
          description={
            <>
              These terms govern your use of all QYVORA platforms, training programs, and
              professional services. Questions? Reach out via our{' '}
              <ContactTrigger type="link" className="text-accent hover:underline">contact modal</ContactTrigger>.
            </>
          }
          metadata={
            <span className="type-meta inline-flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-text-muted">
                Effective{' '}
                <span className="font-bold text-text-primary">{termsData.effectiveDate}</span>
              </span>
              <span className="text-xs font-black uppercase tracking-widest text-text-muted">
                Jurisdiction{' '}
                <span className="font-bold text-text-primary">{termsData.jurisdiction}</span>
              </span>
            </span>
          }
        />
      </PublicContainer>

      <DocTocNav sections={TOC_SECTIONS} contained />

      <PublicContainer>
        <div className="mt-12 md:mt-16">
          {termsData.sections.map((section, idx) => (
            <section key={idx} id={`terms-${idx + 1}`} className="doc-anchor py-10 md:py-14">
              <h2 className="flex items-baseline gap-4 text-2xl font-black uppercase tracking-tight text-text-primary md:text-4xl">
                <span className="shrink-0 font-mono text-sm font-black text-accent md:text-xl">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                {section.title}
              </h2>

              {section.body && (
                <p className="mt-6 max-w-none text-sm font-mono text-text-secondary leading-[2] md:text-base md:leading-[2.2]">
                  {section.body}
                </p>
              )}

              {section.bullets.length > 0 && (
                <ul className="mt-5 flex flex-col gap-3">
                  {section.bullets.map((bullet, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm font-mono text-text-secondary leading-[2] md:text-base md:leading-[2.2]"
                    >
                      <span className="mt-0.5 shrink-0 font-black text-accent">&gt;</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </PublicContainer>
    </div>
  );
};

export default TermsContentSection;
export { TermsContentSection };