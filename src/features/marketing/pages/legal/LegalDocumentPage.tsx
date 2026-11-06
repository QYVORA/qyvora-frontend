import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '@/shared/components/ui/PageHeader';
import PublicContainer from '@/shared/components/layout/PublicContainer';
import DocTocNav from '@/shared/components/tools/DocTocNav';
import type { LegalDocument } from './legalTypes';

interface LegalRelatedLink {
  label: string;
  to: string;
}

interface LegalDocumentPageProps {
  doc: LegalDocument;
  actions?: React.ReactNode;
  related?: LegalRelatedLink[];
}

/**
 * LegalDocumentPage — the shared reading surface for every public policy page.
 *
 * Mirrors the Terms of Service composition exactly (PageHeader, wrapping
 * on-page nav, numbered sections) so all legal pages feel like one set.
 */
const LegalDocumentPage: React.FC<LegalDocumentPageProps> = ({ doc, actions, related }) => {
  const tocSections = doc.sections.map((section, idx) => ({
    id: `${doc.slug}-${idx + 1}`,
    label: section.shortTitle ?? section.title,
  }));

  return (
    <div className="min-h-dvh w-full bg-canvas">
      <div className="w-full pt-24 md:pt-28 lg:pt-32">
        <PublicContainer>
          <PageHeader
            kicker={doc.kicker}
            title={doc.title}
            description={doc.summary}
            actions={actions}
            metadata={
              <span className="type-meta inline-flex flex-wrap items-center gap-x-5 gap-y-2">
                <span className="text-xs font-black uppercase tracking-widest text-text-muted">
                  Effective{' '}
                  <span className="font-bold text-text-primary">{doc.effectiveDate}</span>
                </span>
                <span className="text-xs font-black uppercase tracking-widest text-text-muted">
                  Updated{' '}
                  <span className="font-bold text-text-primary">{doc.lastUpdated}</span>
                </span>
                <span className="text-xs font-black uppercase tracking-widest text-text-muted">
                  Jurisdiction{' '}
                  <span className="font-bold text-text-primary">{doc.jurisdiction}</span>
                </span>
              </span>
            }
          />
          <DocTocNav sections={tocSections} />
        </PublicContainer>

        <PublicContainer>
          <div className="mt-12 pb-12 md:mt-16 md:pb-16 lg:pb-20">
            {doc.sections.map((section, idx) => (
              <section
                key={idx}
                id={`${doc.slug}-${idx + 1}`}
                className="doc-anchor py-10 md:py-14"
              >
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
                        <span className="mt-[0.95rem] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            {related && related.length > 0 && (
              <div className="mt-6 border-t border-border-subtle pt-6">
                <h2 className="type-label text-accent">Related policies</h2>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                  {related.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="inline-flex min-h-[44px] items-center text-sm font-bold text-text-secondary transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </PublicContainer>
      </div>
    </div>
  );
};

export default LegalDocumentPage;
