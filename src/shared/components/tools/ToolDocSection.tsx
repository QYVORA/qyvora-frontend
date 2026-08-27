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
 * Full-width with side padding — matches site-wide layout (px-3 md:px-4 lg:px-6).
 * No max-w-4xl centering — documentation content fills the viewport width.
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
    className={cn('py-16 md:py-24 border-t border-border/10', className)}
  >
    <div className="px-3 md:px-4 lg:px-6">
      {(kicker || title) && (
        <div className="mb-10 md:mb-14">
          {kicker && (
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-3">
              {kicker}
            </p>
          )}
          {title && (
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-text-primary leading-tight">
              {title}{' '}
              {accent && <span className="text-accent">{accent}</span>}
            </h2>
          )}
          {description && (
            <p className="mt-4 text-base text-text-secondary font-mono leading-relaxed max-w-2xl">
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
