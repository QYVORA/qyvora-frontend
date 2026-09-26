import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Github, Library, ListTree, X } from 'lucide-react';
import { BottomSheet, BottomSheetContent, BottomSheetClose } from '@/shared/components/ui/BottomSheet';
import { useDocScrollSpy } from '@/shared/hooks/useDocScrollSpy';
import { cn } from '@/shared/utils/cn';
import {
  TOOLS,
  TOOL_DOMAIN_LABELS,
  TOOL_DOMAIN_ORDER,
  getToolByPath,
  type ToolEntry,
} from '@/features/marketing/data/tools/registry';
import { getToolDoc } from '@/features/marketing/data/tools';

type Sheet = 'sections' | 'tools' | null;

/**
 * DocsBottomNav — fixed bottom navigation for documentation on small screens.
 *
 * The rail that carries navigation on desktop has no mobile equivalent, so the
 * three things a reader actually needs are promoted to a permanent bar instead
 * of being hidden behind a menu: the sections of the page being read, the full
 * tool index, and the source of the tool in front of them. Links that leave the
 * documentation (the repository, the marketing site) open normally rather than
 * through a sheet.
 *
 * Two of the four items open a BottomSheet — it is the right surface for a long
 * grouped list and it keeps the page visible behind it, which is what makes the
 * hierarchy readable. The bar is safe-area aware and hidden from `lg` up, where
 * DocsSidebar takes over.
 */
const DocsBottomNav: React.FC = () => {
  const location = useLocation();
  const [sheet, setSheet] = useState<Sheet>(null);

  const activeTool = getToolByPath(location.pathname);
  const activeDoc = activeTool ? getToolDoc(activeTool.slug) : undefined;
  const sections = activeDoc?.sections ?? [];

  // The section list is passed as a joined key so the spy only re-subscribes
  // when the reader moves to a different tool, not on every render.
  const sectionIdsKey = useMemo(
    () => sections.map((section) => section.id).join(','),
    [sections],
  );
  const activeSectionId = useDocScrollSpy(sectionIdsKey, 96);

  useEffect(() => setSheet(null), [location.pathname, location.hash]);

  return (
    <>
      <nav
        aria-label="Documentation"
        className="fixed inset-x-0 bottom-0 z-[90] border-t border-border-subtle bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        <ul className="flex items-stretch">
          <li className="flex-1">
            <button
              type="button"
              onClick={() => setSheet('sections')}
              aria-expanded={sheet === 'sections'}
              aria-haspopup="dialog"
              disabled={!sections.length}
              className="flex min-h-[56px] w-full flex-col items-center justify-center gap-0.5 px-1 font-mono text-[10px] font-black uppercase tracking-widest text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-40"
            >
              <ListTree className="h-5 w-5" aria-hidden="true" />
              Sections
            </button>
          </li>

          <li className="flex-1">
            <button
              type="button"
              onClick={() => setSheet('tools')}
              aria-expanded={sheet === 'tools'}
              aria-haspopup="dialog"
              className="flex min-h-[56px] w-full flex-col items-center justify-center gap-0.5 px-1 font-mono text-[10px] font-black uppercase tracking-widest text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
            >
              <BookOpen className="h-5 w-5" aria-hidden="true" />
              Tools
            </button>
          </li>

          <li className="flex-1">
            <a
              href={activeTool?.github ?? 'https://github.com/QYVORA'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[56px] w-full flex-col items-center justify-center gap-0.5 px-1 font-mono text-[10px] font-black uppercase tracking-widest text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
            >
              <Github className="h-5 w-5" aria-hidden="true" />
              Repo
            </a>
          </li>

          <li className="flex-1">
            <Link
              to="/"
              className="flex min-h-[56px] w-full flex-col items-center justify-center gap-0.5 px-1 font-mono text-[10px] font-black uppercase tracking-widest text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
            >
              <Library className="h-5 w-5" aria-hidden="true" />
              Site
            </Link>
          </li>
        </ul>
      </nav>

      <BottomSheet open={sheet !== null} onOpenChange={(open) => !open && setSheet(null)}>
        <BottomSheetContent
          ariaLabel={sheet === 'sections' ? 'Sections on this page' : 'All tools'}
          className="max-h-[85dvh]"
        >
          <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
            <p className="font-mono text-[11px] font-black uppercase tracking-[0.3em] text-accent">
              {sheet === 'sections' ? 'On this page' : 'Tools'}
            </p>
            <BottomSheetClose
              asChild
              aria-label="Close"
              className="flex h-11 w-11 items-center justify-center rounded-xl text-text-secondary transition-colors hover:bg-surface-raised hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <button type="button">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </BottomSheetClose>
          </div>

          {sheet === 'sections' ? (
            <nav aria-label="Sections on this page" className="px-2 py-3">
              <ul className="space-y-0.5">
                {sections.map((section) => {
                  const isActive = section.id === activeSectionId;

                  return (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        onClick={() => setSheet(null)}
                        aria-current={isActive ? 'true' : undefined}
                        className={cn(
                          'flex min-h-[48px] items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors',
                          'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent',
                          isActive
                            ? 'bg-accent/10 font-black text-accent'
                            : 'text-text-secondary hover:bg-surface-raised hover:text-text-primary',
                        )}
                      >
                        {activeTool?.logo && (
                          <img
                            src={activeTool.logo}
                            alt=""
                            aria-hidden="true"
                            loading="lazy"
                            className="h-6 w-6 shrink-0 object-contain"
                          />
                        )}
                        <span className="truncate">{section.label}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          ) : (
            <nav aria-label="All tools" className="px-2 py-3">
              {TOOL_DOMAIN_ORDER.map((domain) => (
                <section key={domain} className="mb-5 last:mb-0">
                  <h3 className="type-label mb-1 px-3 uppercase tracking-[0.12em] text-text-tertiary">
                    {TOOL_DOMAIN_LABELS[domain]}
                  </h3>
                  <ul className="space-y-0.5">
                    {TOOLS.filter((tool) => tool.domain === domain).map((tool) => (
                      <li key={tool.slug}>
                        <SheetToolLink
                          tool={tool}
                          isActive={tool.slug === activeTool?.slug}
                        />
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </nav>
          )}
        </BottomSheetContent>
      </BottomSheet>
    </>
  );
};

/** One tool row in the index sheet — logo, name, and whether it is the current page. */
const SheetToolLink: React.FC<{ tool: ToolEntry; isActive: boolean }> = ({ tool, isActive }) => (
  <Link
    to={tool.path}
    aria-current={isActive ? 'page' : undefined}
    className={cn(
      'flex min-h-[48px] items-center gap-3 rounded-xl px-3 py-2 text-sm font-black transition-colors',
      'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent',
      isActive
        ? 'bg-accent/10 text-accent'
        : 'text-text-secondary hover:bg-surface-raised hover:text-text-primary',
    )}
  >
    {tool.logo ? (
      <img
        src={tool.logo}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="h-7 w-7 shrink-0 object-contain"
      />
    ) : (
      <Library className="h-5 w-5 shrink-0" aria-hidden="true" />
    )}
    <span className="min-w-0 flex-1 truncate">{tool.displayName}</span>
    <span className="shrink-0 truncate font-mono text-[11px] font-normal normal-case text-text-muted">
      {tool.summary}
    </span>
  </Link>
);

export default DocsBottomNav;
