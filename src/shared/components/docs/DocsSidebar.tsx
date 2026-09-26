import React, { useMemo, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Github, Library, PanelLeftClose, PanelLeftOpen, Search } from 'lucide-react';
import { Logo, QyvoraMark } from '@/shared/components/brand';
import Input from '@/shared/components/ui/Input';
import { Tooltip } from '@/shared/components/ui/Tooltip';
import { cn } from '@/shared/utils/cn';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';
import { useDocScrollSpy } from '@/shared/hooks/useDocScrollSpy';
import {
  TOOLS,
  TOOL_DOMAIN_LABELS,
  TOOL_DOMAIN_ORDER,
  getToolByPath,
  type ToolDomain,
  type ToolEntry,
} from '@/features/marketing/data/tools/registry';
import { getToolDoc } from '@/features/marketing/data/tools';

const rowBase =
  'relative flex min-h-[48px] items-center rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent';
const rowIdle = 'text-text-secondary hover:bg-surface-raised hover:text-text-primary';
const rowActive = 'bg-accent/10 text-accent';

const ActiveBar: React.FC = () => (
  <span
    aria-hidden="true"
    className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-accent"
  />
);

/**
 * Tool mark. In the expanded rail the name sits beside it, so the mark stays
 * small; in the collapsed rail the mark is the entire label, so it grows to
 * fill the 48px row and stays legible at a glance.
 */
const ToolMark: React.FC<{ tool: ToolEntry; size?: 'sm' | 'lg' }> = ({ tool, size = 'sm' }) => {
  const dimension = size === 'lg' ? 'h-7 w-7' : 'h-[18px] w-[18px]';

  return tool.logo ? (
    <img
      src={tool.logo}
      alt=""
      aria-hidden="true"
      loading="lazy"
      className={`${dimension} shrink-0 object-contain`}
    />
  ) : (
    <Library className={`${dimension} shrink-0`} aria-hidden="true" />
  );
};

interface DocsSidebarProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

/**
 * DocsSidebar — the documentation rail.
 *
 * Mirrors the dashboard sidebar so the two read as the same product: a fixed
 * left rail, a brand header, grouped navigation, a collapsed 76px state, and
 * the same active-row treatment. It replaces the public navbar on documentation
 * routes, so the article column owns the full viewport height.
 *
 * The tool list is the primary navigation. The active tool expands in place to
 * reveal its own sections, which doubles as the "on this page" index — one
 * navigation axis instead of a rail plus a separate table of contents.
 *
 * Collapse state is owned by DocsShell so the content column's left padding can
 * track the rail exactly.
 */
const DocsSidebar: React.FC<DocsSidebarProps> = ({ collapsed, onToggleCollapsed }) => {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();
  const [query, setQuery] = useState('');

  const activeTool = getToolByPath(location.pathname);
  const activeDoc = activeTool ? getToolDoc(activeTool.slug) : undefined;

  const sectionIds = useMemo(
    () => (activeDoc?.sections ?? []).map((section) => section.id).join(','),
    [activeDoc],
  );
  const activeSection = useDocScrollSpy(sectionIds);

  const needle = query.trim().toLowerCase();
  const matching = useMemo(() => {
    if (!needle) return null;
    return TOOLS.filter(
      (tool) =>
        tool.name.includes(needle) ||
        tool.summary.toLowerCase().includes(needle) ||
        tool.domain.includes(needle),
    );
  }, [needle]);

  const groups = useMemo(() => {
    if (matching) {
      return TOOL_DOMAIN_ORDER.map((domain) => ({
        domain,
        tools: matching.filter((tool) => tool.domain === domain),
      })).filter((group) => group.tools.length > 0);
    }
    return TOOL_DOMAIN_ORDER.map((domain) => ({
      domain,
      tools: TOOLS.filter((tool) => tool.domain === domain),
    }));
  }, [matching]);

  const total = groups.reduce((count, group) => count + group.tools.length, 0);

  const jumpTo = (id: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    const element = document.getElementById(id);
    if (!element) return;
    event.preventDefault();
    element.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });
    // Keep the URL shareable without triggering a router navigation.
    window.history.replaceState(null, '', `#${id}`);
  };

  return (
    <aside
      aria-label="Documentation"
      className={cn(
        'fixed inset-y-0 left-0 z-[90] hidden flex-col border-r border-border-subtle bg-canvas',
        'transition-[width] duration-[var(--dur-base)] ease-[var(--ease-smooth)] lg:flex',
        collapsed ? 'w-[76px]' : 'w-[264px]',
      )}
    >
      {/* Brand */}
      <div
        className={cn(
          'flex h-20 shrink-0 items-center border-b border-border-subtle',
          collapsed ? 'justify-center px-0' : 'px-5',
        )}
      >
        <Link
          to="/"
          aria-label="QYVORA home"
          className="rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          {collapsed ? <QyvoraMark className="h-7 w-7" /> : <Logo size="sm" />}
        </Link>
      </div>

      {/* Filter */}
      {!collapsed && (
        <div className="px-3 pt-3">
          <Input
            icon={<Search className="h-4 w-4" aria-hidden="true" />}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter tools"
            aria-label="Filter tools"
            className="min-h-[40px] py-2 text-xs"
          />
          <p role="status" aria-live="polite" className="sr-only">
            {total} tools shown
          </p>
        </div>
      )}

      {/* Tool list */}
      <nav
        aria-label="Tools"
        className="custom-scrollbar flex-1 overflow-y-auto px-3 py-3"
      >
        {total === 0 && !collapsed && (
          <p className="px-3 py-2 text-xs leading-relaxed text-text-muted">
            No tool matches “{query.trim()}”.
          </p>
        )}

        {groups.map(({ domain, tools }) => (
          <section key={domain} className="mb-5 last:mb-0">
            {!collapsed && (
              <h3 className="type-label mb-1 px-3 uppercase tracking-[0.12em] text-text-tertiary">
                {TOOL_DOMAIN_LABELS[domain as ToolDomain]}
              </h3>
            )}
            <ul className="space-y-0.5">
              {tools.map((tool) => {
                const isActive = tool.slug === activeTool?.slug;
                const sections = isActive ? (activeDoc?.sections ?? []) : [];

                return (
                  <li key={tool.slug}>
                    {collapsed ? (
                      <Tooltip content={tool.displayName} side="right">
                        <NavLink
                          to={tool.path}
                          aria-label={tool.displayName}
                          aria-current={isActive ? 'page' : undefined}
                          className={cn(
                            rowBase,
                            'h-12 w-12 justify-center px-0',
                            isActive ? rowActive : rowIdle,
                          )}
                        >
                          {isActive && <ActiveBar />}
                          <ToolMark tool={tool} size="lg" />
                        </NavLink>
                      </Tooltip>
                    ) : (
                      <NavLink
                        to={tool.path}
                        aria-current={isActive ? 'page' : undefined}
                        className={cn(
                          rowBase,
                          'w-full gap-2.5 px-3 py-2',
                          isActive ? rowActive : rowIdle,
                        )}
                      >
                        {isActive && <ActiveBar />}
                        <ToolMark tool={tool} />
                        <span className="min-w-0 flex-1 truncate text-sm font-black">
                          {tool.displayName}
                        </span>
                      </NavLink>
                    )}

                    {isActive && !collapsed && !needle && sections.length > 0 && (
                      <ul className="ml-5 mt-0.5 space-y-0.5 border-l border-border-subtle pl-3">
                        {sections.map((section) => {
                          const isCurrent = activeSection === section.id;
                          return (
                            <li key={section.id}>
                              <a
                                href={`#${section.id}`}
                                onClick={jumpTo(section.id)}
                                aria-current={isCurrent ? 'true' : undefined}
                                className={cn(
                                  'flex min-h-[36px] items-center rounded-lg px-2.5 text-xs transition-colors',
                                  'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent',
                                  isCurrent
                                    ? 'font-black text-accent'
                                    : 'text-text-muted hover:bg-surface-raised hover:text-text-primary',
                                )}
                              >
                                <span className="truncate">{section.label}</span>
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </nav>

      {/* Footer */}
      <div className="shrink-0 border-t border-border-subtle px-3 py-3">
        {activeTool && (
          <>
            {collapsed ? (
              <Tooltip content={`${activeTool.displayName} repository`} side="right">
                <a
                  href={activeTool.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${activeTool.displayName} repository on GitHub`}
                  className={cn(
                    'flex min-h-[48px] items-center rounded-xl text-text-secondary transition-colors',
                    'hover:bg-surface-raised hover:text-text-primary',
                    'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent',
                    collapsed ? 'h-12 w-12 justify-center' : 'w-full gap-3 px-3',
                  )}
                >
                  <Github className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
                  {!collapsed && <span className="truncate text-sm">Repository</span>}
                </a>
              </Tooltip>
            ) : (
              <a
                href={activeTool.github}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'flex min-h-[48px] w-full items-center gap-3 rounded-xl px-3 text-text-secondary transition-colors',
                  'hover:bg-surface-raised hover:text-text-primary',
                  'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent',
                )}
              >
                <Github className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate font-mono text-xs">
                  {activeTool.repo}
                </span>
              </a>
            )}
          </>
        )}

        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-expanded={!collapsed}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={cn(
            'flex min-h-[48px] w-full items-center rounded-xl text-sm text-text-secondary transition-colors',
            'hover:bg-surface-raised hover:text-text-primary',
            'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent',
            collapsed ? 'justify-center' : 'gap-3 px-3',
          )}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
          ) : (
            <>
              <PanelLeftClose className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};

export default DocsSidebar;
