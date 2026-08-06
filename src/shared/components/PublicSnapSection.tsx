import React from 'react';

interface PublicSnapSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

/**
 * Full-viewport marketing content section used on public inner pages.
 *
 * Follows the same scroll-snap rhythm as the landing page: each section fills
 * exactly one viewport (`min-h-dvh lg:h-dvh`) and snaps into place via the
 * parent `.snap-container`.
 *
 * Content is vertically centred when it fits. When it is taller than the
 * viewport it scrolls internally WITHOUT clipping — this uses `my-auto`
 * centering on an inner wrapper instead of `justify-center`, which would push
 * the overflow above the scroll container and make the top of the content
 * unreachable.
 */
const PublicSnapSection: React.FC<PublicSnapSectionProps> = ({
  children,
  className,
  id,
}) => {
  return (
    <div
      id={id}
      className={`relative w-full min-h-dvh lg:h-dvh overflow-y-auto no-scrollbar px-3 md:px-4 lg:px-6 pt-24 md:pt-28 lg:pt-32 pb-6 md:pb-8 lg:pb-10 ${className ?? ''}`}
    >
      <div className="min-h-full flex flex-col">
        <div className="w-full my-auto">{children}</div>
      </div>
    </div>
  );
};

export default PublicSnapSection;
