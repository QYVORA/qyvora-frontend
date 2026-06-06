import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Lock, Github, ArrowRight } from 'lucide-react';

interface RoomCardProps {
  bootcampId: string;
  room: any;
  roomIdx: number;
  configPhase: any;
  configRoom: any;
  roomImg: string;
}

const RoomCard: React.FC<RoomCardProps> = ({
  bootcampId,
  room,
  roomIdx,
  configPhase,
  configRoom,
  roomImg,
}) => {
  const isRoomLocked = room.locked;
  const roomDone = Boolean(room.completed);
  const roomPath = configPhase && configRoom
    ? `/dashboard/bootcamps/${bootcampId}/phases/${configPhase.id}/rooms/${configRoom.id}`
    : null;

  return (
    <Link
      to={!isRoomLocked && roomPath ? roomPath : '#'}
      onClick={isRoomLocked ? (e) => e.preventDefault() : undefined}
      className={`group relative flex w-full flex-col overflow-hidden rounded-2xl border-2 bg-bg transition-colors duration-200 ${
        isRoomLocked
          ? 'border-border opacity-45 cursor-not-allowed pointer-events-none'
          : roomDone
          ? 'hover:border-accent/60'
          : 'hover:border-accent/40'
      }`}
      style={{ borderColor: configPhase?.color ? `${configPhase.color}40` : 'var(--color-border)' }}
    >
      <div className="relative aspect-video overflow-hidden rounded-t-2xl">
        <img
          src={roomImg}
          alt={room.title}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isRoomLocked ? 'grayscale brightness-50'
              : roomDone ? 'brightness-50'
                : 'group-hover:scale-[1.03]'
          }`}
          onError={(e) => {
            const el = e.currentTarget;
            if (!el.dataset.fallbackApplied) {
              el.dataset.fallbackApplied = '1';
              el.src = '/assets/bootcamp/hpb-cover.webp';
            }
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden dark:block dark:bg-black/10"
        />
        {roomDone && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-bg/60 backdrop-blur-[2px] rounded-t-2xl">
            <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center shadow-lg">
              <CheckCircle2 className="h-6 w-6 text-bg" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-accent">Completed</span>
          </div>
        )}
        {!roomDone && !isRoomLocked && (
          <div className="absolute top-2.5 left-2.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg border border-accent/25 bg-bg/80 backdrop-blur-sm font-mono text-[10px] font-black text-accent">
              {String(roomIdx + 1).padStart(2, '0')}
            </div>
          </div>
        )}
        {isRoomLocked && (
          <div className="absolute top-2.5 left-2.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg border border-border bg-bg/80 font-mono text-[10px] font-black text-text-muted">
              <Lock className="h-2.5 w-2.5" />
            </div>
          </div>
        )}
        {configRoom && !roomDone && (
          <div className="absolute bottom-2 right-2.5 rounded-md bg-bg/80 backdrop-blur-sm px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-text-muted border border-border/60">
            {configRoom.steps.length} steps
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className={`mb-1.5 text-sm font-black leading-snug transition-colors ${
          isRoomLocked ? 'text-text-muted'
            : roomDone ? 'text-accent'
              : 'text-text-primary group-hover:text-accent'
        }`}>
          {configRoom?.title || room.title || `Room ${roomIdx + 1}`}
        </h3>
        {(configRoom?.overview || room.overview) && (
          <p className="line-clamp-2 text-[11px] leading-relaxed text-text-muted">
            {configRoom?.overview || room.overview}
          </p>
        )}
        {roomDone ? (
          <div className="mt-3 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-accent/60">
            Review room <ArrowRight className="h-3 w-3" />
          </div>
        ) : !isRoomLocked && (
          <div className="mt-3 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-accent opacity-0 transition-opacity group-hover:opacity-100">
            Enter room <ArrowRight className="h-3 w-3" />
          </div>
        )}
      </div>
    </Link>
  );
};

export default RoomCard;
