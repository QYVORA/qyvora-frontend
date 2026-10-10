import React from 'react';
import CpLogo from '@/shared/components/CpLogo';

interface ProfileCPBalanceProps {
  cp: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZES = {
  sm: {
    coin: 'w-4 h-4',
    text: 'text-base',
    label: 'text-[10px]',
  },
  md: {
    coin: 'w-5 h-5 sm:w-6 sm:h-6',
    text: 'text-xl sm:text-2xl',
    label: 'text-xs',
  },
  lg: {
    coin: 'w-7 h-7 sm:w-8 sm:h-8',
    text: 'text-2xl sm:text-3xl',
    label: 'text-sm',
  },
};

/**
 * Clean typographic CP balance presentation.
 * Displays the coin directly alongside the number, preserving its transparent
 * background and intended proportions without wrapping in a card.
 */
export const ProfileCPBalance: React.FC<ProfileCPBalanceProps> = ({
  cp,
  size = 'md',
  className = '',
}) => {
  const sizeCfg = SIZES[size] || SIZES.md;

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <CpLogo className={`${sizeCfg.coin} shrink-0`} alt="CP" />
      <div className="inline-flex items-baseline gap-1.5">
        <span className={`font-mono ${sizeCfg.text} font-black tracking-tight text-text-primary`}>
          {(cp || 0).toLocaleString()}
        </span>
        <span className={`font-mono ${sizeCfg.label} font-bold uppercase tracking-wider text-accent`}>
          CP
        </span>
      </div>
    </div>
  );
};

export default ProfileCPBalance;
