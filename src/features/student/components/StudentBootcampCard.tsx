import React from 'react';
import { Link } from 'react-router-dom';
import { Play, CheckCircle2, Lock, ArrowRight, Clock, Layers } from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';

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

const FALLBACK_IMG = '/assets/bootcamp/hpb-cover.png';

const StudentBootcampCard: React.FC<Props> = ({ data, index = 0, onEnroll, onLocked }) => {
  const { id, title, description, level, duration, priceLabel, img, progress, isEnrolled, isLocked } = data;
  const isComplete = progress === 100;

  const cardClasses = `group relative flex flex-col overflow-hidden rounded-2xl border-2 bg-bg-card transition-colors duration-200 ${
    isLocked
      ? 'border-border opacity-70 cursor-default'
      : isEnrolled
      ? 'border-accent/25 hover:border-accent/55'
      : 'border-border hover:border-accent/40'
  }`;

  const inner = (
    <>
      {/* ── Cover image ─────────────────────────────────────────────── */}
      <div className="relative aspect-video overflow-hidden">
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

        {/* Gradient overlay */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)' }}
        />

        {/* Top-left badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
          {level && (
            <span className="px-2 py-0.5 bg-bg/85 backdrop-blur-sm border border-border/80 rounded text-[9px] font-black uppercase text-accent tracking-widest">
              {level}
            </span>
          )}
          {isLocked && (
            <span className="px-2 py-0.5 bg-black/75 border border-border rounded text-[9px] font-black uppercase text-text-muted tracking-widest flex items-center gap-1">
              <Lock className="w-2.5 h-2.5" /> Coming soon
            </span>
          )}
          {isComplete && !isLocked && (
            <span className="px-2 py-0.5 bg-accent text-bg rounded text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
              <CheckCircle2 className="w-2.5 h-2.5" /> Complete
            </span>
          )}
          {isEnrolled && !isComplete && !isLocked && (
            <span className="px-2 py-0.5 bg-accent/20 border border-accent/35 text-accent rounded text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
              <Play className="w-2 h-2 fill-current" /> Active
            </span>
          )}
        </div>

        {/* Progress bar at bottom of image */}
        {progress > 0 && !isLocked && (
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-bg/40">
            <div
              className="h-full bg-accent transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* ── Card body ───────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className={`mb-1.5 text-base font-black leading-snug transition-colors md:text-lg ${
          isLocked ? 'text-text-muted' : 'text-text-primary group-hover:text-accent'
        }`}>
          {title}
        </h3>

        {description && (
          <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-text-muted">{description}</p>
        )}

        <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-bold uppercase text-text-muted">
          {duration && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 opacity-60" /> {duration}
            </span>
          )}
          {duration && priceLabel && <span className="opacity-30">·</span>}
          {priceLabel && <span className="text-accent">{priceLabel}</span>}
          <span className="flex items-center gap-1 ml-auto opacity-60">
            <Layers className="w-3 h-3" /> 5 phases
          </span>
        </div>

        {/* CTA */}
        <div className="mt-auto space-y-2">
          {isLocked ? (
            <button
              className="btn-secondary flex w-full items-center justify-center gap-2 py-2.5 text-sm font-black uppercase opacity-80"
            >
              <Lock className="h-3.5 w-3.5" /> Coming soon
            </button>
          ) : isEnrolled ? (
            <Link
              to={`/bootcamps/${id}`}
              className="btn-primary flex w-full items-center justify-center gap-2 py-2.5 text-sm font-black uppercase"
            >
              {isComplete ? (
                <><CheckCircle2 className="h-3.5 w-3.5" /> Review curriculum</>
              ) : (
                <><Play className="h-3.5 w-3.5 fill-current" /> Continue training</>
              )}
            </Link>
          ) : (
            onEnroll ? (
              <button
                onClick={() => onEnroll(data)}
                className="btn-primary flex w-full items-center justify-center gap-2 py-2.5 text-sm font-black uppercase"
              >
                Enroll now <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <Link
                to={`/bootcamps/${id}`}
                className="btn-primary flex w-full items-center justify-center gap-2 py-2.5 text-sm font-black uppercase"
              >
                Enroll now <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )
          )}
        </div>
      </div>
    </>
  );

  return (
    <ScrollReveal delay={index * 0.07}>
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
