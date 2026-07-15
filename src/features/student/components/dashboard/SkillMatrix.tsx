import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
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

interface SkillMatrixProps {
  modules: OverviewModule[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  return (
    <div className="bg-bg-card border border-border/50 rounded-xl px-3 py-2 shadow-lg">
      <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">{d.label}</p>
      <p className="text-sm font-black text-accent">{d.value}%</p>
    </div>
  );
};

const SkillMatrix = ({ modules }: SkillMatrixProps) => {
  const { t } = useTranslation();

  const { radarData, skills, average } = useMemo(() => {
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

    const skillList = allSkills.map((s) => {
      const def = SKILL_DEFINITIONS.find((d) => d.key === s.skillKey)!;
      return {
        ...def,
        level: s.progress.percentage,
        completed: s.progress.completed,
        total: s.progress.total,
      };
    });

    const total = skillList.reduce((sum, s) => sum + s.level, 0);
    const avg = skillList.length > 0 ? Math.round(total / skillList.length) : 0;

    return { radarData: radar, skills: skillList, average: avg };
  }, [modules]);

  return (
    <div className="rounded-2xl border border-border/30 bg-bg-card p-6 md:p-8">
      {/* Header */}
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

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Radar Chart */}
        <div className="flex-1 h-[320px] sm:h-[360px] lg:h-[380px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
              <PolarGrid
                stroke="var(--color-border)"
                strokeOpacity={0.3}
                gridType="polygon"
              />
              <PolarAngleAxis
                dataKey="axis"
                tick={({ payload, x, y, cx, cy }: any) => {
                  const dx = Number(x) - Number(cx);
                  const dy = Number(y) - Number(cy);
                  const dist = 18;
                  const len = Math.sqrt(dx * dx + dy * dy) || 1;
                  const tx = Number(x) + (dx / len) * dist;
                  const ty = Number(y) + (dy / len) * dist;
                  return (
                    <text
                      x={tx}
                      y={ty}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="fill-text-muted text-[9px] font-black uppercase"
                      style={{ letterSpacing: '0.1em' }}
                    >
                      {payload.value}
                    </text>
                  );
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Radar
                name="Skills"
                dataKey="value"
                stroke="var(--color-accent)"
                strokeWidth={2}
                fill="var(--color-accent)"
                fillOpacity={0.15}
                dot={false}
                animationDuration={800}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Skill Legend + Bars */}
        <div className="flex flex-col gap-2.5 lg:w-[260px] shrink-0">
          {skills.map((skill) => (
            <div key={skill.key} className="flex items-center gap-3">
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: skill.color }}
              />
              <span className="text-[10px] font-black uppercase tracking-widest text-text-muted min-w-[90px] truncate">
                {skill.shortLabel}
              </span>
              <div className="flex-1 h-1.5 rounded-full bg-accent-dim/20 overflow-hidden">
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
      </div>
    </div>
  );
};

export default SkillMatrix;
