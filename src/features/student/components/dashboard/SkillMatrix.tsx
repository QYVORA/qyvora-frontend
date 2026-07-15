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
import { PHASE_COLORS } from '@/features/student/constants/bootcampConfig';

interface SkillAxis {
  key: string;
  label: string;
  shortLabel: string;
  color: string;
  phaseId?: string;
}

const SKILL_AXES: SkillAxis[] = [
  { key: 'mindset', label: 'Security Mindset', shortLabel: 'Mindset', color: PHASE_COLORS.phase1, phaseId: 'phase1' },
  { key: 'linux', label: 'Linux / Terminal', shortLabel: 'Linux', color: PHASE_COLORS.phase2, phaseId: 'phase2' },
  { key: 'networking', label: 'Networking', shortLabel: 'Network', color: PHASE_COLORS.phase3, phaseId: 'phase3' },
  { key: 'web', label: 'Web Security', shortLabel: 'Web', color: PHASE_COLORS.phase4, phaseId: 'phase4' },
  { key: 'social', label: 'Social Engineering', shortLabel: 'Social', color: PHASE_COLORS.phase5, phaseId: 'phase5' },
  { key: 'tools', label: 'Tools Proficiency', shortLabel: 'Tools', color: '#8B5CF6' },
  { key: 'programming', label: 'Programming', shortLabel: 'Code', color: '#10B981' },
];

interface OverviewModule {
  moduleId?: number;
  title?: string;
  progress?: number;
  roomsCompleted?: number;
  roomsTotal?: number;
}

interface SkillMatrixProps {
  modules: OverviewModule[];
  courseProgress?: { completed: number; total: number };
}

function computeSkillValues(
  modules: OverviewModule[],
  courseProgress?: { completed: number; total: number },
): Record<string, number> {
  const phaseMap = new Map<number, OverviewModule>();
  modules.forEach((m) => {
    if (m.moduleId) phaseMap.set(m.moduleId, m);
  });

  const getPhase = (id: number) => phaseMap.get(id);
  const pct = (done: number, total: number) => (total > 0 ? Math.round((done / total) * 100) : 0);

  const p1 = getPhase(1);
  const p2 = getPhase(2);
  const p3 = getPhase(3);
  const p4 = getPhase(4);
  const p5 = getPhase(5);

  const coursePct = courseProgress
    ? pct(courseProgress.completed, courseProgress.total)
    : 0;

  return {
    mindset: p1 ? pct(p1.roomsCompleted ?? 0, p1.roomsTotal ?? 3) : 0,
    linux: p2 ? pct(p2.roomsCompleted ?? 0, p2.roomsTotal ?? 4) : 0,
    networking: p3 ? pct(p3.roomsCompleted ?? 0, p3.roomsTotal ?? 4) : 0,
    web: p4 ? pct(p4.roomsCompleted ?? 0, p4.roomsTotal ?? 5) : 0,
    social: p5 ? pct(p5.roomsCompleted ?? 0, p5.roomsTotal ?? 3) : 0,
    tools: Math.min(100, coursePct + 10),
    programming: Math.min(100, coursePct),
  };
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

const SkillMatrix = ({ modules, courseProgress }: SkillMatrixProps) => {
  const { t } = useTranslation();

  const { radarData, skills, average } = useMemo(() => {
    const values = computeSkillValues(modules, courseProgress);

    const radar = SKILL_AXES.map((axis) => ({
      axis: axis.shortLabel,
      label: axis.label,
      value: values[axis.key] ?? 0,
      color: axis.color,
    }));

    const skillList = SKILL_AXES.map((axis) => ({
      ...axis,
      level: values[axis.key] ?? 0,
    }));

    const total = skillList.reduce((sum, s) => sum + s.level, 0);
    const avg = skillList.length > 0 ? Math.round(total / skillList.length) : 0;

    return { radarData: radar, skills: skillList, average: avg };
  }, [modules, courseProgress]);

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
        <div className="flex-1 min-h-[300px] lg:min-h-[360px]">
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
              <span className="text-[10px] font-black text-text-primary w-8 text-right tabular-nums">
                {skill.level}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillMatrix;
