import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import { IconArrowRight } from '@/shared/components/icons';

export type BootcampLevel = 'Novice' | 'Operator' | 'Specialist' | 'Elite';

interface BootcampCardProps {
  image: string;
  level: BootcampLevel;
  title: string;
  description?: string;
  duration: string;
  price: string;
  href?: string;
}

const LEVEL_STYLES: Record<string, string> = {
  Novice: 'text-accent border-accent/20 bg-accent/10',
  Operator: 'text-blue-400 border-blue-400/20 bg-blue-400/10',
  Specialist: 'text-purple-400 border-purple-400/20 bg-purple-400/10',
  Elite: 'bg-accent text-bg border-accent',
};

const BootcampCard: React.FC<BootcampCardProps> = ({ level, title, description, duration, price, href = '/register' }) => {
  const { t } = useTranslation();
  return (
    <Link to={href} className="group/card relative aspect-square rounded-2xl border border-border/30 bg-bg-card p-3 md:p-5 transition-all duration-300 hover:border-accent/30 flex flex-col text-left">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-accent/10 border border-accent/20">
          <Briefcase className="w-4 h-4 text-accent" />
        </div>
        <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${LEVEL_STYLES[level] || LEVEL_STYLES.Novice}`}>
          {level}
        </span>
      </div>

      <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-black text-text-primary group-hover/card:text-accent transition-colors leading-snug mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-xs sm:text-sm text-text-muted line-clamp-3 leading-relaxed flex-1 mb-2">
          {description}
        </p>
      )}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/20">
        <span className="text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-widest text-text-muted">
          {duration} · {price}
        </span>
        <span className="px-3 py-1.5 rounded-lg text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-widest bg-accent text-bg transition-all duration-200 group-hover/card:brightness-110 group-active:scale-95">
          {t('button.enrollNow')}
        </span>
      </div>
    </Link>
  );
};

export default BootcampCard;
