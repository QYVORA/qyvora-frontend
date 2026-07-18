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

  const { radarData, average } = useMemo(() => {
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

    return { radarData: radar, average: computeSkillStats(modules).average };
  }, [modules]);

  return (
    <div className="flex flex-col lg:flex-row lg:items-start gap-3 lg:ml-auto lg:max-w-[600px]">
      {/* Radar Chart Card */}
      <div className="rounded-2xl border border-border/30 bg-bg-card p-3 flex flex-col lg:w-[280px] shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-text-primary">
            {t('student.dashboard.skillMatrix', 'Skill Matrix')}
          </h3>
          <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">
            {t('student.dashboard.skillMatrixSub', 'Overall')}{' '}
            <span className="text-accent">{average}%</span>
          </span>
        </div>
        <div className="flex-1 min-h-0">
          <SkillRadarChart data={radarData} />
        </div>
      </div>

      {/* Skill Stats Card */}
      <div className="rounded-2xl border border-border/30 bg-bg-card p-3 flex flex-col lg:w-[280px] shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-text-primary">
            {t('student.dashboard.skillStats', 'Skill Progress')}
          </h3>
          <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">
            {t('student.dashboard.skillStatsSub', 'Completion')}{' '}
            <span className="text-accent">{average}%</span>
          </span>
        </div>
        <div className="min-h-0 overflow-y-auto">
          <SkillStats modules={modules} />
        </div>
      </div>
    </div>
  );
};

export default SkillMatrix;
