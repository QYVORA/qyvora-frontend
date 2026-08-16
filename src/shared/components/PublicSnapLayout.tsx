import React from 'react';

interface PublicSnapLayoutProps {
  children: React.ReactNode;
}

/**
 * Full-viewport scroll-snap wrapper for public inner pages.
 *
 * Desktop: sections snap (`y mandatory` inside a `100dvh` scroll container),
 * matching the landing page. Mobile: the container is a plain block — sections
 * scroll naturally (snap CSS is desktop-only). Each child section provides its
 * own background and navbar clearance via `PublicSnapSection`/snap wrappers.
 */
const PublicSnapLayout: React.FC<PublicSnapLayoutProps> = ({ children }) => {
  return <div className="relative w-full bg-bg snap-container no-scrollbar">{children}</div>;
};

export default PublicSnapLayout;
