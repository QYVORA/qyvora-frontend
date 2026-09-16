import React, { useState } from 'react';
import { ListOrdered, Download } from 'lucide-react';
import SEO from '@/shared/components/SEO';
import PublicFooter from '@/shared/components/layout/PublicFooter';
import ToolDocTopbar, { type ToolDocSection } from './ToolDocTopbar';
import DocToc from './DocToc';
import { BottomSheet, BottomSheetContent } from '@/shared/components/ui/BottomSheet';
import IconButton from '@/shared/components/ui/IconButton';

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
 * DocsShell — document layout for tool documentation pages (13 tools share this).
 *
 * Desktop (lg+): sticky "On this page" rail in a fixed sidebar column beside
 * the reading column. Mobile: the same TOC lives in an "On this page" bottom
 * sheet opened from the header bar; an install action is always reachable.
 *
 * Reading area is article-width but not max-w-* constrained at the page level —
 * sections own their own prose width. Terminal/command styling (and only that)
 * stays monospace.
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
}) => {
  const [tocOpen, setTocOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-canvas">
      <SEO title={seoTitle} description={seoDescription} />

      <ToolDocTopbar
        toolName={toolName}
        accentWord={accentWord}
        sections={sections}
        githubUrl={githubUrl}
        installLabel={installLabel}
        onInstall={onInstall}
      />

      <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 lg:px-6">
        <aside className="hidden lg:block">
          <div className="lg:sticky lg:top-24 max-h-[calc(100dvh-8rem)] overflow-y-auto py-10 pr-2">
            <DocToc
              toolName={toolName}
              sections={sections}
              installLabel={installLabel}
              onInstall={onInstall}
            />
          </div>
        </aside>

        <main id="main-content" className="flex min-w-0 min-h-dvh flex-col px-3 md:px-4 lg:px-0">
          {/* Mobile context bar — On this page (sheet) + install */}
          <div className="sticky top-20 z-[80] -mx-3 flex items-center justify-between gap-3 border-b border-border-subtle bg-canvas/95 px-3 py-2 md:-mx-4 md:px-4 lg:hidden">
            <IconButton
              label="On this page"
              tooltip={false}
              variant="default"
              onClick={() => setTocOpen(true)}
              icon={<ListOrdered className="h-4 w-4" aria-hidden="true" />}
            />
            <span className="type-label text-text-tertiary">{toolName}</span>
            {onInstall && (
              <button
                type="button"
                onClick={onInstall}
                className="flex min-h-[44px] items-center gap-1.5 rounded-lg border border-accent/40 px-3 text-sm font-medium text-accent transition-colors hover:bg-accent/10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                {installLabel}
              </button>
            )}
          </div>

          {children}
        </main>
      </div>

      <PublicFooter />

      <BottomSheet open={tocOpen} onOpenChange={setTocOpen}>
        <BottomSheetContent ariaLabel="On this page">
          <div className="px-3 py-4">
            <DocToc
              toolName={toolName}
              sections={sections}
              installLabel={installLabel}
              onInstall={onInstall}
              onNavigate={() => setTocOpen(false)}
            />
          </div>
        </BottomSheetContent>
      </BottomSheet>
    </div>
  );
};

export default ToolDocPage;