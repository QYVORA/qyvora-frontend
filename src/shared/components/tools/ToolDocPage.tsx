import React from 'react';
import SEO from '@/shared/components/SEO';
import PublicContainer from '@/shared/components/layout/PublicContainer';
import DocTocNav from './DocTocNav';

export interface ToolDocSectionItem {
  id: string;
  label: string;
}

interface ToolDocPageProps {
  toolName: string;
  accentWord?: string;
  seoTitle: string;
  seoDescription: string;
  sections?: ToolDocSectionItem[];
  githubUrl?: string;
  installLabel?: string;
  onInstall?: () => void;
  children: React.ReactNode;
}

/**
 * DocsShell — reading-material wrapper for tool documentation pages (14 tools
 * share this). Renders inside the public shell (PublicNavigation + PublicFooter)
 * with standard navbar clearance and a wrapping "On this page" chip nav below
 * the hero. Sections own their reading width and spacing.
 */
const ToolDocPage: React.FC<ToolDocPageProps> = ({
  seoTitle,
  seoDescription,
  sections,
  children,
}) => {
  const [hero, ...content] = React.Children.toArray(children);

  return (
    <div className="relative min-h-dvh w-full bg-canvas pt-24 md:pt-28 lg:pt-32">
      <SEO title={seoTitle} description={seoDescription} />
      {hero}
      {sections && sections.length > 0 && (
        <PublicContainer>
          <DocTocNav sections={sections} />
        </PublicContainer>
      )}
      {content}
    </div>
  );
};

export default ToolDocPage;