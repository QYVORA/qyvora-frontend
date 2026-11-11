import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from '@/shared/components/ui/Button';

export interface WorkspaceStat {
  label: React.ReactNode;
  value: React.ReactNode;
  accent?: boolean;
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
  /** Hero breadcrumb; defaults to a link back to `backTo`. */
  breadcrumb?: React.ReactNode;
  /** Router back destination used by the default breadcrumb. */
  backTo?: string;
  backLabel?: React.ReactNode;
  /** Callback back link (for non-route exits, e.g. exiting a lab scenario). */
  onBack?: () => void;
  /** Factual metadata (difficulty, time, CP…) shown under the header. */
  stats?: WorkspaceStat[];
  progress?: WorkspaceProgress;
  /** Right-aligned primary/contextual action slot. */
  actions?: React.ReactNode;
  /** Oversized identity artwork rendered as a decorative hero background. */
  heroArt?: React.ReactNode;
  children?: React.ReactNode;
}

/**
 * LearningWorkspaceShell — shared learning hero and content column.
 *
 * The shell deliberately has no learning sidebar, outline rail or floating
 * step navigation. The dashboard topbar is the only global navigation; tasks
 * live in one centered column so courses, bootcamp rooms and labs read as the
 * same product surface.
 */
const LearningWorkspaceShell: React.FC<LearningWorkspaceShellProps> = ({
  kicker,
  icon,
  title,
  description,
  breadcrumb,
  backTo,
  backLabel,
  onBack,
  stats,
  progress,
  actions,
  heroArt,
  children,
}) => {
  const defaultBreadcrumb =
    backTo && backLabel ? (
      <Link
        to={backTo}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-tertiary transition-colors duration-150 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        {backLabel}
      </Link>
    ) : null;

  return (
    <div className="min-h-dvh w-full bg-canvas">
      <div className="w-full px-[var(--app-gutter,12px)] pb-16 pt-6 md:pb-20 md:pt-8 lg:pb-24">
        <header className="relative isolate overflow-hidden rounded-2xl border border-border-subtle bg-surface px-5 py-6 sm:px-6 sm:py-7 md:px-8">
          <div className="relative z-10 flex flex-col gap-6">
          {(breadcrumb || defaultBreadcrumb || onBack) && (
            <div className="flex flex-wrap items-center gap-3">
              {onBack ? (
                <Button variant="ghost" onClick={onBack} className="-ml-2 w-fit">
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  {backLabel ?? 'Back'}
                </Button>
              ) : (
                (breadcrumb ?? defaultBreadcrumb)
              )}
            </div>
          )}

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0 max-w-2xl">
              {kicker && (
                <p className="mb-2 text-[12px] font-medium uppercase tracking-[0.12em] text-accent">{kicker}</p>
              )}
              <div className="flex items-center gap-4">
                {icon && (
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-surface-raised text-accent">
                    {icon}
                  </span>
                )}
                <h1 className="text-2xl font-medium leading-tight tracking-tight text-text-primary sm:text-3xl md:text-4xl">
                  {title}
                </h1>
              </div>
              {description && (
                <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary sm:text-base">{description}</p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-4">
              {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
              {heroArt && (
                <div aria-hidden="true" className="pointer-events-none hidden h-40 w-40 shrink-0 sm:block">
                  {heroArt}
                </div>
              )}
            </div>
          </div>

          {(stats || progress) && (
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border-subtle pt-4">
              {stats?.map((stat) => (
                <span
                  key={String(stat.label)}
                  className={`type-meta ${stat.accent ? 'text-accent' : 'text-text-tertiary'}`}
                >
                  <span className="text-sm font-medium tabular-nums text-text-primary">{stat.value}</span>{' '}
                  {stat.label}
                </span>
              ))}
              {progress && (
                <div className="flex min-w-[180px] flex-1 items-center gap-3">
                  <div
                    className="h-1 flex-1 overflow-hidden rounded-full bg-surface-raised"
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
                  <span className="type-meta text-sm font-medium tabular-nums text-text-primary">
                    {progress.label}
                  </span>
                </div>
              )}
            </div>
          )}
          </div>
        </header>

        <div className="mt-8 w-full md:mt-10">{children}</div>
      </div>
    </div>
  );
};

export default LearningWorkspaceShell;
