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
 * page's sections, and clears the fixed 80px navbar via `pt-24 md:pt-28 lg:pt-32`.
 * Content is vertically centered; sections grow if content exceeds the viewport.
 */
const PublicSnapSection: React.FC<PublicSnapSectionProps> = ({
  children,
  className,
  id,
}) => {
  return (
    <section
      id={id}
      className={`relative w-full min-h-dvh lg:h-dvh snap-section flex items-start odd:bg-bg even:bg-bg-alt scroll-mt-24 md:scroll-mt-28 ${className ?? ''}`}
    >
      <div className="w-full h-full overflow-y-auto px-3 md:px-4 lg:px-6 pt-24 md:pt-28 lg:pt-32 pb-6 md:pb-8 lg:pb-10">
        {children}
      </div>
    </section>
  );
};

export default PublicSnapSection;
