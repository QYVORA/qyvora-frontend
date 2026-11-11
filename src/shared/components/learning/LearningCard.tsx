import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Loader2 } from 'lucide-react';
import { IconArrowRight } from '@/shared/components/icons';
import LabBadge from '@/shared/components/LabBadge';
import type { ViewMode } from '@/shared/components/card-collection';

export type LearningCardType = 'lab' | 'course' | 'bootcamp' | 'lesson' | 'product' | 'resource';

export interface LearningCardProps {
  id?: string;
  type?: LearningCardType;
  title: string;
  description?: string;
  to?: string;
  href?: string;
  external?: boolean;
  onClick?: () => void;
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | string;
  badge?: React.ReactNode;
  badgeText?: string;
  accentColor?: string;
  cpReward?: string | number;
  duration?: string;
  lessonsCount?: number | string;
  modulesCount?: number | string;
  progress?: number;
  image?: string;
  imageAlt?: string;
  icon?: React.ReactNode;
  tags?: string[];
  actionLabel?: string;
  actionIcon?: React.ReactNode;
  /** Set false for informational cards with no destination (the action pill would be dead). */
  showAction?: boolean;
  isActionDisabled?: boolean;
  isActionLoading?: boolean;
  onActionClick?: (e: React.MouseEvent) => void;
  owned?: boolean;
  isFree?: boolean;
  price?: string | number;
  view?: ViewMode;
  className?: string;
  muted?: boolean;
  active?: boolean;
}

const DIFFICULTY_CLASSES: Record<string, string> = {
  beginner: 'badge-beginner',
  intermediate: 'badge-intermediate',
  advanced: 'badge-advanced',
};

export const DifficultyBadge: React.FC<{ difficulty: string }> = ({ difficulty }) => {
  const baseDiff = difficulty.split('-')[0].toLowerCase();
  const diffClass = DIFFICULTY_CLASSES[baseDiff] || 'badge-accent';
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[12px] font-medium shrink-0 border ${diffClass}`}>
      <Star className="h-2.5 w-2.5" /> {baseDiff}
    </span>
  );
};

export const LearningCard: React.FC<LearningCardProps> = ({
  id,
  type = 'lab',
  title,
  description,
  to,
  href,
  external,
  onClick,
  difficulty,
  badge,
  badgeText,
  accentColor,
  cpReward,
  duration,
  lessonsCount,
  modulesCount,
  progress,
  image,
  imageAlt = '',
  icon,
  tags,
  actionLabel,
  actionIcon,
  showAction = true,
  isActionDisabled = false,
  isActionLoading = false,
  onActionClick,
  owned,
  isFree,
  price,
  view = 'grid',
  className = '',
  muted = false,
  active = false,
}) => {
  const linkTarget = to || href;
  const isExpanded = view === 'expanded';

  /** Footer renders only when it has something to say — no empty rule, no dead pill. */
  const hasMeta =
    cpReward !== undefined ||
    Boolean(duration) ||
    Boolean(lessonsCount) ||
    Boolean(modulesCount) ||
    (price !== undefined && !isFree);

  const containerClasses = [
    'group/card relative rounded-2xl border border-border-subtle bg-surface transition-colors duration-[var(--dur-base)] ease-[var(--ease-smooth)] flex flex-col text-left',
    active ? 'border-accent/60' : '',
    isExpanded ? 'p-4 md:p-5 gap-2' : 'h-full min-h-[220px] p-4 md:p-5 justify-between',
    muted ? 'opacity-60 cursor-default' : 'hover:border-accent/40',
    className,
  ].join(' ');

  // ── Card Header (Badges / Visual Slot) ───────────────────────────────────
  const renderVisualSlot = () => {
    if (badge) return badge;
    if (id && type === 'lab') {
      return <LabBadge labId={id} accentColor={accentColor} className="h-16 w-16 shrink-0 sm:h-20 sm:w-20" />;
    }
    if (icon) {
      return (
        <div className="w-14 h-14 flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-surface-raised text-accent">
          {icon}
        </div>
      );
    }
    return null;
  };

  const renderDifficulty = () => {
    if (difficulty) {
      return <DifficultyBadge difficulty={difficulty} />;
    }
    if (badgeText) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[12px] font-medium shrink-0 border badge-accent">
          {badgeText}
        </span>
      );
    }
    return null;
  };

  // ── Action Button Render ──────────────────────────────────────────────────
  const renderAction = () => {
    if (!showAction) return null;
    const defaultLabel = type === 'lab' ? 'Launch' : type === 'course' ? 'Start Lab' : 'View';
    const label = actionLabel || defaultLabel;

    const actionContent = (
      <span
        className={`inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-[13px] font-medium text-on-accent transition-colors hover:bg-accent/90 ${
          isActionDisabled ? 'opacity-50 pointer-events-none' : ''
        }`}
      >
        {isActionLoading ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <>
            {label} {actionIcon || <IconArrowRight size={12} className="inline-block" />}
          </>
        )}
      </span>
    );

    if (onActionClick) {
      return (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onActionClick(e);
          }}
          disabled={isActionDisabled || isActionLoading}
          className="shrink-0"
        >
          {actionContent}
        </button>
      );
    }

    return actionContent;
  };

  // ── EXPANDED (LIST) VIEW ─────────────────────────────────────────────────
  if (isExpanded) {
    const expandedContent = (
      <>
        <div className="relative z-10">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                {renderDifficulty()}
                {owned && (
                  <span className="rounded-md bg-accent/10 px-2 py-0.5 text-[12px] font-medium text-accent">
                    Owned
                  </span>
                )}
                {isFree && !owned && (
                  <span className="rounded-md bg-accent/10 px-2 py-0.5 text-[12px] font-medium text-accent">
                    Free
                  </span>
                )}
                {tags?.slice(0, 2).map((tag) => (
                  <span key={tag} className="text-[12px] font-medium text-text-muted">
                    #{tag}
                  </span>
                ))}
              </div>
              <h3 className="text-base font-medium text-text-primary group-hover/card:text-accent transition-colors leading-snug truncate">
                {title}
              </h3>
            </div>
            {renderVisualSlot()}
          </div>
        </div>

        {description && (
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed text-text-secondary line-clamp-2">
            {description}
          </p>
        )}

        {typeof progress === 'number' && (
          <div className="w-full bg-surface-raised h-1 rounded-full overflow-hidden my-1">
            <div className="bg-accent h-full rounded-full transition-[width] duration-[var(--dur-slow)] ease-[var(--ease-smooth)]" style={{ width: `${progress}%` }} />
          </div>
        )}

        {showAction || hasMeta ? (
          <div className="flex items-center justify-between pt-2 border-t border-border-subtle">
            <div className="flex items-center gap-3 text-[12px] tabular-nums text-text-muted">
              {cpReward !== undefined && (
                <span className="font-medium text-accent">
                  {cpReward} CP
                </span>
              )}
              {duration && <span>{duration}</span>}
              {lessonsCount && <span>{lessonsCount} lessons</span>}
              {modulesCount && <span>{modulesCount} modules</span>}
              {price !== undefined && !isFree && (
                <span className="font-medium tabular-nums text-text-primary">{price}</span>
              )}
            </div>
            <div className="shrink-0">{renderAction()}</div>
          </div>
        ) : null}
      </>
    );

    if (linkTarget && !external) {
      return (
        <Link to={linkTarget} className={containerClasses}>
          {expandedContent}
        </Link>
      );
    }
    if (linkTarget && external) {
      return (
        <a href={linkTarget} target="_blank" rel="noopener noreferrer" className={containerClasses}>
          {expandedContent}
        </a>
      );
    }
    if (onClick) {
      return (
        <div role="button" tabIndex={0} onClick={onClick} aria-label={title} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()} className={containerClasses}>
          {expandedContent}
        </div>
      );
    }
    return <div className={containerClasses}>{expandedContent}</div>;
  }

  // ── STANDARD (GRID) VIEW ─────────────────────────────────────────────────
  const gridContent = (
    <>
      <div>
        {/* Cover Image slot if present */}
        {image && (
          <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden mb-3 border border-border-subtle bg-surface-raised">
            <img
              src={image}
              alt={imageAlt || title}
              width={640}
              height={360}
              loading="lazy"
              className="w-full h-full object-cover"
            />
            {owned && (
              <span className="absolute top-2 right-2 rounded-md bg-accent/10 px-2 py-0.5 text-[12px] font-medium text-accent">
                Owned
              </span>
            )}
            {isFree && !owned && (
              <span className="absolute top-2 right-2 rounded-md bg-accent/10 px-2 py-0.5 text-[12px] font-medium text-accent">
                Free
              </span>
            )}
          </div>
        )}

        {/* Top Header Row with Badges and Icon */}
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2 mb-2">
          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
            {renderDifficulty()}
            {!image && owned && (
              <span className="rounded-md bg-accent/10 px-2 py-0.5 text-[12px] font-medium text-accent">
                Owned
              </span>
            )}
            {!image && isFree && !owned && (
              <span className="rounded-md bg-accent/10 px-2 py-0.5 text-[12px] font-medium text-accent">
                Free
              </span>
            )}
          </div>
          {!image && renderVisualSlot()}
        </div>

        {/* Title */}
        <h3 className="text-base font-medium text-text-primary group-hover/card:text-accent transition-colors leading-snug break-words mb-1">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed text-text-secondary line-clamp-3 mb-2">
            {description}
          </p>
        )}

        {/* Progress Bar */}
        {typeof progress === 'number' && (
          <div className="w-full bg-surface-raised h-1 rounded-full overflow-hidden my-2">
            <div className="bg-accent h-full rounded-full transition-[width] duration-[var(--dur-slow)] ease-[var(--ease-smooth)]" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>

      {/* Bottom Footer Row with Metadata and Action CTA */}
      {showAction || hasMeta ? (
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border-subtle">
          <div className="flex items-center gap-2 text-[12px] tabular-nums text-text-muted">
            {cpReward !== undefined && (
              <span className="font-medium text-accent">
                {cpReward} CP
              </span>
            )}
            {duration && <span>{duration}</span>}
            {lessonsCount && <span>{lessonsCount} lessons</span>}
            {modulesCount && <span>{modulesCount} modules</span>}
            {price !== undefined && !isFree && (
              <span className="font-medium tabular-nums text-text-primary">{price}</span>
            )}
          </div>
          <div className="shrink-0">{renderAction()}</div>
        </div>
      ) : null}
    </>
  );

  if (linkTarget && !external) {
    return (
      <Link to={linkTarget} className={containerClasses}>
        {gridContent}
      </Link>
    );
  }
  if (linkTarget && external) {
    return (
      <a href={linkTarget} target="_blank" rel="noopener noreferrer" className={containerClasses}>
        {gridContent}
      </a>
    );
  }
  if (onClick) {
    return (
      <div role="button" tabIndex={0} onClick={onClick} aria-label={title} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()} className={containerClasses}>
        {gridContent}
      </div>
    );
  }
  return <div className={containerClasses}>{gridContent}</div>;
};

export default LearningCard;
