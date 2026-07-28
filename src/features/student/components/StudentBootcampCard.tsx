import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  IconPlay,
  IconCheck,
  IconLock,
  IconClock,
  IconDashboard,
} from '@/shared/components/icons';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import hpbCoverImg from '@/assets/bootcamp/hpb-cover.webp';
import Dobia from '@/shared/components/Dobia';

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
  const { t } = useTranslation();
  const { id, title, description, level, duration, priceLabel, img, progress, isEnrolled, isLocked } = data;
  const isComplete = progress === 100;

  const cardClasses = `group relative flex flex-col h-full overflow-hidden rounded-2xl border border-border/30 bg-bg-card transition-all duration-300 ${
    isLocked
      ? 'opacity-40 cursor-default'
      : 'hover:border-accent/30'
  }`;

  const inner = (
    <>
      {/* ── Cover image ─────────────────────────────────────────────── */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={img}
          alt={title}
          width={1200}
          height={675}
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

        {/* Top-left badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
          {level && (
            <span className="px-2 py-0.5 bg-bg/85 backdrop-blur-sm rounded-lg text-[9px] font-black uppercase text-accent tracking-widest border border-accent/20">
              {level}
            </span>
          )}
          {isLocked && (
            <span className="px-2 py-0.5 bg-bg/85 backdrop-blur-sm rounded-lg text-[9px] font-black uppercase text-text-muted tracking-widest flex items-center gap-1 border border-border/30">
              <IconLock size={10} /> {t('student.studentBootcampCard.comingSoon')}
            </span>
          )}
          {isComplete && !isLocked && (
            <span className="px-2 py-0.5 bg-accent text-bg rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
              <IconCheck size={10} /> {t('badge.completed')}
            </span>
          )}
          {isEnrolled && !isComplete && !isLocked && (
            <span className="px-2 py-0.5 bg-accent/20 text-accent rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
              <IconPlay size={8} /> {t('badge.active')}
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

        {/* Dobia progress indicator */}
        {progress > 0 && !isLocked && (
          <div className="absolute bottom-1 right-1">
            <Dobia expression={isComplete ? 'success' : 'scanning'} size="xs" />
          </div>
        )}
      </div>

      {/* ── Card body ───────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2 p-4 sm:p-5 md:p-6 lg:p-7 flex-1">
        <h3 className={`text-sm sm:text-base md:text-lg font-black leading-snug break-words transition-colors ${
          isLocked ? 'text-text-muted' : 'text-text-primary group-hover:text-accent'
        }`}>
          {title}
        </h3>

        {description && (
          <p className="text-xs sm:text-sm text-text-muted line-clamp-3 leading-relaxed flex-1">{description}</p>
        )}

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-auto pt-2">
          {duration && (
            <span className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-text-muted">
              <IconClock size={12} /> {duration}
            </span>
          )}
          {priceLabel && (
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-accent">{priceLabel}</span>
          )}
        </div>

        {/* CTA */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-text-muted">
            <IconDashboard size={12} /> {t('student.studentBootcampCard.phasesCount')}
          </span>
          {isLocked ? (
            <span className="px-3 py-1.5 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest bg-bg-elevated text-text-muted border border-border/30">
              {t('student.studentBootcampCard.comingSoon')}
            </span>
          ) : isEnrolled ? (
            <Link
              to={`/dashboard/bootcamps/${id}`}
              className="px-3 py-1.5 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest bg-accent text-bg transition-all duration-200 group-hover:brightness-110 group-active:scale-95"
            >
              {isComplete ? t('student.studentBootcampCard.reviewCurriculum') : t('student.studentBootcampCard.continueTraining')}
            </Link>
          ) : onEnroll ? (
            <button
              onClick={() => onEnroll(data)}
              className="px-3 py-1.5 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest bg-accent text-bg transition-all duration-200 group-hover:brightness-110 group-active:scale-95"
            >
              {t('student.studentBootcampCard.enrollNow')}
            </button>
          ) : (
            <Link
              to={`/dashboard/bootcamps/${id}`}
              className="px-3 py-1.5 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest bg-accent text-bg transition-all duration-200 group-hover:brightness-110 group-active:scale-95"
            >
              {t('student.studentBootcampCard.enrollNow')}
            </Link>
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
