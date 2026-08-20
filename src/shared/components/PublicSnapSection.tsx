import React from 'react';

interface PublicSnapSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

/**
 * Full-viewport snap section for public inner pages.
 *
 * On desktop (md+) sections fill at least one viewport (`min-h-dvh`) and snap
 * into view. On mobile sections have no minimum height so content can grow
 * naturally without clipping — vertical space is too precious to lock to a
 * single viewport.
 *
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
      className={`relative w-full md:min-h-dvh lg:h-dvh snap-section flex flex-col justify-center odd:bg-bg even:bg-bg-alt px-3 md:px-4 lg:px-6 pt-24 pb-8 md:pb-10 lg:pb-12 overflow-hidden ${className ?? ''}`}
    >
      {children}
    </section>
  );
};

export default PublicSnapSection;
