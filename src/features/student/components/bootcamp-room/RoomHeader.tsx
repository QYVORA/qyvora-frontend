import React from 'react';
import { Clock, BookOpen, Timer, CheckCircle2 } from 'lucide-react';
import type { BootcampPhase, BootcampRoom } from '../../constants/bootcampConfig';

interface RoomHeaderProps {
  phase: BootcampPhase;
  room: BootcampRoom;
  timeSpent: number;
  formatTime: (ms: number) => string;
  isRoomComplete: boolean;
}

const RoomHeader: React.FC<RoomHeaderProps> = ({
  phase,
  room,
  timeSpent,
  formatTime,
  isRoomComplete,
}) => {
  return (
    <div className="mb-8">
      <div className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-accent">
        {phase.codename} — {phase.title}
      </div>
      <h1 className="mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-tight text-text-primary break-words">
        {room.title}
      </h1>
      <p className="border-l-4 border-accent/50 pl-4 text-sm sm:text-base leading-relaxed text-text-secondary">
        {room.overview}
      </p>
      
      <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted mt-4">
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          <span>{room.estimatedMinutes} min</span>
        </div>
        <div className="flex items-center gap-1.5">
          <BookOpen className="h-4 w-4" />
          <span>{room.steps.length} steps</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Timer className="h-4 w-4" />
          <span>Session: {formatTime(timeSpent)}</span>
        </div>
      </div>
      
      {isRoomComplete && (
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent text-bg px-4 py-1.5 text-xs font-black uppercase tracking-widest shadow-lg shadow-accent/20">
          <CheckCircle2 className="h-4 w-4" /> Room Complete
        </div>
      )}
    </div>
  );
};

export default RoomHeader;
