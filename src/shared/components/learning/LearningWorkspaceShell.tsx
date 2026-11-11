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
      <div className="mx-auto w-full max-w-[1240px] px-3 pb-16 pt-6 sm:px-6 md:pb-20 md:pt-8 lg:px-8 lg:pb-24">
        <header
          className={
            heroArt
              ? 'relative isolate overflow-hidden rounded-2xl border border-accent/20 bg-surface px-5 py-6 sm:px-6 sm:py-7 md:px-8 md:py-8'
              : 'flex flex-col gap-6'
          }
        >
          {heroArt && (
            <>
              <div
                aria-hidden="true"
                className="learning-hero-wash pointer-events-none absolute inset-0"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 top-1/2 h-72 w-72 -translate-y-1/2 rotate-6 opacity-20 sm:-right-16 sm:h-80 sm:w-80 md:h-96 md:w-96 lg:right-2 lg:h-[26rem] lg:w-[26rem] lg:opacity-30"
              >
                {heroArt}
              </div>
            </>
          )}
          <div className={heroArt ? 'relative z-10 flex flex-col gap-6' : 'contents'}>
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
                <h1
                  className={`font-display text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:text-4xl lg:text-[42px] ${
                    heroArt ? 'learning-hero-title' : 'text-text-primary'
                  }`}
                >
                  {title}
                </h1>
              </div>
              {description && (
                <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary sm:text-base sm:leading-7 md:text-lg">{description}</p>
              )}
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
          </div>
        </header>

        <div className="mt-8 w-full md:mt-10">{children}</div>
      </div>
    </div>
  );
};

export default LearningWorkspaceShell;
