import { useTranslation } from 'react-i18next';
import {
  SKILL_DEFINITIONS,
  computeAllSkills,
  extractBootcampCompletedIds,
} from '@/features/student/utils/skillRegistry';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';
import CpLogo from '@/shared/components/CpLogo';

interface OverviewModule {
  moduleId?: number;
  title?: string;
  progress?: number;
  roomsCompleted?: number;
  roomsTotal?: number;
}

interface SkillStatsProps {
  modules: OverviewModule[];
}

interface SkillEntry {
  key: string;
  shortLabel: string;
  label: string;
  color: string;
  level: number;
  completed: number;
  total: number;
}

interface SkillStatsResult {
  skills: SkillEntry[];
  average: number;
}

export const computeSkillStats = (modules: OverviewModule[]): SkillStatsResult => {
  const bootcampCompleted = extractBootcampCompletedIds(modules);
  const allSkills = computeAllSkills(bootcampCompleted);

  const skills = allSkills.map((s) => {
    const def = SKILL_DEFINITIONS.find((d) => d.key === s.skillKey)!;
    return {
      ...def,
      level: s.progress.percentage,
      completed: s.progress.completed,
      total: s.progress.total,
    };
  });

  const total = skills.reduce((sum, s) => sum + s.level, 0);
  const average = skills.length > 0 ? Math.round(total / skills.length) : 0;

  return { skills, average };
};

const SkillStats = ({ modules }: SkillStatsProps) => {
  const { t } = useTranslation();
  const { skills, average } = computeSkillStats(modules);
  const prefersReduced = useReducedMotion();

  return (
    <div className="flex flex-col gap-4 md:gap-5 h-full">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.25em] text-text-primary">
            {t('student.dashboard.skillStats', 'Skill Progress')}
          </h3>
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mt-0.5">
            {t('student.dashboard.skillStatsSub', 'Completion')}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-bg-elevated border border-border/50">
          <CpLogo className="w-4 h-4" />
          <span className="text-sm font-black text-accent tabular-nums">{average}%</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-around gap-3 md:gap-4">
        {skills.map((skill, i) => (
          <div key={skill.key} className="flex items-center gap-3 md:gap-3.5 lg:gap-4">
            <span className="shrink-0 w-[72px] md:w-[84px] lg:w-[96px]">
              <span className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: skill.color, boxShadow: `0 0 6px ${skill.color}` }}
                />
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-text-muted truncate">
                  {skill.shortLabel}
                </span>
              </span>
            </span>
            <div className="flex-1 h-3 md:h-3.5 lg:h-4 rounded-full bg-accent-dim/15 overflow-hidden">
              <div
                className="h-full rounded-full origin-left"
                style={{
                  width: `${skill.level}%`,
                  background: `linear-gradient(90deg, ${skill.color}66, ${skill.color})`,
                  animation: prefersReduced ? undefined : `skill-bar-grow 1s cubic-bezier(0.22, 1, 0.36, 1) ${80 + i * 90}ms both`,
                }}
              />
            </div>
            <span className="text-[9px] md:text-[10px] font-black text-text-primary w-12 md:w-14 lg:w-16 text-right tabular-nums shrink-0">
              {skill.completed}/{skill.total}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes skill-bar-grow {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
};

export default SkillStats;
