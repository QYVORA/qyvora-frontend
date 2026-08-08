import { useMemo } from 'react';
import {
  SKILL_DEFINITIONS,
  computeAllSkills,
  extractBootcampCompletedIds,
} from '@/features/student/utils/skillRegistry';
import SkillRadarChart from './SkillRadarChart';
import SkillStats from './SkillStats';

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

    const radar = allSkills.map((s) => {
      const def = SKILL_DEFINITIONS.find((d) => d.key === s.skillKey)!;
      return {
        axis: def.shortLabel,
        label: def.label,
        value: s.progress.percentage,
        color: def.color,
      };
    });

    return radar;
  }, [modules]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 lg:h-[460px]">
      {/* Radar Chart Card */}
      <div className="rounded-2xl border border-border/30 bg-bg-card p-4 md:p-6 flex flex-col min-h-[360px] lg:min-h-0">
        <div className="flex-1 min-h-0 flex items-center justify-center">
          <SkillRadarChart data={radarData} />
        </div>
      </div>

      {/* Skill Stats Card */}
      <div className="rounded-2xl border border-border/30 bg-bg-card p-4 md:p-6 flex flex-col min-h-[360px] lg:min-h-0">
        <SkillStats modules={modules} />
      </div>
    </div>
  );
};

export default SkillMatrix;
