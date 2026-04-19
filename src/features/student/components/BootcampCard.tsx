import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';

interface BootcampCardProps {
  image: string;
  level: 'Novice' | 'Operator' | 'Specialist' | 'Elite';
  title: string;
  duration: string;
  price: string;
}

const BootcampCard: React.FC<BootcampCardProps> = ({ image, level, title, duration, price }) => {
  return (
    <div className="card-hsociety group overflow-hidden">
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
      <div className="p-6">
        <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-accent transition-colors">
          {title}
        </h3>
        <div className="flex items-center justify-between text-xs text-text-muted mb-6">
          <span>{duration}</span>
          <span className="text-text-secondary font-mono">{price}</span>
        </div>
        <button className="w-full btn-primary !py-2.5 text-xs flex items-center justify-center gap-2">
          Enroll Now <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default BootcampCard;
