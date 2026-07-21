import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';
import { Trophy, Shield, FlaskConical, GraduationCap, Flame, Star } from 'lucide-react';
import type { ProfileData, Trophy as TrophyType, TrophyTier } from '@/shared/types/profile';
import { TIER_STYLES } from '@/shared/types/profile';
import { deriveTrophies } from '@/shared/utils/profileDerivations';
import ModuleHeader from './ModuleHeader';

interface TrophyCabinetProps {
  profile: ProfileData;
  className?: string;
}

const TrophyCabinet: React.FC<TrophyCabinetProps> = ({ profile, className = '' }) => {
  const { t } = useTranslation();
  const prefersReduced = useReducedMotion();

  const trophies = useMemo(() => deriveTrophies(profile), [profile]);

  if (trophies.length === 0) {
    return (
      <div className={`rounded-2xl border border-border/30 bg-bg-card p-6 ${className}`}>
        <ModuleHeader
          icon={<Trophy className="w-4 h-4 text-amber-400" />}
          iconClassName="bg-amber-400/10"
          title={t('profile.trophy.title', 'Trophy Cabinet')}
        />
        <p className="text-xs text-text-muted text-center py-4">
          {t('profile.trophy.empty', 'No trophies earned yet. Keep pushing!')}
        </p>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border border-border/30 bg-bg-card overflow-hidden ${className}`}>
      <ModuleHeader
        icon={<Trophy className="w-4 h-4 text-amber-400" />}
        iconClassName="bg-amber-400/10"
        title={t('profile.trophy.title', 'Trophy Cabinet')}
        trailing={
          <span className="px-2 py-1 bg-amber-400/10 text-amber-400 text-[9px] font-black rounded-lg">
            {trophies.length}
          </span>
        }
      />

      <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {trophies.map((trophy, idx) => {
          const styles = TIER_STYLES[trophy.tier];
          return (
            <motion.div
              key={trophy.id}
              initial={prefersReduced ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: prefersReduced ? 0 : 0.3, delay: prefersReduced ? 0 : idx * 0.05 }}
              className={`
                relative flex flex-col items-center text-center p-4 rounded-xl border
                transition-all duration-300 hover:scale-[1.02] cursor-default
                ${styles.border} ${styles.bg} ${styles.glow}
              `}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 ${styles.bg}`}>
                <Trophy className={`w-6 h-6 ${styles.text}`} />
              </div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-text-primary leading-tight mb-1">
                {trophy.title}
              </h4>
              <p className="text-[9px] text-text-muted leading-snug line-clamp-2">
                {trophy.description}
              </p>
              <span className={`
                mt-2 px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-wider
                ${styles.text} ${styles.bg}
              `}>
                {trophy.tier}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TrophyCabinet;
