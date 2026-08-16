import React from 'react';

interface PublicSnapSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

/**
 * Natural-flow content section for public inner pages.
 *
 * Uses the unified stretched layout: full width, consistent side padding,
 * generous vertical rhythm. Sections scroll normally — no snap behaviour and
 * no forced viewport height, so taller content grows the page instead of
 * clipping or creating full-height strips.
 */
const PublicSnapSection: React.FC<PublicSnapSectionProps> = ({
  children,
  className,
  id,
}) => {
  return (
    <section
      id={id}
      className={`relative w-full px-3 md:px-4 lg:px-6 py-16 md:py-20 lg:py-24 scroll-mt-24 md:scroll-mt-28 ${className ?? ''}`}
    >
      {children}
    </section>
  );
};

export default PublicSnapSection;
