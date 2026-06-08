import React, { useState, useRef, useCallback } from 'react';
import { Candle, Range } from './types';
import { fmt, fmtShort, sma } from './utils';

interface TradingChartProps {
  candles: Candle[];
  range: Range;
}

const TradingChart: React.FC<TradingChartProps> = ({ candles, range }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hovered, setHovered] = useState<{ idx: number; x: number } | null>(null);

  const W = 900, MAIN_H = 280, VOL_H = 60, PAD = { top: 24, right: 16, bottom: 8, left: 64 };
  const chartW = W - PAD.left - PAD.right;
  const mainH = MAIN_H - PAD.top - PAD.bottom;
  const totalH = MAIN_H + VOL_H + 28;

  const n = candles.length;
  const gap = chartW / Math.max(n, 1);
  const candleW = Math.max(2, Math.floor(gap * 0.65));

  const prices = candles.flatMap(c => [c.high, c.low]);
  const maxP = Math.max(...prices, 1);
  const minP = Math.min(...prices, 0);
  const priceRange = maxP - minP || 1;
  const maxVol = Math.max(...candles.map(c => c.volume), 1);

  const toX = (i: number) => PAD.left + i * gap + gap / 2;
  const toY = (v: number) => PAD.top + mainH - ((v - minP) / priceRange) * mainH;
  const toVolY = (v: number) => MAIN_H + VOL_H - (v / maxVol) * (VOL_H - 4);

  const sma7 = sma(candles, 7);
  const sma20 = sma(candles, 20);

  const smaPath = (vals: (number | null)[], color: string) => {
    let d = '';
    vals.forEach((v, i) => {
      if (v === null) return;
      d += d === '' ? `M ${toX(i)} ${toY(v)}` : ` L ${toX(i)} ${toY(v)}`;
    });
    return d ? <path d={d} fill="none" stroke={color} strokeWidth="1.5" opacity="0.75" strokeLinejoin="round" /> : null;
  };

  const yTicks = 5;
  const yLabels = Array.from({ length: yTicks + 1 }, (_, i) => {
    const v = minP + (priceRange * i) / yTicks;
    return { y: toY(v), label: fmtShort(Math.round(v)) };
  });
  const xStep = Math.max(1, Math.floor(n / 8));
  const hoveredCandle = hovered !== null ? candles[hovered.idx] : null;

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect || !n) return;
    const svgX = ((e.clientX - rect.left) / rect.width) * W;
    const idx = Math.round((svgX - PAD.left) / gap - 0.5);
    const clamped = Math.max(0, Math.min(n - 1, idx));
    setHovered({ idx: clamped, x: toX(clamped) });
  }, [n, gap]);

  const GREEN = '#58A366', RED = '#f87171', GRID = 'rgba(255,255,255,0.04)';

  return (
    <div className="relative w-full select-none">
      {/* Ticker header */}
      <div className="flex flex-wrap items-center gap-4 px-1 pb-3 border-b border-border/50 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-base font-black font-mono text-text-primary">CP/NET</span>
          <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">QYVORA CHAIN · {range}</span>
        </div>
        {hoveredCandle ? (
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono">
            <span className="text-text-muted">{hoveredCandle.date}</span>
            <span className="text-text-muted">O <span className="text-text-primary">{fmtShort(hoveredCandle.open)}</span></span>
            <span className="text-text-muted">H <span style={{ color: hoveredCandle.bullish ? GREEN : RED }}>{fmtShort(hoveredCandle.high)}</span></span>
            <span className="text-text-muted">L <span style={{ color: hoveredCandle.bullish ? GREEN : RED }}>{fmtShort(hoveredCandle.low)}</span></span>
            <span className="text-text-muted">C <span style={{ color: hoveredCandle.bullish ? GREEN : RED }}>{fmtShort(hoveredCandle.close)}</span></span>
            <span className="text-text-muted">Vol <span className="text-text-primary">{fmtShort(hoveredCandle.volume)}</span></span>
            <span className="text-text-muted">+{fmt(hoveredCandle.issued)} <span style={{ color: GREEN }}>issued</span></span>
            <span className="text-text-muted">-{fmt(hoveredCandle.burned)} <span style={{ color: RED }}>burned</span></span>
            <span className="text-text-muted">{hoveredCandle.txCount} tx</span>
          </div>
        ) : candles.length > 0 ? (() => {
          const last = candles[candles.length - 1];
          const prev = candles[candles.length - 2];
          const chg = prev ? last.close - prev.close : 0;
          const pct = prev && prev.close !== 0 ? ((chg / Math.abs(prev.close)) * 100).toFixed(2) : '0.00';
          const up = chg >= 0;
          return (
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono">
              <span className="text-xl font-black" style={{ color: up ? GREEN : RED }}>{fmtShort(last.close)}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: up ? 'var(--color-accent-dim)' : 'rgba(248,113,113,0.15)', color: up ? GREEN : RED }}>
                {up ? '▲' : '▼'} {Math.abs(Number(pct))}%
              </span>
              <span className="text-text-muted">SMA7 <span style={{ color: '#60a5fa' }}>{fmtShort(Math.round(sma7[sma7.length - 1] ?? 0))}</span></span>
              <span className="text-text-muted">SMA20 <span style={{ color: '#f59e0b' }}>{fmtShort(Math.round(sma20[sma20.length - 1] ?? 0))}</span></span>
            </div>
          );
        })() : null}
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${totalH}`}
        className="w-full"
        style={{ height: Math.round(totalH * 0.58) }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHovered(null)}
      >
        {/* Grid */}
        {yLabels.map((t, i) => (
          <line key={i} x1={PAD.left} y1={t.y} x2={W - PAD.right} y2={t.y} stroke={GRID} strokeWidth="1" />
        ))}
        <line x1={PAD.left} y1={MAIN_H} x2={W - PAD.right} y2={MAIN_H} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

        {/* Y labels */}
        {yLabels.map((t, i) => (
          <text key={i} x={PAD.left - 6} y={t.y + 4} textAnchor="end" fontSize="9" fill="rgba(255,255,255,0.3)" fontFamily="monospace">{t.label}</text>
        ))}
        <text x={PAD.left - 6} y={MAIN_H + 14} textAnchor="end" fontSize="8" fill="rgba(255,255,255,0.22)" fontFamily="monospace">VOL</text>

        {/* Candles + volume bars */}
        {candles.map((c, i) => {
          const x = toX(i);
          const bodyTop = toY(Math.max(c.open, c.close));
          const bodyBot = toY(Math.min(c.open, c.close));
          const bodyH = Math.max(1, bodyBot - bodyTop);
          const color = c.bullish ? GREEN : RED;
          const isHov = hovered?.idx === i;
          return (
            <g key={i}>
              <line x1={x} y1={toY(c.high)} x2={x} y2={toY(c.low)} stroke={color} strokeWidth="1" opacity={isHov ? 1 : 0.8} />
              <rect x={x - candleW / 2} y={bodyTop} width={candleW} height={bodyH} fill={color} opacity={isHov ? 1 : 0.85} rx="0.5" />
              <rect x={x - candleW / 2} y={toVolY(c.volume)} width={candleW} height={MAIN_H + VOL_H - toVolY(c.volume)} fill={color} opacity={isHov ? 0.7 : 0.3} rx="0.5" />
            </g>
          );
        })}

        {/* SMA lines */}
        {smaPath(sma7, '#60a5fa')}
        {smaPath(sma20, '#f59e0b')}

        {/* Crosshair */}
        {hovered && (
          <>
            <line x1={hovered.x} y1={PAD.top} x2={hovered.x} y2={MAIN_H + VOL_H} stroke="rgba(255,255,255,0.18)" strokeWidth="1" strokeDasharray="3 3" />
            {hoveredCandle && (
              <line x1={PAD.left} y1={toY(hoveredCandle.close)} x2={W - PAD.right} y2={toY(hoveredCandle.close)} stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="3 3" />
            )}
          </>
        )}

        {/* X labels */}
        {candles.map((c, i) => {
          if (i % xStep !== 0 && i !== n - 1) return null;
          return <text key={i} x={toX(i)} y={totalH - 4} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.28)" fontFamily="monospace">{c.date}</text>;
        })}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 pt-2 px-1">
        {[
          { color: '#60a5fa', label: 'SMA 7', line: true },
          { color: '#f59e0b', label: 'SMA 20', line: true },
          { color: GREEN, label: 'Bullish (net +CP)', line: false },
          { color: RED, label: 'Bearish (net −CP)', line: false },
        ].map(({ color, label, line }) => (
          <div key={label} className="flex items-center gap-1.5 text-[10px] font-mono text-text-muted">
            {line
              ? <span className="w-5 h-0.5 inline-block rounded" style={{ background: color }} />
              : <span className="w-3 h-3 inline-block rounded-sm opacity-85" style={{ background: color }} />
            }
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TradingChart;
