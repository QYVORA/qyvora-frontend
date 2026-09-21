import React from 'react';
import SEO from '@/shared/components/SEO';
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
 * DocsShell — reading-material wrapper for tool documentation pages (13 tools
 * share this). Renders inside the public shell (PublicNavigation + PublicFooter)
 * with standard navbar clearance and a sticky "On this page" chip nav. Sections
 * own their reading width and spacing.
 */
const ToolDocPage: React.FC<ToolDocPageProps> = ({
  seoTitle,
  seoDescription,
  sections,
  children,
}) => (
  <div className="relative min-h-dvh w-full bg-canvas pt-24 md:pt-28 lg:pt-32">
    <SEO title={seoTitle} description={seoDescription} />
    {sections && sections.length > 0 && <DocTocNav sections={sections} />}
    {children}
  </div>
);

export default ToolDocPage;