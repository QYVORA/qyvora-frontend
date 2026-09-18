import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ListOrdered, Download } from 'lucide-react';
import { IconArrowRight } from '@/shared/components/icons';
import SEO from '@/shared/components/SEO';
import PublicFooter from '@/shared/components/layout/PublicFooter';
import { QyvoraMark } from '@/shared/components/brand';
import ToolDocTopbar, { type ToolDocSection } from './ToolDocTopbar';
import DocToc from './DocToc';
import Button from '@/shared/components/ui/Button';
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
 * Desktop (lg+): a fixed left rail mirroring the StudentSidebar — brand
 * identity header, scroll-spyed "On this page" items, and an install action
 * pinned at the bottom. The rail sits below the topbar and never scrolls
 * with the page. Main content is offset by the rail width.
 *
 * Mobile: the same TOC lives in an "On this page" bottom sheet opened from
 * the sticky context bar; an install action is always reachable there too.
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

      {/* Desktop fixed docs rail — mirrors the StudentSidebar layout. */}
      <aside className="fixed bottom-0 left-0 top-14 z-[95] hidden w-[264px] flex-col border-r border-border-subtle bg-canvas md:top-16 lg:flex">
        <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-border-subtle px-4">
          <QyvoraMark className="h-6 w-6 shrink-0" />
          <span className="type-label min-w-0 truncate text-text-tertiary">
            Documentation
          </span>
        </div>

        <nav aria-label="Documentation" className="flex-1 overflow-y-auto px-3 py-4">
          <DocToc sections={sections} />
        </nav>

        <div className="shrink-0 border-t border-border-subtle px-3 py-3">
          {onInstall && (
            <Button size="sm" onClick={onInstall} className="w-full">
              {installLabel}
            </Button>
          )}
          <Link
            to="/tools"
            className="flex min-h-[44px] items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-raised hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
          >
            <span>{"All tools"}</span>
            <IconArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </Link>
        </div>
      </aside>

      {/* Main + footer offset to clear the fixed desktop rail. */}
      <div className="lg:pl-[264px]">
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
                <Download className="h-4 w-4 shrink-0" aria-hidden="true" />
                {installLabel}
              </button>
            )}
          </div>

          {children}
        </main>
      </div>

      <div className="lg:pl-[264px]">
        <PublicFooter />
      </div>

      <BottomSheet open={tocOpen} onOpenChange={setTocOpen}>
        <BottomSheetContent ariaLabel="On this page">
          <div className="px-3 py-4">
            <DocToc sections={sections} onNavigate={() => setTocOpen(false)} />
            {onInstall && (
              <Button size="sm" onClick={onInstall} className="mt-4 w-full">
                {installLabel}
              </Button>
            )}
          </div>
        </BottomSheetContent>
      </BottomSheet>
    </div>
  );
};

export default ToolDocPage;