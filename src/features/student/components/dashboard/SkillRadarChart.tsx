import React, { useState, useMemo, useRef, useCallback } from 'react';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';

interface SkillRadarChartProps {
  data: { axis: string; label: string; value: number; color: string }[];
}

const polygonPerimeter = (points: string): number => {
  const pts = points
    .trim()
    .split(/\s+/)
    .map((pair) => pair.split(',').map(Number));
  if (pts.length < 2) return 0;
  let len = 0;
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % pts.length];
    len += Math.hypot(x2 - x1, y2 - y1);
  }
  return len;
};

const SkillRadarChart = ({ data }: SkillRadarChartProps) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const n = data.length;
  const cx = 200;
  const cy = 200;
  const radius = 155;
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1];

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

  const perimeters = useMemo(
    () => gridPolygons.map((points) => polygonPerimeter(points)),
    [gridPolygons],
  );

  const hoveredData = hoveredIdx !== null ? data[hoveredIdx] : null;
  const hoveredPoint = hoveredIdx !== null ? pointOnAxis(axisAngles[hoveredIdx], (data[hoveredIdx].value / 100) * radius) : null;

  const handleMouseLeave = useCallback(() => setHoveredIdx(null), []);

  return (
    <div ref={containerRef} className="relative w-full max-w-[320px] md:max-w-[340px] aspect-square" onMouseLeave={handleMouseLeave}>
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full overflow-visible"
      >
        <defs>
          <radialGradient id="radar-fill" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.32" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.06" />
          </radialGradient>
        </defs>

        {/* Spider-web grid polygons — draw-in from the outer web inward */}
        {gridPolygons.slice(0, -1).map((points, i) => {
          const len = perimeters[i];
          return (
            <polygon
              key={i}
              points={points}
              fill="none"
              stroke="var(--color-border)"
              strokeOpacity={0.16 + i * 0.05}
              strokeWidth={1}
              className={prefersReduced ? '' : 'animate-web-draw'}
              style={
                prefersReduced
                  ? undefined
                  : ({ '--dash-len': `${len}`, strokeDasharray: `${len}` } as React.CSSProperties)
              }
            />
          );
        })}

        {/* Outer web rim — strongest line */}
        <polygon
          points={gridPolygons[gridLevels.length - 1]}
          fill="none"
          stroke="var(--color-border)"
          strokeOpacity={0.5}
          strokeWidth={1.25}
          className={prefersReduced ? '' : 'animate-web-draw'}
          style={
            prefersReduced
              ? undefined
              : ({ '--dash-len': `${perimeters[perimeters.length - 1]}`, strokeDasharray: `${perimeters[perimeters.length - 1]}` } as React.CSSProperties)
          }
        />

        {/* Axis spokes */}
        {axisAngles.map((angle, i) => {
          const end = pointOnAxis(angle, radius);
          const len = Math.hypot(end.x - cx, end.y - cy);
          return (
            <line
              key={`axis-${i}`}
              x1={cx}
              y1={cy}
              x2={end.x}
              y2={end.y}
              stroke="var(--color-border)"
              strokeOpacity={0.28}
              strokeWidth={1}
              className={prefersReduced ? '' : 'animate-spoke-draw'}
              style={
                prefersReduced
                  ? undefined
                  : ({ '--dash-len': `${len}`, strokeDasharray: `${len}`, animationDelay: `${0.55 + i * 0.05}s` } as React.CSSProperties)
              }
            />
          );
        })}

        {/* Data polygon */}
        <polygon
          points={dataPolygonPoints}
          stroke="var(--color-accent)"
          strokeWidth={2}
          fill="url(#radar-fill)"
          strokeLinejoin="round"
          className={`${prefersReduced ? '' : 'animate-data-fill'}`}
          style={{
            transformBox: 'view-box',
            transformOrigin: `${cx}px ${cy}px`,
            animationDelay: '0.95s',
          }}
        />

        {/* Axis labels + value */}
        {axisAngles.map((angle, i) => {
          const labelRadius = radius + 26;
          const p = pointOnAxis(angle, labelRadius);
          const value = data[i]?.value ?? 0;
          return (
            <g key={`label-${i}`}>
              <text
                x={p.x}
                y={p.y - (angle > Math.PI * 0.3 && angle < Math.PI * 0.7 ? 9 : 0)}
                textAnchor="middle"
                dominantBaseline="central"
                className={prefersReduced ? '' : 'animate-label-fade'}
                style={{ animationDelay: '1.15s' }}
              >
                <tspan className="fill-text-primary text-[10px] font-black uppercase" style={{ letterSpacing: '0.08em' }}>
                  {data[i]?.axis}
                </tspan>
              </text>
              {value > 0 && (
                <text
                  x={p.x}
                  y={p.y + (angle > Math.PI * 0.3 && angle < Math.PI * 0.7 ? 11 : 0)}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className={prefersReduced ? '' : 'animate-label-fade'}
                  style={{ animationDelay: '1.25s' }}
                >
                  <tspan className="fill-accent font-black tabular-nums" style={{ fontSize: 9 }}>
                    {value}%
                  </tspan>
                </text>
              )}
            </g>
          );
        })}

        {/* Vertex dots on the data polygon */}
        {axisAngles.map((angle, i) => {
          const r = (data[i]?.value ?? 0) / 100 * radius;
          const p = pointOnAxis(angle, r);
          const color = data[i]?.color;
          return (
            <circle
              key={`dot-${i}`}
              cx={p.x}
              cy={p.y}
              r={4.5}
              fill="var(--color-bg-card)"
              stroke={color}
              strokeWidth={2.5}
              className={prefersReduced ? '' : 'animate-dot-pop'}
              style={{ transformBox: 'fill-box', transformOrigin: 'center', animationDelay: `${1.05 + i * 0.05}s` }}
            />
          );
        })}

        {/* Center node */}
        <circle
          cx={cx}
          cy={cy}
          r={2.5}
          fill="var(--color-border)"
          className={prefersReduced ? '' : 'animate-dot-pop'}
          style={{ transformBox: 'fill-box', transformOrigin: 'center', animationDelay: '0.5s' }}
        />

        {/* Hover targets (invisible circles for better hit detection) */}
        {axisAngles.map((angle, i) => {
          const r = (data[i]?.value ?? 0) / 100 * radius;
          const p = pointOnAxis(angle, r);
          return (
            <circle
              key={`hit-${i}`}
              cx={p.x}
              cy={p.y}
              r={16}
              fill="transparent"
              onMouseEnter={() => setHoveredIdx(i)}
              style={{ cursor: 'pointer' }}
            />
          );
        })}
      </svg>

      {/* Tooltip — rendered outside SVG so it never gets clipped */}
      {hoveredData && hoveredPoint && (
        <div
          className="pointer-events-none absolute z-10 bg-bg-card border border-border/50 rounded-lg px-2.5 py-1.5 shadow-lg text-center"
          style={{
            left: `${(hoveredPoint.x / 400) * 100}%`,
            top: `${(hoveredPoint.y / 400) * 100}%`,
            transform: 'translate(-50%, -130%)',
            transition: 'left 120ms ease-out, top 120ms ease-out',
          }}
        >
          <p className="font-black uppercase tracking-widest text-text-muted" style={{ fontSize: 8 }}>
            {hoveredData.label}
          </p>
          <p className="flex items-center justify-center gap-1 mt-0.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: hoveredData.color }} />
            <span className="text-xs font-black text-accent tabular-nums">{hoveredData.value}%</span>
          </p>
        </div>
      )}

      <style>{`
        @keyframes web-draw {
          from { stroke-dashoffset: var(--dash-len); }
          to { stroke-dashoffset: 0; }
        }
        @keyframes spoke-draw {
          from { stroke-dashoffset: var(--dash-len); }
          to { stroke-dashoffset: 0; }
        }
        @keyframes data-fill {
          from { opacity: 0; transform: scale(0.72); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes label-fade {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes dot-pop {
          from { opacity: 0; transform: scale(0); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-web-draw { animation: web-draw 0.7s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .animate-spoke-draw { animation-name: spoke-draw; animation-duration: 0.5s; animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1); animation-fill-mode: both; }
        .animate-data-fill { animation-name: data-fill; animation-duration: 0.7s; animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1); animation-fill-mode: both; }
        .animate-label-fade { animation-name: label-fade; animation-duration: 0.5s; animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1); animation-fill-mode: both; }
        .animate-dot-pop { animation-name: dot-pop; animation-duration: 0.4s; animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1); animation-fill-mode: both; }
      `}</style>
    </div>
  );
};

export default SkillRadarChart;
