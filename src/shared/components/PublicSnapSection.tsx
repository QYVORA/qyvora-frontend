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
 * viewport it scrolls internally WITHOUT clipping: the inner wrapper is the
 * scroll container and the content wrapper carries `min-h-full` + `justify-center`,
 * so short content is centred while tall content starts at the top and is
 * fully reachable (never clipped above the fold).
 */
const PublicSnapSection: React.FC<PublicSnapSectionProps> = ({
  children,
  className,
  id,
}) => {
  return (
    <div
      id={id}
      className={`relative w-full min-h-dvh lg:h-dvh overflow-hidden px-3 md:px-4 lg:px-6 pt-24 md:pt-28 lg:pt-32 pb-6 md:pb-8 lg:pb-10 flex flex-col ${className ?? ''}`}
    >
      <div className="w-full my-auto flex-1 min-h-0 overflow-y-auto no-scrollbar">
        <div className="min-h-full w-full flex flex-col justify-center">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PublicSnapSection;
