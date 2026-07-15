import React from 'react';
import { ListChecks } from 'lucide-react';
import { IconCheck, IconLock } from '@/shared/components/icons';
import ScrollReveal from '../../../../shared/components/ScrollReveal';
import RoomCard from './RoomCard';
import { BOOTCAMP_CONFIG } from '../../constants/bootcampConfig';
import phaseOneImg from '@/assets/bootcamp/rooms/phaseOne.webp';
import phaseTwoImg from '@/assets/bootcamp/rooms/phaseTwo.webp';
import phaseThreeImg from '@/assets/bootcamp/rooms/phaseThree.webp';
import phaseFourImg from '@/assets/bootcamp/rooms/phaseFour.webp';
import phaseFiveImg from '@/assets/bootcamp/rooms/phaseFive.webp';
import hpbCoverImg from '@/assets/bootcamp/hpb-cover.webp';

const PHASE_ROOM_IMAGES: Record<string, string> = {
  phase1: phaseOneImg,
  phase2: phaseTwoImg,
  phase3: phaseThreeImg,
  phase4: phaseFourImg,
  phase5: phaseFiveImg,
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
      <div className="w-full bg-transparent">
        {/* Phase header */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-6 sm:py-8">
          <div className="flex items-center gap-4">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl font-mono text-lg font-black transition-all duration-300 ${
              isComplete
                ? 'bg-accent text-bg shadow-lg shadow-accent/20'
                : isLocked
                  ? 'bg-bg-elevated text-text-muted opacity-50'
                  : 'bg-accent-dim text-accent'
            }`}>
              {isComplete
                ? <IconCheck size={20} />
                : isLocked
                  ? <IconLock size={16} />
                  : String(modIdx + 1).padStart(2, '0')}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent/70 mb-0.5">
                {configPhase?.codename || `Phase ${modIdx + 1}`}
              </p>
              <h3 className="mb-0 text-xl font-black text-text-primary tracking-tight">
                {mod.title}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-text-muted/60">
              <ListChecks className="h-4 w-4" />
              {roomsDone}/{roomsTotal} <span className="hidden sm:inline">Modules</span>
            </span>
            {progress > 0 && (
              <span className="rounded-xl bg-accent-dim px-3 py-1 font-mono text-xs font-black text-accent shadow-sm">
                {progress}%
              </span>
            )}
          </div>
        </div>

        {/* Room cards */}
        <div className="px-0 pb-12">
          {isLocked ? (
            <div className="flex items-center gap-4 rounded-2xl bg-bg-elevated/40 p-8 border border-border/30">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-bg/50 text-text-muted opacity-40">
                <IconLock size={20} />
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-widest text-text-muted">Phase locked</p>
                <p className="text-xs text-text-muted/60">Your instructor will unlock this when it's time.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              {(mod.rooms || []).map((room: any, roomIdx: number) => {
                const configRoom = configPhase?.rooms.find(
                  (r) => r.title.toLowerCase() === String(room.title || '').toLowerCase()
                ) || configPhase?.rooms[roomIdx];
                const roomImg = configPhase
                  ? PHASE_ROOM_IMAGES[configPhase.id] ?? hpbCoverImg

                  : hpbCoverImg;
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
