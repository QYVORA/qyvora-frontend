import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';
import { Award, ChevronDown, ChevronUp, FlaskConical } from 'lucide-react';
import { type Achievement, RARITY_STYLES } from './AchievementCard';
import HpbAvatar from '@/shared/components/HpbAvatar';
import BootcampBadge from '@/shared/components/BootcampBadge';
import LabBadge from '@/shared/components/LabBadge';
import { QyvoraMark } from '@/shared/components/brand';
import ModuleHeader from './ModuleHeader';
import { BOOTCAMP_CONFIG, PHASE_COLORS } from '@/features/student/constants/bootcampStructure';
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
  i18nPrefix?: string;
}

const PINNED_RARITIES = new Set(['rare', 'epic', 'legendary']);

const LAB_BADGE_IDS = ['privesc', 'passwords', 'sqli', 'osint', 'killchain'] as const;

const AchievementsSection: React.FC<AchievementsSectionProps> = ({
  rooms,
  bootcampCompleted,
  labsCompleted = 0,
  coursesCompleted = 0,
  completedPhaseIds = [],
  completedCourseIds = [],
  skillAchievements = [],
  i18nPrefix,
}) => {
  const { t } = useTranslation();
  const prefersReduced = useReducedMotion();
  const prefix = i18nPrefix || 'student.profile';
  const [expanded, setExpanded] = useState(false);

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
        color: PHASE_COLORS[phase!.id] || '#06B66F',
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

  const pinnedPhaseCount = phaseAchievements.filter((a) => PINNED_RARITIES.has(a.rarity)).length;
  const pinnedCourseCount = courseAchievements.filter((a) => PINNED_RARITIES.has(a.rarity)).length;
  const pinnedLabCount = labCount >= 10 ? 1 : 0;
  const pinnedSkillCount = skillAchievements.filter((sa) => PINNED_RARITIES.has(sa.rarity)).length;
  const totalPinned = pinnedPhaseCount + pinnedCourseCount + pinnedLabCount + pinnedSkillCount;

  const totalAchievements = phaseAchievements.length + courseAchievements.length + (labCount > 0 ? 1 : 0) + skillAchievements.length;

  if (totalAchievements === 0) {
    return (
      <div className="rounded-2xl border border-border/50 bg-bg-card p-6">
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
      {bootcampCompleted && (
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReduced ? 0 : 0.35 }}
          className="flex items-center gap-4"
        >
          <BootcampBadge completed className="w-24 sm:w-28" />
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

      {/* Bootcamp Phases */}
      {phaseAchievements.length > 0 && (
        <div>
          <ModuleHeader
            icon={<Award className="w-4 h-4 text-accent" />}
            iconClassName="bg-accent/10"
            title={t('profile.achievements.bootcampPhases', 'Bootcamp Phases')}
            trailing={
              <span className="px-2 py-1 bg-accent/10 text-accent text-[9px] font-black rounded-lg">
                {phaseAchievements.length}
              </span>
            }
          />
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {phaseAchievements.map((a, idx) => (
                <motion.div
                  key={a.id}
                  layout
                  initial={prefersReduced ? false : { opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={prefersReduced ? undefined : { opacity: 0, scale: 0.9 }}
                  transition={{ duration: prefersReduced ? 0 : 0.3, delay: prefersReduced ? 0 : idx * 0.03 }}
                  className="relative group flex flex-col items-center text-center p-4 rounded-xl border border-border/50 bg-bg-card transition-all duration-300 hover:scale-[1.02] cursor-default"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-bg-elevated">
                    {a.iconNode}
                  </div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-text-primary leading-tight mb-1">
                    {a.title}
                  </h4>
                  {a.description && (
                    <p className="text-[9px] text-text-muted leading-snug line-clamp-2">
                      {a.description}
                    </p>
                  )}
                  {a.color && (
                    <span
                      className="mt-2 inline-block w-2 h-2 rounded-full"
                      style={{ backgroundColor: a.color }}
                    />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Courses */}
      {courseAchievements.length > 0 && (
        <div>
          <ModuleHeader
            icon={<Award className="w-4 h-4 text-blue-400" />}
            iconClassName="bg-blue-400/10"
            title={t('profile.achievements.courses', 'Courses')}
            trailing={
              <span className="px-2 py-1 bg-blue-400/10 text-blue-400 text-[9px] font-black rounded-lg">
                {courseAchievements.length}
              </span>
            }
          />
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {courseAchievements.map((a, idx) => {
                const IconComp = a.IconComponent;
                return (
                  <motion.div
                    key={a.id}
                    layout
                    initial={prefersReduced ? false : { opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={prefersReduced ? undefined : { opacity: 0, scale: 0.9 }}
                    transition={{ duration: prefersReduced ? 0 : 0.3, delay: prefersReduced ? 0 : idx * 0.03 }}
                    className="relative group flex flex-col items-center text-center p-4 rounded-xl border border-border/50 bg-bg-card transition-all duration-300 hover:scale-[1.02] cursor-default"
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-blue-400/10">
                      {IconComp ? (
                        <IconComp className="w-6 h-6 text-blue-400" />
                      ) : (
                        <QyvoraMark className="w-5 h-5" />
                      )}
                    </div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-text-primary leading-tight mb-1">
                      {a.title}
                    </h4>
                    {a.description && (
                      <p className="text-[9px] text-text-muted leading-snug line-clamp-2">
                        {a.description}
                      </p>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Labs */}
      {labCount > 0 && (
        <div>
          <ModuleHeader
            icon={<FlaskConical className="w-4 h-4 text-red-400" />}
            iconClassName="bg-red-400/10"
            title={t('profile.achievements.labs', 'Labs')}
            trailing={
              <span className="px-2 py-1 bg-red-400/10 text-red-400 text-[9px] font-black rounded-lg">
                {labCount}
              </span>
            }
          />
          <div className="mt-3">
            <div className="flex flex-col items-center text-center p-4 rounded-xl border border-border/50 bg-bg-card max-w-[280px]">
              <div className="flex items-center gap-2 mb-3">
                {LAB_BADGE_IDS.map((labId) => (
                  <LabBadge key={labId} labId={labId} className="w-9 h-9" />
                ))}
              </div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-text-primary leading-tight mb-1">
                {t('profile.achievements.labsCompleted', 'Lab Operator')}
              </h4>
              <p className="text-[9px] text-text-muted leading-snug">
                {t('profile.achievements.labsCompletedDesc', `${labCount} lab${labCount !== 1 ? 's' : ''} completed`)}
              </p>
              {(labCount >= 5 || labCount >= 10) && (
                <span className={`mt-2 px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-wider ${
                  labCount >= 10
                    ? 'bg-blue-400/20 text-blue-400'
                    : 'bg-accent/20 text-accent'
                }`}>
                  {labCount >= 10 ? 'rare' : 'uncommon'}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Skill Achievements */}
      {skillAchievements.length > 0 && (
        <div>
          <ModuleHeader
            icon={<Award className="w-4 h-4 text-accent" />}
            iconClassName="bg-accent/10"
            title={t('profile.achievements.skills', 'Skill Badges')}
            trailing={
              <span className="px-2 py-1 bg-accent/10 text-accent text-[9px] font-black rounded-lg">
                {skillAchievements.length}
              </span>
            }
          />
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {skillAchievements.map((sa, idx) => {
                const rarity = sa.rarity || 'common';
                const styles = RARITY_STYLES[rarity];
                return (
                  <motion.div
                    key={`skill-${sa.skill}`}
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
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                      style={{ backgroundColor: `${sa.color}15` }}
                    >
                      <Award className="w-5 h-5" style={{ color: sa.color }} />
                    </div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-text-primary leading-tight mb-1">
                      {sa.label}
                    </h4>
                    <p className="text-[9px] text-text-muted leading-snug line-clamp-2">
                      {sa.scenariosCompleted} scenario{sa.scenariosCompleted !== 1 ? 's' : ''} completed
                    </p>
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
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementsSection;
