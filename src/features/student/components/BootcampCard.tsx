import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { IconArrowRight } from '@/shared/components/icons';
import hpbCoverImg from '@/assets/bootcamp/hpb-cover.webp';

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

const BootcampCard: React.FC<BootcampCardProps> = ({ image, level, title, description, duration, price, href = '/register' }) => {
  const { t } = useTranslation();
  return (
    <Link to={href} className="group flex flex-col rounded-2xl border border-border/30 bg-bg-card overflow-hidden transition-all duration-300 hover:border-accent/30 h-full">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={image}
          alt={title}
          width={1200}
          height={675}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          referrerPolicy="no-referrer"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            const el = e.currentTarget;
            if (!el.dataset.fallbackApplied) {
              el.dataset.fallbackApplied = '1';
              el.src = hpbCoverImg;
            }
          }}
        />
        <div className="absolute top-2.5 left-2.5">
          <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
            level === 'Elite' ? 'bg-accent text-bg border-accent' : 'bg-bg/85 backdrop-blur-sm text-accent border-accent/20'
          }`}>
            {level}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2 p-4 sm:p-5 md:p-6 lg:p-7 flex-1">
        <h3 className="text-sm sm:text-base md:text-lg font-black text-text-primary group-hover:text-accent transition-colors leading-snug">
          {title}
        </h3>
        {description && (
          <p className="text-xs sm:text-sm text-text-muted line-clamp-3 leading-relaxed flex-1">
            {description}
          </p>
        )}
        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-widest text-text-muted">
            {duration} · {price}
          </span>
          <span className="px-3 py-1.5 rounded-lg text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-widest bg-accent text-bg transition-all duration-200 group-hover:brightness-110 group-active:scale-95">
            {t('button.enrollNow')}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default BootcampCard;
