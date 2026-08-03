import React from 'react';

interface PublicSnapLayoutProps {
  children: React.ReactNode;
}

/**
 * Wraps a set of full-viewport marketing sections in the same scroll-snap
 * container used by the landing page. Every direct child becomes a snap
 * section. Section backgrounds alternate between `bg-bg` and the dashboard's
 * secondary `bg-bg-alt` so public pages share the same rhythm as the
 * dashboard and landing page.
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
          className={`relative w-full min-h-dvh snap-section ${i % 2 === 0 ? 'bg-bg' : 'bg-bg-alt'}`}
        >
          {child}
        </section>
      ))}
    </div>
  );
};

export default PublicSnapLayout;
