import React from 'react';
import { GridBoxedBackground } from '@/shared/components/backgrounds';
import { Footer } from '@/shared/components/layout';
import LandingFinalCtaSection from '@/features/marketing/components/landing/LandingFinalCtaSection';

interface PublicSnapLayoutProps {
  children: React.ReactNode;
}

/**
 * Wraps a set of full-viewport marketing sections in the same scroll-snap
 * container used by the landing page. Every direct child becomes a snap
 * section. Section backgrounds alternate between `bg-bg` and the dashboard's
 * secondary `bg-bg-alt`, and the athene grid background follows the same
 * alternating rhythm (section 0 = hero carries its own, sections 2, 4, …
 * get one) so public pages share the same uniform UI as the landing page.
 */
const PublicSnapLayout: React.FC<PublicSnapLayoutProps> = ({ children }) => {
  const sections = React.Children.toArray(children).filter((child) =>
    React.isValidElement(child)
  );

  return (
    <div className="relative w-full bg-bg snap-container no-scrollbar">
      {sections.map((child, i) => {
        const isFooter = child.type === Footer;
        const carriesOwnGrid =
          i === 0 || isFooter || child.type === LandingFinalCtaSection;
        return (
          <section
            key={i}
            className={`relative w-full snap-section ${
              isFooter
                ? 'bg-bg pt-10 md:pt-0'
                : `min-h-dvh ${i % 2 === 0 ? 'bg-bg' : 'bg-bg-alt'}`
            }`}
          >
            {!carriesOwnGrid && i % 2 === 0 && (
              <GridBoxedBackground blur={0} mask="right" />
            )}
            <div className="relative z-10 w-full">{child}</div>
          </section>
        );
      })}
    </div>
  );
};

export default PublicSnapLayout;
