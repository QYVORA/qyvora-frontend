import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useTheme } from '../../../core/contexts/ThemeContext';
import { useAdaptiveUi } from '../../../core/hooks/useAdaptiveUi';

/* ═══════════════════════════════════════════════
   LAND POLYGONS (Optimized for Background)
═══════════════════════════════════════════════ */
const AFRICA = [35.8,-5.9,35.5,-2.0,35.2,0.0,36.8,2.4,37.1,4.8,36.9,5.5,37.1,8.7,37.4,9.8,37.2,10.4,37.3,11.1,37.5,11.5,30.3,32.2,31.5,32.3,30.0,32.6,27.5,34.1,23.0,37.3,18.0,41.5,12.6,43.5,11.6,43.2,11.5,51.3,2.0,41.5,-1.7,41.5,-4.1,39.6,-10.5,40.4,-14.8,40.5,-24.0,35.5,-26.5,34.9,-29.9,31.0,-31.5,29.6,-33.9,27.0,-34.8,20.0,-34.4,18.5,-33.0,17.9,-28.9,16.5,-22.2,14.5,-17.2,12.0,-12.0,12.0,-6.0,12.2,-4.9,8.8,-2.1,9.3,-0.7,8.7,1.4,9.5,2.3,9.9,4.3,6.0,5.0,3.3,6.3,2.4,6.2,1.6,6.3,1.2,6.2,0.4,6.0,0.4,5.1,0.0,4.7,-1.6,4.9,-2.5,5.0,-3.1,4.5,-6.4,5.3,-7.5,6.9,-8.5,6.9,-11.3,8.5,-13.2,9.5,-13.7,10.7,-14.9,11.3,-15.8,11.5,-16.7,12.7,-16.7,14.8,-17.5,14.4,-17.0,13.6,-16.9,13.8,-16.7,14.2,-16.6,16.0,-16.5,20.8,-17.0,27.7,-13.2,30.9,-9.8,35.5,-6.2,35.8,-5.9];
const N_AMERICA = [71.3,-156,70.5,-145,60.0,-141,48.5,-124,37.8,-122,32.5,-117,23.0,-110,18.4,-99,15.9,-90,15.7,-85,10.0,-83,8.4,-77,10.0,-62,18.5,-66,25.0,-77,25.8,-80,29.0,-81,30.4,-87,29.0,-89,26.0,-97,22.0,-98,20.5,-97,19.0,-91,18.5,-88,16.0,-86,10.0,-83,8.4,-77,35.2,-75,38.9,-77,41.0,-73,44.0,-67,47.0,-53,52.0,-55,50.0,-66,46.0,-72,43.7,-79,42.0,-83,46.7,-92,48.0,-90,48.0,-100,55.0,-109,58.0,-93,60.0,-94,63.0,-86,65.0,-87,68.0,-90,71.0,-79,73.0,-66,67.0,-62,60.0,-64,62.0,-78,65.0,-101,68.0,-114,70.0,-130,71.3,-156];
const S_AMERICA = [12.4,-71.6,11.0,-73.4,8.5,-76.9,4.9,-77.4,1.3,-78.5,-1.1,-80.2,-4.9,-81.3,-8.0,-78.6,-14.0,-76.2,-18.3,-70.5,-22.8,-70.8,-28.0,-71.4,-33.8,-71.6,-37.0,-73.5,-40.0,-73.2,-41.9,-74.5,-44.0,-65.4,-50.0,-68.5,-52.5,-69.6,-55.0,-64.0,-52.0,-58.5,-48.0,-55.0,-43.5,-48.5,-38.0,-48.0,-34.0,-52.5,-28.0,-50.0,-22.0,-43.2,-16.0,-39.0,-8.0,-35.2,-5.0,-35.1,-3.0,-38.5,0.0,-50.0,3.0,-51.0,6.5,-58.0,8.0,-60.5,11.0,-63.0,11.5,-72.0,12.4,-71.6];
const EUROPE = [36.0,-5.6,38.7,-9.5,42.0,-9.0,43.5,-8.0,43.8,-4.0,43.5,1.5,42.5,3.5,41.3,2.0,37.9,0.7,36.0,-5.6,43.5,1.5,47.5,2.5,49.0,1.8,51.0,2.5,51.5,4.0,53.3,6.5,54.0,9.0,55.0,10.0,56.0,12.5,57.5,10.0,58.0,11.5,60.0,11.0,60.0,18.5,65.0,22.0,68.0,14.4,71.0,28.0,70.0,20.0,68.0,14.4,65.0,14.0,63.0,8.0,58.0,5.0,56.0,8.0,54.5,12.0,53.5,14.5,51.0,15.0,50.0,18.0,48.5,18.5,47.5,22.0,45.5,21.0,44.0,22.0,42.0,22.5,41.0,23.0,40.5,24.0,37.9,23.6,36.9,22.5,36.5,28.0,41.0,29.0,41.5,28.0,43.0,28.5,45.0,30.0,46.5,30.5,47.0,32.5,46.0,33.5,44.5,34.0,43.0,33.0,42.0,36.0,41.5,37.0,40.0,36.0,36.0,36.0,36.0,26.0,36.0,30.0,38.0,36.0,37.0,42.0,36.0,36.0,36.0,26.0,43.5,1.5];
const ASIA = [72.0,26,72.0,60,72.0,100,72.0,140,70.0,142,64.0,141,60.0,140,56.0,133,52.0,133,48.0,140,44.0,136,44.0,132,38.0,128,36.0,128,34.0,126,34.0,130,36.0,132,32.0,132,30.0,122,26.0,120,22.0,114,20.0,110,18.0,110,10.0,108,4.0,108,4.0,104,2.0,104,0.0,104,-4.0,104,-6.0,106,-6.0,108,10.0,100,16.0,100,20.0,100,22.0,106,20.0,108,16.0,102,12.0,99,10.0,100,8.0,77,10.0,80,14.0,80,18.0,84,22.0,88,24.0,92,22.0,92,16.0,80,8.0,77,24.0,62,28.0,64,32.0,74,24.0,68,24.0,62,36.0,26,36.0,30,38.0,36,37.0,42,36.0,43,36.0,36,36.0,26,30.0,32,28.0,34,22.0,37,12.0,43,12.0,45,14.0,48,18.0,56,22.0,60,26.0,56,22.0,58,20.0,58,16.0,52,12.0,44,12.0,43,36.0,43,40.0,44,44.0,50,48.0,56,52.0,60,56.0,60,60.0,60,64.0,64,68.0,70,72.0,60,72.0,26];
const AUSTRALIA = [-10.7,142,-14.0,130,-14.0,126,-16.0,122,-22.0,114,-24.0,113,-29.0,115,-32.0,115,-34.5,118,-37.5,140,-38.5,142,-38.5,145,-37.5,148,-34.0,151,-30.0,153,-24.0,152,-19.0,147,-14.5,145,-10.7,142];

const LAND_POLYS = [AFRICA, N_AMERICA, S_AMERICA, EUROPE, ASIA, AUSTRALIA];

function pip(lat, lng, poly) {
  const n = poly.length >> 1;
  let inside = false;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const yi = poly[i*2], xi = poly[i*2+1];
    const yj = poly[j*2], xj = poly[j*2+1];
    if ((yi > lat) !== (yj > lat) && lng < ((xj-xi)*(lat-yi))/(yj-yi)+xi)
      inside = !inside;
  }
  return inside;
}

function isLand(lat, lng) {
  return LAND_POLYS.some(p => pip(lat, lng, p));
}

/* ═══════════════════════════════════════════════
   HERO BACKGROUND COMPONENT
═══════════════════════════════════════════════ */
function HeroBackground({ className = "" }) {
  const canvasRef = useRef(null);
  const { theme } = useTheme();
  const { isMobile, constrainedDevice } = useAdaptiveUi();
  const isLight = theme === 'light';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    
    // Grid settings - more subtle and refined
    const step = isMobile ? 10 : (constrainedDevice ? 8 : 6);
    const dotR = isMobile ? 0.9 : 1.1;
    const accentColor = '#66B870';
    
    let rafId;
    let time = 0;

    const draw = () => {
      time += 0.004; // Slightly slower for cleaner look
      const scrollSpeed = 50; // Reduced speed for more stable appearance
      const scrollOffset = time * scrollSpeed;
      
      ctx.clearRect(0, 0, w, h);
      
      const cols = Math.ceil(w / step);
      const rows = Math.ceil(h / step);
      
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * step;
          const y = j * step;
          
          const nx = (x / w) * 2 - 1;
          const ny = (y / h) * 2 - 1;
          
          let lng = (nx * 180) + scrollOffset;
          lng = ((lng + 180) % 360 + 360) % 360 - 180;
          
          const lat = -ny * 90;

          if (isLand(lat, lng)) {
            const dist = Math.sqrt(nx * nx + ny * ny);
            const wave = Math.sin(dist * 5 - time) * 0.5 + 0.5;
            
            // More subtle opacity for cleaner look
            ctx.globalAlpha = isLight ? (0.08 + wave * 0.12) : (0.09 + wave * 0.18);
            ctx.fillStyle = accentColor;
            
            ctx.beginPath();
            ctx.arc(x, y, dotR, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      
      rafId = requestAnimationFrame(draw);
    };

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafId);
    };
  }, [theme, isMobile, constrainedDevice, isLight]);

  const bgBase = isLight ? 'rgba(255,255,255,1)' : 'rgba(0,0,0,1)';

  return (
    <div className={`absolute inset-0 z-0 pointer-events-none overflow-hidden ${className}`}>
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full"
        style={{ 
          filter: 'blur(0.4px)',
          width: '100%',
          height: '100%',
          minWidth: '100vw',
          minHeight: '100vh'
        }}
      />
      
      {/* Ambient Radial Gradient Overlay - More subtle */}
      <div 
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 40%, transparent 25%, ${bgBase} 90%)`,
          opacity: isLight ? 0.6 : 0.75
        }}
      />

      {/* Edge Fades - Smoother transitions */}
      <div className="absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-bg via-bg/80 to-transparent opacity-100" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-bg via-bg/80 to-transparent opacity-100" />
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-bg to-transparent opacity-60" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-bg to-transparent opacity-60" />
      </div>
    </div>
  );
}

export default React.memo(HeroBackground);
