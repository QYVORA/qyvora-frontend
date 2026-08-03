import React from 'react';
import { IconLock } from '@/shared/components/icons';
import ScrollReveal from '../../../../shared/components/ScrollReveal';
import RoomCard from './RoomCard';
import PhaseHeroSection from './PhaseHeroSection';
import { BOOTCAMP_CONFIG } from '../../constants/bootcampConfig';
import hpbCoverImg from '@/assets/bootcamp/hpb-cover.webp';

const PHASE_ROOM_IMAGES: Record<string, string> = {};

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
        <PhaseHeroSection
          phaseId={configPhase?.id || `phase${modIdx + 1}`}
          phaseNumber={modIdx + 1}
          codename={configPhase?.codename || `Phase ${modIdx + 1}`}
          title={mod.title}
          description={mod.description}
          roomsDone={roomsDone}
          roomsTotal={roomsTotal}
          progress={progress}
          isLocked={isLocked}
          isComplete={isComplete}
        />

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {(mod.rooms || []).map((room: any, roomIdx: number) => {
                const configRoom = configPhase?.rooms.find(
                  (r) => r.title.toLowerCase() === String(room.title || '').toLowerCase()
                ) || configPhase?.rooms[roomIdx];
                const roomImg = configPhase
                  ? PHASE_ROOM_IMAGES[configPhase.id] ?? hpbCoverImg

                  : hpbCoverImg;
                return (
                  <div key={room.roomId} className="aspect-square">
                    <RoomCard
                      bootcampId={bootcampId}
                      room={room}
                      roomIdx={roomIdx}
                      configPhase={configPhase}
                      configRoom={configRoom}
                      roomImg={roomImg}
                    />
                  </div>
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
