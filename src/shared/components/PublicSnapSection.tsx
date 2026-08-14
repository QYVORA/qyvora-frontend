import React from 'react';

interface PublicSnapSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  /** Keep compact profile-style content inside one snap viewport. */
  fitViewport?: boolean;
}

/**
 * Full-viewport marketing content section used on public inner pages.
 *
 * Follows the same scroll-snap rhythm as the landing page: each section fills
 * at least one viewport (`min-h-dvh`) and snaps into place via the parent
 * `.snap-container`. Sections with more content grow beyond the viewport
 * instead of scrolling internally, so nothing is ever clipped and every
 * control stays visible.
 *
 * Content is vertically centred when it fits. When it is taller than the
 * viewport the section grows and the content stays top-aligned — never cut
 * off above or below the fold.
 */
const PublicSnapSection: React.FC<PublicSnapSectionProps> = ({
  children,
  className,
  id,
  fitViewport = false,
}) => {
  return (
    <div
      id={id}
      className={`relative w-full px-3 md:px-4 lg:px-6 flex flex-col ${
        fitViewport
          ? 'h-dvh min-h-0 overflow-hidden pt-20 md:pt-24 lg:pt-28 pb-8 md:pb-12 lg:pb-16'
          : 'min-h-dvh pt-24 md:pt-28 lg:pt-32 pb-12 md:pb-16 lg:pb-20'
      } ${className ?? ''}`}
    >
      <div className="w-full my-auto flex-1 flex flex-col justify-center min-h-0">
        {children}
      </div>
    </div>
  );
};

export default PublicSnapSection;
