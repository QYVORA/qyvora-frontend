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
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest shrink-0 border ${diffClass}`}>
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

  const containerClasses = [
    'group/card relative rounded-2xl border transition-[border-color,box-shadow,background-color] duration-[var(--dur-base)] ease-[var(--ease-smooth)] flex flex-col text-left',
    active ? 'border-accent shadow-[0_0_16px_var(--color-accent-dim)]' : 'card-accent',
    'bg-bg-card',
    isExpanded ? 'p-4 md:p-5 gap-2' : 'h-full min-h-[220px] p-4 md:p-5 justify-between',
    muted ? 'opacity-60 cursor-default' : 'hover:border-accent/80 hover:shadow-[var(--card-shimmer)]',
    className,
  ].join(' ');

  const cardStyle = { boxShadow: 'var(--card-shimmer)' };

  // ── Card Header (Badges / Visual Slot) ───────────────────────────────────
  const renderVisualSlot = () => {
    if (badge) return badge;
    if (id && type === 'lab') {
      return <LabBadge labId={id} accentColor={accentColor} className="w-11 h-11 shrink-0" />;
    }
    if (icon) {
      return (
        <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
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
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest shrink-0 border badge-accent">
          {badgeText}
        </span>
      );
    }
    return null;
  };

  // ── Action Button Render ──────────────────────────────────────────────────
  const renderAction = () => {
    const defaultLabel = type === 'lab' ? 'Launch' : type === 'course' ? 'Start Course' : 'View';
    const label = actionLabel || defaultLabel;

    const actionContent = (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-widest bg-accent text-on-accent transition-[filter,transform] duration-[var(--dur-base)] group-hover/card:brightness-110 group-active:scale-95 ${
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
                  <span className="px-2 py-0.5 bg-accent text-on-accent rounded-lg text-[9px] font-black uppercase tracking-widest">
                    Owned
                  </span>
                )}
                {isFree && !owned && (
                  <span className="px-2 py-0.5 bg-accent text-on-accent rounded-lg text-[9px] font-black uppercase tracking-widest">
                    Free
                  </span>
                )}
                {tags?.slice(0, 2).map((tag) => (
                  <span key={tag} className="text-[9px] font-black uppercase tracking-widest text-text-muted">
                    #{tag}
                  </span>
                ))}
              </div>
              <h3 className="text-sm sm:text-base md:text-lg font-black text-text-primary group-hover/card:text-accent transition-colors leading-snug truncate">
                {title}
              </h3>
            </div>
            {renderVisualSlot()}
          </div>
        </div>

        {description && (
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed line-clamp-2 font-mono">
            {description}
          </p>
        )}

        {typeof progress === 'number' && (
          <div className="w-full bg-bg-elevated h-1.5 rounded-full overflow-hidden my-1">
            <div className="bg-accent h-full rounded-full transition-[width] duration-[var(--dur-slow)] ease-[var(--ease-smooth)]" style={{ width: `${progress}%` }} />
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-border/20">
          <div className="flex items-center gap-3 text-[10px] font-mono text-text-muted">
            {cpReward !== undefined && (
              <span className="font-black uppercase tracking-widest text-accent">
                {cpReward} CP
              </span>
            )}
            {duration && <span>{duration}</span>}
            {lessonsCount && <span>{lessonsCount} lessons</span>}
            {modulesCount && <span>{modulesCount} modules</span>}
            {price !== undefined && !isFree && (
              <span className="font-black text-text-primary font-mono">{price}</span>
            )}
          </div>
          <div className="shrink-0">{renderAction()}</div>
        </div>
      </>
    );

    if (linkTarget && !external) {
      return (
        <Link to={linkTarget} className={containerClasses} style={cardStyle}>
          {expandedContent}
        </Link>
      );
    }
    if (linkTarget && external) {
      return (
        <a href={linkTarget} target="_blank" rel="noopener noreferrer" className={containerClasses} style={cardStyle}>
          {expandedContent}
        </a>
      );
    }
    if (onClick) {
      return (
        <div role="button" tabIndex={0} onClick={onClick} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()} className={containerClasses} style={cardStyle}>
          {expandedContent}
        </div>
      );
    }
    return <div className={containerClasses} style={cardStyle}>{expandedContent}</div>;
  }

  // ── STANDARD (GRID) VIEW ─────────────────────────────────────────────────
  const gridContent = (
    <>
      <div>
        {/* Cover Image slot if present */}
        {image && (
          <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden mb-3 border border-border/40 bg-accent/5">
            <img
              src={image}
              alt={imageAlt || title}
              width={640}
              height={360}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 ease-[var(--ease-smooth)] group-hover/card:scale-105"
            />
            {owned && (
              <span className="absolute top-2 right-2 px-2 py-0.5 bg-accent text-on-accent rounded-lg text-[8px] font-black uppercase tracking-widest shadow-sm">
                Owned
              </span>
            )}
            {isFree && !owned && (
              <span className="absolute top-2 right-2 px-2 py-0.5 bg-accent text-on-accent rounded-lg text-[8px] font-black uppercase tracking-widest shadow-sm">
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
              <span className="px-2 py-0.5 bg-accent text-on-accent rounded-lg text-[8px] font-black uppercase tracking-widest">
                Owned
              </span>
            )}
            {!image && isFree && !owned && (
              <span className="px-2 py-0.5 bg-accent text-on-accent rounded-lg text-[8px] font-black uppercase tracking-widest">
                Free
              </span>
            )}
          </div>
          {!image && renderVisualSlot()}
        </div>

        {/* Title */}
        <h3 className="text-sm sm:text-base md:text-lg font-black text-text-primary group-hover/card:text-accent transition-colors leading-snug break-words mb-1">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed line-clamp-3 mb-2 font-mono">
            {description}
          </p>
        )}

        {/* Progress Bar */}
        {typeof progress === 'number' && (
          <div className="w-full bg-bg-elevated h-1.5 rounded-full overflow-hidden my-2">
            <div className="bg-accent h-full rounded-full transition-[width] duration-[var(--dur-slow)] ease-[var(--ease-smooth)]" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>

      {/* Bottom Footer Row with Metadata and Action CTA */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/20">
        <div className="flex items-center gap-2 text-[9px] sm:text-[10px] font-mono text-text-muted">
          {cpReward !== undefined && (
            <span className="font-black uppercase tracking-widest text-accent">
              {cpReward} CP
            </span>
          )}
          {duration && <span>{duration}</span>}
          {lessonsCount && <span>{lessonsCount} lessons</span>}
          {modulesCount && <span>{modulesCount} modules</span>}
          {price !== undefined && !isFree && (
            <span className="font-black text-text-primary">{price}</span>
          )}
        </div>
        <div className="shrink-0">{renderAction()}</div>
      </div>
    </>
  );

  if (linkTarget && !external) {
    return (
      <Link to={linkTarget} className={containerClasses} style={cardStyle}>
        {gridContent}
      </Link>
    );
  }
  if (linkTarget && external) {
    return (
      <a href={linkTarget} target="_blank" rel="noopener noreferrer" className={containerClasses} style={cardStyle}>
        {gridContent}
      </a>
    );
  }
  if (onClick) {
    return (
      <div role="button" tabIndex={0} onClick={onClick} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()} className={containerClasses} style={cardStyle}>
        {gridContent}
      </div>
    );
  }
  return <div className={containerClasses} style={cardStyle}>{gridContent}</div>;
};

export default LearningCard;
