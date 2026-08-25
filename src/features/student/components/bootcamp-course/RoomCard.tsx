import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Undo2, Trash2 } from 'lucide-react';
import { IconCheck, IconLock, IconArrowRight } from '@/shared/components/icons';
import HpbAvatar, { type HpbVariant } from '@/shared/components/HpbAvatar';
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
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim() || '#06B66F';
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
      className={`group/card relative aspect-square rounded-2xl border border-border/50 bg-bg-card p-3 md:p-5 transition-all duration-300 flex flex-col text-left ${
        isRoomLocked
          ? 'opacity-40 cursor-not-allowed pointer-events-none'
          : 'hover:border-accent/50'
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="relative w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-accent/10 border border-accent/20 overflow-hidden">
          {roomDone ? (
            <IconCheck size={16} className="text-accent" />
          ) : (
            <span className="text-[9px] font-black text-accent">{String(roomIdx + 1).padStart(2, '0')}</span>
          )}
          <canvas
            ref={canvasRef}
            width={80}
            height={80}
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
        </div>

        {isRoomLocked && (
          <span className="px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest bg-bg-elevated text-text-muted border border-border/50 flex items-center gap-1">
            <IconLock size={10} /> Locked
          </span>
        )}

        {/* Annotation controls */}
        {!isRoomLocked && !roomDone && (
          <div className="ml-auto flex items-center gap-1">
            <button
              onClick={toggleAnnotate}
              className={`rounded-lg px-2 py-1 text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-1 ${
                annotateMode
                  ? 'bg-accent text-on-accent'
                  : 'bg-bg-elevated text-text-muted hover:text-accent border border-border/50'
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
              </button>
            )}
          </div>
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
          <span className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-accent">
            Review room <IconArrowRight size={12} />
          </span>
        ) : !isRoomLocked ? (
          <span className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-accent">
            Enter room <IconArrowRight size={12} />
          </span>
        ) : (
          <span />
        )}
        {configRoom && !roomDone && (
          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-text-muted">
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
