import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { createPortal } from 'react-dom';
import { X, ZoomIn, ZoomOut } from 'lucide-react';
import { useScrollLock } from '../../../../core/hooks/useScrollLock';

interface Props {
  src: string;
  alt: string;
  onClose: () => void;
}

const ImageLightbox: React.FC<Props> = ({ src, alt, onClose }) => {
  useScrollLock();
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ mx: number; my: number; px: number; py: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const clampScale = (v: number) => Math.min(5, Math.max(1, v));

  const zoom = useCallback((delta: number) => {
    setScale((s) => {
      const next = clampScale(s + delta);
      if (next === 1) setPos({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const resetZoom = useCallback(() => {
    setScale(1);
    setPos({ x: 0, y: 0 });
  }, []);

  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    zoom(e.deltaY < 0 ? 0.25 : -0.25);
  }, [zoom]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (scale <= 1) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    dragStart.current = { mx: e.clientX, my: e.clientY, px: pos.x, py: pos.y };
  }, [scale, pos]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging || !dragStart.current) return;
    setPos({
      x: dragStart.current.px + (e.clientX - dragStart.current.mx),
      y: dragStart.current.py + (e.clientY - dragStart.current.my),
    });
  }, [dragging]);

  const onPointerUp = useCallback(() => {
    setDragging(false);
    dragStart.current = null;
  }, []);

  const lastTap = useRef(0);
  const onDoubleClick = useCallback(() => {
    if (scale > 1) resetZoom();
    else setScale(2.5);
  }, [scale, resetZoom]);

  const onTouchEnd = useCallback(() => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      if (scale > 1) resetZoom();
      else setScale(2.5);
    }
    lastTap.current = now;
  }, [scale, resetZoom]);

  const modal = (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-[200] flex flex-col bg-black/95 backdrop-blur-sm"
        aria-modal="true"
        aria-label="Image viewer"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => zoom(-0.5)}
              disabled={scale <= 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 text-white/70 hover:text-white hover:border-white/30 transition-colors disabled:opacity-30"
              aria-label="Zoom out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="min-w-[44px] text-center font-mono text-xs font-bold text-white/50">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={() => zoom(0.5)}
              disabled={scale >= 5}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 text-white/70 hover:text-white hover:border-white/30 transition-colors disabled:opacity-30"
              aria-label="Zoom in"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            {scale > 1 && (
              <button
                onClick={resetZoom}
                className="ml-1 px-2.5 h-8 rounded-lg border border-white/15 text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-white hover:border-white/30 transition-colors"
              >
                Reset
              </button>
            )}
          </div>
          <p className="hidden sm:block text-[10px] font-bold uppercase tracking-widest text-white/30">
            {scale > 1 ? 'Drag to pan · Scroll to zoom' : 'Scroll or pinch to zoom · Double-click to zoom in'}
          </p>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 text-white/70 hover:text-white hover:border-white/30 transition-colors"
            aria-label="Close image viewer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div
          ref={containerRef}
          className="flex-1 overflow-hidden flex items-center justify-center"
          style={{ cursor: scale > 1 ? (dragging ? 'grabbing' : 'grab') : 'zoom-in' }}
          onWheel={onWheel}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          onDoubleClick={onDoubleClick}
          onTouchEnd={onTouchEnd}
        >
          <motion.img
            src={src}
            alt={alt}
            draggable={false}
            animate={{ scale, x: pos.x, y: pos.y }}
            transition={{ type: 'spring', stiffness: 400, damping: 35, mass: 0.6 }}
            className="max-w-full max-h-full object-contain select-none"
            style={{ transformOrigin: 'center center' }}
          />
        </div>

        <div className="sm:hidden shrink-0 py-2 text-center text-[10px] font-bold uppercase tracking-widest text-white/25">
          Double-tap to zoom · Pinch to scale
        </div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(modal, document.body);
};

export default ImageLightbox;
