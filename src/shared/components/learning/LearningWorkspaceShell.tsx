import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Button from '@/shared/components/ui/Button';

export interface WorkspaceStat {
  label: React.ReactNode;
  value: React.ReactNode;
  accent?: boolean;
}

export interface WorkspaceProgress {
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
  children?: React.ReactNode;
}

/**
 * LearningWorkspaceShell — the calm chrome for course lesson, bootcamp room
 * and lab workspaces. Back link, one title, factual stats, optional progress,
 * then full-width step content. Step navigation stays inside the page, not in
 * the layout; floating walkthrough toolbars were removed — the sidebar rail is
 * the single dashboard navigation.
 */
const LearningWorkspaceShell: React.FC<LearningWorkspaceShellProps> = ({
  kicker,
  icon,
  title,
  description,
  backTo,
  backLabel,
  onBack,
  stats,
  progress,
  actions,
  children,
}) => (
  <div className="min-h-dvh w-full bg-canvas">
    <div className="w-full space-y-8 px-3 pb-16 pt-5 md:px-4 md:pb-20 md:pt-8 lg:px-6 lg:pb-24">
      <header className="flex flex-col gap-6">
        {backTo ? (
          <Button to={backTo} variant="ghost" className="-ml-2 w-fit">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {backLabel ?? 'Back'}
          </Button>
        ) : onBack ? (
          <Button variant="ghost" onClick={onBack} className="-ml-2 w-fit">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {backLabel ?? 'Back'}
          </Button>
        ) : null}
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
              <h1 className="type-h1 font-black uppercase tracking-tight text-text-primary">
                {title}
              </h1>
            </div>
            {description && <p className="mt-3 type-body max-w-prose">{description}</p>}
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

      {children}
    </div>
  </div>
);

export default LearningWorkspaceShell;