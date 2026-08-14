import React from 'react';
import { Link } from 'react-router-dom';
import { FlaskConical, Star } from 'lucide-react';
import { IconArrowRight } from '@/shared/components/icons';
import type { ViewMode } from '@/shared/components/card-collection';

export interface LabCardItem {
  id: string;
  route: string;
  accentColor: string;
  difficulty: string;
  cpReward: string;
  title: string;
  description: string;
}

interface LabCardProps {
  lab: LabCardItem;
  view: ViewMode;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'text-accent border-accent/30 bg-accent/10',
  intermediate: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
  advanced: 'text-red-400 border-red-400/30 bg-red-400/10',
};

const DifficultyBadge: React.FC<{ difficulty: string }> = ({ difficulty }) => {
  const baseDiff = difficulty.split('-')[0];
  const diffColor = DIFFICULTY_COLORS[baseDiff] || DIFFICULTY_COLORS.beginner;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest shrink-0 ${diffColor}`}>
      <Star className="h-2.5 w-2.5" /> {baseDiff}
    </span>
  );
};

const LabCard: React.FC<LabCardProps> = ({ lab, view }) => {
  if (view === 'expanded') {
    return (
      <Link
        to={lab.route}
        className="group/card flex flex-col gap-2 card-accent bg-bg-card p-4 md:p-5 transition-all duration-300 text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-accent/10 border border-accent/20">
            <FlaskConical className="w-4 h-4 text-accent" />
          </div>
          <h3 className="text-sm sm:text-base md:text-lg font-black text-text-primary group-hover/card:text-accent transition-colors leading-snug truncate flex-1 min-w-0">
            {lab.title}
          </h3>
          <DifficultyBadge difficulty={lab.difficulty} />
        </div>

        <p className="text-xs sm:text-sm text-text-muted leading-relaxed line-clamp-2">
          {lab.description}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-border/10">
          <span className="text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-widest text-accent">
            {lab.cpReward} CP
          </span>
          <span className="px-3 py-1.5 rounded-lg text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-widest bg-accent text-on-accent transition-all duration-200 group-hover/card:brightness-110 group-active:scale-95">
            Launch <IconArrowRight size={12} className="inline-block ml-1" />
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={lab.route}
      className="group/card relative h-full min-h-[220px] card-accent bg-bg-card p-4 md:p-5 transition-all duration-300 flex flex-col text-left justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-accent/10 border border-accent/20">
            <FlaskConical className="w-4 h-4 text-accent" />
          </div>
          <DifficultyBadge difficulty={lab.difficulty} />
        </div>

        <h3 className="text-sm sm:text-base md:text-lg font-black text-text-primary group-hover/card:text-accent transition-colors leading-snug break-words mb-1">
          {lab.title}
        </h3>

        <p className="text-xs sm:text-sm text-text-muted leading-relaxed line-clamp-3 mb-2">
          {lab.description}
        </p>
      </div>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/10">
        <span className="text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-widest text-accent">
          {lab.cpReward} CP
        </span>
        <span className="px-3 py-1.5 rounded-lg text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-widest bg-accent text-on-accent transition-all duration-200 group-hover/card:brightness-110 group-active:scale-95">
          Launch <IconArrowRight size={12} className="inline-block ml-1" />
        </span>
      </div>
    </Link>
  );
};

export default LabCard;
