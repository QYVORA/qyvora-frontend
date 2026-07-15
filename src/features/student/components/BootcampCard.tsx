import React from 'react';
import { Link } from 'react-router-dom';
import { IconChevronRight } from '@/shared/components/icons';
import hpbCoverImg from '@/assets/bootcamp/hpb-cover.webp';

export type BootcampLevel = 'Novice' | 'Operator' | 'Specialist' | 'Elite';

interface BootcampCardProps {
  image: string;
  level: BootcampLevel;
  title: string;
  description?: string;
  duration: string;
  price: string;
  // href is optional — if not provided the card is non-navigable (e.g. skeleton)
  href?: string;
}

// Fix #8: card is now a Link so clicking anywhere navigates to the bootcamp
const BootcampCard: React.FC<BootcampCardProps> = ({ image, level, title, description, duration, price, href = '/register' }) => (
  <Link to={href} className="card-qyvora group overflow-hidden flex flex-col h-full block border border-border/30 hover:border-accent/30 transition-all">
    <div className="relative aspect-video overflow-hidden">
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        referrerPolicy="no-referrer"
        loading="lazy"
        decoding="async"
        onError={(e) => {
          // If the image fails (broken backend URL, missing file, etc.)
          // fall back to the HPB cover which is always present in /public
          const el = e.currentTarget;
          if (!el.dataset.fallbackApplied) {
            el.dataset.fallbackApplied = '1';
            el.src = hpbCoverImg;
          }
        }}
      />
      <div className="absolute top-4 left-4">
        <span className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase border tracking-widest ${
          level === 'Elite' ? 'bg-accent text-bg border-accent' : 'bg-bg/80 text-accent border-accent/30 backdrop-blur-sm'
        }`}>
          {level}
        </span>
      </div>
    </div>
    <div className="p-8 flex flex-col flex-1">
      <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-accent transition-colors">
        {title}
      </h3>
      {description && (
        <p className="text-xs text-text-muted line-clamp-2 mb-3">{description}</p>
      )}
      <div className="flex items-center justify-between text-xs text-text-muted mb-6 mt-auto">
        <span>{duration}</span>
        <span className="text-text-secondary font-mono">{price}</span>
      </div>
      <div className="w-full btn-primary !py-2.5 text-xs flex items-center justify-center gap-2">
        Enroll Now <IconChevronRight size={16} />
      </div>
    </div>
  </Link>
);

export default BootcampCard;
