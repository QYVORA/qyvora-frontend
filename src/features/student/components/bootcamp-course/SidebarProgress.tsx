import React from 'react';
import { Layers, BarChart3, Trophy, CheckCircle2, Lock } from 'lucide-react';
import { BOOTCAMP_CONFIG } from '../../constants/bootcampConfig';

interface SidebarProgressProps {
  progressValue: string;
  progressNum: number;
  doneRooms: number;
  totalRooms: number;
  doneModules: number;
  totalModules: number;
  courseModules: any[];
  moduleProgressMap: Map<number, any>;
}

const SidebarProgress: React.FC<SidebarProgressProps> = ({
  progressValue,
  progressNum,
  doneRooms,
  totalRooms,
  doneModules,
  totalModules,
  courseModules,
  moduleProgressMap,
}) => {
  return (
    <div className="px-2 pb-6 lg:p-5 space-y-4">
      {/* Progress card - Hidden on mobile as it's redundant with CourseHeader */}
      <div className="hidden lg:block relative overflow-hidden rounded-3xl border-2 border-accent/25 bg-accent-dim p-6">
        <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-accent/20 blur-3xl" aria-hidden />
        <div className="relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-1">Overall progress</p>
          <div className="text-5xl font-black text-accent font-mono mb-3">{progressValue}</div>
          <div className="h-1.5 overflow-hidden rounded-full bg-bg/40 mb-3">
            <div
              className="h-full rounded-full bg-accent transition-all duration-700"
              style={{ width: `${progressNum}%` }}
            />
          </div>
          <p className="text-xs text-text-secondary">{doneRooms} of {totalRooms} rooms completed</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border-2 border-border bg-bg-card p-4 flex flex-col gap-1">
          <div className="flex items-center gap-2 text-text-muted mb-1">
            <Layers className="w-4 h-4 text-accent" />
            <span className="text-[10px] font-black uppercase tracking-widest">Phases</span>
          </div>
          <div className="font-mono text-2xl font-black text-text-primary">
            {doneModules}<span className="text-sm text-text-muted font-bold">/{totalModules}</span>
          </div>
        </div>
        <div className="rounded-2xl border-2 border-border bg-bg-card p-4 flex flex-col gap-1">
          <div className="flex items-center gap-2 text-text-muted mb-1">
            <BarChart3 className="w-4 h-4 text-accent" />
            <span className="text-[10px] font-black uppercase tracking-widest">Rooms</span>
          </div>
          <div className="font-mono text-2xl font-black text-text-primary">
            {doneRooms}<span className="text-sm text-text-muted font-bold">/{totalRooms}</span>
          </div>
        </div>
      </div>

      {/* Phase quick-nav */}
      <div className="overflow-hidden rounded-2xl border-2 border-border bg-bg-card">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <Trophy className="h-4 w-4 text-accent shrink-0" />
          <h3 className="text-xs font-black uppercase tracking-widest text-text-primary">Phases</h3>
        </div>
        <div className="divide-y divide-border/50">
          {courseModules.map((mod, idx) => {
            const prog = moduleProgressMap.get(Number(mod.moduleId));
            const progress = Number(prog?.progress || 0);
            const isComplete = progress === 100;
            const isLocked = mod.locked;
            const configPhase = BOOTCAMP_CONFIG.phases.find(
              (p) => p.title.toLowerCase() === String(mod.title || '').toLowerCase()
            ) || BOOTCAMP_CONFIG.phases[idx];
            return (
              <div key={mod.moduleId} className="flex items-center gap-3 px-4 py-3">
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border font-mono text-[10px] font-black ${
                  isComplete ? 'border-accent/30 bg-accent text-bg'
                    : isLocked ? 'border-border bg-bg text-text-muted'
                    : 'border-accent/30 bg-accent-dim text-accent'
                }`}>
                  {isComplete ? <CheckCircle2 className="h-3.5 w-3.5" />
                    : isLocked ? <Lock className="h-3 w-3" />
                    : String(idx + 1).padStart(2, '0')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-black uppercase tracking-[0.25em] text-accent leading-none mb-0.5">
                    {configPhase?.codename || `Phase ${idx + 1}`}
                  </p>
                  <p className="text-xs font-bold text-text-primary truncate">{mod.title}</p>
                </div>
                {progress > 0 && !isComplete && (
                  <span className="text-[10px] font-mono font-black text-accent shrink-0">{progress}%</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SidebarProgress;
