import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LabBadge from '@/shared/components/LabBadge';

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
  const { t } = useTranslation();
  
  const DIFFICULTY_COLORS: Record<string, string> = {
    beginner: 'text-accent border-accent/30 bg-accent/10',
    intermediate: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
    advanced: 'text-red-400 border-red-400/30 bg-red-400/10',
  };
  
  const baseDiff = difficulty.split('-')[0];
  const diffColor = DIFFICULTY_COLORS[baseDiff] || DIFFICULTY_COLORS.beginner;
  
  return (
    <Link
      to={route}
      className="group/card relative aspect-square card-accent bg-bg-card p-3 md:p-5 transition-all duration-300 flex flex-col text-left"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-black text-text-primary group-hover/card:text-accent transition-colors leading-snug min-w-0">
          {title}
        </h3>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest shrink-0 ${diffColor}`}>
            {baseDiff}
          </span>
          <LabBadge labId={id} accentColor={accentColor} className="w-11 h-11 shrink-0" />
        </div>
      </div>

      <p className="text-xs sm:text-sm md:text-base text-text-muted line-clamp-3 leading-relaxed flex-1 mb-2">
        {description}
      </p>

      <div className="flex items-center justify-between mt-auto pt-2">
        <span className="text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-widest text-accent">
          {cpReward} CP
        </span>
        <span className="px-3 py-1.5 rounded-lg text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-widest bg-accent text-on-accent transition-all duration-200 group-hover/card:brightness-110 group-active:scale-95">
          {t('student.labs.labCard.start')}
        </span>
      </div>
    </Link>
  );
};

export default LabCard;
