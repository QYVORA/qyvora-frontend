/**
 * RelatedContentSection.tsx
 * Location: src/shared/components/RelatedContentSection.tsx
 *
 * Sibling-content listing for content-specific public pages (tool pages,
 * simulation details, bootcamp phases, service tiers). Mirrors the
 * "Keep Reading" pattern on the blog detail page so every detail page ends
 * with the same wayfinding block before the final CTA.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { IconArrowRight } from '@/shared/components/icons';

export interface RelatedItem {
  to: string;
  title: string;
  subtitle?: string;
  badge?: string;
  /** Cover image — rendered in the 16/9 visual slot when provided. */
  image?: string;
  /** Icon fallback for items without imagery (tool marks, phase glyphs). */
  icon?: React.ReactNode;
}

interface RelatedContentSectionProps {
  /** Optional heading override; defaults to the translated "Keep Reading". */
  title?: string;
  items: RelatedItem[];
}

const RelatedContentSection: React.FC<RelatedContentSectionProps> = ({ title, items }) => {
  const { t } = useTranslation();

  if (items.length === 0) return null;

  return (
    <section aria-labelledby="related-content-heading">
      <div className="w-full px-3 md:px-4 lg:px-6 py-16 md:py-24">
        <h2 id="related-content-heading" className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-10">
          {title ?? t('relatedContent.keepReading', { defaultValue: 'Keep Reading' })}
        </h2>
        <div className={`grid grid-cols-1 ${items.length > 1 ? 'md:grid-cols-2' : ''} gap-8`}>
          {items.map((item) => (
            <Link
              key={item.to + item.title}
              to={item.to}
              className="group block terminal-card rounded-2xl border border-border bg-bg-card overflow-hidden transition-all duration-500 hover:border-accent/40"
              style={{ boxShadow: 'var(--card-shimmer)' }}
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-accent/5 flex items-center justify-center">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <span className="w-24 h-24 md:w-28 md:h-28 flex items-center justify-center text-accent transition-transform duration-500 group-hover:scale-105">
                    {item.icon}
                  </span>
                )}
              </div>
              <div className="p-6">
                {item.badge && (
                  <div className="mb-3">
                    <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-border/30 bg-bg-elevated text-text-muted">
                      {item.badge}
                    </span>
                  </div>
                )}
                <h3 className="text-xl font-black uppercase tracking-tight text-text-primary mb-2 break-words">
                  {item.title}
                </h3>
                {item.subtitle && (
                  <p className="text-xs text-text-muted leading-relaxed line-clamp-2">{item.subtitle}</p>
                )}
                <div className="mt-4 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-accent group-hover:gap-2.5 transition-all">
                  {t('relatedContent.view', { defaultValue: 'View' })} <IconArrowRight size={12} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedContentSection;
