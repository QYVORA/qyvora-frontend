import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BookOpen, Timer } from 'lucide-react';
import { IconArrowLeft, IconClock, IconCheck } from '@/shared/components/icons';
import type { BootcampPhase, BootcampRoom } from '../../constants/bootcampConfig';

interface RoomHeaderProps {
  phase: BootcampPhase;
  room: BootcampRoom;
  timeSpent: number;
  formatTime: (ms: number) => string;
  isRoomComplete: boolean;
  backUrl?: string;
  backLabel?: string;
}

const RoomHeader: React.FC<RoomHeaderProps> = ({
  phase,
  room,
  timeSpent,
  formatTime,
  isRoomComplete,
  backUrl,
  backLabel = 'Back to Bootcamp',
}) => {
  const { t } = useTranslation();
  return (
    <header className="mb-8">
      {backUrl && (
        <Link
          to={backUrl}
          className="group mb-6 flex items-center gap-2 text-text-muted transition-colors hover:text-text-primary min-h-[44px] min-w-[44px]"
        >
          <IconArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
          <span className="text-[10px] font-black uppercase tracking-widest">{backLabel}</span>
        </Link>
      )}
      <div className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-accent">
        {t('student.bootcampRoom.header.phaseLabel', { codename: phase.codename, phase: phase.title })}
      </div>
      <h1 className="mb-4 text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-tight text-text-primary break-words">
        {room.title}
      </h1>
      <p className="border-l-4 border-accent/50 pl-4 text-sm sm:text-base leading-relaxed text-text-secondary">
        {room.overview}
      </p>
      
      <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted mt-4">
        <div className="flex items-center gap-1.5">
          <IconClock size={16} />
          <span>{t('student.bootcampRoom.header.duration', { min: room.estimatedMinutes })}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <BookOpen className="h-4 w-4" />
          <span>{t('student.bootcampRoom.header.steps', { count: room.steps.length })}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Timer className="h-4 w-4" />
          <span>{t('student.bootcampRoom.header.sessionTime', { time: formatTime(timeSpent) })}</span>
        </div>
      </div>
      
      {isRoomComplete && (
        <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-accent text-bg px-4 py-1.5 text-xs font-black uppercase tracking-widest border border-accent/30">
          <IconCheck size={16} /> {t('student.bootcampRoom.header.completeBadge')}
        </div>
      )}
    </header>
  );
};

export default RoomHeader;
