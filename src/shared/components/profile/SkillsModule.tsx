import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Cpu } from 'lucide-react';
import {
  SKILL_DEFINITIONS,
  computeAllSkills,
  extractBootcampCompletedIds,
} from '@/features/student/utils/skillRegistry';

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
      <div className="px-5 py-4 border-b border-border/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <Cpu className="w-4 h-4 text-accent" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-widest text-text-muted">
              {t('profile.skills.title', 'Skills')}
            </h3>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">
            {t('profile.skills.overall', 'Overall')}{' '}
            <span className="text-accent">{overallAverage}%</span>
          </span>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {skills.map((skill, idx) => (
          <motion.div
            key={skill.key}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.04 }}
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
                initial={{ width: 0 }}
                animate={{ width: `${skill.percentage}%` }}
                transition={{ duration: 0.6, delay: idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
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
