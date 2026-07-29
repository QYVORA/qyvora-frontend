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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-3">
      {/* Radar Chart Card */}
      <div className="rounded-2xl border border-border/30 bg-bg-card p-2 md:p-3 lg:p-4 flex flex-col">
        <div className="flex-1 min-h-0 overflow-hidden">
          <SkillRadarChart data={radarData} />
        </div>
      </div>

      {/* Skill Stats Card */}
      <div className="rounded-2xl border border-border/30 bg-bg-card p-2 md:p-3 lg:p-4 flex flex-col">
        <div className="min-h-0 h-full flex flex-col overflow-y-auto">
          <SkillStats modules={modules} />
        </div>
      </div>
    </div>
  );
};

export default SkillMatrix;
