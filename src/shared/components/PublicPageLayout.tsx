import React from 'react';

interface PublicPageLayoutProps {
  children: React.ReactNode;
}

/**
 * Plain block wrapper for public inner pages providing the shared page
 * background and full width. Each child section supplies its own background
 * and spacing.
 */
const PublicPageLayout: React.FC<PublicPageLayoutProps> = ({ children }) => {
  return <div className="relative w-full bg-bg">{children}</div>;
};

export default PublicPageLayout;