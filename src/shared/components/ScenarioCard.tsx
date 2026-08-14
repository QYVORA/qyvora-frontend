import { Swords } from 'lucide-react';

interface ScenarioCardProps {
  title: string;
  difficulty: string;
  description: string;
  cpReward: number | string;
  subtitle?: string;
  onStart: () => void;
}

const DIFFICULTY_STYLES: Record<string, string> = {
  beginner: 'bg-green-400/10 text-green-400 border-green-400/20',
  intermediate: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
  advanced: 'bg-red-400/10 text-red-400 border-red-400/20',
};

const ScenarioCard = ({ title, difficulty, description, cpReward, subtitle, onStart }: ScenarioCardProps) => (
  <button
    onClick={onStart}
    className="group/card relative aspect-square card-accent bg-bg-card p-3 md:p-5 transition-all duration-300 flex flex-col text-left w-full"
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
      <span className={`px-2 py-0.5 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest border ${DIFFICULTY_STYLES[difficulty] || DIFFICULTY_STYLES.beginner}`}>
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

    <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/20">
      <span className="text-[9px] font-black uppercase tracking-widest text-accent">
        {cpReward} CP
      </span>
      <span className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest bg-accent text-on-accent transition-all duration-200 group-hover/card:brightness-110 group-active:scale-95">
        Start
      </span>
    </div>
  </button>
);

export default ScenarioCard;
