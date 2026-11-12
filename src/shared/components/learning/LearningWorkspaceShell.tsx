import React from 'react';
import LearningHero from './LearningHero';

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
  /** Tiny uppercase eyebrow, e.g. a Lab category label. */
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
  /** Factual metadata (difficulty, time, steps…) shown under the header. */
  stats?: WorkspaceStat[];
  progress?: WorkspaceProgress;
  /** Right-aligned primary/contextual action slot. */
  actions?: React.ReactNode;
  /** Crisp badge artwork shown beside the title (the slanted art is derived from it). */
  heroArt?: React.ReactNode;
  /** Official badge artwork used for the slanted hero background. */
  heroArtSrc?: string;
  children?: React.ReactNode;
}

/**
 * LearningWorkspaceShell — shared full-bleed learning hero and content column.
 *
 * The shell deliberately has no learning sidebar, outline rail or floating
 * step navigation. The dashboard topbar is the only global navigation; tasks
 * live in one centered column so content Labs, bootcamp rooms and Labs read as
 * the same product surface.
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
  heroArtSrc,
  children,
}) => {
  const pct = progress
    ? Math.max(0, Math.min(100, Number.isFinite(progress.value) ? progress.value : 0))
    : 0;

  return (
    <div className="min-h-dvh w-full bg-canvas">
      <LearningHero
        kicker={kicker}
        icon={icon ?? heroArt}
        title={title}
        description={description}
        breadcrumb={breadcrumb}
        backTo={backTo}
        backLabel={backLabel}
        onBack={onBack}
        stats={stats}
        actions={actions}
        heroArtSrc={heroArtSrc}
      />

      {progress && (
        <div className="w-full border-b border-border-subtle bg-surface/70">
          <div className="flex items-center justify-start gap-3 px-[var(--app-gutter,12px)] py-3">
            <span className="type-meta shrink-0 text-text-secondary">{progress.label}</span>
            <div
              className="h-1 w-full max-w-md overflow-hidden rounded-none bg-surface-raised"
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={String(progress.label)}
            >
              <div
                className="h-full rounded-none bg-accent transition-[width] duration-[var(--dur-base)] ease-[var(--ease-smooth)] motion-reduce:transition-none"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="type-meta shrink-0 tabular-nums text-text-primary">{Math.round(pct)}%</span>
          </div>
        </div>
      )}

      <div className="w-full px-[var(--app-gutter,12px)] pb-16 pt-8 md:pb-20 lg:pb-24">
        {children}
      </div>
    </div>
  );
};

export default LearningWorkspaceShell;
