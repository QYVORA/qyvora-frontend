import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Button from '@/shared/components/ui/Button';
import { cn } from '@/shared/utils/cn';
import { LearningPathDiagram } from './LearningPathDiagram';

export interface WorkspaceStat {
  label: React.ReactNode;
  value: React.ReactNode;
  accent?: boolean;
}

export interface LearningOutlineItem {
  id: string;
  label: React.ReactNode;
}

interface WorkspaceProgress {
  /** 0–100 completion percent. */
  value: number;
  label: React.ReactNode;
}

interface LearningWorkspaceShellProps {
  /** Tiny uppercase eyebrow, e.g. a course/category label. */
  kicker?: React.ReactNode;
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Router back destination (or use `onBack` for a callback). */
  backTo?: string;
  backLabel?: React.ReactNode;
  /** Callback back link (for non-route exits, e.g. exiting a lab scenario). */
  onBack?: () => void;
  /** Factual metadata (rooms, time, CP…) shown under the header. */
  stats?: WorkspaceStat[];
  progress?: WorkspaceProgress;
  /** Right-aligned contextual action slot (connections, status chips). */
  actions?: React.ReactNode;
  /** Sticky in-page section navigation for continuous learning pages. */
  outline?: LearningOutlineItem[];
  children?: React.ReactNode;
}

/**
 * LearningWorkspaceShell — the calm chrome for course lesson, bootcamp room
 * and lab workspaces. One title, factual stats, optional progress, then
 * full-width step content. Exit navigation belongs to the topbar BackButton
 * (this shell no longer renders its own route-based back link); an `onBack`
 * callback is kept for scenarios that need a non-route exit. Step navigation
 * stays inside the page, not in the layout; floating walkthrough toolbars were
 * removed — the sidebar rail is the single dashboard navigation.
 */
const LearningWorkspaceShell: React.FC<LearningWorkspaceShellProps> = ({
  kicker,
  icon,
  title,
  description,
  onBack,
  backLabel,
  stats,
  progress,
  actions,
  outline,
  children,
}) => {
  const outlineItems = outline ?? [];
  const outlineIdsKey = outlineItems.map((item) => item.id).join('|');
  const [activeOutlineId, setActiveOutlineId] = useState('');

  useEffect(() => {
    const ids = outlineIdsKey ? outlineIdsKey.split('|') : [];
    if (ids.length === 0) {
      setActiveOutlineId('');
      return;
    }

    setActiveOutlineId((current) => (ids.includes(current) ? current : ids[0]));

    if (typeof IntersectionObserver === 'undefined') return;
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveOutlineId(visible[0].target.id);
      },
      { rootMargin: '-12% 0px -68% 0px', threshold: [0, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [outlineIdsKey]);

  return (
    <div className="min-h-dvh w-full bg-canvas">
      <div className="w-full space-y-8 px-3 pb-16 pt-5 md:px-4 md:pb-20 md:pt-8 lg:px-6 lg:pb-24">
        <header className="flex flex-col gap-6">
          {onBack && (
            <Button variant="ghost" onClick={onBack} className="-ml-2 w-fit">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              {backLabel ?? 'Back'}
            </Button>
          )}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              {kicker && (
                <p className="mb-2 type-label uppercase tracking-[0.12em] text-accent">{kicker}</p>
              )}
              <div className="flex items-center gap-4">
                {icon && (
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-border-subtle bg-surface-raised text-accent">
                    {icon}
                  </span>
                )}
                {/* Same scale as PageHeader so a learning workspace and a listing
                    page read as one title system across Courses / Labs / Bootcamps. */}
                <h1 className="text-3xl font-black uppercase tracking-tight text-text-primary md:text-4xl lg:text-5xl">
                  {title}
                </h1>
              </div>
              {description && <p className="mt-3 max-w-2xl text-lg text-text-secondary md:text-xl">{description}</p>}
            </div>
            {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
          </div>

          {(stats || progress) && (
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border-subtle pt-4">
              {stats?.map((stat) => (
                <span
                  key={String(stat.label)}
                  className={`type-meta ${stat.accent ? 'text-accent' : 'text-text-tertiary'}`}
                >
                  <span className="font-mono text-sm font-black text-text-primary">{stat.value}</span>{' '}
                  {stat.label}
                </span>
              ))}
              {progress && (
                <div className="flex min-w-[180px] flex-1 items-center gap-3">
                  <div
                    className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-raised"
                    role="progressbar"
                    aria-valuenow={progress.value}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={String(progress.label)}
                  >
                    <div
                      className="h-full rounded-full bg-accent transition-[width] duration-700 ease-[var(--ease-smooth)]"
                      style={{ width: `${Math.max(0, Math.min(100, progress.value))}%` }}
                    />
                  </div>
                  <span className="type-meta font-mono text-sm font-black text-text-primary">
                    {progress.label}
                  </span>
                </div>
              )}
            </div>
          )}
        </header>

        {outlineItems.length > 0 ? (
          <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-start lg:gap-10">
            <aside className="order-1 lg:sticky lg:top-24 lg:order-2">
              <nav aria-label="Learning sections">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="type-label uppercase tracking-[0.12em] text-text-muted">Sections</p>
                  <span className="rounded-md border border-border/30 bg-surface-raised px-2 py-0.5 font-mono text-xs font-black text-text-tertiary">
                    {outlineItems.length}
                  </span>
                </div>
                <ol className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
                  {outlineItems.map((item, index) => {
                    const isActive = item.id === activeOutlineId;
                    return (
                      <li key={item.id} className="min-w-[13rem] shrink-0 lg:min-w-0 lg:shrink">
                        <a
                          href={`#${item.id}`}
                          aria-current={isActive ? 'location' : undefined}
                          className={cn(
                            'group flex items-start gap-3 rounded-xl border px-3 py-2.5 transition-colors',
                            isActive
                              ? 'border-accent/40 bg-accent/10 text-accent'
                              : 'border-transparent text-text-secondary hover:border-border/30 hover:bg-surface-raised hover:text-accent',
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className={cn(
                              'mt-0.5 shrink-0 font-mono text-xs font-black',
                              isActive ? 'text-accent' : 'text-text-muted',
                            )}
                          >
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span className="min-w-0 text-sm font-bold leading-snug lg:text-base">
                            {item.label}
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ol>
              </nav>
            </aside>
            <div className="order-2 min-w-0 lg:order-1">
              <LearningPathDiagram
                items={outlineItems}
                activeId={activeOutlineId}
                className="mb-8 md:mb-10"
              />
              {children}
            </div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default LearningWorkspaceShell;
