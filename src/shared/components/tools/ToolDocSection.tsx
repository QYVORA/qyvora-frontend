import React from 'react';
import { cn } from '@/shared/utils/cn';

interface ToolDocSectionProps {
  id: string;
  kicker?: string;
  title?: string;
  accent?: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Consistent section wrapper for tool documentation pages.
 * Full-width with side padding — matches site-wide reading layouts
 * (px-3 md:px-4 lg:px-6). Reading-scale section headings (text-2xl md:text-4xl)
 * and description prose.
 */
const ToolDocSection: React.FC<ToolDocSectionProps> = ({
  id,
  kicker,
  title,
  accent,
  description,
  className,
  children,
}) => (
  <section
    id={id}
    className={cn('doc-anchor py-16 md:py-20', className)}
  >
    <div className="w-full px-3 md:px-4 lg:px-6">
      {(kicker || title) && (
        <div className="mb-8 md:mb-10">
          {kicker && (
            <p className="text-kicker mb-3 font-black uppercase tracking-[0.3em] text-accent">
              {kicker}
            </p>
          )}
          {title && (
            <h2 className="text-2xl font-black uppercase tracking-tight text-text-primary md:text-4xl">
              {title}
              {accent && (
                <>
                  {' '}
                  <span className="text-accent">{accent}</span>
                </>
              )}
            </h2>
          )}
          {description && (
            <p className="mt-4 max-w-2xl text-sm font-mono text-text-secondary leading-[2] md:text-base md:leading-[2.2]">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  </section>
);

export default ToolDocSection;