import { Link } from 'react-router-dom';
import { LAB_ICONS } from './LabIcons';

interface LabCardProps {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  cpReward: string;
  route: string;
  accentColor: string;
}

const LabCard = ({ id, title, description, difficulty, cpReward, route, accentColor }: LabCardProps) => {
  const Icon = LAB_ICONS[id] || LAB_ICONS.privesc;

  return (
    <Link
      to={route}
      className="group flex flex-col rounded-2xl border border-border/30 bg-bg-card overflow-hidden transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
    >
      <div
        className="relative flex items-center justify-center py-8 px-4 overflow-hidden"
        style={{ backgroundColor: `${accentColor}15` }}
      >
        <div className="relative text-accent transition-transform duration-300 group-hover:scale-110">
          <Icon className="w-28 h-28 md:w-32 md:h-32" />
        </div>
      </div>

      <div className="flex flex-col gap-2 p-4 flex-1">
        <h3 className="text-sm font-black text-text-primary group-hover:text-accent transition-colors leading-snug">
          {title}
        </h3>
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
    </Link>
  );
};

export default LabCard;
