import React, { useRef, useEffect } from 'react';
import { useTheme } from '../../../core/contexts/ThemeContext';

const HeroCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width  = (canvas.width  = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // ── Consistent sizing across all pages ──────────────────────────────────
    const fontSize   = 22;          // larger, readable binary digits
    const colSpacing = 34;          // wider columns so digits breathe
    const trailLength = 18;         // longer trail for more presence
    const columns    = Math.ceil(width / colSpacing);
    const chars      = '10';        // pure binary

    const streams = Array.from({ length: columns }, () => ({
      head:  Math.random() * -(height / fontSize),
      speed: 0.22 + Math.random() * 0.28,
      seq:   Array.from({ length: trailLength }, () =>
        chars[Math.floor(Math.random() * chars.length)]
      ),
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.font = `bold ${fontSize}px "JetBrains Mono", monospace`;

      streams.forEach((stream, col) => {
        const x = col * colSpacing;

        for (let i = 0; i < trailLength; i++) {
          const row = Math.floor(stream.head) - i;
          const y   = row * fontSize;
          if (y < -fontSize || y > height) continue;

          // Head is brightest, tail fades — higher base opacity than before
          const maxAlpha = theme === 'light' ? 0.38 : 0.28;
          const alpha    = (1 - i / trailLength) * maxAlpha;
          ctx.globalAlpha = Math.max(alpha, 0.03);
          ctx.fillStyle   = theme === 'light' ? '#1a6b0e' : '#88AD7C';
          ctx.fillText(stream.seq[i], x, y);
        }

        stream.head += stream.speed;

        // Occasional flicker
        if (Math.random() < 0.06) {
          const idx = Math.floor(Math.random() * trailLength);
          stream.seq[idx] = chars[Math.floor(Math.random() * chars.length)];
        }

        // Reset when trail has fully passed the bottom
        if ((stream.head - trailLength) * fontSize > height) {
          stream.head  = Math.random() * -(height / fontSize) * 0.5;
          stream.speed = 0.22 + Math.random() * 0.28;
        }
      });

      ctx.globalAlpha    = 1;
      animationFrameId   = requestAnimationFrame(draw);
    };

    const handleResize = () => {
      width  = canvas.width  = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute top-0 left-0 w-full h-full pointer-events-none z-0 ${
        theme === 'light' ? 'opacity-80' : 'opacity-70'
      }`}
    />
  );
};

export default HeroCanvas;
