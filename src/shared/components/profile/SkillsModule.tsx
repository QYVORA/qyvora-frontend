import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';
import { Cpu } from 'lucide-react';
import {
  SKILL_DEFINITIONS,
  computeAllSkills,
  extractBootcampCompletedIds,
} from '@/features/student/utils/skillRegistry';
import ModuleHeader from './ModuleHeader';

interface OverviewModule {
  moduleId?: number;
  roomsCompleted?: number;
  roomsTotal?: number;
}

interface SkillsModuleProps {
  modules: OverviewModule[];
  className?: string;
}

const SkillsModule: React.FC<SkillsModuleProps> = ({ modules, className = '' }) => {
  const { t } = useTranslation();
  const prefersReduced = useReducedMotion();

  const skills = useMemo(() => {
    const bootcampCompleted = extractBootcampCompletedIds(modules);
    const allSkills = computeAllSkills(bootcampCompleted);

    return allSkills.map((s) => {
      const def = SKILL_DEFINITIONS.find((d) => d.key === s.skillKey)!;
      return {
        ...def,
        completed: s.progress.completed,
        total: s.progress.total,
        percentage: s.progress.percentage,
      };
    });
  }, [modules]);

  const overallAverage = useMemo(() => {
    if (skills.length === 0) return 0;
    return Math.round(skills.reduce((sum, s) => sum + s.percentage, 0) / skills.length);
  }, [skills]);

  return (
    <div className={`rounded-2xl border border-border/30 bg-bg-card overflow-hidden ${className}`}>
      <ModuleHeader
        icon={<Cpu className="w-4 h-4 text-accent" />}
        iconClassName="bg-accent/10"
        title={t('profile.skills.title', 'Skills')}
        trailing={
          <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">
            {t('profile.skills.overall', 'Overall')}{' '}
            <span className="text-accent">{overallAverage}%</span>
          </span>
        }
      />

      <div className="p-5 space-y-4">
        {skills.map((skill, idx) => (
          <motion.div
            key={skill.key}
            initial={prefersReduced ? false : { opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: prefersReduced ? 0 : 0.3, delay: prefersReduced ? 0 : idx * 0.04 }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: skill.color }}
                />
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                  {skill.shortLabel}
                </span>
              </div>
              <span className="text-[10px] font-mono text-text-muted/60">
                {skill.completed}/{skill.total}
              </span>
            </div>
            <div className="h-2 rounded-full bg-border/20 overflow-hidden">
              <motion.div
                initial={prefersReduced ? false : { width: 0 }}
                animate={{ width: `${skill.percentage}%` }}
                transition={{ duration: prefersReduced ? 0 : 0.6, delay: prefersReduced ? 0 : idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="h-full rounded-full"
                style={{ backgroundColor: skill.color }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SkillsModule;
