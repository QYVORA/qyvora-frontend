import React from 'react';
import SEO from '@/shared/components/SEO';
import { Footer } from '@/shared/components/layout';
import ToolDocTopbar, { type ToolDocSection } from './ToolDocTopbar';

interface ToolDocPageProps {
  toolName: string;
  accentWord?: string;
  seoTitle: string;
  seoDescription: string;
  sections: ToolDocSection[];
  githubUrl?: string;
  installLabel?: string;
  onInstall?: () => void;
  children: React.ReactNode;
}

/**
 * Shared layout for tool documentation pages.
 * Single-scroll page with a fixed tool topbar, no sidebar, no snap sections.
 */
const ToolDocPage: React.FC<ToolDocPageProps> = ({
  toolName,
  accentWord,
  seoTitle,
  seoDescription,
  sections,
  githubUrl,
  installLabel,
  onInstall,
  children,
}) => (
  <div className="bg-bg min-h-full">
    <SEO title={seoTitle} description={seoDescription} />

    <ToolDocTopbar
      toolName={toolName}
      accentWord={accentWord}
      sections={sections}
      githubUrl={githubUrl}
      installLabel={installLabel}
      onInstall={onInstall}
    />

    <main className="min-h-screen">
      {children}
    </main>

    <Footer />
  </div>
);

export default ToolDocPage;
