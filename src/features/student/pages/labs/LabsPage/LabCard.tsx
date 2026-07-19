import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

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
      className="group flex flex-col rounded-2xl border border-border/30 bg-bg-card overflow-hidden transition-all duration-300 hover:border-accent/30"
    >
      <div className="flex flex-col gap-2 p-5 flex-1">
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
            {t('student.labs.labCard.start')}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default LabCard;
