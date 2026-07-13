import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Layers } from 'lucide-react';
import { IconCheck, IconLock, IconArrowRight, IconClock } from '@/shared/components/icons';
import { BOOTCAMP_CONFIG, type BootcampPhase } from '@/features/student/constants/bootcampConfig';
import { PHASES } from '@/features/marketing/pages/LearnPage/learnData';
import ScrollReveal from '@/shared/components/ScrollReveal';

interface LearningPathMapProps {
  overview: any;
  bootcampId: string;
  isEnrolled: boolean;
}

const LearningPathMap: React.FC<LearningPathMapProps> = ({ overview, bootcampId, isEnrolled }) => {
  const modules = Array.isArray(overview?.modules) ? overview.modules : [];

  if (!isEnrolled) {
    return (
      <div className="flex flex-col gap-4 px-4 md:px-0">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-text-muted">Learning Path</h3>
          <Link to="/dashboard/bootcamps" className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline">View All</Link>
        </div>
        <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-border/20 py-12 text-center flex flex-col items-center justify-center bg-transparent">
          <BookOpen className="mx-auto mb-3 h-8 w-8 text-text-muted opacity-40" />
          <p className="mb-4 text-sm text-text-muted">Enroll to begin the Hacker Protocol Bootcamp.</p>
          <Link to="/dashboard/bootcamps" className="btn-primary !text-[10px] !px-6 !py-2.5 flex items-center gap-1.5">
            Start Bootcamp <IconArrowRight size={14} className="inline-block ml-1.5" />
          </Link>
        </div>
      </div>
    );
  }

  const getPhaseState = (phase: BootcampPhase) => {
    const mod = modules.find(
      (m: any) => String(m.moduleId || m.id) === phase.id || m.title?.toLowerCase() === phase.title.toLowerCase()
    );
    if (mod) {
      const progress = Number(mod.progress || 0);
      if (progress >= 100) return 'completed';
      if (progress > 0) return 'current';
    }
    const phaseIdx = BOOTCAMP_CONFIG.phases.findIndex((p) => p.id === phase.id);
    const allPrevCompleted = BOOTCAMP_CONFIG.phases.slice(0, phaseIdx).every((p) => {
      const m = modules.find(
        (mod: any) => String(mod.moduleId || mod.id) === p.id || mod.title?.toLowerCase() === p.title.toLowerCase()
      );
      return m && Number(m.progress || 0) >= 100;
    });
    if (phaseIdx === 0 || allPrevCompleted) return 'current';
    return 'locked';
  };

  const getPhaseProgress = (phase: BootcampPhase) => {
    const mod = modules.find(
      (m: any) => String(m.moduleId || m.id) === phase.id || m.title?.toLowerCase() === phase.title.toLowerCase()
    );
    if (!mod) return { roomsCompleted: 0, totalRooms: phase.rooms.length };
    return {
      roomsCompleted: Number(mod.roomsCompleted || 0),
      totalRooms: Number(mod.roomsTotal || phase.rooms.length),
    };
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-4 md:px-0">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-text-muted">Learning Path</h3>
        <Link to="/dashboard/bootcamps" className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline">View All</Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 px-4 md:px-0" role="list" aria-label="Learning path phases">
        {BOOTCAMP_CONFIG.phases.map((phase, idx) => {
          const state = getPhaseState(phase);
          const { roomsCompleted, totalRooms } = getPhaseProgress(phase);
          const firstRoomId = phase.rooms[0]?.id;
          const learnPhase = PHASES[idx];
          const Icon = learnPhase?.icon;
          const totalSteps = phase.rooms.reduce((acc, r) => acc + (r.steps?.length || 0), 0);

          const isLocked = state === 'locked';
          const isCompleted = state === 'completed';

          const pillContent = (
            <div
              className={`relative min-h-[220px] md:min-h-[280px] rounded-2xl border overflow-hidden transition-all duration-300 ${
                isLocked
                  ? 'border-border/20 opacity-40'
                  : isCompleted
                  ? 'border-accent/40'
                  : 'border-accent shadow-[0_0_12px_rgba(6,182,111,0.3)]'
              }`}
            >
              {learnPhase?.image && (
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${learnPhase.image})` }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              {isLocked && <div className="absolute inset-0 bg-black/40" />}
              <div className="relative z-10 p-5 flex flex-col h-full min-h-[220px] md:min-h-[280px]">
                <div className="flex items-center gap-2.5 mb-3">
                  {Icon && (
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isCompleted
                        ? 'bg-accent text-bg'
                        : isLocked
                        ? 'bg-bg-elevated text-text-muted'
                        : 'bg-accent/10 text-accent'
                    }`}>
                      {isCompleted ? <IconCheck size={20} /> : isLocked ? <IconLock size={20} /> : <Icon className="w-5 h-5" />}
                    </div>
                  )}
                  <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center shrink-0">
                    <span className="text-xs font-black text-bg">{String(idx + 1).padStart(2, '0')}</span>
                  </div>
                </div>
                <h4 className={`text-base font-black tracking-tight mb-1.5 ${isLocked ? 'text-text-muted/60' : 'text-white'}`}>
                  {phase.title}
                </h4>
                {learnPhase?.desc && (
                  <p className={`text-xs leading-relaxed line-clamp-3 mb-3 ${isLocked ? 'text-text-muted/50' : 'text-white/70'}`}>
                    {learnPhase.desc}
                  </p>
                )}
                <div className="mt-auto flex items-center gap-2">
                  {!isLocked && (
                    <>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/10">
                        <Layers className="w-3 h-3 text-accent" />
                        <span className="text-[10px] font-bold text-white">{totalRooms} rooms</span>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/10">
                        <IconClock size={12} className="text-accent" />
                        <span className="text-[10px] font-bold text-white">{totalSteps} steps</span>
                      </div>
                    </>
                  )}
                  {isLocked && (
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Locked</span>
                  )}
                </div>
                {isCompleted && (
                  <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-accent flex items-center justify-center">
                    <IconCheck size={16} className="text-bg" />
                  </div>
                )}
                {!isLocked && !isCompleted && roomsCompleted > 0 && totalRooms > 0 && (
                  <div className="mt-2.5 w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-accent transition-all duration-700"
                      style={{ width: `${(roomsCompleted / totalRooms) * 100}%` }}
                      role="progressbar"
                      aria-valuenow={Math.round((roomsCompleted / totalRooms) * 100)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${roomsCompleted} of ${totalRooms} rooms completed`}
                    />
                  </div>
                )}
              </div>
            </div>
          );

          return (
            <ScrollReveal key={phase.id} delay={idx * 0.07} className="flex">
              <div role="listitem" className="flex-1">
                {state !== 'locked' && firstRoomId ? (
                  <Link
                    to={`/dashboard/bootcamps/${bootcampId}/phases/${phase.id}/rooms/${firstRoomId}`}
                    className="flex-1 block"
                    aria-label={`Phase ${idx + 1}: ${phase.title}, ${roomsCompleted} of ${totalRooms} rooms${state === 'completed' ? ', completed' : ''}`}
                  >
                    {pillContent}
                  </Link>
                ) : (
                  <div className="flex-1" aria-disabled={state === 'locked'} aria-label={`Phase ${idx + 1}: ${phase.title}${state === 'locked' ? ', locked' : ''}`}>
                    {pillContent}
                  </div>
                )}
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </div>
  );
};

export default LearningPathMap;
