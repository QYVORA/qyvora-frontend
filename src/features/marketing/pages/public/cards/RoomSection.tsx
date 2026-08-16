import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Clock } from 'lucide-react';
import { IconTerminal, IconArrowRight } from '@/shared/components/icons';
import type { BootcampRoom } from '@/features/student/constants/bootcampConfig';

interface RoomSectionProps {
  room: BootcampRoom;
  roomIndex: number;
}

const RoomSection: React.FC<RoomSectionProps> = ({ room, roomIndex }) => {
  const { t } = useTranslation();

  return (
    <article className="relative w-full px-3 md:px-4 lg:px-6 pt-24 md:pt-28 lg:pt-32 pb-6 md:pb-8 lg:pb-10">
      <div className="flex flex-col justify-center">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
              <IconTerminal className="w-5 h-5 md:w-6 md:h-6 text-accent" />
            </span>
            <div className="min-w-0">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-accent">
                Room {roomIndex + 1}
              </span>
              <h3 className="text-lg md:text-2xl lg:text-3xl font-black text-text-primary tracking-tight leading-tight break-words">
                {room.title}
              </h3>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-text-muted shrink-0">
            <Clock className="w-3.5 h-3.5" /> {room.estimatedMinutes} min
          </span>
        </div>

        <p className="text-xs md:text-sm text-text-muted leading-relaxed mt-4 max-w-3xl">
          {room.overview}
        </p>

        {room.steps.length > 0 && (
          <div className="mt-6 md:mt-8">
            <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-text-muted mb-3">
              {t('landing.curriculum.stepCount', { count: room.steps.length })}
            </h4>
            <ol className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
              {room.steps.map((step, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-border/20 bg-bg-elevated/40 px-3 py-2.5 md:px-4 md:py-3"
                >
                  <span className="w-5 h-5 md:w-6 md:h-6 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-[9px] md:text-[10px] font-mono font-black text-accent shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-xs md:text-sm text-text-secondary leading-relaxed pt-0.5">
                    {step.title}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className="flex items-center justify-between gap-4 mt-6 md:mt-8 pt-5 border-t border-border/20">
          <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">
            {room.steps.length} {room.steps.length === 1 ? 'step' : 'steps'} · {room.estimatedMinutes} min
          </span>
          <Link
            to="/register"
            className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-[10px]"
          >
            {t('landing.bootcamp.startPhase')} <IconArrowRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default RoomSection;
