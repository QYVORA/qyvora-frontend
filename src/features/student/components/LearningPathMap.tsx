import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Lock, ArrowRight, BookOpen } from 'lucide-react';
import { BOOTCAMP_CONFIG, type BootcampPhase } from '@/features/student/constants/bootcampConfig';
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
      <div className="flex flex-col gap-4 px-5 md:px-0">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-text-muted">Learning Path</h3>
          <Link to="/dashboard/bootcamps" className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline">View All</Link>
        </div>
        <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-border/20 py-12 text-center flex flex-col items-center justify-center bg-transparent">
          <BookOpen className="mx-auto mb-3 h-8 w-8 text-text-muted opacity-40" />
          <p className="mb-4 text-sm text-text-muted">Enroll to begin the Hacker Protocol Bootcamp.</p>
          <Link to="/dashboard/bootcamps" className="bg-accent text-bg px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:brightness-110">
            Start Bootcamp <ArrowRight className="inline-block ml-1.5 h-3.5 w-3.5" />
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
      <div className="flex items-center justify-between px-5 md:px-0">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-text-muted">Learning Path</h3>
        <Link to="/dashboard/bootcamps" className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline">View All</Link>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 px-5 md:px-0 scroll-hover">
        {BOOTCAMP_CONFIG.phases.map((phase, idx) => {
          const state = getPhaseState(phase);
          const { roomsCompleted, totalRooms } = getPhaseProgress(phase);
          const firstRoomId = phase.rooms[0]?.id;

          const pillContent = (
            <div
              className={`flex-none flex flex-col items-center gap-2 p-4 rounded-2xl border min-w-[150px] transition-all duration-300 ${
                state === 'locked'
                  ? 'border-border/20 bg-bg-card/30 opacity-50'
                  : state === 'completed'
                  ? 'border-accent/40 bg-accent-dim/10'
                  : 'border-accent bg-accent-dim/15 shadow-[0_0_12px_rgba(102,184,112,0.3)]'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                state === 'completed'
                  ? 'bg-accent text-bg'
                  : state === 'current'
                  ? 'bg-accent/20 text-accent'
                  : 'bg-bg-elevated text-text-muted'
              }`}>
                {state === 'completed' ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : state === 'locked' ? (
                  <Lock className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-black">{idx + 1}</span>
                )}
              </div>
              <div className="text-center">
                <div className={`text-[9px] font-black uppercase tracking-widest mb-0.5 ${
                  state === 'locked' ? 'text-text-muted' : 'text-accent'
                }`}>
                  Phase {idx + 1}
                </div>
                <div className={`text-xs font-bold leading-tight ${
                  state === 'locked' ? 'text-text-muted/60' : 'text-text-primary'
                }`}>
                  {phase.title}
                </div>
              </div>
              <div className={`text-[10px] font-mono ${
                state === 'locked' ? 'text-text-muted/40' : 'text-text-muted'
              }`}>
                {state !== 'locked' ? `${roomsCompleted}/${totalRooms} rooms` : `${totalRooms} rooms`}
              </div>
              {state === 'current' && totalRooms > 0 && (
                <div className="w-full h-1.5 rounded-full bg-accent-dim/20 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-accent transition-all duration-700"
                    style={{ width: `${(roomsCompleted / totalRooms) * 100}%` }}
                  />
                </div>
              )}
            </div>
          );

          return (
            <React.Fragment key={phase.id}>
              <ScrollReveal delay={idx * 0.07} className="flex-none">
                {state !== 'locked' && firstRoomId ? (
                  <Link
                    to={`/dashboard/bootcamps/${bootcampId}/phases/${phase.id}/rooms/${firstRoomId}`}
                    className="block"
                  >
                    {pillContent}
                  </Link>
                ) : (
                  pillContent
                )}
              </ScrollReveal>
              {idx < BOOTCAMP_CONFIG.phases.length - 1 && (
                <div className="flex-none flex items-center">
                  <ArrowRight className={`w-4 h-4 ${state === 'locked' ? 'text-border' : 'text-text-muted/30'}`} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default LearningPathMap;
