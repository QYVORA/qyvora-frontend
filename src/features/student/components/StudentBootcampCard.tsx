import React from 'react';
import { Link } from 'react-router-dom';
import {
  IconPlay,
  IconCheck,
  IconLock,
  IconArrowRight,
  IconClock,
  IconDashboard,
} from '@/shared/components/icons';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import hpbCoverImg from '@/assets/bootcamp/hpb-cover.webp';

export interface StudentBootcampCardData {
  id: string;
  title: string;
  description?: string;
  level?: string;
  duration?: string;
  priceLabel?: string;
  img: string;
  progress: number;        // 0–100
  isEnrolled?: boolean;
  isLocked?: boolean;
}

interface Props {
  data: StudentBootcampCardData;
  index?: number;
  /** Called when the user clicks "Enroll now" — if omitted the button links directly */
  onEnroll?: (data: StudentBootcampCardData) => void;
  /** Called when the user clicks a locked card */
  onLocked?: (data: StudentBootcampCardData) => void;
}

const FALLBACK_IMG = hpbCoverImg;

const StudentBootcampCard: React.FC<Props> = ({ data, index = 0, onEnroll, onLocked }) => {
  const { id, title, description, level, duration, priceLabel, img, progress, isEnrolled, isLocked } = data;
  const isComplete = progress === 100;

  const cardClasses = `group relative flex flex-col h-full overflow-hidden rounded-2xl border border-border/30 bg-bg-card transition-all duration-300 ${
    isLocked
      ? 'opacity-40 cursor-default'
      : 'hover:border-accent/30 hover:scale-[1.01]'
  }`;

  const inner = (
    <>
      {/* ── Cover image ─────────────────────────────────────────────── */}
      <div className="relative aspect-video overflow-hidden rounded-t-2xl shadow-sm">
        <img
          src={img}
          alt={title}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isLocked ? 'grayscale brightness-50' : 'group-hover:scale-[1.03]'
          }`}
          onError={(e) => {
            const el = e.currentTarget;
            if (!el.dataset.fallbackApplied) {
              el.dataset.fallbackApplied = '1';
              el.src = FALLBACK_IMG;
            }
          }}
        />

        {/* Subtle overlay instead of gradient */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden dark:block dark:bg-black/10"
        />

        {/* Top-left badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
          {level && (
            <span className="px-2 py-0.5 bg-bg/85 backdrop-blur-sm rounded text-[9px] font-black uppercase text-accent tracking-widest shadow-sm">
              {level}
            </span>
          )}
          {isLocked && (
            <span className="px-2 py-0.5 bg-black/75 rounded text-[9px] font-black uppercase text-text-muted tracking-widest flex items-center gap-1 shadow-sm">
              <IconLock size={10} /> Coming soon
            </span>
          )}
          {isComplete && !isLocked && (
            <span className="px-2 py-0.5 bg-accent text-bg rounded text-[9px] font-black uppercase tracking-widest flex items-center gap-1 shadow-md">
              <IconCheck size={10} /> Complete
            </span>
          )}
          {isEnrolled && !isComplete && !isLocked && (
            <span className="px-2 py-0.5 bg-accent/20 text-accent rounded text-[9px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm">
              <IconPlay size={8} /> Active
            </span>
          )}
        </div>

        {/* Progress bar at bottom of image */}
        {progress > 0 && !isLocked && (
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-bg/40">
            <div
              className="h-full bg-accent transition-all duration-700 shadow-[0_0_8px_var(--color-accent)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* ── Card body ───────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col pt-6 px-6 pb-6">
        <h3 className={`mb-1.5 text-lg font-black leading-snug break-words transition-colors ${
          isLocked ? 'text-text-muted' : 'text-text-primary group-hover:text-accent'
        }`}>
          {title}
        </h3>

        {description && (
          <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-text-muted/70 font-mono">{description}</p>
        )}

        <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-black uppercase text-text-muted/60 tracking-widest">
          {duration && (
            <span className="flex items-center gap-1.5">
              <IconClock size={14} className="opacity-60" /> {duration}
            </span>
          )}
          {duration && priceLabel && <span className="opacity-30">·</span>}
          {priceLabel && <span className="text-accent">{priceLabel}</span>}
          <span className="flex items-center gap-1.5 ml-auto">
            <IconDashboard size={14} className="opacity-60" /> 5 phases
          </span>
        </div>

        {/* CTA */}
        <div className="mt-auto space-y-2.5">
          {isLocked ? (
            <button
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-bg-elevated text-text-muted text-xs font-black uppercase tracking-widest opacity-60 cursor-default"
            >
              <IconLock size={14} /> Coming soon
            </button>
          ) : isEnrolled ? (
            <Link
              to={`/dashboard/bootcamps/${id}`}
              className="btn-primary w-full flex items-center justify-center gap-3 !text-xs !py-3.5"
            >
              {isComplete ? (
                <><IconCheck size={16} /> Review curriculum</>
              ) : (
                <><IconPlay size={16} /> Continue training</>
              )}
            </Link>
          ) : (
            onEnroll ? (
              <button
                onClick={() => onEnroll(data)}
                className="btn-primary w-full flex items-center justify-center gap-3 !text-xs !py-3.5"
              >
                Enroll now <IconArrowRight size={16} />
              </button>
            ) : (
              <Link
                to={`/dashboard/bootcamps/${id}`}
                className="btn-primary w-full flex items-center justify-center gap-3 !text-xs !py-3.5"
              >
                Enroll now <IconArrowRight size={16} />
              </Link>
            )
          )}
        </div>
      </div>
    </>
  );

  return (
    <ScrollReveal delay={index * 0.07} className="h-full">
      {isLocked && onLocked ? (
        <div
          className={cardClasses}
          style={{ boxShadow: 'var(--card-shimmer)' }}
          onClick={() => onLocked(data)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onLocked(data)}
        >
          {inner}
        </div>
      ) : (
        <div className={cardClasses} style={{ boxShadow: 'var(--card-shimmer)' }}>
          {inner}
        </div>
      )}
    </ScrollReveal>
  );
};

export default StudentBootcampCard;
