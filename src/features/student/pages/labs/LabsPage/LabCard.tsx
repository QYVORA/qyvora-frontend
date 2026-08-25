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

const LabCard = ({ id, title, description, cpReward, route, accentColor }: LabCardProps) => {
  const { t } = useTranslation();
  return (
    <Link
      to={route}
      className="group/card relative aspect-square card-accent bg-bg-card p-3 md:p-5 transition-all duration-300 flex flex-col text-left"
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2 mb-2">
        <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-black text-text-primary group-hover/card:text-accent transition-colors leading-snug">
          {title}
        </h3>
        <LabBadge labId={id} accentColor={accentColor} className="w-11 h-11 shrink-0" />
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
