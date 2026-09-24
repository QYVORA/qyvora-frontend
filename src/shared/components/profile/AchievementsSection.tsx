import { useMemo } from 'react';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';
import { RARITY_STYLES } from './AchievementCard';
import HpbAvatar from '@/shared/components/HpbAvatar';
import BootcampBadge from '@/shared/components/BootcampBadge';
import LabBadge from '@/shared/components/LabBadge';
import { QyvoraMark } from '@/shared/components/brand';
import ModuleHeader from './ModuleHeader';
import { BOOTCAMP_CONFIG } from '@/features/student/constants/bootcampStructure';
import { COURSES } from '@/features/student/data/courses/courseData';
import { COURSE_ICON_MAP } from '@/features/student/data/courses/courseIcons';

interface SkillAchievement {
  skill: string;
  label: string;
  color: string;
  scenariosCompleted: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

interface AchievementsSectionProps {
  rooms: { roomId: number; title: string }[];
  bootcampCompleted: boolean;
  labsCompleted?: number;
  coursesCompleted?: number;
  completedPhaseIds?: string[];
  completedCourseIds?: string[];
  skillAchievements?: SkillAchievement[];
}

const LAB_BADGE_IDS = ['privesc', 'passwords', 'sqli', 'osint', 'killchain'] as const;

function CountBadge({ count }: { count: number }) {
  return (
    <span className="rounded-md bg-accent/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-accent">
      {count}
    </span>
  );
}

const AchievementsSection: React.FC<AchievementsSectionProps> = ({
  rooms,
  bootcampCompleted,
  labsCompleted = 0,
  coursesCompleted = 0,
  completedPhaseIds = [],
  completedCourseIds = [],
  skillAchievements = [],
}) => {
  const prefersReduced = useReducedMotion();

  const phaseAchievements = useMemo(() => {
    const phaseMap = new Map(BOOTCAMP_CONFIG.phases.map((p) => [p.id, p]));
    return completedPhaseIds
      .map((id) => phaseMap.get(id))
      .filter(Boolean)
      .map((phase) => ({
        id: `phase-${phase!.id}`,
        type: 'bootcamp' as const,
        title: phase!.title,
        description: phase!.codename,
        rarity: 'uncommon' as const,
        iconNode: <HpbAvatar variant={phase!.id as 'phase1'} size="xs" />,
      }));
  }, [completedPhaseIds]);

  const courseAchievements = useMemo(() => {
    const courseMap = new Map(COURSES.map((c) => [c.id, c]));
    return completedCourseIds
      .map((id) => courseMap.get(id))
      .filter(Boolean)
      .map((course) => {
        const iconCfg = COURSE_ICON_MAP[course!.id];
        return {
          id: `course-${course!.id}`,
          type: 'course' as const,
          title: course!.title,
          description: course!.categoryId,
          rarity: 'common' as const,
          IconComponent: iconCfg?.icon,
        };
      });
  }, [completedCourseIds]);

  const labCount = labsCompleted || rooms.length;
  const totalAchievements = phaseAchievements.length + courseAchievements.length + (labCount > 0 ? 1 : 0) + skillAchievements.length;

  if (totalAchievements === 0) {
    return (
      <div className="rounded-2xl border border-border-subtle bg-surface p-5 md:p-6">
        <ModuleHeader icon={<QyvoraMark className="h-4 w-4" />} title="Achievements" />
        <p className="py-4 text-center text-sm text-text-muted">
          No achievements yet. Start learning to earn your first!
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border-subtle bg-surface p-5 md:p-6">
      <ModuleHeader
        icon={<QyvoraMark className="h-4 w-4" />}
        title="Achievements"
        trailing={<CountBadge count={totalAchievements} />}
      />

      <div className="space-y-8">
        {bootcampCompleted && (
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReduced ? 0 : 0.35 }}
            className="flex items-center gap-4 rounded-xl border border-border-subtle bg-surface-raised/60 px-4 py-3"
          >
            <BootcampBadge completed className="w-16 shrink-0 sm:w-20" />
            <div className="min-w-0">
              <h3 className="text-sm font-black text-text-primary">HPB Graduate</h3>
              <p className="truncate text-xs text-text-muted">
                Completed the Hacker Protocol Bootcamp
              </p>
            </div>
          </motion.div>
        )}

        {phaseAchievements.length > 0 && (
          <div>
            <div className="mb-3 flex items-center justify-between gap-2">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                Bootcamp Phases
              </h4>
              <CountBadge count={phaseAchievements.length} />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {phaseAchievements.map((a, idx) => (
                <motion.div
                  key={a.id}
                  initial={prefersReduced ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: prefersReduced ? 0 : 0.3, delay: prefersReduced ? 0 : idx * 0.03 }}
                  className="flex flex-col items-center rounded-xl border border-border-subtle bg-surface-raised/60 p-4 text-center"
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-surface">
                    {a.iconNode}
                  </div>
                  <h4 className="mb-1 text-xs font-black uppercase tracking-widest leading-tight text-text-primary">
                    {a.title}
                  </h4>
                  {a.description && (
                    <p className="line-clamp-2 text-xs leading-snug text-text-muted">
                      {a.description}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {courseAchievements.length > 0 && (
          <div>
            <div className="mb-3 flex items-center justify-between gap-2">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                Courses
              </h4>
              <CountBadge count={courseAchievements.length} />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {courseAchievements.map((a, idx) => {
                const IconComp = a.IconComponent;
                return (
                  <motion.div
                    key={a.id}
                    initial={prefersReduced ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: prefersReduced ? 0 : 0.3, delay: prefersReduced ? 0 : idx * 0.03 }}
                    className="flex flex-col items-center rounded-xl border border-border-subtle bg-surface-raised/60 p-4 text-center"
                  >
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-surface">
                      {IconComp ? (
                        <IconComp className="h-6 w-6" />
                      ) : (
                        <QyvoraMark className="h-5 w-5" />
                      )}
                    </div>
                    <h4 className="mb-1 text-xs font-black uppercase tracking-widest leading-tight text-text-primary">
                      {a.title}
                    </h4>
                    {a.description && (
                      <p className="line-clamp-2 text-xs leading-snug text-text-muted">
                        {a.description}
                      </p>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {labCount > 0 && (
          <div>
            <div className="mb-3 flex items-center justify-between gap-2">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                Labs
              </h4>
              <CountBadge count={labCount} />
            </div>
            <div className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-border-subtle bg-surface-raised/60 px-4 py-4 sm:gap-6">
              {LAB_BADGE_IDS.map((labId) => (
                <LabBadge key={labId} labId={labId} className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20" />
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <h4 className="text-xs font-black uppercase tracking-widest text-text-primary">
                Lab Operator
              </h4>
              <p className="text-xs leading-snug text-text-muted">
                {`${labCount} labs completed`}
              </p>
              {labCount >= 5 && (
                <span className="rounded px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider bg-accent/10 text-accent">
                  {labCount >= 10 ? 'rare' : 'uncommon'}
                </span>
              )}
            </div>
          </div>
        )}

        {skillAchievements.length > 0 && (
          <div>
            <div className="mb-3 flex items-center justify-between gap-2">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                Skill Badges
              </h4>
              <CountBadge count={skillAchievements.length} />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {skillAchievements.map((sa, idx) => {
                const rarity = sa.rarity || 'common';
                const styles = RARITY_STYLES[rarity];
                return (
                  <motion.div
                    key={`skill-${sa.skill}`}
                    initial={prefersReduced ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: prefersReduced ? 0 : 0.3, delay: prefersReduced ? 0 : idx * 0.03 }}
                    className={`flex flex-col items-center rounded-xl border p-4 text-center ${styles.border} ${styles.bg}`}
                  >
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-surface">
                      <QyvoraMark className="h-5 w-5" />
                    </div>
                    <h4 className="mb-1 text-xs font-black uppercase tracking-widest leading-tight text-text-primary">
                      {sa.label}
                    </h4>
                    <p className="line-clamp-2 text-xs leading-snug text-text-muted">
                      {sa.scenariosCompleted} scenario{sa.scenariosCompleted !== 1 ? 's' : ''} completed
                    </p>
                    {rarity !== 'common' && (
                      <span className="mt-2 rounded bg-accent/10 px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-accent">
                        {rarity}
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementsSection;