import React from 'react';
import SEO from '@/shared/components/SEO';
import { Footer } from '@/shared/components/layout';
import ToolDocTopbar, { type ToolDocSection } from './ToolDocTopbar';
import DocToc from './DocToc';

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
 * Single-scroll doc with a fixed tool topbar, a sticky "On this page" rail on
 * lg+ and a measured reading column. Children render inside <main>.
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

    <div className="w-full mx-auto lg:grid lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-10">
      <aside className="hidden lg:block relative">
        <div className="lg:sticky lg:top-16 max-h-[calc(100vh-4rem)] overflow-y-auto py-10 px-4">
          <DocToc
            toolName={toolName}
            sections={sections}
            installLabel={installLabel}
            onInstall={onInstall}
          />
        </div>
      </aside>

      <main id="main-content" className="flex flex-col min-w-0 min-h-dvh">
        {children}
      </main>
    </div>

    <Footer />
  </div>
);

export default ToolDocPage;