import React from 'react';

interface PublicSnapSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

/**
 * Full-viewport snap section for public inner pages.
 *
 * Each section fills at least one viewport (`min-h-dvh`), is a scroll-snap
 * target on desktop, alternates `bg-bg`/`bg-bg-alt` by its position among the
 * page's sections, and clears the fixed 80px navbar via `pt-24`.
 * Content is vertically centered inside the snap frame. No nested scrolling —
 * the page-level snap container is the sole vertical scroll surface.
 */
const PublicSnapSection: React.FC<PublicSnapSectionProps> = ({
  children,
  className,
  id,
}) => {
  return (
    <section
      id={id}
      className={`relative w-full min-h-dvh lg:h-dvh snap-section flex flex-col items-center justify-center odd:bg-bg even:bg-bg-alt px-3 md:px-4 lg:px-6 pt-24 pb-8 md:pb-10 lg:pb-12 overflow-hidden ${className ?? ''}`}
    >
      {children}
    </section>
  );
};

export default PublicSnapSection;
