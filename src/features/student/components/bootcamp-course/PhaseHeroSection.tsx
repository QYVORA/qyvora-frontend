import React from 'react';
import { ListChecks } from 'lucide-react';
import { IconCheck, IconLock } from '@/shared/components/icons';
import HpbAvatar, { type HpbVariant } from '@/shared/components/HpbAvatar';

interface PhaseHeroSectionProps {
  phaseId: string;
  phaseNumber: number;
  codename: string;
  title: string;
  description?: string;
  roomsDone: number;
  roomsTotal: number;
  progress: number;
  isLocked: boolean;
  isComplete: boolean;
}

const PhaseHeroSection: React.FC<PhaseHeroSectionProps> = ({
  phaseId,
  phaseNumber,
  codename,
  title,
  description,
  roomsDone,
  roomsTotal,
  progress,
  isLocked,
  isComplete,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-6 lg:gap-10 px-5 py-8 sm:py-10">
      <div className="space-y-4 min-w-0">
        <div className="flex items-center gap-3">
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl font-mono text-lg font-black transition-all duration-300 ${
            isComplete
              ? 'bg-accent text-on-accent shadow-lg shadow-accent/20'
              : isLocked
                ? 'bg-bg-elevated text-text-muted opacity-50'
                : 'bg-accent-dim text-accent'
          }`}>
            {isComplete
              ? <IconCheck size={20} />
              : isLocked
                ? <IconLock size={16} />
                : String(phaseNumber).padStart(2, '0')}
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent/70">
            {codename}
          </p>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-text-primary tracking-tight leading-[1.08]">
          {title}
        </h2>

        {description && (
          <p className="text-text-secondary text-sm sm:text-base leading-relaxed max-w-xl font-mono">
            {description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4">
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

      <div className="hidden lg:flex items-center justify-center h-64 xl:h-80">
        <HpbAvatar
          variant={phaseId as HpbVariant}
          className="h-full w-auto max-h-full max-w-full"
        />
      </div>
    </div>
  );
};

export default PhaseHeroSection;
