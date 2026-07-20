import { type ReactNode } from 'react';
import { motion } from 'motion/react';

export interface ProfileStatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  accent?: boolean;
  className?: string;
}

const ProfileStatCard: React.FC<ProfileStatCardProps> = ({
  icon,
  label,
  value,
  accent = false,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`
        rounded-2xl border p-5 flex flex-col gap-2.5
        ${accent
          ? 'border-accent/20 bg-accent/5'
          : 'border-border/30 bg-bg-card'
        }
        ${className}
      `}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
          accent ? 'bg-accent/15' : 'bg-bg-elevated'
        }`}>
          {icon}
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
          {label}
        </span>
      </div>
      <div className={`font-mono text-2xl font-black leading-none tabular-nums ${
        accent ? 'text-accent' : 'text-text-primary'
      }`}>
        {value}
      </div>
    </motion.div>
  );
};

export default ProfileStatCard;
