import { useState, useMemo } from 'react';

interface SkillRadarChartProps {
  data: { axis: string; label: string; value: number; color: string }[];
}

const SkillRadarChart = ({ data }: SkillRadarChartProps) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const n = data.length;
  const cx = 200;
  const cy = 200;
  const radius = 140;
  const gridLevels = [0.25, 0.5, 0.75, 1];

  const axisAngles = useMemo(
    () => Array.from({ length: n }, (_, i) => (2 * Math.PI * i) / n - Math.PI / 2),
    [n],
  );

  const pointOnAxis = (angle: number, r: number) => ({
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle),
  });

  const dataPolygonPoints = useMemo(() => {
    return axisAngles
      .map((angle, i) => {
        const r = (data[i]?.value ?? 0) / 100 * radius;
        const p = pointOnAxis(angle, r);
        return `${p.x},${p.y}`;
      })
      .join(' ');
  }, [axisAngles, data]);

  const gridPolygons = useMemo(() => {
    return gridLevels.map((level) => {
      const r = radius * level;
      return axisAngles
        .map((angle) => {
          const p = pointOnAxis(angle, r);
          return `${p.x},${p.y}`;
        })
        .join(' ');
    });
  }, [axisAngles]);

  const hoveredData = hoveredIdx !== null ? data[hoveredIdx] : null;
  const hoveredPoint = hoveredIdx !== null ? pointOnAxis(axisAngles[hoveredIdx], (data[hoveredIdx].value / 100) * radius) : null;

  return (
    <div className="h-[320px] sm:h-[360px] lg:h-[380px] lg:flex-1 overflow-hidden">
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full"
        onMouseLeave={() => setHoveredIdx(null)}
      >
        {/* Grid polygons */}
        {gridPolygons.map((points, i) => (
          <polygon
            key={i}
            points={points}
            fill="none"
            stroke="var(--color-border)"
            strokeOpacity={0.3}
            strokeWidth={1}
          />
        ))}

        {/* Axis lines */}
        {axisAngles.map((angle, i) => {
          const end = pointOnAxis(angle, radius);
          return (
            <line
              key={`axis-${i}`}
              x1={cx}
              y1={cy}
              x2={end.x}
              y2={end.y}
              stroke="var(--color-border)"
              strokeOpacity={0.3}
              strokeWidth={1}
            />
          );
        })}

        {/* Data polygon */}
        <polygon
          points={dataPolygonPoints}
          stroke="var(--color-accent)"
          strokeWidth={2}
          fill="var(--color-accent)"
          fillOpacity={0.15}
          className="animate-radar-draw"
          style={{
            transformOrigin: `${cx}px ${cy}px`,
          }}
        />

        {/* Axis labels */}
        {axisAngles.map((angle, i) => {
          const labelRadius = radius + 22;
          const p = pointOnAxis(angle, labelRadius);
          return (
            <text
              key={`label-${i}`}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-text-muted text-[9px] font-black uppercase"
              style={{ letterSpacing: '0.1em' }}
            >
              {data[i]?.axis}
            </text>
          );
        })}

        {/* Hover targets (invisible circles for better hit detection) */}
        {axisAngles.map((angle, i) => {
          const r = (data[i]?.value ?? 0) / 100 * radius;
          const p = pointOnAxis(angle, r);
          return (
            <circle
              key={`hit-${i}`}
              cx={p.x}
              cy={p.y}
              r={12}
              fill="transparent"
              onMouseEnter={() => setHoveredIdx(i)}
              style={{ cursor: 'pointer' }}
            />
          );
        })}

        {/* Tooltip */}
        {hoveredData && hoveredPoint && (
          <g className="pointer-events-none">
            <foreignObject
              x={hoveredPoint.x - 60}
              y={hoveredPoint.y - 50}
              width={120}
              height={44}
            >
              <div
                className="bg-bg-card border border-border/50 rounded-xl px-3 py-2 shadow-lg text-center"
                style={{ fontSize: 10 }}
              >
                <p className="font-black uppercase tracking-widest text-text-muted" style={{ fontSize: 9 }}>
                  {hoveredData.label}
                </p>
                <p className="text-sm font-black text-accent">{hoveredData.value}%</p>
              </div>
            </foreignObject>
          </g>
        )}
      </svg>
      <style>{`
        @keyframes radar-draw {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-radar-draw {
          animation: radar-draw 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default SkillRadarChart;
