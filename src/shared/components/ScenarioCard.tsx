import { Swords } from 'lucide-react';

interface ScenarioCardProps {
  title: string;
  difficulty: string;
  description: string;
  cpReward: number | string;
  subtitle?: string;
  onStart: () => void;
}

const DIFFICULTY_CLASSES: Record<string, string> = {
  beginner: 'badge-beginner',
  intermediate: 'badge-intermediate',
  advanced: 'badge-advanced',
};

const ScenarioCard = ({ title, difficulty, description, cpReward, subtitle, onStart }: ScenarioCardProps) => (
  <button
    onClick={onStart}
    className="group/card relative aspect-square card-accent bg-bg-card p-4 md:p-5 transition-[border-color,box-shadow,transform,background-color] duration-[var(--dur-base)] ease-[var(--ease-smooth)] flex flex-col text-left w-full"
  >
    <div className="flex items-center gap-2 mb-2">
      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-accent/10 border border-accent/20">
        <Swords className="w-4 h-4 text-accent" />
      </div>
    </div>

    <div className="flex items-center gap-2 flex-wrap mb-1">
      <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-black text-text-primary group-hover/card:text-accent transition-colors leading-snug">
        {title}
      </h3>
      <span className={`px-2 py-0.5 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest border ${DIFFICULTY_CLASSES[difficulty] || 'badge-accent'}`}>
        {difficulty}
      </span>
    </div>
    {subtitle && (
      <p className="text-[10px] font-black uppercase tracking-widest text-accent/60 mb-1">
        {subtitle}
      </p>
    )}
    <p className="text-xs text-text-muted line-clamp-3 leading-relaxed flex-1 mb-2">
      {description}
    </p>

    <div className="flex items-center justify-between mt-auto pt-2">
      <span className="text-[9px] font-black uppercase tracking-widest text-accent">
        {cpReward} CP
      </span>
      <span className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest bg-accent text-on-accent transition-[filter,transform] duration-[var(--dur-base)] group-hover/card:brightness-110 group-active:scale-95">
        Start
      </span>
    </div>
  </button>
);

export default ScenarioCard;
