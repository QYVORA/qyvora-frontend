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
    <div className="mb-8 rounded-2xl border border-border bg-bg-card p-5 md:p-6">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-xs font-black uppercase tracking-[0.2em] text-text-muted">Progress</span>
        <span className="font-mono text-base font-black text-accent">
          {viewedStepsCount} / {totalStepsCount} steps
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-accent-dim">
        <div
          className="h-full rounded-full bg-accent transition-all duration-500"
          style={{ width: `${(viewedStepsCount / totalStepsCount) * 100}%` }}
        />
      </div>
      <div className="flex items-center gap-2 text-xs text-text-muted mt-3">
        <Timer className="h-3.5 w-3.5" />
        <span>Time in room: {formatTime(timeSpent)}</span>
      </div>
      <div className="mt-4 flex gap-2 flex-wrap">
        {steps.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToStep(idx)}
            className={`h-3 flex-1 min-w-[24px] max-w-[52px] rounded-full transition-all ${
              idx === currentStepIdx ? 'bg-accent scale-y-[1.3]'
                : viewedSteps.has(idx) ? 'bg-accent/45'
                : 'bg-accent-dim'
            }`}
            title={`Step ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default RoomProgress;
