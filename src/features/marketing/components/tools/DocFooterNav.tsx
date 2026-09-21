import React from 'react';
import { Link } from 'react-router-dom';
import { IconArrowRight, IconArrowLeft } from '@/shared/components/icons';
import { getToolNeighbors, getRelatedTools } from '@/features/marketing/data/relatedTools';

interface DocFooterNavProps {
  currentPath: string;
}

/**
 * DocFooterNav — closing block for tool documentation pages.
 * A lightweight previous/next row keeps the reader moving through the toolkit,
 * followed by a compact related-tools strip using the real tool logos. No
 * heavyweight cards — wayfinding stays subordinate to the reading columns.
 */
const DocFooterNav: React.FC<DocFooterNavProps> = ({ currentPath }) => {
  const { prev, next } = getToolNeighbors(currentPath);
  const related = getRelatedTools(currentPath);

  return (
    <div className="w-full border-t border-border/10 py-16 md:py-24">
      <div className="flex flex-col gap-12 px-3 md:px-4 md:gap-16 lg:px-6">
        <div>
          <div className="mb-5">
            <p className="text-micro font-black uppercase tracking-[0.3em] text-text-muted">
              Continue reading
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {prev ? (
              <Link
                to={prev.path}
                className="group flex min-h-[56px] items-center gap-3 rounded-2xl border border-border/40 bg-bg-card px-4 py-3 transition-colors hover:border-accent/40 hover:bg-bg-elevated"
              >
                <IconArrowLeft
                  size={16}
                  className="shrink-0 text-accent transition-transform duration-200 group-hover:-translate-x-0.5"
                />
                <span className="min-w-0">
                  <span className="block text-micro font-black uppercase tracking-widest text-text-muted">
                    Previous
                  </span>
                  <span className="block truncate text-sm font-black text-text-primary transition-colors group-hover:text-accent">
                    {prev.title}
                  </span>
                </span>
              </Link>
            ) : (
              <span className="hidden sm:block" />
            )}

            {next ? (
              <Link
                to={next.path}
                className="group flex min-h-[56px] items-center justify-end gap-3 rounded-2xl border border-border/40 bg-bg-card px-4 py-3 text-right transition-colors hover:border-accent/40 hover:bg-bg-elevated"
              >
                <span className="min-w-0">
                  <span className="block text-micro font-black uppercase tracking-widest text-text-muted">
                    Next
                  </span>
                  <span className="block truncate text-sm font-black text-text-primary transition-colors group-hover:text-accent">
                    {next.title}
                  </span>
                </span>
                <IconArrowRight
                  size={16}
                  className="shrink-0 text-accent transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Link>
            ) : (
              <span className="hidden sm:block" />
            )}
          </div>
        </div>

        {related.length > 0 && (
          <div>
            <div className="mb-5 flex items-center justify-between gap-4">
              <p className="text-micro font-black uppercase tracking-[0.3em] text-text-muted">
                More from the toolkit
              </p>
              <Link
                to="/tools"
                className="flex min-h-[44px] items-center gap-1.5 text-xs font-black uppercase tracking-widest text-accent transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {"All tools"} <IconArrowRight size={12} aria-hidden="true" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((tool) => (
                <Link
                  key={tool.to}
                  to={tool.to}
className="group flex min-h-[56px] items-center gap-3 rounded-2xl border border-border/40 bg-bg-card px-4 py-3 transition-colors hover:border-accent/40 hover:bg-bg-elevated"
                >
                  {tool.image && (
                    <img
                      src={tool.image}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      className="h-8 w-8 shrink-0 rounded-lg object-contain opacity-90 transition-opacity group-hover:opacity-100"
                    />
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-black text-text-primary transition-colors group-hover:text-accent">
                      {tool.title}
                    </span>
                    <span className="block truncate text-xs font-mono text-text-muted">
                      {tool.subtitle}
                    </span>
                  </span>
                  <IconArrowRight
                    size={14}
                    className="shrink-0 text-text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-accent"
                  />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocFooterNav;