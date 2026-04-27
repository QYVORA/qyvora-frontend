import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

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
  <Link to={href} className="card-hsociety group overflow-hidden flex flex-col block hover:border-accent/40 transition-all">
    <div className="relative aspect-video overflow-hidden">
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        referrerPolicy="no-referrer"
      />
      <div className="absolute top-4 left-4">
        <span className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase border tracking-widest ${
          level === 'Elite' ? 'bg-accent text-bg border-accent' : 'bg-bg/80 text-accent border-accent/30 backdrop-blur-sm'
        }`}>
          {level}
        </span>
      </div>
    </div>
    <div className="p-6 flex flex-col flex-1">
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
        Enroll Now <ChevronRight className="w-4 h-4" />
      </div>
    </div>
  </Link>
);

export default BootcampCard;
