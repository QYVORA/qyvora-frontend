import {
  SKILL_DEFINITIONS,
  computeAllSkills,
  extractBootcampCompletedIds,
} from '@/features/student/utils/skillRegistry';

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
  const { skills } = computeSkillStats(modules);

  return (
    <div className="flex flex-col justify-between h-full">
      {skills.map((skill) => (
        <div key={skill.key} className="flex items-center gap-3">
          <div
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: skill.color }}
          />
          <span className="text-[10px] font-black uppercase tracking-widest text-text-muted min-w-[80px] truncate">
            {skill.shortLabel}
          </span>
          <div className="flex-1 h-2.5 rounded-full bg-accent-dim/20 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${skill.level}%`, backgroundColor: skill.color }}
            />
          </div>
          <span className="text-[10px] font-black text-text-primary w-12 text-right tabular-nums">
            {skill.completed}/{skill.total}
          </span>
        </div>
      ))}
    </div>
  );
};

export default SkillStats;
