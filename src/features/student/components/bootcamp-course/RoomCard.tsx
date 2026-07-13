import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Undo2, Trash2 } from 'lucide-react';
import { IconCheck, IconLock, IconArrowRight } from '@/shared/components/icons';
import hpbCoverImg from '@/assets/bootcamp/hpb-cover.webp';

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

  const [annotateMode, setAnnotateMode] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDoodle, setHasDoodle] = useState(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const doodleStorageKey = `card_doodle_${bootcampId}_${configPhase?.id || ''}_${configRoom?.id || ''}`;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(doodleStorageKey);
      if (saved && canvasRef.current) {
        const img = new Image();
        img.onload = () => {
          const ctx = canvasRef.current?.getContext('2d');
          if (ctx) { ctx.drawImage(img, 0, 0); setHasDoodle(true); }
        };
        img.src = saved;
      }
    } catch {}
  }, [annotateMode, doodleStorageKey]);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!annotateMode) return;
    e.preventDefault();
    const pos = getPos(e);
    if (!pos) return;
    setIsDrawing(true);
    lastPointRef.current = pos;
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !annotateMode) return;
    e.preventDefault();
    const pos = getPos(e);
    if (!pos || !lastPointRef.current) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = '#06B66F';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPointRef.current = pos;
  };

  const endDraw = () => {
    setIsDrawing(false);
    lastPointRef.current = null;
    setHasDoodle(true);
    if (canvasRef.current) {
      try { localStorage.setItem(doodleStorageKey, canvasRef.current.toDataURL()); } catch {}
    }
  };

  const clearDoodle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      setHasDoodle(false);
      try { localStorage.removeItem(doodleStorageKey); } catch {}
    }
  };

  const toggleAnnotate = (e: React.MouseEvent) => {
    if (isRoomLocked || roomDone) return;
    e.stopPropagation();
    e.preventDefault();
    setAnnotateMode((p) => !p);
  };

  const inner = (
    <div
      className={`group relative flex w-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-bg-card transition-all duration-300 ${
        isRoomLocked
          ? 'opacity-40 cursor-not-allowed pointer-events-none'
          : 'hover:border-accent/30 hover:scale-[1.01]'
      }`}
    >
      <div className="relative aspect-video overflow-hidden rounded-t-2xl shadow-sm">
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
              el.src = hpbCoverImg;
            }
          }}
        />
        <canvas
          ref={canvasRef}
          width={640}
          height={360}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
          className={`absolute inset-0 w-full h-full transition-opacity ${annotateMode ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          style={{ touchAction: annotateMode ? 'none' : 'auto' }}
        />

        {roomDone && (
          <div className="room-completed-overlay absolute inset-0 flex flex-col items-center justify-center gap-2 bg-bg/60 backdrop-blur-[2px] rounded-t-2xl">
            <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center shadow-lg">
              <IconCheck size={24} className="text-bg" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-accent">Completed</span>
          </div>
        )}

        {/* Room number badge */}
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
              <IconLock size={10} />
            </div>
          </div>
        )}

        {/* Annotation controls */}
        {!isRoomLocked && !roomDone && (
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5">
            <button
              onClick={toggleAnnotate}
              className={`rounded-lg px-2 py-1 text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-1 ${
                annotateMode
                  ? 'bg-accent text-bg'
                  : 'bg-bg/80 backdrop-blur-md text-text-muted hover:text-accent border border-border/30'
              }`}
            >
              <Pencil className="h-2.5 w-2.5" />
              Doodle
            </button>
            {annotateMode && hasDoodle && (
              <button
                onClick={clearDoodle}
                className="rounded-lg px-2 py-1 bg-red-500/20 text-red-400 text-[9px] font-black uppercase tracking-widest flex items-center gap-1 hover:bg-red-500/30 transition-all"
              >
                <Trash2 className="h-2.5 w-2.5" />
                Clear
              </button>
            )}
          </div>
        )}

        {configRoom && !roomDone && (
          <div className="absolute bottom-2.5 right-2.5 rounded-lg bg-bg/80 backdrop-blur-md px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-text-muted shadow-sm">
            {configRoom.steps.length} steps
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col pt-5 px-6 pb-5">
        <h3 className={`mb-1 text-base font-black leading-snug transition-colors ${
          isRoomLocked ? 'text-text-muted'
            : roomDone ? 'text-accent'
              : 'text-text-primary group-hover:text-accent'
        }`}>
          {configRoom?.title || room.title || `Room ${roomIdx + 1}`}
        </h3>
        {(configRoom?.overview || room.overview) && (
          <p className="line-clamp-2 text-[11px] leading-relaxed text-text-muted/70 font-mono">
            {configRoom?.overview || room.overview}
          </p>
        )}
        {roomDone ? (
          <div className="mt-auto pt-3 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-accent/60">
            Review room <IconArrowRight size={12} />
          </div>
        ) : !isRoomLocked && (
          <div className="mt-auto pt-3 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-accent opacity-0 transition-all duration-300 transform translate-x-[-4px] group-hover:opacity-100 group-hover:translate-x-0">
            Enter room <IconArrowRight size={12} />
          </div>
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
