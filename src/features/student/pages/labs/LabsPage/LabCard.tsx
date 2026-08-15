import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FlaskConical } from 'lucide-react';

interface LabCardProps {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  cpReward: string;
  route: string;
  accentColor: string;
}

const LabCard = ({ title, description, cpReward, route }: LabCardProps) => {
  const { t } = useTranslation();
  return (
    <Link
      to={route}
      className="group/card relative aspect-square rounded-2xl border border-border/30 bg-bg-card p-3 md:p-5 transition-all duration-300 hover:border-accent/30 flex flex-col text-left"
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-accent/10 border border-accent/20">
          <FlaskConical className="w-4 h-4 text-accent" />
        </div>
      </div>

      <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-black text-text-primary group-hover/card:text-accent transition-colors leading-snug mb-1">
        {title}
      </h3>

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
