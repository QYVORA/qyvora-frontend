import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { IconArrowRight, IconArrowLeft } from '@/shared/components/icons';
import { getToolNeighbors, getRelatedTools } from '@/features/marketing/data/relatedTools';
import RelatedContentSection from '@/shared/components/RelatedContentSection';

interface DocFooterNavProps {
  currentPath: string;
}

/**
 * DocFooterNav — closing block for tool documentation pages.
 * Previous/Next cards keep the reader moving through the toolkit, followed by
 * the full related-tools strip. Replaces the marketing-style "Ready to…" CTA.
 */
const DocFooterNav: React.FC<DocFooterNavProps> = ({ currentPath }) => {
  const { t } = useTranslation();
  const { prev, next } = getToolNeighbors(t, currentPath);

  return (
    <div className="w-full py-16 md:py-24 border-t border-border/10">
      <div className="px-3 md:px-4 lg:px-6 flex flex-col gap-10 md:gap-14">
        <div>
          <div className="mb-6">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">
              Continue reading
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prev ? (
              <Link
                to={prev.path}
                className="group flex gap-4 items-center rounded-2xl border border-border/50 bg-bg-card p-4 md:p-5 transition-colors hover:border-accent/40 hover:bg-bg-elevated"
              >
                <IconArrowLeft
                  size={18}
                  className="text-accent shrink-0 transition-transform duration-200 group-hover:-translate-x-1"
                />
                <span className="min-w-0">
                  <span className="block text-[9px] font-black uppercase tracking-widest text-text-muted">
                    Previous
                  </span>
                  <span className="mt-1 block text-sm font-black text-text-primary truncate">
                    {prev.title}
                  </span>
                  <span className="mt-0.5 line-clamp-1 block text-[11px] font-mono text-text-muted">
                    {prev.desc}
                  </span>
                </span>
              </Link>
            ) : (
              <span className="hidden md:block" />
            )}

            {next ? (
              <Link
                to={next.path}
                className="group flex gap-4 items-center justify-end rounded-2xl border border-border/50 bg-bg-card p-4 md:p-5 text-right transition-colors hover:border-accent/40 hover:bg-bg-elevated"
              >
                <span className="min-w-0">
                  <span className="block text-[9px] font-black uppercase tracking-widest text-text-muted">
                    Next
                  </span>
                  <span className="mt-1 block text-sm font-black text-text-primary truncate">
                    {next.title}
                  </span>
                  <span className="mt-0.5 line-clamp-1 block text-[11px] font-mono text-text-muted">
                    {next.desc}
                  </span>
                </span>
                <IconArrowRight
                  size={18}
                  className="text-accent shrink-0 transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            ) : (
              <span className="hidden md:block" />
            )}
          </div>
        </div>

        <RelatedContentSection items={getRelatedTools(t, currentPath)} />
      </div>
    </div>
  );
};

export default DocFooterNav;