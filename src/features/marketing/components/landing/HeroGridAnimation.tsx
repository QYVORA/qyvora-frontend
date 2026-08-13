import React, { useRef, useEffect } from 'react';

interface Cell {
  x: number;
  y: number;
  size: number;
  color: [number, number, number];
  baseOpacity: number;
  currentOpacity: number;
  prevDrawnOpacity: number;
  phase: number;
  speed: number;
  glitchTimer: number;
  glitchActive: boolean;
  glitchOffset: number;
}

const ACCENT: [number, number, number] = [6, 182, 111];
const REDRAW_THRESHOLD = 0.008;
const TARGET_FPS = 18;
const FRAME_INTERVAL = 1000 / TARGET_FPS;
const CORNER_RADIUS = 3;
const GLITCH_INTERVAL_MIN = 3000;
const GLITCH_INTERVAL_MAX = 9000;
const GLITCH_DURATION = 120;

function createCells(cols: number, rows: number, cellSize: number, isLight: boolean): Cell[] {
  const cells: Cell[] = [];
  const lastCol = Math.max(1, cols - 1);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Sparse, accent-only Athene grid. Boxes are always the accent colour
      // and only a few spawn (~2-5% of cells), with the spawn chance rising
      // toward the right edge so the animation lives on the right side of the
      // screen while the left stays empty. Works in both themes: light renders
      // them at full opacity, dark at a dimmed glow.
      const colFrac = c / lastCol;
      // Dark keeps ~6-15% of cells; light renders accent green at full opacity,
      // which reads much louder on a pale background, so it gets fewer boxes
      // (~2.4-6%). Both are roughly triple the original sparse field.
      const densityScale = isLight ? 0.4 : 1;
      const spawnChance = (0.015 + colFrac * 0.035) * densityScale * 3;
      const baseOpacity = Math.random() < spawnChance
        ? (isLight ? 1 : 0.2 + Math.random() * 0.4)
        : 0;

      cells.push({
        x: c * cellSize,
        y: r * cellSize,
        size: cellSize,
        color: ACCENT,
        baseOpacity,
        currentOpacity: baseOpacity,
        prevDrawnOpacity: baseOpacity,
        phase: Math.random() * Math.PI * 2,
        speed: 0.00003 + Math.random() * 0.0001,
        glitchTimer: Math.random() * GLITCH_INTERVAL_MAX + GLITCH_INTERVAL_MIN,
        glitchActive: false,
        glitchOffset: 0,
      });
    }
  }
  return cells;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

interface HeroGridAnimationProps {
  className?: string;
  reduced?: boolean;
}

const HeroGridAnimation: React.FC<HeroGridAnimationProps> = ({ className = '', reduced = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cellsRef = useRef<Cell[]>([]);
  const rafRef = useRef<number>(0);

  const gap = 3;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cellSize = reduced ? 56 : 42;
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';

    function resize() {
      const rect = canvas!.parentElement!.getBoundingClientRect();
      canvas!.width = rect.width * dpr;
      canvas!.height = rect.height * dpr;
      canvas!.style.width = `${rect.width}px`;
      canvas!.style.height = `${rect.height}px`;
      ctx!.scale(dpr, dpr);

      const cols = Math.ceil(rect.width / cellSize) + 1;
      const rows = Math.ceil(rect.height / cellSize) + 1;
      cellsRef.current = createCells(cols, rows, cellSize, isLight);
    }

    resize();

    const themeObserver = new MutationObserver(() => {
      const newIsLight = document.documentElement.getAttribute('data-theme') === 'light';
      if (newIsLight !== isLight) {
        cellsRef.current = createCells(
          Math.ceil(canvas!.parentElement!.getBoundingClientRect().width / cellSize) + 1,
          Math.ceil(canvas!.parentElement!.getBoundingClientRect().height / cellSize) + 1,
          cellSize,
          newIsLight,
        );
      }
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    window.addEventListener('resize', resize);

    if (reduced) {
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      for (const cell of cellsRef.current) {
        if (cell.baseOpacity === 0) continue;
        ctx.fillStyle = `rgba(${cell.color[0]},${cell.color[1]},${cell.color[2]},${cell.baseOpacity * 0.5})`;
        drawRoundedRect(ctx, cell.x + 1, cell.y + 1, cell.size - 2, cell.size - 2, CORNER_RADIUS);
        ctx.fill();
      }
      return () => {
        themeObserver.disconnect();
        window.removeEventListener('resize', resize);
      };
    }

    let lastFrameTime = 0;
    let visible = true;

    const observer = new IntersectionObserver(
      ([entry]) => { visible = entry.isIntersecting; },
      { threshold: 0 },
    );
    observer.observe(canvas);

    function draw(timestamp: number) {
      rafRef.current = requestAnimationFrame(draw);

      if (!visible) return;
      if (timestamp - lastFrameTime < FRAME_INTERVAL) return;
      lastFrameTime = timestamp;

      const cells = cellsRef.current;
      const inset = gap / 2;

      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        cell.phase += cell.speed * FRAME_INTERVAL;
        const wave = (Math.sin(cell.phase) + 1) / 2;
        let target = cell.baseOpacity * (0.08 + wave * 0.92);

        cell.glitchTimer -= FRAME_INTERVAL;
        if (cell.glitchTimer <= 0 && !cell.glitchActive) {
          cell.glitchActive = true;
          cell.glitchTimer = GLITCH_DURATION;
          cell.glitchOffset = (Math.random() - 0.5) * 6;
        }
        if (cell.glitchActive) {
          cell.glitchTimer -= FRAME_INTERVAL;
          const glitchProgress = 1 - Math.max(0, cell.glitchTimer) / GLITCH_DURATION;
          const flicker = Math.sin(glitchProgress * Math.PI * 4) * 0.4;
          target = Math.max(0, Math.min(1, target + flicker));
          if (cell.glitchTimer <= 0) {
            cell.glitchActive = false;
            cell.glitchTimer = GLITCH_INTERVAL_MIN + Math.random() * (GLITCH_INTERVAL_MAX - GLITCH_INTERVAL_MIN);
            cell.glitchOffset = 0;
          }
        }

        cell.currentOpacity += (target - cell.currentOpacity) * 0.008;

        const delta = cell.currentOpacity - cell.prevDrawnOpacity;
        if (delta > -REDRAW_THRESHOLD && delta < REDRAW_THRESHOLD && !cell.glitchActive) continue;

        const prevVis = cell.prevDrawnOpacity >= 0.01;
        const currVis = cell.currentOpacity >= 0.01;
        const dx = cell.glitchActive ? cell.glitchOffset * (1 - Math.max(0, cell.glitchTimer) / GLITCH_DURATION) : 0;

        if (prevVis) {
          ctx!.clearRect(
            cell.x + inset - 1,
            cell.y + inset - 1,
            cell.size - gap + 2,
            cell.size - gap + 2,
          );
        }

        if (currVis) {
          const jitter = cell.glitchActive ? (Math.random() - 0.5) * 0.8 : 0;
          ctx!.fillStyle = `rgba(${cell.color[0]},${cell.color[1]},${cell.color[2]},${cell.currentOpacity + jitter * 0.1})`;
          drawRoundedRect(
            ctx!,
            cell.x + inset + dx,
            cell.y + inset,
            cell.size - gap,
            cell.size - gap,
            CORNER_RADIUS,
          );
          ctx!.fill();
        }

        cell.prevDrawnOpacity = cell.currentOpacity;
      }
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      observer.disconnect();
      themeObserver.disconnect();
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
