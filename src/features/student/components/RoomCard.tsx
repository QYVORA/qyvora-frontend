import React from 'react';
import { Monitor } from 'lucide-react';

interface RoomCardProps {
  image: string;
  logo: string;
  title: string;
  level: string;
  description: string;
}

const RoomCard: React.FC<RoomCardProps> = ({ image, logo, title, level, description }) => {
  return (
    <div className="card-hsociety group overflow-hidden flex flex-col h-full">
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-bg border border-border p-1.5 shadow-lg flex items-center justify-center overflow-hidden">
          <img src={logo} alt="" className="w-full h-full object-contain" />
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-accent-dim text-accent border border-accent/20">
            {level}
          </span>
          <Monitor className="w-3 h-3 text-text-muted" />
        </div>
        <h3 className="text-base font-bold text-text-primary mb-2 group-hover:text-accent transition-colors">
          {title}
        </h3>
        <p className="text-sm text-text-muted line-clamp-2 mb-6">
          {description}
        </p>
        <div className="mt-auto">
          <button className="w-full btn-primary !py-2.5 flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-black transition-all group/btn">
            DEPLOY_LAB <Monitor className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
