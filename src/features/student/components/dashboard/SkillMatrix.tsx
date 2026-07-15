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
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Radar Chart Card */}
      <div className="flex-1 rounded-2xl border border-border/30 bg-bg-card p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-text-primary">
              {t('student.dashboard.skillMatrix', 'Skill Matrix')}
            </h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mt-1">
              {t('student.dashboard.skillMatrixSub', 'Overall')}{' '}
              <span className="text-accent">{average}%</span>
            </p>
          </div>
        </div>
        <SkillRadarChart data={radarData} />
      </div>

      {/* Skill Stats Card */}
      <div className="rounded-2xl border border-border/30 bg-bg-card p-6 md:p-8 lg:w-[320px] shrink-0">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-text-primary">
              {t('student.dashboard.skillStats', 'Skill Progress')}
            </h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mt-1">
              {t('student.dashboard.skillStatsSub', 'Completion')}{' '}
              <span className="text-accent">{average}%</span>
            </p>
          </div>
        </div>
        <SkillStats modules={modules} />
      </div>
    </div>
  );
};

export default SkillMatrix;
