import React from 'react';

interface PublicSnapSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

/**
 * Full-viewport snap section for public inner pages.
 *
 * Layout contract:
 * - Desktop (md+): sections are AT LEAST one viewport tall (`min-h-dvh`) and
 *   snap into view under the strict snap container. The section grows freely
 *   when content exceeds the viewport — never `h-dvh`, so content can never
 *   be clipped.
 * - Vertical centering is done via `my-auto` on the inner wrapper: when the
 *   content fits, it is centered in the remaining space; when it overflows,
 *   auto margins collapse to zero and the content starts right below the
 *   reserved navbar clearance instead of bleeding underneath the navbar.
 * - Mobile: no minimum height — sections size to their content.
 */
const PublicSnapSection: React.FC<PublicSnapSectionProps> = ({
  children,
  className,
  id,
}) => {
  return (
    <section
      id={id}
      className={`relative w-full md:min-h-dvh snap-section flex flex-col odd:bg-bg even:bg-bg-alt px-3 md:px-4 lg:px-6 pt-24 pb-8 md:pt-28 md:pb-10 lg:pt-32 lg:pb-12 ${className ?? ''}`}
    >
      <div className="w-full my-auto">{children}</div>
    </section>
  );
};

export default PublicSnapSection;
