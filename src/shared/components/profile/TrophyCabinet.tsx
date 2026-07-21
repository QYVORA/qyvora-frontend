import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Trophy, Shield, FlaskConical, GraduationCap, Flame, Star } from 'lucide-react';
import type { ProfileData, Trophy as TrophyType, TrophyTier } from '@/shared/types/profile';
import { TIER_STYLES } from '@/shared/types/profile';

interface TrophyCabinetProps {
  profile: ProfileData;
  className?: string;
}

/**
 * Derives trophies from available profile data.
 * Trophy tiers are based on milestones.
 */
function deriveTrophies(profile: ProfileData): TrophyType[] {
  const trophies: TrophyType[] = [];

  if (profile.bootcampCompleted) {
    trophies.push({
      id: 'hpb-graduate',
      title: 'HPB Graduate',
      description: 'Completed the Hacker Protocol Bootcamp',
      tier: 'gold',
      earnedAt: undefined,
    });
  }

  if (profile.labsCompleted >= 50) {
    trophies.push({
      id: 'lab-master',
      title: 'Lab Master',
      description: `${profile.labsCompleted} labs completed`,
      tier: 'platinum',
    });
  } else if (profile.labsCompleted >= 20) {
    trophies.push({
      id: 'lab-expert',
      title: 'Lab Expert',
      description: `${profile.labsCompleted} labs completed`,
      tier: 'gold',
    });
  } else if (profile.labsCompleted >= 10) {
    trophies.push({
      id: 'lab-operator',
      title: 'Lab Operator',
      description: `${profile.labsCompleted} labs completed`,
      tier: 'silver',
    });
  } else if (profile.labsCompleted >= 1) {
    trophies.push({
      id: 'first-lab',
      title: 'First Lab',
      description: 'Completed first lab',
      tier: 'bronze',
    });
  }

  if (profile.coursesCompleted >= 5) {
    trophies.push({
      id: 'scholar',
      title: 'Scholar',
      description: `${profile.coursesCompleted} courses completed`,
      tier: 'platinum',
    });
  } else if (profile.coursesCompleted >= 2) {
    trophies.push({
      id: 'course-graduate',
      title: 'Course Graduate',
      description: `${profile.coursesCompleted} courses completed`,
      tier: 'silver',
    });
  } else if (profile.coursesCompleted >= 1) {
    trophies.push({
      id: 'first-course',
      title: 'First Course',
      description: 'Completed first course',
      tier: 'bronze',
    });
  }

  if (profile.cp >= 1500) {
    trophies.push({
      id: 'vanguard',
      title: 'Vanguard',
      description: 'Reached Vanguard rank',
      tier: 'diamond',
    });
  } else if (profile.cp >= 900) {
    trophies.push({
      id: 'architect',
      title: 'Architect',
      description: 'Reached Architect rank',
      tier: 'platinum',
    });
  } else if (profile.cp >= 450) {
    trophies.push({
      id: 'specialist',
      title: 'Specialist',
      description: 'Reached Specialist rank',
      tier: 'gold',
    });
  } else if (profile.cp >= 150) {
    trophies.push({
      id: 'contributor',
      title: 'Contributor',
      description: 'Reached Contributor rank',
      tier: 'silver',
    });
  }

  return trophies;
}

const TrophyCabinet: React.FC<TrophyCabinetProps> = ({ profile, className = '' }) => {
  const { t } = useTranslation();

  const trophies = useMemo(() => deriveTrophies(profile), [profile]);

  if (trophies.length === 0) {
    return (
      <div className={`rounded-2xl border border-border/30 bg-bg-card p-6 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center">
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <h3 className="text-xs font-black uppercase tracking-widest text-text-muted">
            {t('profile.trophy.title', 'Trophy Cabinet')}
          </h3>
        </div>
        <p className="text-xs text-text-muted text-center py-4">
          {t('profile.trophy.empty', 'No trophies earned yet. Keep pushing!')}
        </p>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border border-border/30 bg-bg-card overflow-hidden ${className}`}>
      <div className="px-5 py-4 border-b border-border/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center">
              <Trophy className="w-4 h-4 text-amber-400" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-widest text-text-muted">
              {t('profile.trophy.title', 'Trophy Cabinet')}
            </h3>
          </div>
          <span className="px-2 py-1 bg-amber-400/10 text-amber-400 text-[9px] font-black rounded-lg">
            {trophies.length}
          </span>
        </div>
      </div>

      <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {trophies.map((trophy, idx) => {
          const styles = TIER_STYLES[trophy.tier];
          return (
            <motion.div
              key={trophy.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
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
