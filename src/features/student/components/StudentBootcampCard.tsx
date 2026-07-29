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
import { Briefcase } from 'lucide-react';
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

const StudentBootcampCard: React.FC<Props> = ({ data, index = 0, onEnroll, onLocked }) => {
  const { t } = useTranslation();
  const { id, title, description, level, duration, priceLabel, progress, isEnrolled, isLocked } = data;
  const isComplete = progress === 100;

  const cardClasses = `relative aspect-square rounded-2xl border border-border/30 bg-bg-card p-3 md:p-5 transition-all duration-300 flex flex-col text-left ${
    isLocked
      ? 'opacity-40 cursor-default'
      : 'hover:border-accent/30'
  }`;

  const BtnBase = 'px-3 py-1.5 rounded-lg text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-widest bg-accent text-bg transition-all duration-200 group-hover/card:brightness-110 group-active:scale-95';

  const inner = (
    <>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-accent/10 border border-accent/20">
          <Briefcase className="w-4 h-4 text-accent" />
        </div>
        {level && (
          <span className="px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border border-accent/20 bg-accent/10 text-accent">
            {level}
          </span>
        )}
        {isLocked && (
          <span className="px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest bg-bg-elevated text-text-muted border border-border/30 flex items-center gap-1">
            <IconLock size={10} /> {t('student.studentBootcampCard.comingSoon')}
          </span>
        )}
        {isComplete && !isLocked && (
          <span className="px-2 py-0.5 rounded-lg bg-accent text-bg text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
            <IconCheck size={10} /> {t('badge.completed')}
          </span>
        )}
        {isEnrolled && !isComplete && !isLocked && (
          <span className="px-2 py-0.5 rounded-lg bg-accent/20 text-accent text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
            <IconPlay size={8} /> {t('badge.active')}
          </span>
        )}
      </div>

      <h3 className={`text-sm sm:text-base md:text-lg lg:text-xl font-black leading-snug break-words transition-colors mb-1 ${
        isLocked ? 'text-text-muted' : 'text-text-primary group-hover/card:text-accent'
      }`}>
        {title}
      </h3>

      {description && (
        <p className="text-xs sm:text-sm text-text-muted line-clamp-3 leading-relaxed flex-1 mb-2">{description}</p>
      )}

      {/* Progress bar */}
      {progress > 0 && !isLocked && (
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[8px] font-mono text-text-muted">{progress}%</span>
          </div>
          <div className="h-1.5 bg-bg-elevated rounded-full overflow-hidden">
            <div className="h-full bg-accent transition-all duration-700" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-auto pt-2 border-t border-border/20">
        {duration && (
          <span className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-text-muted">
            <IconClock size={12} /> {duration}
          </span>
        )}
        {priceLabel && (
          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-accent">{priceLabel}</span>
        )}
        <div className="ml-auto">
          {isLocked ? (
            <span className="px-3 py-1.5 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest bg-bg-elevated text-text-muted border border-border/30">
              {t('student.studentBootcampCard.comingSoon')}
            </span>
          ) : isEnrolled ? (
            <Link
              to={`/dashboard/bootcamps/${id}`}
              className={BtnBase}
            >
              {isComplete ? t('student.studentBootcampCard.reviewCurriculum') : t('student.studentBootcampCard.continueTraining')}
            </Link>
          ) : onEnroll ? (
            <button
              onClick={() => onEnroll(data)}
              className={BtnBase}
            >
              {t('student.studentBootcampCard.enrollNow')}
            </button>
          ) : (
            <Link
              to={`/dashboard/bootcamps/${id}`}
              className={BtnBase}
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
