import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';
import { Award, ChevronDown, ChevronUp } from 'lucide-react';
import { type Achievement, RARITY_STYLES, TYPE_ICONS, TYPE_COLORS } from './AchievementCard';
import BootcampBadge from '@/shared/components/BootcampBadge';
import ModuleHeader from './ModuleHeader';

interface CompletedRoom {
  roomId: number;
  title: string;
}

interface AchievementsSectionProps {
  rooms: CompletedRoom[];
  bootcampCompleted: boolean;
  labsCompleted?: number;
  coursesCompleted?: number;
  i18nPrefix?: string;
}

const PINNED_RARITIES = new Set(['rare', 'epic', 'legendary']);
const COLLAPSE_THRESHOLD = 8;

const AchievementsSection: React.FC<AchievementsSectionProps> = ({
  rooms,
  bootcampCompleted,
  labsCompleted = 0,
  coursesCompleted = 0,
  i18nPrefix,
}) => {
  const { t } = useTranslation();
  const prefersReduced = useReducedMotion();
  const prefix = i18nPrefix || 'student.profile';
  const [expanded, setExpanded] = useState(false);

  const achievements: Achievement[] = useMemo(() => {
    const result: Achievement[] = [];

    if (bootcampCompleted) {
      result.push({
        id: 'bootcamp-hpb',
        type: 'bootcamp',
        title: t(`${prefix}.achievements.hpbGraduate`, 'HPB Graduate'),
        description: t(`${prefix}.achievements.hpbGraduateDesc`, 'Completed the Hacker Protocol Bootcamp'),
        rarity: 'epic',
      });
    }

    const labCount = labsCompleted || rooms.length;
    if (labCount > 0) {
      result.push({
        id: 'labs-completed',
        type: 'lab',
        title: t(`${prefix}.achievements.labsCompleted`, 'Lab Operator'),
        description: t(`${prefix}.achievements.labsCompletedDesc`, `${labCount} lab${labCount !== 1 ? 's' : ''} completed`),
        rarity: labCount >= 10 ? 'rare' : labCount >= 5 ? 'uncommon' : 'common',
      });
    }

    if (coursesCompleted > 0) {
      result.push({
        id: 'courses-completed',
        type: 'course',
        title: t(`${prefix}.achievements.coursesCompleted`, 'Course Graduate'),
        description: t(`${prefix}.achievements.coursesCompletedDesc`, `${coursesCompleted} course${coursesCompleted !== 1 ? 's' : ''} completed`),
        rarity: coursesCompleted >= 5 ? 'rare' : coursesCompleted >= 2 ? 'uncommon' : 'common',
      });
    }

    rooms.forEach((room) => {
      result.push({
        id: `room-${room.roomId}`,
        type: 'challenge',
        title: room.title,
        description: t(`${prefix}.achievements.roomCompleted`, 'Room completed'),
        rarity: 'common',
      });
    });

    return result;
  }, [rooms, bootcampCompleted, labsCompleted, coursesCompleted, t, prefix]);

  const pinned = useMemo(
    () => achievements.filter((a) => PINNED_RARITIES.has(a.rarity || 'common')),
    [achievements],
  );

  const hasMore = achievements.length > COLLAPSE_THRESHOLD;
  const visibleGrid = expanded ? achievements : achievements.slice(0, COLLAPSE_THRESHOLD);

  if (achievements.length === 0) {
    return (
      <div className="rounded-2xl border border-border/30 bg-bg-card p-6">
        <ModuleHeader
          icon={<Award className="w-4 h-4 text-accent" />}
          iconClassName="bg-accent/10"
          title={t('profile.achievements.title', 'Achievements')}
        />
        <p className="text-xs text-text-muted text-center py-4">
          {t('profile.achievements.empty', 'No achievements yet. Start learning to earn your first!')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bootcamp Badge (if completed) */}
      {bootcampCompleted && (
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReduced ? 0 : 0.35 }}
          className="rounded-2xl border border-border/30 bg-bg-card p-5 flex items-center gap-4"
        >
          <BootcampBadge completed className="w-16 h-16" />
          <div>
            <h3 className="text-sm font-black text-text-primary">
              {t(`${prefix}.achievements.hpbGraduate`, 'HPB Graduate')}
            </h3>
            <p className="text-xs text-text-muted">
              {t(`${prefix}.achievements.hpbGraduateDesc`, 'Completed the Hacker Protocol Bootcamp')}
            </p>
          </div>
        </motion.div>
      )}

      {/* Pinned achievements shelf */}
      {pinned.length > 0 && (
        <div className="rounded-2xl border border-border/30 bg-bg-card p-5">
          <ModuleHeader
            icon={<Award className="w-4 h-4 text-accent" />}
            iconClassName="bg-accent/10"
            title={t('profile.achievements.pinned', 'Pinned')}
            trailing={
              <span className="px-2 py-1 bg-accent/10 text-accent text-[9px] font-black rounded-lg">
                {pinned.length}
              </span>
            }
          />
          <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
            {pinned.map((achievement, idx) => {
              const rarity = achievement.rarity || 'common';
              const styles = RARITY_STYLES[rarity];
              const typeIcon = achievement.icon || TYPE_ICONS[achievement.type];
              const typeColor = achievement.color || TYPE_COLORS[achievement.type];

              return (
                <motion.div
                  key={achievement.id}
                  initial={prefersReduced ? false : { opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: prefersReduced ? 0 : 0.3, delay: prefersReduced ? 0 : idx * 0.05 }}
                  className={`
                    relative flex flex-col items-center text-center p-4 rounded-xl border
                    min-w-[140px] shrink-0 transition-all duration-300 hover:scale-[1.02] cursor-default
                    ${styles.border} ${styles.bg} ${styles.glow}
                  `}
                >
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center mb-2
                    ${rarity === 'legendary' ? 'bg-amber-400/10' :
                      rarity === 'epic' ? 'bg-purple-400/10' :
                      rarity === 'rare' ? 'bg-blue-400/10' :
                      'bg-accent/10'}
                  `}>
                    <span className={typeColor}>{typeIcon}</span>
                  </div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-text-primary leading-tight mb-1">
                    {achievement.title}
                  </h4>
                  {achievement.description && (
                    <p className="text-[9px] text-text-muted leading-snug line-clamp-2">
                      {achievement.description}
                    </p>
                  )}
                  {rarity !== 'common' && (
                    <span className={`
                      mt-2 px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-wider
                      ${rarity === 'legendary' ? 'bg-amber-400/20 text-amber-400' :
                        rarity === 'epic' ? 'bg-purple-400/20 text-purple-400' :
                        rarity === 'rare' ? 'bg-blue-400/20 text-blue-400' :
                        'bg-accent/20 text-accent'}
                    `}>
                      {rarity}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Full achievement grid */}
      <div className="rounded-2xl border border-border/30 bg-bg-card overflow-hidden">
        <ModuleHeader
          icon={<Award className="w-4 h-4 text-accent" />}
          iconClassName="bg-accent/10"
          title={t('profile.achievements.title', 'Achievements')}
          trailing={
            <span className="px-2 py-1 bg-accent/10 text-accent text-[9px] font-black rounded-lg">
              {achievements.length}
            </span>
          }
        />

        <div className="p-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <AnimatePresence mode="popLayout">
            {visibleGrid.map((achievement, idx) => {
              const rarity = achievement.rarity || 'common';
              const styles = RARITY_STYLES[rarity];
              const typeIcon = achievement.icon || TYPE_ICONS[achievement.type];
              const typeColor = achievement.color || TYPE_COLORS[achievement.type];

              return (
                <motion.div
                  key={achievement.id}
                  layout
                  initial={prefersReduced ? false : { opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={prefersReduced ? undefined : { opacity: 0, scale: 0.9 }}
                  transition={{ duration: prefersReduced ? 0 : 0.3, delay: prefersReduced ? 0 : idx * 0.03 }}
                  className={`
                    relative group flex flex-col items-center text-center p-4 rounded-xl border
                    transition-all duration-300 hover:scale-[1.02] cursor-default
                    ${styles.border} ${styles.bg} ${styles.glow}
                  `}
                >
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center mb-3
                    ${rarity === 'legendary' ? 'bg-amber-400/10' :
                      rarity === 'epic' ? 'bg-purple-400/10' :
                      rarity === 'rare' ? 'bg-blue-400/10' :
                      'bg-accent/10'}
                  `}>
                    <span className={typeColor}>{typeIcon}</span>
                  </div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-text-primary leading-tight mb-1">
                    {achievement.title}
                  </h4>
                  {achievement.description && (
                    <p className="text-[9px] text-text-muted leading-snug line-clamp-2">
                      {achievement.description}
                    </p>
                  )}
                  {rarity !== 'common' && (
                    <span className={`
                      mt-2 px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-wider
                      ${rarity === 'legendary' ? 'bg-amber-400/20 text-amber-400' :
                        rarity === 'epic' ? 'bg-purple-400/20 text-purple-400' :
                        rarity === 'rare' ? 'bg-blue-400/20 text-blue-400' :
                        'bg-accent/20 text-accent'}
                    `}>
                      {rarity}
                    </span>
                  )}
                  {achievement.earnedAt && (
                    <span className="mt-2 text-[8px] text-text-muted/50 font-mono">
                      {new Date(achievement.earnedAt).toLocaleDateString()}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {hasMore && (
          <div className="px-5 pb-5">
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border/30 bg-bg-elevated text-xs font-black uppercase tracking-widest text-text-muted hover:border-accent/30 hover:text-text-primary transition-all"
            >
              {expanded ? (
                <>{t('profile.achievements.showLess', 'Show less')} <ChevronUp className="w-3.5 h-3.5" /></>
              ) : (
                <>{t('profile.achievements.showAll', 'Show all')} ({achievements.length}) <ChevronDown className="w-3.5 h-3.5" /></>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementsSection;
