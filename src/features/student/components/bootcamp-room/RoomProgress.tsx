import React from 'react';
import { Timer } from 'lucide-react';

interface RoomProgressProps {
  viewedStepsCount: number;
  totalStepsCount: number;
  timeSpent: number;
  formatTime: (ms: number) => string;
  currentStepIdx: number;
  goToStep: (idx: number) => void;
  steps: any[];
  viewedSteps: Set<number>;
}

const RoomProgress: React.FC<RoomProgressProps> = ({
  viewedStepsCount,
  totalStepsCount,
  timeSpent,
  formatTime,
  currentStepIdx,
  goToStep,
  steps,
  viewedSteps,
}) => {
  return (
    <div className="mb-8 rounded-2xl border border-border/30 bg-bg-card p-5 md:p-6">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-xs font-black uppercase tracking-[0.2em] text-text-muted">Progress</span>
        <span className="font-mono text-base font-black text-accent">
          {viewedStepsCount} / {totalStepsCount} steps
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-accent-dim border border-border/40">
        <div
          className="h-full bg-accent transition-all duration-700 ease-out rounded-full"
          style={{ width: `${totalStepsCount > 0 ? (viewedStepsCount / totalStepsCount) * 100 : 0}%` }}
          role="progressbar"
          aria-valuenow={totalStepsCount > 0 ? Math.round((viewedStepsCount / totalStepsCount) * 100) : 0}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progress: ${viewedStepsCount} of ${totalStepsCount} steps viewed`}
        />
      </div>
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-text-muted mt-4">
        <Timer className="h-3.5 w-3.5 text-accent" />
        <span>Time in session: {formatTime(timeSpent)}</span>
      </div>
    </div>
  );
};

export default RoomProgress;
