import React from 'react';
import { Link } from 'react-router-dom';
import { IconCheck, IconLock, IconArrowRight } from '@/shared/components/icons';
import HpbAvatar, { type HpbVariant } from '@/shared/components/HpbAvatar';

interface RoomCardProps {
  bootcampId: string;
  room: any;
  roomIdx: number;
  configPhase: any;
  configRoom: any;
}

const RoomCard: React.FC<RoomCardProps> = ({
  bootcampId,
  room,
  roomIdx,
  configPhase,
  configRoom,
}) => {
  const isRoomLocked = room.locked;
  const roomDone = Boolean(room.completed);
  const roomPath = configPhase && configRoom
    ? `/dashboard/bootcamps/${bootcampId}/phases/${configPhase.id}/rooms/${configRoom.id}`
    : null;

  const inner = (
    <div
      className={`group/card relative aspect-square rounded-2xl border border-border-subtle bg-surface p-3 md:p-5 transition-[transform,box-shadow,border-color,opacity] duration-[var(--dur-base)] ease-[var(--ease-smooth)] flex flex-col text-left ${
        isRoomLocked
          ? 'opacity-40 cursor-not-allowed pointer-events-none'
          : 'hover:border-accent/40'
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="relative w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-accent/10 border border-accent/20 overflow-hidden">
          {roomDone ? (
            <IconCheck size={16} className="text-accent" />
          ) : (
            <span className="text-xs font-black text-accent">{String(roomIdx + 1).padStart(2, '0')}</span>
          )}
        </div>

        {isRoomLocked && (
          <span className="px-2 py-0.5 rounded-lg text-xs font-black uppercase tracking-widest bg-surface-raised text-text-muted border border-border-subtle flex items-center gap-1">
            <IconLock size={10} /> Locked
          </span>
        )}
      </div>

      <h3 className={`text-sm sm:text-base md:text-lg lg:text-xl font-black leading-snug break-words transition-colors mb-1 ${
        isRoomLocked ? 'text-text-muted'
          : roomDone ? 'text-accent'
            : 'text-text-primary group-hover/card:text-accent'
      }`}>
        {configRoom?.title || room.title || `Room ${roomIdx + 1}`}
      </h3>

      <div className="flex-1 min-h-0 mb-2 flex flex-col">
        {(configRoom?.overview || room.overview) && (
          <p className="text-xs sm:text-sm text-text-muted line-clamp-3 leading-relaxed">
            {configRoom?.overview || room.overview}
          </p>
        )}
        <div className="flex-1 min-h-[64px] w-full flex items-center justify-center">
          <HpbAvatar
            variant={configPhase?.id as HpbVariant}
            className="h-full w-auto max-h-full max-w-full"
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto pt-2">
        {roomDone ? (
          <span className="flex items-center gap-1.5 text-xs sm:text-xs font-black uppercase tracking-widest text-accent">
            Review room <IconArrowRight size={12} />
          </span>
        ) : !isRoomLocked ? (
          <span className="flex items-center gap-1.5 text-xs sm:text-xs font-black uppercase tracking-widest text-accent">
            Enter room <IconArrowRight size={12} />
          </span>
        ) : (
          <span />
        )}
        {configRoom && !roomDone && (
          <span className="text-xs sm:text-xs font-black uppercase tracking-widest text-text-muted">
            {configRoom.steps.length} steps
          </span>
        )}
      </div>
    </div>
  );

  if (isRoomLocked) return inner;

  return (
    <Link to={roomPath || '#'} className="block">
      {inner}
    </Link>
  );
};

export default RoomCard;
