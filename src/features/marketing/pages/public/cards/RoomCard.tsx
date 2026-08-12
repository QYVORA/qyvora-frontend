import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Clock } from 'lucide-react';
import { IconTerminal } from '@/shared/components/icons';
import type { ViewMode } from '@/shared/components/card-collection';
import type { BootcampRoom } from '@/features/student/constants/bootcampConfig';

interface RoomCardProps {
  room: BootcampRoom;
  roomIndex: number;
  view: ViewMode;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, roomIndex, view }) => {
  const { t } = useTranslation();

  if (view === 'expanded') {
    return (
      <div className="group/card flex flex-col gap-2 rounded-2xl border border-border/30 bg-bg-card p-4 md:p-5 transition-all duration-300 hover:border-accent/30 text-left">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-accent/10 border border-accent/20">
              <IconTerminal className="w-4 h-4 text-accent" />
            </div>
            <div className="min-w-0">
              <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-accent/10 text-[9px] font-black uppercase tracking-widest text-accent border border-accent/20">
                Room {roomIndex + 1}
              </span>
              <h4 className="text-sm sm:text-base md:text-lg font-black text-text-primary group-hover/card:text-accent transition-colors leading-snug truncate">
                {room.title}
              </h4>
            </div>
          </div>
          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-text-muted shrink-0 flex items-center gap-1.5">
            <Clock className="w-3 h-3" /> {room.estimatedMinutes} min
          </span>
        </div>

        <p className="text-xs sm:text-sm text-text-muted leading-relaxed line-clamp-2">
          {room.overview}
        </p>

        <div className="flex items-center justify-end pt-2 border-t border-border/10">
          <Link
            to="/register"
            className="px-3 py-1.5 rounded-lg text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-widest bg-accent text-on-accent transition-all duration-200 group-hover/card:brightness-110 group-active:scale-95"
          >
            {t('landing.bootcamp.startPhase')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="group/card relative h-72 sm:h-64 lg:h-60 rounded-2xl border border-border/30 bg-bg-card p-3 md:p-5 transition-all duration-300 hover:border-accent/30 flex flex-col text-left">
      <div className="flex items-center justify-between mb-2">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-accent/10 border border-accent/20">
          <IconTerminal className="w-4 h-4 text-accent" />
        </div>
        <span className="px-2 py-0.5 rounded-lg bg-accent/10 text-[9px] font-black uppercase tracking-widest text-accent border border-accent/20">
          Room {roomIndex + 1}
        </span>
      </div>

      <h4 className="text-sm sm:text-base md:text-lg lg:text-xl font-black text-text-primary group-hover/card:text-accent transition-colors leading-snug break-words mb-1">
        {room.title}
      </h4>

      <p className="text-xs sm:text-sm md:text-base text-text-muted leading-relaxed line-clamp-3 break-words flex-1 mb-2">
        {room.overview}
      </p>

      <div className="flex items-center justify-between mt-auto">
        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-text-muted flex items-center gap-1.5">
          <Clock className="w-3 h-3" /> {room.estimatedMinutes} min
        </span>
        <Link
          to="/register"
          className="px-3 py-1.5 rounded-lg text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-widest bg-accent text-on-accent transition-all duration-200 group-hover/card:brightness-110 group-active:scale-95"
        >
          {t('landing.bootcamp.startPhase')}
        </Link>
      </div>
    </div>
  );
};

export default RoomCard;
