import React, { useRef, useEffect } from 'react';

interface Cell {
  x: number;
  y: number;
  size: number;
  color: [number, number, number];
  baseOpacity: number;
  targetOpacity: number;
  currentOpacity: number;
  phase: number;
  speed: number;
}

const ACCENT: [number, number, number] = [6, 182, 111];

function createCells(cols: number, rows: number, cellSize: number): Cell[] {
  const cells: Cell[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const rand = Math.random();
      let color: [number, number, number];
      let baseOpacity: number;

      if (rand < 0.08) {
        color = ACCENT;
        baseOpacity = 0.15 + Math.random() * 0.35;
      } else if (rand < 0.18) {
        const shade = Math.floor(Math.random() * 12);
        color = [shade, shade, shade];
        baseOpacity = 0.3 + Math.random() * 0.5;
      } else if (rand < 0.35) {
        const g = Math.floor(40 + Math.random() * 30);
        color = [0, g, Math.floor(g * 0.5)];
        baseOpacity = 0.15 + Math.random() * 0.3;
      } else {
        color = [0, 0, 0];
        baseOpacity = 0.4 + Math.random() * 0.6;
      }

      cells.push({
        x: c * cellSize,
        y: r * cellSize,
        size: cellSize,
        color,
        baseOpacity,
        targetOpacity: baseOpacity,
        currentOpacity: baseOpacity,
        phase: Math.random() * Math.PI * 2,
        speed: 0.002 + Math.random() * 0.006,
      });
    }
  }
  return cells;
}

interface HeroGridAnimationProps {
  className?: string;
  reduced?: boolean;
}

const HeroGridAnimation: React.FC<HeroGridAnimationProps> = ({ className = '', reduced = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cellsRef = useRef<Cell[]>([]);
  const rafRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  const gap = 3;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cellSize = reduced ? 52 : 38;

    function resize() {
      const rect = canvas!.parentElement!.getBoundingClientRect();
      canvas!.width = rect.width * dpr;
      canvas!.height = rect.height * dpr;
      canvas!.style.width = `${rect.width}px`;
      canvas!.style.height = `${rect.height}px`;
      ctx!.scale(dpr, dpr);

      const cols = Math.ceil(rect.width / cellSize) + 1;
      const rows = Math.ceil(rect.height / cellSize) + 1;
      cellsRef.current = createCells(cols, rows, cellSize);
    }

    resize();
    window.addEventListener('resize', resize);

    if (reduced) {
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      for (const cell of cellsRef.current) {
        ctx.fillStyle = `rgba(${cell.color[0]},${cell.color[1]},${cell.color[2]},${cell.baseOpacity * 0.5})`;
        ctx.fillRect(cell.x + 1, cell.y + 1, cell.size - 2, cell.size - 2);
      }
      return () => window.removeEventListener('resize', resize);
    }

    let lastFrame = 0;

    function draw(timestamp: number) {
      if (!lastFrame) lastFrame = timestamp;
      const dt = timestamp - lastFrame;
      lastFrame = timestamp;
      timeRef.current += dt;

      const w = canvas!.width / dpr;
      const h = canvas!.height / dpr;

      ctx!.clearRect(0, 0, w, h);

      const t = timeRef.current;

      for (const cell of cellsRef.current) {
        cell.phase += cell.speed * dt;
        const wave = (Math.sin(cell.phase) + 1) / 2;
        cell.targetOpacity = cell.baseOpacity * (0.08 + wave * 0.92);
        cell.currentOpacity += (cell.targetOpacity - cell.currentOpacity) * 0.03;

        if (cell.currentOpacity < 0.01) continue;

        const inset = gap / 2;
        ctx!.fillStyle = `rgba(${cell.color[0]},${cell.color[1]},${cell.color[2]},${cell.currentOpacity})`;
        ctx!.fillRect(
          cell.x + inset,
          cell.y + inset,
          cell.size - gap,
          cell.size - gap
        );
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      aria-hidden="true"
    />
  );
};

export default React.memo(HeroGridAnimation);
