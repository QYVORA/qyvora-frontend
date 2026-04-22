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
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const fontSize = 18;
    const colSpacing = 28;
    const trailLength = 12; // number of chars visible per stream
    const columns = Math.ceil(width / colSpacing);
    const chars = '10101010110';

    // Each column: head position (in rows) + speed + per-column char sequence
    const streams = Array.from({ length: columns }, () => ({
      head: Math.random() * -(height / fontSize),
      speed: 0.18 + Math.random() * 0.22,
      // pre-generate a fixed sequence of chars for this stream
      seq: Array.from({ length: trailLength }, () =>
        chars[Math.floor(Math.random() * chars.length)]
      ),
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

      streams.forEach((stream, col) => {
        const x = col * colSpacing;

        for (let i = 0; i < trailLength; i++) {
          const row = Math.floor(stream.head) - i;
          const y = row * fontSize;
          if (y < -fontSize || y > height) continue;

          // Head char is brightest, tail fades out
          const maxAlpha = theme === 'light' ? 0.28 : 0.18;
          const alpha = (1 - i / trailLength) * maxAlpha;
          ctx.globalAlpha = Math.max(alpha, 0.02);
          ctx.fillStyle = theme === 'light' ? '#1a6b0e' : '#88AD7C';
          ctx.fillText(stream.seq[i], x, y);
        }

        stream.head += stream.speed;

        // Occasionally shuffle one char in the sequence for flicker
        if (Math.random() < 0.08) {
          const idx = Math.floor(Math.random() * trailLength);
          stream.seq[idx] = chars[Math.floor(Math.random() * chars.length)];
        }

        // Reset when the whole trail has passed the bottom
        if ((stream.head - trailLength) * fontSize > height) {
          stream.head = Math.random() * -(height / fontSize) * 0.5;
          stream.speed = 0.18 + Math.random() * 0.22;
        }
      });

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(draw);
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
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
      className={`absolute top-0 left-0 w-full h-full pointer-events-none z-0 ${theme === 'light' ? 'opacity-75' : 'opacity-60'}`}
    />
  );
};

export default HeroCanvas;
