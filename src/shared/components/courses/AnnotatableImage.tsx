import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Pencil, Square, ArrowUpRight, Eraser, Undo2, ZoomIn, Maximize2, X } from 'lucide-react';

interface Annotation {
  type: 'freehand' | 'rect' | 'arrow';
  color: string;
  points: { x: number; y: number }[];
}

interface AnnotatableImageProps {
  src: string;
  alt: string;
  stepNum: number;
  storageKey?: string;
  className?: string;
}

const COLORS = ['#06B66F', '#FF5F57', '#FFBD2E', '#60A5FA', '#A78BFA', '#FFFFFF'];

const AnnotatableImage: React.FC<AnnotatableImageProps> = ({
  src,
  alt,
  stepNum,
  storageKey,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [activeTool, setActiveTool] = useState<'freehand' | 'rect' | 'arrow' | null>(null);
  const [activeColor, setActiveColor] = useState(COLORS[0]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const currentAnnot = useRef<Annotation | null>(null);
  const startPoint = useRef<{ x: number; y: number } | null>(null);

  const saveKey = storageKey || `annotation_${stepNum}`;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(saveKey);
      if (saved) setAnnotations(JSON.parse(saved));
    } catch {}
  }, [saveKey]);

  const saveAnnotations = useCallback((anns: Annotation[]) => {
    try { localStorage.setItem(saveKey, JSON.stringify(anns)); } catch {}
  }, [saveKey]);

  const getCanvasPos = (clientX: number, clientY: number): { x: number; y: number } => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: (clientX - rect.left) * (canvasRef.current!.width / rect.width),
      y: (clientY - rect.top) * (canvasRef.current!.height / rect.height),
    };
  };

  const getPosFromEvent = (e: React.MouseEvent | React.TouchEvent): { x: number; y: number } => {
    if ('touches' in e) {
      const touch = e.touches[0] || e.changedTouches[0];
      return getCanvasPos(touch.clientX, touch.clientY);
    }
    return getCanvasPos((e as React.MouseEvent).clientX, (e as React.MouseEvent).clientY);
  };

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    for (const ann of annotations) {
      ctx.strokeStyle = ann.color;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (ann.type === 'freehand' && ann.points.length > 1) {
        ctx.beginPath();
        ctx.moveTo(ann.points[0].x, ann.points[0].y);
        for (let i = 1; i < ann.points.length; i++) {
          ctx.lineTo(ann.points[i].x, ann.points[i].y);
        }
        ctx.stroke();
      } else if (ann.type === 'rect' && ann.points.length === 2) {
        ctx.strokeRect(
          ann.points[0].x, ann.points[0].y,
          ann.points[1].x - ann.points[0].x,
          ann.points[1].y - ann.points[0].y
        );
      } else if (ann.type === 'arrow' && ann.points.length === 2) {
        const [from, to] = ann.points;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
        const angle = Math.atan2(to.y - from.y, to.x - from.x);
        ctx.beginPath();
        ctx.moveTo(to.x, to.y);
        ctx.lineTo(to.x - 10 * Math.cos(angle - 0.4), to.y - 10 * Math.sin(angle - 0.4));
        ctx.lineTo(to.x - 10 * Math.cos(angle + 0.4), to.y - 10 * Math.sin(angle + 0.4));
        ctx.closePath();
        ctx.fillStyle = ann.color;
        ctx.fill();
      }
    }

    if (currentAnnot.current) {
      const ann = currentAnnot.current;
      ctx.strokeStyle = ann.color;
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);

      if (ann.type === 'freehand' && ann.points.length > 1) {
        ctx.beginPath();
        ctx.moveTo(ann.points[0].x, ann.points[0].y);
        for (let i = 1; i < ann.points.length; i++) {
          ctx.lineTo(ann.points[i].x, ann.points[i].y);
        }
        ctx.stroke();
      } else if (ann.type === 'rect' && ann.points.length === 2) {
        ctx.strokeRect(
          ann.points[0].x, ann.points[0].y,
          ann.points[1].x - ann.points[0].x,
          ann.points[1].y - ann.points[0].y
        );
      } else if (ann.type === 'arrow' && ann.points.length === 2) {
        ctx.beginPath();
        ctx.moveTo(ann.points[0].x, ann.points[0].y);
        ctx.lineTo(ann.points[1].x, ann.points[1].y);
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }
  }, [annotations]);

  useEffect(() => {
    if (imgLoaded) redraw();
  }, [imgLoaded, redraw, annotations]);

  const handleImgLoad = () => {
    setImgLoaded(true);
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (canvas && img) {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
    }
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (!activeTool) return;
    e.preventDefault();
    setIsDrawing(true);
    const pos = getPosFromEvent(e);
    startPoint.current = pos;
    currentAnnot.current = { type: activeTool, color: activeColor, points: [pos] };
    if (activeTool === 'freehand') {
      currentAnnot.current.points = [pos];
    }
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !currentAnnot.current) return;
    e.preventDefault();
    const pos = getPosFromEvent(e);
    if (currentAnnot.current.type === 'freehand') {
      currentAnnot.current.points.push(pos);
    } else if (startPoint.current) {
      currentAnnot.current.points = [startPoint.current, pos];
    }
    redraw();
  };

  const handleMouseUp = () => {
    if (!isDrawing || !currentAnnot.current) return;
    setIsDrawing(false);
    const ann = currentAnnot.current;
    if (ann.type !== 'freehand' && ann.points.length < 2) {
      currentAnnot.current = null;
      return;
    }
    const next = [...annotations, ann];
    setAnnotations(next);
    saveAnnotations(next);
    currentAnnot.current = null;
    startPoint.current = null;
  };

  const handleClear = () => {
    setAnnotations([]);
    saveAnnotations([]);
    if (canvasRef.current && imgRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.drawImage(imgRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };

  const handleUndo = () => {
    const next = annotations.slice(0, -1);
    setAnnotations(next);
    saveAnnotations(next);
  };

  const canvasContent = (
    <div ref={containerRef} className={`relative overflow-hidden rounded-lg border border-border group ${className}`}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        width={1200}
        height={800}
        onLoad={handleImgLoad}
        className="w-full h-auto"
        crossOrigin="anonymous"
      />
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full ${activeTool ? 'cursor-crosshair' : 'cursor-default'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      />
      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        {(['freehand', 'rect', 'arrow'] as const).map((tool) => (
          <button
            key={tool}
            onClick={() => setActiveTool(activeTool === tool ? null : tool)}
            className={`p-1.5 rounded-lg border transition-all ${
              activeTool === tool
                ? 'bg-accent text-bg border-accent'
                : 'bg-bg-card/80 text-text-muted border-border hover:text-accent'
            }`}
            aria-label={tool === 'freehand' ? 'Freehand draw' : tool === 'rect' ? 'Draw rectangle' : 'Draw arrow'}
            title={tool === 'freehand' ? 'Freehand' : tool === 'rect' ? 'Rectangle' : 'Arrow'}
          >
            {tool === 'freehand' ? <Pencil className="h-3.5 w-3.5" /> :
             tool === 'rect' ? <Square className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
          </button>
        ))}
        <div className="w-px h-5 bg-border mx-1" aria-hidden="true" />
        {COLORS.map((c) => (
          <button
            key={c}
            onClick={() => setActiveColor(c)}
            className={`w-4 h-4 rounded-full border-2 transition-all ${activeColor === c ? 'border-accent scale-125' : 'border-transparent'}`}
            style={{ backgroundColor: c }}
            aria-label={`Select color ${c}`}
          />
        ))}
        <div className="w-px h-5 bg-border mx-1" aria-hidden="true" />
        <button onClick={handleUndo} className="p-1.5 rounded-lg bg-bg-card/80 border border-border text-text-muted hover:text-accent transition-colors" title="Undo" aria-label="Undo last annotation">
          <Undo2 className="h-3.5 w-3.5" />
        </button>
        <button onClick={handleClear} className="p-1.5 rounded-lg bg-bg-card/80 border border-border text-text-muted hover:text-red-400 transition-colors" title="Clear all" aria-label="Clear all annotations">
          <Eraser className="h-3.5 w-3.5" />
        </button>
      </div>
      <button
        onClick={() => setShowFullscreen(true)}
        className="absolute top-3 right-3 p-1.5 rounded-lg bg-bg-card/80 border border-border text-text-muted hover:text-accent transition-colors opacity-0 group-hover:opacity-100"
        title="Expand"
        aria-label="Expand image to fullscreen"
      >
        <Maximize2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );

  return (
    <>
      {canvasContent}
      {showFullscreen && (
        <div className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4" onClick={() => setShowFullscreen(false)}>
          <button className="absolute top-6 right-6 text-text-muted hover:text-accent transition-colors" onClick={() => setShowFullscreen(false)} aria-label="Close fullscreen">
            <X className="h-6 w-6" />
          </button>
          <div className="max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            {canvasContent}
          </div>
        </div>
      )}
    </>
  );
};

export default AnnotatableImage;
