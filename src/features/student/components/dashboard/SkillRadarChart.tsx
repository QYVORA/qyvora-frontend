import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface SkillRadarChartProps {
  data: { axis: string; label: string; value: number; color: string }[];
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

const SkillRadarChart = ({ data }: SkillRadarChartProps) => {
  return (
    <div className="h-[320px] sm:h-[360px] lg:h-[380px] lg:flex-1 overflow-hidden">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
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
  );
};

export default SkillRadarChart;
