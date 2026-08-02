import React from 'react';

interface PublicSnapLayoutProps {
  children: React.ReactNode;
}

/**
 * Wraps a set of full-viewport marketing sections in the same scroll-snap
 * container used by the landing page. Every direct child is wrapped in a
 * snap section with `data-nav-invert` so the fixed navbar stays inverted
 * (matching landing behaviour) across all public pages.
 */
const PublicSnapLayout: React.FC<PublicSnapLayoutProps> = ({ children }) => {
  const sections = React.Children.toArray(children).filter((child) =>
    React.isValidElement(child)
  );

  return (
    <div className="relative w-full bg-bg snap-container no-scrollbar">
      {sections.map((child, i) => (
        <section
          key={i}
          className="relative w-full min-h-dvh snap-section bg-bg"
          data-nav-invert
        >
          {child}
        </section>
      ))}
    </div>
  );
};

export default PublicSnapLayout;
