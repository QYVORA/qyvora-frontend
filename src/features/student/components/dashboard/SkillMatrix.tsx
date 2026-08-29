import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

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
            {t('student.dashboard.skillMatrix', 'Skill Matrix')}
          </h2>
          <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-text-muted mt-1">
            {t('student.dashboard.skillMatrixSub', 'Overall')} &middot; {average}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 lg:h-[440px]">
        {/* Radar Chart Card */}
        <div className="rounded-2xl border border-border/50 bg-bg-card p-4 md:p-5 flex flex-col min-h-[380px] lg:min-h-0">
          <div className="flex-1 min-h-0 flex items-center justify-center">
            <SkillRadarChart data={radarData} />
          </div>
        </div>

        {/* Skill Stats Card */}
        <div className="rounded-2xl border border-border/50 bg-bg-card p-4 md:p-5 flex flex-col min-h-[380px] lg:min-h-0">
          <SkillStats modules={modules} />
        </div>
      </div>
    </div>
  );
};

export default SkillMatrix;
