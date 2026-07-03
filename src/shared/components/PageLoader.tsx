import React from 'react';

const Q_PATH_1 = "M2380 4529 c-130 -14 -256 -37 -355 -66 -546 -158 -958 -539 -1125 -1042 -77 -231 -75 -205 -75 -966 0 -615 2 -689 18 -773 56 -288 181 -515 407 -743 249 -250 548 -410 912 -486 l133 -28 1315 -3 1315 -3 -30 30 c-16 16 -84 78 -150 137 -200 181 -773 703 -868 792 l-88 82 -560 0 c-471 0 -572 3 -636 16 -266 55 -457 221 -540 469 l-27 80 -4 435 c-2 280 0 456 7 496 27 152 80 252 192 365 61 61 95 86 170 123 160 79 138 77 1003 74 849 -4 793 1 941 -76 102 -53 230 -183 278 -282 66 -136 69 -166 73 -625 1 -225 3 -413 3 -416 1 -6 958 -692 1023 -734 l28 -17 21 48 c35 81 77 209 96 296 16 76 18 141 18 733 0 588 -2 659 -18 740 -75 372 -238 681 -484 916 -265 254 -587 395 -978 428 -146 13 -1891 12 -2015 0z";
const Q_PATH_2 = "M3062 2311 c2 -5 44 -47 95 -92 50 -46 304 -280 565 -520 260 -239 529 -487 598 -549 226 -206 343 -313 480 -440 205 -189 541 -494 578 -525 30 -25 36 -26 60 -16 62 28 928 496 949 513 8 7 -93 88 -350 281 -1296 970 -1555 1165 -1669 1256 l-127 101 -591 0 c-345 0 -590 -4 -588 -9z";

const VIEWBOX_W = 699;
const VIEWBOX_H = 510;
const SPACING = 14;
const DOT_SIZE = 6;
const COLS = Math.ceil(VIEWBOX_W / SPACING);
const ROWS = Math.ceil(VIEWBOX_H / SPACING);
const TOTAL_DURATION = 1800;

const PageLoader: React.FC = () => {
  const dots: { x: number; y: number; delay: number }[] = [];

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const x = col * SPACING;
      const y = row * SPACING;
      const t = (row / ROWS) * 0.6 + (col / COLS) * 0.4;
      const delay = Math.round(t * TOTAL_DURATION);
      dots.push({ x, y, delay });
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-bg flex flex-col items-center justify-center overflow-hidden select-none touch-none">
      <style>{`
        @keyframes q-dot-in {
          0%   { opacity: 0; transform: scale(0); }
          55%  { opacity: 1; transform: scale(1.2); }
          100% { opacity: 1; transform: scale(1); }
        }
        .q-dot {
          animation: q-dot-in 0.35s ease-out both;
        }
      `}</style>

      <svg
        viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
        className="relative w-56 sm:w-72 lg:w-80 h-auto z-10"
        aria-label="Loading"
      >
        <defs>
          <mask id="q-mask">
            <rect width={VIEWBOX_W} height={VIEWBOX_H} fill="black" />
            <g transform="translate(0,510) scale(0.1,-0.1)">
              <path d={Q_PATH_1} fill="white" />
              <path d={Q_PATH_2} fill="white" />
            </g>
          </mask>
        </defs>

        <g mask="url(#q-mask)">
          {dots.map((dot, i) => (
            <rect
              key={i}
              className="q-dot"
              x={dot.x}
              y={dot.y}
              width={DOT_SIZE}
              height={DOT_SIZE}
              rx={1}
              fill="#66B870"
              style={{ animationDelay: `${dot.delay}ms` }}
            />
          ))}
        </g>
      </svg>

      <p className="relative z-10 mt-8 sm:mt-10 text-[10px] font-mono text-text-muted uppercase tracking-[0.3em] animate-pulse">
        Loading
      </p>
    </div>
  );
};

export default PageLoader;
