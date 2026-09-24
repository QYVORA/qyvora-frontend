import { useMemo } from 'react';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';
import BootcampBadge from '@/shared/components/BootcampBadge';
import CpLogo from '@/shared/components/CpLogo';
import CourseBadge from '@/shared/components/CourseBadge';
import { QyvoraMark } from '@/shared/components/brand';
import type { ProfileData } from '@/shared/types/profile';
import { TIER_STYLES } from '@/shared/types/profile';
import { deriveTrophies } from '@/shared/utils/profileDerivations';
import ModuleHeader from './ModuleHeader';

interface TrophyCabinetProps {
  profile: ProfileData;
  className?: string;
}

const RANK_TROPHY_ID_PREFIX = 'rank-';
const COURSE_TROPHY_IDS = new Set(['scholar', 'course-graduate', 'first-course']);

/**
 * Trophy artwork — real webp assets live in `src/assets/trophies/<id>.webp`
 * (see docs/TROPHY-SPECS.md for the generation prompts). When an asset exists
 * it wins; the branded SVG visuals only act as fallbacks.
 */
const TROPHY_ASSETS = import.meta.glob<string>('/src/assets/trophies/*.webp', {
  eager: true,
  import: 'default',
});

function resolveTrophyArt(id: string): string | undefined {
  if (TROPHY_ASSETS[`/src/assets/trophies/${id}.webp`]) {
    return TROPHY_ASSETS[`/src/assets/trophies/${id}.webp`];
  }
  if (id.startsWith(RANK_TROPHY_ID_PREFIX) && TROPHY_ASSETS['/src/assets/trophies/rank.webp']) {
    return TROPHY_ASSETS['/src/assets/trophies/rank.webp'];
  }
  return undefined;
}

function TrophyVisual({ id, profile }: { id: string; profile: ProfileData }) {
  const art = resolveTrophyArt(id);
  if (art) {
    return (
      <img
        src={art}
        alt=""
        aria-hidden="true"
        loading="lazy"
        draggable={false}
        className="h-12 w-12 object-contain"
      />
    );
  }
  if (id === 'hpb-graduate') return <BootcampBadge completed className="w-12 h-12" />;
  if (id.startsWith(RANK_TROPHY_ID_PREFIX)) return <CpLogo className="w-8 h-8" />;
  if (COURSE_TROPHY_IDS.has(id) && profile.completedCourseIds?.[0]) {
    return <CourseBadge courseId={profile.completedCourseIds[0]} className="w-10 h-10" />;
  }
  return <QyvoraMark className="w-8 h-8" />;
}

const TrophyCabinet: React.FC<TrophyCabinetProps> = ({ profile, className = '' }) => {
  const prefersReduced = useReducedMotion();

  const trophies = useMemo(() => deriveTrophies(profile), [profile]);

  if (trophies.length === 0) {
    return (
      <div className={`rounded-2xl border border-border-subtle bg-surface p-5 md:p-6 ${className}`}>
        <ModuleHeader icon={<QyvoraMark className="h-4 w-4" />} title="Trophy Cabinet" />
        <p className="py-4 text-center text-sm text-text-muted">No trophies earned yet. Keep pushing!</p>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border border-border-subtle bg-surface p-5 md:p-6 ${className}`}>
      <ModuleHeader
        icon={<QyvoraMark className="h-4 w-4" />}
        title="Trophy Cabinet"
        trailing={
          <span className="rounded-md bg-accent/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-accent">
            {trophies.length}
          </span>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {trophies.map((trophy, idx) => {
          const styles = TIER_STYLES[trophy.tier];
          return (
            <motion.div
              key={trophy.id}
              initial={prefersReduced ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: prefersReduced ? 0 : 0.3, delay: prefersReduced ? 0 : idx * 0.05 }}
              className={`relative flex flex-col items-center rounded-xl border p-4 text-center ${styles.border} ${styles.bg}`}
            >
              <div className={`mb-2 flex h-12 w-12 items-center justify-center rounded-xl ${styles.bg}`}>
                <TrophyVisual id={trophy.id} profile={profile} />
              </div>
              <h4 className="mb-1 text-xs font-black uppercase tracking-widest leading-tight text-text-primary">
                {trophy.title}
              </h4>
              <p className="line-clamp-2 text-xs leading-snug text-text-muted">
                {trophy.description}
              </p>
              <span className={`mt-2 rounded px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${styles.text} ${styles.bg}`}>
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