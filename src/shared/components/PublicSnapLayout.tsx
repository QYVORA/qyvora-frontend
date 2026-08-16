import React from 'react';

interface PublicSnapLayoutProps {
  children: React.ReactNode;
}

/**
 * Plain wrapper for public inner pages.
 *
 * Sections flow naturally (no scroll-snap, no forced full-viewport strips,
 * no alternating backgrounds, no background injection). Each child provides
 * its own background and vertical padding via `PublicSnapSection`.
 */
const PublicSnapLayout: React.FC<PublicSnapLayoutProps> = ({ children }) => {
  return <div className="relative w-full bg-bg">{children}</div>;
};

export default PublicSnapLayout;
