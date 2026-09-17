import { useMemo } from 'react';
import {
  SKILL_DEFINITIONS,
  computeAllSkills,
  extractBootcampCompletedIds,
} from '@/features/student/utils/skillRegistry';
import SkillRadarChart from './SkillRadarChart';
import SkillStats, { computeSkillStats } from './SkillStats';

interface OverviewModule {
  moduleId?: number;
  title?: string;
  progress?: number;
  roomsCompleted?: number;
  roomsTotal?: number;
}

interface SkillMatrixProps {
  modules: OverviewModule[];
}

const SkillMatrix = ({ modules }: SkillMatrixProps) => {

  const radarData = useMemo(() => {
    const bootcampCompleted = extractBootcampCompletedIds(modules);
    const allSkills = computeAllSkills(bootcampCompleted);

    return allSkills.map((s) => {
      const def = SKILL_DEFINITIONS.find((d) => d.key === s.skillKey)!;
      return {
        axis: def.shortLabel,
        label: def.label,
        value: s.progress.percentage,
        color: def.color,
      };
    });
  }, [modules]);

  const { average } = useMemo(() => computeSkillStats(modules), [modules]);

  return (
    <div className="relative">
      {/* Section header */}
      <div className="flex items-center justify-between gap-3 mb-4 md:mb-6">
        <div>
          <h2 className="text-lg md:text-xl font-black uppercase tracking-tight text-text-primary">
            {"Skill Matrix"}
          </h2>
          <p className="text-xs md:text-xs font-bold uppercase tracking-widest text-text-muted mt-1.5">
            {"Overall"} &middot; {average}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5 lg:h-[480px]">
        {/* Radar Chart Card */}
        <div className="rounded-2xl border border-border-subtle bg-surface p-5 md:p-6 flex flex-col min-h-[420px] lg:min-h-0">
          <div className="flex-1 min-h-0 flex items-center justify-center">
            <SkillRadarChart data={radarData} />
          </div>
        </div>

        {/* Skill Stats Card */}
        <div className="rounded-2xl border border-border-subtle bg-surface p-5 md:p-6 flex flex-col min-h-[420px] lg:min-h-0">
          <SkillStats modules={modules} />
        </div>
      </div>
    </div>
  );
};

export default SkillMatrix;
