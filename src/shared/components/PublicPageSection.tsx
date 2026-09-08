import React from 'react';

interface PublicPageSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

/**
 * Full-width page section for public inner pages.
 *
 * Desktop (md+): sections are AT LEAST one viewport tall (`min-h-dvh`) and
 * grow freely when content exceeds the viewport — never `h-dvh`, so content
 * can never be clipped.
 * - Vertical centering is done via `my-auto` on the inner wrapper: when the
 *   content fits, it is centered in the remaining space; when it overflows,
 *   auto margins collapse to zero and the content starts right below the
 *   reserved navbar clearance instead of bleeding underneath the navbar.
 * - Mobile: no minimum height — sections size to their content.
 */
const PublicPageSection: React.FC<PublicPageSectionProps> = ({
  children,
  className,
  id,
}) => {
  return (
    <section
      id={id}
      className={`relative w-full md:min-h-dvh flex flex-col odd:bg-bg even:bg-bg-alt px-3 md:px-4 lg:px-6 pt-24 pb-8 md:pt-28 md:pb-10 lg:pt-32 lg:pb-12 ${className ?? ''}`}
    >
      <div className="w-full my-auto">{children}</div>
    </section>
  );
};

export default PublicPageSection;