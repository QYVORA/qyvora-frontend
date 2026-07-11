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
      <div className="flex flex-col gap-4 px-4 md:px-0">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-text-muted">Learning Path</h3>
          <Link to="/dashboard/bootcamps" className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline">View All</Link>
        </div>
        <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-border/20 py-12 text-center flex flex-col items-center justify-center bg-transparent">
          <BookOpen className="mx-auto mb-3 h-8 w-8 text-text-muted opacity-40" />
          <p className="mb-4 text-sm text-text-muted">Enroll to begin the Hacker Protocol Bootcamp.</p>
          <Link to="/dashboard/bootcamps" className="btn-primary !text-[10px] !px-6 !py-2.5 flex items-center gap-1.5">
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
      <div className="flex items-center justify-between px-4 md:px-0">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-text-muted">Learning Path</h3>
        <Link to="/dashboard/bootcamps" className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline">View All</Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 px-4 md:px-0" role="list" aria-label="Learning path phases">
        {BOOTCAMP_CONFIG.phases.map((phase, idx) => {
          const state = getPhaseState(phase);
          const { roomsCompleted, totalRooms } = getPhaseProgress(phase);
          const firstRoomId = phase.rooms[0]?.id;

          const pillContent = (
            <div
              className={`flex flex-col p-4 rounded-xl border transition-all duration-300 min-h-[160px] ${
                state === 'locked'
                  ? 'border-border/20 bg-bg-card/30 opacity-50'
                  : state === 'completed'
                  ? 'border-accent/40 bg-accent-dim/10'
                  : 'border-accent bg-accent-dim/15 shadow-[0_0_8px_rgba(6,182,111,0.25)]'
              }`}
            >
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  state === 'completed'
                    ? 'bg-accent text-bg'
                    : state === 'current'
                    ? 'bg-accent/20 text-accent'
                    : 'bg-bg-elevated text-text-muted'
                }`}>
                  {state === 'completed' ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : state === 'locked' ? (
                    <Lock className="w-4 h-4" />
                  ) : (
                    <span className="text-xs font-black">{idx + 1}</span>
                  )}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${
                  state === 'locked' ? 'text-text-muted' : 'text-accent'
                }`}>
                  Phase {idx + 1}
                </span>
              </div>
              <h4 className={`text-xs font-bold leading-snug mb-1.5 break-words ${
                state === 'locked' ? 'text-text-muted/60' : 'text-text-primary'
              }`}>
                {phase.title}
              </h4>
              <div className="mt-auto pt-1.5">
                <div className={`text-[10px] font-mono text-text-muted mb-1.5 ${state === 'locked' ? 'invisible' : ''}`}>
                  {state !== 'locked' ? `${roomsCompleted}/${totalRooms} rooms` : '0/0 rooms'}
                </div>
                {state === 'current' && totalRooms > 0 && (
                  <div className="w-full h-1.5 rounded-full bg-accent-dim/20 overflow-hidden">
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
                {state !== 'current' && <div className="h-1.5" />}
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
