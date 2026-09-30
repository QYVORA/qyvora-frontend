import { useMemo } from 'react';
import SectionHeader from '@/shared/components/ui/SectionHeader';
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
      <SectionHeader
        title={"Skill Matrix"}
        actions={
          <span className="type-meta">
            {"Overall"} &middot; <span className="font-mono font-black text-text-primary">{average}%</span>
          </span>
        }
      />

      <div className="mt-4 grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-2 lg:h-[480px]">
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
