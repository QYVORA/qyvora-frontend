import React from 'react';
import { CheckCircle2, Lock, ListChecks } from 'lucide-react';
import ScrollReveal from '../../../../shared/components/ScrollReveal';
import RoomCard from './RoomCard';
import { BOOTCAMP_CONFIG } from '../../constants/bootcampConfig';

const PHASE_ROOM_IMAGES: Record<string, string> = {
  phase1: '/assets/bootcamp/rooms/hacker-mindset.webp',
  phase2: '/assets/bootcamp/rooms/linux-foundations.webp',
  phase3: '/assets/bootcamp/rooms/networking.webp',
  phase4: '/assets/bootcamp/rooms/web-and-backend-systems.webp',
  phase5: '/assets/bootcamp/rooms/social-engineering.webp',
};

interface PhaseSectionProps {
  bootcampId: string;
  mod: any;
  modIdx: number;
  moduleProgressMap: Map<number, any>;
}

const PhaseSection: React.FC<PhaseSectionProps> = ({
  bootcampId,
  mod,
  modIdx,
  moduleProgressMap,
}) => {
  const prog = moduleProgressMap.get(Number(mod.moduleId));
  const progress = Number(prog?.progress || 0);
  const roomsDone = Number(prog?.roomsCompleted || 0);
  const roomsTotal = Number(prog?.roomsTotal || mod.rooms?.length || 0);
  const isLocked = mod.locked;
  const isComplete = progress === 100;

  const configPhase = BOOTCAMP_CONFIG.phases.find(
    (p) => p.title.toLowerCase() === String(mod.title || '').toLowerCase()
  ) || BOOTCAMP_CONFIG.phases[modIdx];

  return (
    <ScrollReveal delay={modIdx * 0.04}>
      <div className="w-full overflow-hidden rounded-3xl border-2 border-border bg-bg-card">
        {/* Phase header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-4 sm:px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-accent/30 bg-accent-dim text-accent font-mono text-sm font-black">
              {isComplete
                ? <CheckCircle2 className="h-4 w-4" />
                : isLocked
                  ? <Lock className="h-3.5 w-3.5" />
                  : String(modIdx + 1).padStart(2, '0')}
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-accent">
                {configPhase?.codename || `Phase ${modIdx + 1}`}
              </p>
              <h3 className="mb-0 text-base font-black text-text-primary">
                {mod.title}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-text-muted">
              <ListChecks className="h-3.5 w-3.5 opacity-50" />
              {roomsDone}/{roomsTotal} rooms
            </span>
            {progress > 0 && (
              <span className="rounded-lg border border-accent/25 bg-accent-dim px-2 py-0.5 font-mono text-xs font-black text-accent">
                {progress}%
              </span>
            )}
          </div>
        </div>

        {/* Room cards */}
        <div className="p-4 sm:p-5">
          {isLocked ? (
            <div className="flex items-center gap-3 rounded-2xl border border-dashed border-border bg-bg/40 p-5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-bg">
                <Lock className="h-4 w-4 text-text-muted opacity-50" />
              </div>
              <div>
                <p className="text-sm font-bold text-text-muted">Phase locked</p>
                <p className="text-xs text-text-muted opacity-60">Your instructor will unlock this when it's time.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {(mod.rooms || []).map((room: any, roomIdx: number) => {
                const configRoom = configPhase?.rooms.find(
                  (r) => r.title.toLowerCase() === String(room.title || '').toLowerCase()
                ) || configPhase?.rooms[roomIdx];
                const roomImg = configPhase
                  ? PHASE_ROOM_IMAGES[configPhase.id] ?? '/assets/bootcamp/hpb-cover.webp'
                  : '/assets/bootcamp/hpb-cover.webp';

                return (
                  <RoomCard
                    key={room.roomId}
                    bootcampId={bootcampId}
                    room={room}
                    roomIdx={roomIdx}
                    configPhase={configPhase}
                    configRoom={configRoom}
                    roomImg={roomImg}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </ScrollReveal>
  );
};

export default PhaseSection;
