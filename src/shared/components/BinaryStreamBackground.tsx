import React, { useEffect, useRef } from 'react';

interface BinaryStreamBackgroundProps {
  className?: string;
  density?: number;
}

const BinaryStreamBackground: React.FC<BinaryStreamBackgroundProps> = ({
  className = '',
  density = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let raf = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    const accent = '183,255,153';
    const lanes = Array.from({ length: Math.round(15 * density) }, (_, i) => ({
      x: (i / Math.max(1, Math.round(15 * density) - 1)) * 1.25 - 0.125,
      speed: 0.22 + (i % 5) * 0.045,
      seed: Math.random() * 100,
      width: 0.026 + (i % 4) * 0.004,
    }));

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawGlyph = (x: number, y: number, size: number, bit: number, alpha: number) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = `rgba(${accent},0.92)`;
      ctx.lineWidth = Math.max(1, size * 0.12);
      const w = size * 0.42;
      const h = size * 0.74;
      if (bit > 0.5) {
        ctx.beginPath();
        ctx.moveTo(x, y - h * 0.5);
        ctx.lineTo(x, y + h * 0.5);
        ctx.stroke();
      } else {
        ctx.strokeRect(x - w * 0.5, y - h * 0.5, w, h);
      }
      ctx.restore();
    };

    const draw = (timeMs: number) => {
      const time = timeMs * 0.001;
      ctx.clearRect(0, 0, width, height);

      const horizon = height * 0.47;
      const floorHeight = height - horizon;
      const vanishingX = width * 0.5 + Math.sin(time * 0.22) * width * 0.025;

      const gradient = ctx.createLinearGradient(0, horizon, 0, height);
      gradient.addColorStop(0, `rgba(${accent},0.02)`);
      gradient.addColorStop(0.5, `rgba(${accent},0.035)`);
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, horizon, width, floorHeight);

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      lanes.forEach((lane, laneIndex) => {
        const offset = (time * lane.speed + lane.seed) % 1;
        for (let row = -2; row < 34; row += 1) {
          const p = (row / 33 + offset) % 1;
          const depth = Math.pow(p, 2.05);
          const y = horizon + depth * floorHeight * 1.14;
          if (y < horizon || y > height + 20) continue;

          const spread = depth * width * 1.18;
          const laneX = vanishingX + (lane.x - 0.5) * spread;
          const size = 5 + depth * 24;
          const halfLane = lane.width * spread + 2;
          const bit = Math.sin((row + lane.seed + laneIndex * 13.7) * 12.9898) > 0 ? 1 : 0;
          const alpha = Math.min(0.72, 0.08 + depth * 0.56) * (1 - Math.abs(lane.x - 0.5) * 0.55);

          drawGlyph(laneX, y, size, bit, alpha);

          ctx.strokeStyle = `rgba(${accent},${alpha * 0.18})`;
          ctx.lineWidth = Math.max(1, depth * 2);
          ctx.beginPath();
          ctx.moveTo(vanishingX, horizon);
          ctx.lineTo(laneX - halfLane, y);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(vanishingX, horizon);
          ctx.lineTo(laneX + halfLane, y);
          ctx.stroke();
        }
      });

      ctx.restore();

      const haze = ctx.createRadialGradient(vanishingX, horizon, 0, vanishingX, horizon, width * 0.52);
      haze.addColorStop(0, `rgba(${accent},0.12)`);
      haze.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = haze;
      ctx.fillRect(0, 0, width, height);

      raf = requestAnimationFrame(draw);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      className={`binary-stream-bg absolute inset-0 h-full w-full pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
};

export default BinaryStreamBackground;
