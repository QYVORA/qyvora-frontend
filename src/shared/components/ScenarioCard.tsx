interface ScenarioCardProps {
  index: number;
  title: string;
  difficulty: string;
  description: string;
  cpReward: number | string;
  subtitle?: string;
  accentColor?: string;
  diagramSvg?: string;
  onStart: () => void;
}

const DIFFICULTY_STYLES: Record<string, string> = {
  beginner: 'bg-green-400/10 text-green-400 border-green-400/20',
  intermediate: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
  advanced: 'bg-red-400/10 text-red-400 border-red-400/20',
};

const ScenarioCard = ({ index, title, difficulty, description, cpReward, subtitle, accentColor = '#06B66F', diagramSvg, onStart }: ScenarioCardProps) => (
  <button
    onClick={onStart}
    className="group flex flex-col rounded-2xl border border-border/30 bg-bg-card overflow-hidden transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 text-left w-full"
  >
    <div
      className="relative flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: `${accentColor}15` }}
    >
      {diagramSvg ? (
        <img
          src={diagramSvg}
          alt={title}
          className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <>
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `radial-gradient(${accentColor}40 1px, transparent 1px)`,
            backgroundSize: '16px 16px'
          }} />
          <span className="relative py-6 text-3xl font-black transition-transform duration-300 group-hover:scale-110" style={{ color: accentColor }}>
            {String(index + 1).padStart(2, '0')}
          </span>
        </>
      )}
    </div>

    <div className="flex flex-col gap-2 p-4 flex-1">
      <div className="flex items-center gap-2 flex-wrap">
        <h3 className="text-sm font-black text-text-primary group-hover:text-accent transition-colors leading-snug">
          {title}
        </h3>
        <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${DIFFICULTY_STYLES[difficulty] || DIFFICULTY_STYLES.beginner}`}>
          {difficulty}
        </span>
      </div>
      {subtitle && (
        <p className="text-[10px] font-black uppercase tracking-widest text-accent/60">
          {subtitle}
        </p>
      )}
      <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
        {description}
      </p>

      <div className="flex items-center justify-between mt-auto pt-2">
        <span className="text-[9px] font-black uppercase tracking-widest text-accent">
          {cpReward} CP
        </span>
        <span className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest bg-accent text-bg transition-all duration-200 group-hover:brightness-110 group-active:scale-95">
          Start
        </span>
      </div>
    </div>
  </button>
);

export default ScenarioCard;
