import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, ChevronRight, Lock, Loader2,
  CheckCircle2, BookOpen, ImageOff, Menu, X,
  ClipboardList, ZoomIn, ZoomOut, Maximize2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { createPortal } from 'react-dom';
import api from '../../../core/services/api';
import { useToast } from '../../../core/contexts/ToastContext';
import {
  BOOTCAMP_CONFIG,
  buildStepImagePath,
  type BootcampPhase,
  type BootcampStep,
} from '../constants/bootcampConfig';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface ApiRoom {
  roomId: number;
  title: string;
  overview: string;
  locked: boolean;
  completed?: boolean;
}
interface ApiModule {
  moduleId: number;
  title: string;
  description: string;
  locked: boolean;
  rooms: ApiRoom[];
}
interface ApiCourse {
  id: string;
  title: string;
  modules: ApiModule[];
}
interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
}
interface RoomQuiz {
  scope?: { type?: string; id?: string | number; moduleId?: string | number; courseId?: string };
  questions: QuizQuestion[];
}

// ─────────────────────────────────────────────────────────────────────────────
// IMAGE LIGHTBOX MODAL
// ─────────────────────────────────────────────────────────────────────────────
const ImageLightbox: React.FC<{ src: string; alt: string; onClose: () => void }> = ({
  src,
  alt,
  onClose,
}) => {
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ mx: number; my: number; px: number; py: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

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

  // Mouse wheel zoom
  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    zoom(e.deltaY < 0 ? 0.25 : -0.25);
  }, [zoom]);

  // Drag to pan (only when zoomed in)
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

  // Double-tap / double-click to toggle zoom
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
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            {/* Zoom out */}
            <button
              onClick={() => zoom(-0.5)}
              disabled={scale <= 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 text-white/70 hover:text-white hover:border-white/30 transition-colors disabled:opacity-30"
              aria-label="Zoom out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>

            {/* Scale indicator */}
            <span className="min-w-[44px] text-center font-mono text-xs font-bold text-white/50">
              {Math.round(scale * 100)}%
            </span>

            {/* Zoom in */}
            <button
              onClick={() => zoom(0.5)}
              disabled={scale >= 5}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 text-white/70 hover:text-white hover:border-white/30 transition-colors disabled:opacity-30"
              aria-label="Zoom in"
            >
              <ZoomIn className="h-4 w-4" />
            </button>

            {/* Reset */}
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

          {/* Close */}
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 text-white/70 hover:text-white hover:border-white/30 transition-colors"
            aria-label="Close image viewer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Image area */}
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

        {/* Bottom hint on mobile */}
        <div className="sm:hidden shrink-0 py-2 text-center text-[10px] font-bold uppercase tracking-widest text-white/25">
          Double-tap to zoom · Pinch to scale
        </div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(modal, document.body);
};

// ─────────────────────────────────────────────────────────────────────────────
// STEP IMAGE — loading + error fallback + zoom trigger
// ─────────────────────────────────────────────────────────────────────────────
const StepImage: React.FC<{ src: string; alt: string; stepNum: number }> = ({ src, alt, stepNum }) => {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    setStatus('loading');
  }, [src]);

  return (
    <>
      <div className="group mt-4 w-full max-w-full overflow-hidden rounded-xl border border-border bg-bg relative">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={`w-full max-w-full h-auto rounded-xl object-contain transition-opacity duration-200 ${
            status === 'loaded' ? 'opacity-100 group-hover:opacity-90' : 'opacity-0'
          }`}
        />

        {status === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center py-10 bg-bg/85">
            <Loader2 className="h-5 w-5 animate-spin text-accent opacity-50" />
          </div>
        )}
        {status === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 py-8 text-text-muted bg-bg/90">
            <ImageOff className="h-6 w-6 opacity-25" />
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">
              Step {stepNum} image not available
            </span>
          </div>
        )}

        {/* Clickable image */}
        <button
          type="button"
          onClick={() => status === 'loaded' && setLightboxOpen(true)}
          className="absolute inset-0 block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-xl"
          aria-label="Expand image"
          tabIndex={status === 'loaded' ? 0 : -1}
          style={{ display: status === 'loaded' ? 'block' : 'none' }}
        >
          {/* Zoom hint overlay */}
          <div className="absolute inset-0 flex items-center justify-center rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="flex items-center gap-1.5 rounded-lg bg-black/60 backdrop-blur-sm px-3 py-1.5 border border-white/10">
              <Maximize2 className="h-3.5 w-3.5 text-white" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white">Expand</span>
            </div>
          </div>
        </button>
      </div>

      {lightboxOpen && (
        <ImageLightbox
          src={src}
          alt={alt}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STEP PLACEHOLDER (no image defined in config)
// ─────────────────────────────────────────────────────────────────────────────
const StepPlaceholder: React.FC<{ stepNum: number }> = ({ stepNum }) => (
  <div className="mt-3 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-bg py-8 text-text-muted">
    <ImageOff className="h-5 w-5 opacity-25" />
    <span className="text-[10px] font-bold uppercase tracking-widest opacity-35">
      Step {stepNum} — image coming soon
    </span>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// STEP CARD
// ─────────────────────────────────────────────────────────────────────────────
const StepCard: React.FC<{
  step: BootcampStep;
  stepNum: number;
  total: number;
  phaseId: string;
  roomId: string;
  isActive: boolean;
  isViewed: boolean;
  onClick: () => void;
}> = ({ step, stepNum, total, phaseId, roomId, isActive, isViewed, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer rounded-xl border p-6 sm:p-8 transition-colors duration-150 overflow-hidden ${
        isActive
          ? 'border-accent/40 bg-bg-card'
          : isViewed
          ? 'border-accent/20 bg-bg-card hover:border-accent/30'
          : 'border-border bg-bg-card hover:border-border/70'
      }`}
    >
      {/* Active left-edge accent bar */}
      {isActive && (
        <div className="absolute left-0 top-6 bottom-6 w-1 rounded-full bg-accent" />
      )}

      {/* Step header */}
      <div className="mb-3 flex items-center gap-2.5">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border-2 font-mono text-base font-black transition-colors ${
            isViewed && !isActive
              ? 'border-accent/40 bg-accent text-bg'
              : isActive
              ? 'border-accent bg-accent-dim text-accent'
              : 'border-border bg-bg text-text-muted'
          }`}
        >
          {isViewed && !isActive ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            String(stepNum).padStart(2, '0')
          )}
        </div>
        <div className="flex-1 min-w-0 overflow-hidden">
          <span className="block truncate text-xs font-black uppercase tracking-[0.2em] text-text-muted">
            {step.title}
          </span>
        </div>
        {isActive && (
          <span className="shrink-0 rounded-full border border-accent/30 bg-accent-dim px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-accent">
            Active
          </span>
        )}
        {isViewed && !isActive && (
          <span className="shrink-0 text-[8px] font-black uppercase tracking-widest text-accent/60">
            Viewed
          </span>
        )}
      </div>

      {/* Instruction */}
      <p
        className={`text-base md:text-lg leading-relaxed transition-colors ${
          isActive ? 'text-text-primary' : 'text-text-secondary'
        }`}
      >
        {step.instruction}
      </p>

      {/* Image — always rendered so browser loads it */}
      {step.image ? (
        <StepImage
          src={buildStepImagePath(phaseId, roomId, step.image)}
          alt={`${step.title}: ${step.instruction}`}
          stepNum={stepNum}
        />
      ) : (
        <StepPlaceholder stepNum={stepNum} />
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// LEFT SIDEBAR
// ─────────────────────────────────────────────────────────────────────────────
const Sidebar: React.FC<{
  phases: BootcampPhase[];
  activePhaseId: string;
  activeRoomId: string;
  completedRooms: Set<string>;
  lockedRooms: Set<string>;
  bootcampId: string;
  onNavigate: (phaseId: string, roomId: string) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}> = ({
  phases,
  activePhaseId,
  activeRoomId,
  completedRooms,
  lockedRooms,
  bootcampId,
  onNavigate,
  mobileOpen,
  onMobileClose,
}) => {
  const content = (
    <nav className="flex flex-col gap-1 p-3 pb-6">
      <div className="mb-3 px-1">
        <Link
          to={`/bootcamps/${bootcampId}`}
          className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-accent transition-colors"
          onClick={onMobileClose}
        >
          <ArrowLeft className="h-3 w-3" /> Back to Curriculum
        </Link>
      </div>

      {phases.map((phase) => (
        <div key={phase.id} className="mb-3">
          <p className="mb-1.5 px-2 text-[9px] font-black uppercase tracking-[0.3em] text-accent">
            {phase.codename} — {phase.title}
          </p>
          <div className="space-y-0.5 border-l border-border/50 ml-2 pl-2">
            {phase.rooms.map((room) => {
              const key = `${phase.id}:${room.id}`;
              const isActive = phase.id === activePhaseId && room.id === activeRoomId;
              const isCompleted = completedRooms.has(key);
              const isLocked = lockedRooms.has(key);
              return (
                <button
                  key={key}
                  onClick={() => {
                    if (!isLocked) {
                      onNavigate(phase.id, room.id);
                      onMobileClose();
                    }
                  }}
                  disabled={isLocked}
                  className={`w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-left text-sm transition-all min-h-[44px] ${
                    isActive
                      ? 'bg-accent-dim border border-accent/30 text-accent font-bold'
                      : isLocked
                      ? 'opacity-40 cursor-not-allowed text-text-muted'
                      : 'hover:bg-accent-dim/30 text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border text-[9px] font-black font-mono ${
                      isCompleted
                        ? 'border-accent/40 bg-accent text-bg'
                        : isActive
                        ? 'border-accent/40 bg-accent-dim text-accent'
                        : 'border-border bg-bg text-text-muted'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="h-2.5 w-2.5" /> : isLocked ? <Lock className="h-2.5 w-2.5" /> : null}
                  </span>
                  <span className="truncate text-xs">{room.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar — hidden, main render has its own inline desktop sidebar */}
      <aside className="hidden">
        {content}
      </aside>
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-black/65 backdrop-blur-sm lg:hidden"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              className="fixed left-0 top-20 bottom-0 z-[70] w-[92vw] max-w-[360px] flex flex-col bg-bg-card border-r border-border shadow-2xl lg:hidden overflow-y-auto"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between border-b border-border px-4 py-3.5 bg-bg-card/95 backdrop-blur-md shrink-0">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-accent">Curriculum</p>
                  <p className="text-xs font-black text-text-primary">Room Navigator</p>
                </div>
                <button
                  onClick={onMobileClose}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-text-muted hover:text-text-primary hover:border-accent/40 transition-colors"
                  aria-label="Close curriculum"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              {/* Scrollable content */}
              <div className="flex-1">
                {content}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};


// ─────────────────────────────────────────────────────────────────────────────
// QUIZ GATE MODAL — shown when student tries to skip the quiz
// ─────────────────────────────────────────────────────────────────────────────
const QuizGateModal: React.FC<{ onClose: () => void; onTakeQuiz: () => void }> = ({ onClose, onTakeQuiz }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
    <motion.div
      initial={{ scale: 0.92, opacity: 0, y: 16 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.92, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="relative z-10 w-full max-w-sm rounded-2xl border border-border bg-bg-card p-8 text-center shadow-2xl"
    >
      <div className="mb-4 text-4xl">🔒</div>
      <h2 className="mb-2 text-lg font-black text-text-primary">Not so fast, operator.</h2>
      <p className="mb-6 text-sm text-text-muted leading-relaxed">
        You need to complete this room's quiz before moving on. No skipping — the mission requires it.
      </p>
      <div className="flex flex-col gap-3">
        <button onClick={onTakeQuiz} className="btn-primary text-sm py-3">
          Take the Quiz
        </button>
        <button onClick={onClose} className="btn-secondary text-sm py-3">
          Stay Here
        </button>
      </div>
    </motion.div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// QUIZ MODAL
// ─────────────────────────────────────────────────────────────────────────────
const QuizModal: React.FC<{
  moduleId: string;
  roomId: string;
  courseId: string;
  onClose: () => void;
  onPassed: () => void;
}> = ({ moduleId, roomId, courseId, onClose, onPassed }) => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState<RoomQuiz | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  // result now also carries the original questions for review
  const [result, setResult] = useState<{
    score: number;
    passed: boolean;
    reward?: number;
    questions: QuizQuestion[];
    correctIndexes: Record<string, number>;
  } | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .post('/student/quiz', { moduleId, roomId, courseId })
      .then((res) => {
        const q = res?.data as RoomQuiz & { questions: Array<QuizQuestion & { correctIndex?: number }> };
        if (Array.isArray(q?.questions) && q.questions.length > 0) {
          setQuiz(q);
        } else {
          setError('No questions available for this room yet.');
        }
      })
      .catch((err: any) => {
        if (err?.response?.status !== 403) {
          setError(String(err?.response?.data?.error || '') || 'Could not load quiz.');
        }
      })
      .finally(() => setLoading(false));
  }, [moduleId, roomId, courseId]);

  const submit = async () => {
    if (!quiz) return;
    if (Object.keys(answers).length < quiz.questions.length) {
      addToast('Answer all questions before submitting.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post('/student/quiz', { moduleId, roomId, courseId, answers });
      const score   = Number(res?.data?.score || 0);
      const passed  = Boolean(res?.data?.passed);
      const reward  = Number(res?.data?.reward?.points || 0);
      // Build correctIndexes map from the quiz questions (backend returns correctIndex)
      const correctIndexes: Record<string, number> = {};
      (quiz.questions as Array<QuizQuestion & { correctIndex?: number }>).forEach((q) => {
        if (typeof q.correctIndex === 'number') correctIndexes[q.id] = q.correctIndex;
      });
      setResult({ score, passed, reward, questions: quiz.questions, correctIndexes });
      if (passed) {
        addToast(`Quiz passed! ${score}% — +${reward} CP`, 'success');
        onPassed();
      } else {
        addToast(`Score: ${score}% — need 70% to pass`, 'info');
      }
    } catch (err: any) {
      addToast(err?.response?.data?.error || 'Could not submit quiz.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-bg-card shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-bg-card px-6 py-4">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-accent" />
            <h2 className="text-sm font-black uppercase tracking-widest text-text-primary">
              Room Quiz
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-text-muted hover:text-text-primary transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6">
          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center gap-2 py-10 text-sm text-text-muted">
              <Loader2 className="h-4 w-4 animate-spin text-accent" />
              Loading quiz…
            </div>
          )}

          {/* Error */}
          {!loading && !quiz && !result && (
            <p className={`py-8 text-center text-sm ${error ? 'text-red-400' : 'text-text-muted'}`}>
              {error || 'Quiz not available for this room yet.'}
            </p>
          )}

          {/* ── Result + answer review ── */}
          {!loading && result && (
            <div className="space-y-6">
              {/* Score header */}
              <div className="text-center py-4">
                <div className={`text-6xl font-black mb-2 ${result.passed ? 'text-accent' : 'text-red-400'}`}>
                  {result.score}%
                </div>
                <div className={`text-sm font-bold uppercase tracking-widest ${result.passed ? 'text-accent' : 'text-red-400'}`}>
                  {result.passed ? '✓ Passed' : '✗ Not quite — 70% needed'}
                </div>
                {result.passed && result.reward > 0 && (
                  <div className="mt-1 text-xs text-text-muted">+{result.reward} CP earned</div>
                )}
              </div>

              {/* Answer review */}
              <div className="space-y-5">
                {result.questions.map((q, idx) => {
                  const chosen  = answers[q.id];
                  const correct = result.correctIndexes[q.id];
                  const isRight = chosen === correct;
                  return (
                    <div key={q.id} className={`rounded-xl border p-4 ${isRight ? 'border-accent/30 bg-accent/5' : 'border-red-500/30 bg-red-500/5'}`}>
                      <div className="flex items-start gap-2 mb-3">
                        <span className={`shrink-0 mt-0.5 text-sm font-black ${isRight ? 'text-accent' : 'text-red-400'}`}>
                          {isRight ? '✓' : '✗'}
                        </span>
                        <p className="text-sm font-bold text-text-primary leading-snug">
                          <span className="text-text-muted font-mono text-[10px] mr-1">Q{idx + 1}.</span>
                          {q.text}
                        </p>
                      </div>
                      <div className="space-y-1.5 pl-5">
                        {q.options.map((opt, optIdx) => {
                          const isCorrectOpt = optIdx === correct;
                          const isChosenOpt  = optIdx === chosen;
                          let cls = 'border-border text-text-muted';
                          if (isCorrectOpt) cls = 'border-accent/50 bg-accent/10 text-accent font-bold';
                          else if (isChosenOpt && !isRight) cls = 'border-red-500/50 bg-red-500/10 text-red-400 line-through';
                          return (
                            <div key={optIdx} className={`rounded-lg border px-3 py-2 text-xs flex items-center gap-2 ${cls}`}>
                              <span className="font-mono opacity-50 shrink-0">{String.fromCharCode(65 + optIdx)}.</span>
                              <span>{opt}</span>
                              {isCorrectOpt && <span className="ml-auto text-[10px] font-black text-accent shrink-0">Correct</span>}
                              {isChosenOpt && !isRight && <span className="ml-auto text-[10px] font-black text-red-400 shrink-0">Your answer</span>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 pt-2">
                {!result.passed && (
                  <button
                    onClick={() => { setResult(null); setAnswers({}); }}
                    className="btn-primary text-sm py-3"
                  >
                    Try Again
                  </button>
                )}
                <button onClick={onClose} className={`text-sm py-3 ${result.passed ? 'btn-primary' : 'btn-secondary'}`}>
                  {result.passed ? 'Continue to Next Room' : 'Close'}
                </button>
              </div>
            </div>
          )}

          {/* ── Questions ── */}
          {!loading && quiz && !result && (
            <>
              <div className="mb-6 h-1 overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-accent transition-all duration-300"
                  style={{ width: `${(Object.keys(answers).length / quiz.questions.length) * 100}%` }}
                />
              </div>

              <div className="space-y-7">
                {quiz.questions.map((q, idx) => (
                  <div key={q.id || idx} className="space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 shrink-0 rounded border border-border bg-bg px-2 py-0.5 font-mono text-[10px] font-black text-text-muted">
                        Q{idx + 1}
                      </span>
                      <p className="text-sm font-bold leading-snug text-text-primary">{q.text}</p>
                    </div>
                    <div className="space-y-2">
                      {(q.options || []).map((opt, optIdx) => {
                        const selected = Number(answers[q.id]) === optIdx;
                        return (
                          <button
                            key={`${q.id}-${optIdx}`}
                            onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
                            className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                              selected
                                ? 'border-accent bg-accent-dim font-bold text-accent'
                                : 'border-border text-text-secondary hover:border-accent/30 hover:bg-accent-dim/20'
                            }`}
                          >
                            <span className="mr-2 font-mono text-[10px] opacity-50">
                              {String.fromCharCode(65 + optIdx)}.
                            </span>
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 space-y-2">
                <button
                  onClick={submit}
                  disabled={submitting || Object.keys(answers).length < quiz.questions.length}
                  className="btn-primary inline-flex w-full items-center justify-center gap-2 py-3 text-sm disabled:opacity-50"
                >
                  {submitting
                    ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Submitting…</>
                    : 'Submit Quiz'}
                </button>
                {Object.keys(answers).length < quiz.questions.length && (
                  <p className="text-center text-[10px] text-text-muted">
                    {quiz.questions.length - Object.keys(answers).length} question{quiz.questions.length - Object.keys(answers).length !== 1 ? 's' : ''} remaining
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};


// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
const BootcampRoomPage: React.FC = () => {
  const { bootcampId, phaseId: phaseIdParam, moduleId, roomId } = useParams<{
    bootcampId?: string;
    phaseId?: string;
    moduleId?: string;
    roomId?: string;
  }>();

  // Legacy route uses moduleId (1-based number) → convert to phaseId ("phase1", "phase2", etc.)
  const phaseId = phaseIdParam || (moduleId ? `phase${moduleId}` : undefined);
  const navigate = useNavigate();
  const { addToast } = useToast();

  // ── API state ──────────────────────────────────────────────────────────────
  const [apiCourse, setApiCourse] = useState<ApiCourse | null>(null);
  const [apiLoading, setApiLoading] = useState(true);
  const [bootcampStatus, setBootcampStatus] = useState('not_enrolled');

  // ── Step progression ───────────────────────────────────────────────────────
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [viewedSteps, setViewedSteps] = useState<Set<number>>(new Set([0]));

  // ── Mobile sidebar ─────────────────────────────────────────────────────────
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Quiz modal ─────────────────────────────────────────────────────────────
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizGateOpen, setQuizGateOpen] = useState(false);
  // Track whether the quiz for the current room has been passed this session
  const [quizPassed, setQuizPassed] = useState(false);

  // ── Room complete overlay ──────────────────────────────────────────────────
  const [showCompleteOverlay, setShowCompleteOverlay] = useState(false);

  // ── Completed rooms (localStorage) ────────────────────────────────────────
  const storageKey = `hpb_completed_${bootcampId || 'hpb'}`;
  const [completedRooms, setCompletedRooms] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
      return new Set();
    }
  });

  const markRoomComplete = (phId: string, rmId: string) => {
    const key = `${phId}:${rmId}`;
    setCompletedRooms((prev) => {
      const next = new Set(prev);
      next.add(key);
      try { localStorage.setItem(storageKey, JSON.stringify([...next])); } catch (_e) { /* localStorage unavailable */ }
      return next;
    });
  };

  // ── Load API data ──────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const query = bootcampId ? `?bootcampId=${encodeURIComponent(bootcampId)}` : '';
        const [ovRes, courseRes] = await Promise.all([
          api.get('/student/overview'),
          api.get(`/student/course${query}`).catch(() => null),
        ]);
        const ov = ovRes.data;
        const enrolledViaStatus =
          ov?.bootcampStatus &&
          ov.bootcampStatus !== 'not_enrolled' &&
          String(ov?.bootcampId || '') === String(bootcampId || '');
        const enrolledViaModules = (Array.isArray(ov?.modules) ? ov.modules : []).some(
          (m: any) => String(m.bootcampId || m.id || '') === String(bootcampId || '')
        );
        setBootcampStatus(enrolledViaStatus || enrolledViaModules ? 'enrolled' : 'not_enrolled');
        if (courseRes?.data) setApiCourse(courseRes.data as ApiCourse);
      } catch {
        // silent
      } finally {
        setApiLoading(false);
      }
    };
    load();
  }, [bootcampId]);

  // ── Redirect if not enrolled ───────────────────────────────────────────────
  useEffect(() => {
    if (!apiLoading && bootcampStatus === 'not_enrolled') {
      navigate('/bootcamps', { replace: true });
    }
  }, [apiLoading, bootcampStatus, navigate]);

  // ── Listen for quiz open event from navbar ────────────────────────────────
  useEffect(() => {
    const handler = () => setQuizOpen(true);
    window.addEventListener('bootcamp:openQuiz', handler);
    return () => window.removeEventListener('bootcamp:openQuiz', handler);
  }, []);

  // ── Reset step index when room changes ────────────────────────────────────
  useEffect(() => {
    setCurrentStepIdx(0);
    setViewedSteps(new Set([0]));
    setQuizPassed(false);
  }, [phaseId, roomId]);

  // ── Resolve phase and room from config ────────────────────────────────────
  const phase = BOOTCAMP_CONFIG.phases.find((p) => p.id === phaseId);
  const room = phase?.rooms.find((r) => r.id === roomId);

  // Build locked rooms set from API data
  const lockedRooms = new Set<string>();
  if (apiCourse) {
    apiCourse.modules.forEach((mod) => {
      if (mod.locked) {
        // find matching phase by title
        const matchPhase = BOOTCAMP_CONFIG.phases.find(
          (p) => p.title.toLowerCase() === mod.title.toLowerCase()
        );
        if (matchPhase) {
          matchPhase.rooms.forEach((r) => lockedRooms.add(`${matchPhase.id}:${r.id}`));
        }
      } else {
        mod.rooms.forEach((apiRoom) => {
          if (apiRoom.locked) {
            const matchPhase = BOOTCAMP_CONFIG.phases.find(
              (p) => p.title.toLowerCase() === mod.title.toLowerCase()
            );
            if (matchPhase) {
              const matchRoom = matchPhase.rooms.find(
                (r) => r.title.toLowerCase() === apiRoom.title.toLowerCase()
              );
              if (matchRoom) lockedRooms.add(`${matchPhase.id}:${matchRoom.id}`);
            }
          }
        });
      }
    });
  }

  // ── Navigation helpers ─────────────────────────────────────────────────────
  const handleNavigate = (pId: string, rId: string) => {
    navigate(`/bootcamps/${bootcampId}/phases/${pId}/rooms/${rId}`);
  };

  const goToStep = (idx: number) => {
    setCurrentStepIdx(idx);
    setViewedSteps((prev) => {
      const next = new Set(prev);
      next.add(idx);
      return next;
    });
  };

  const goNext = () => {
    if (!room) return;
    const nextIdx = currentStepIdx + 1;
    if (nextIdx < room.steps.length) {
      goToStep(nextIdx);
    } else {
      // All steps viewed — require quiz before marking complete
      if (!quizPassed && quizModuleId) {
        setQuizGateOpen(true);
      } else {
        if (phaseId && roomId) markRoomComplete(phaseId, roomId);
        setShowCompleteOverlay(true);
      }
    }
  };

  const goPrev = () => {
    if (currentStepIdx > 0) goToStep(currentStepIdx - 1);
  };

  const isLastStep = room ? currentStepIdx === room.steps.length - 1 : false;

  // ── Find prev/next room for navigation ────────────────────────────────────
  const allRooms: Array<{ phaseId: string; roomId: string; title: string }> = [];
  BOOTCAMP_CONFIG.phases.forEach((p) => {
    p.rooms.forEach((r) => allRooms.push({ phaseId: p.id, roomId: r.id, title: r.title }));
  });
  const currentRoomIdx = allRooms.findIndex((r) => r.phaseId === phaseId && r.roomId === roomId);
  const prevRoom = currentRoomIdx > 0 ? allRooms[currentRoomIdx - 1] : null;
  const nextRoom = currentRoomIdx < allRooms.length - 1 ? allRooms[currentRoomIdx + 1] : null;

  // ── Loading ────────────────────────────────────────────────────────────────
  if (apiLoading) {
    return (
      <div className="min-h-screen bg-bg">
        <div className="mx-auto max-w-7xl px-4 pt-20 md:pt-24 space-y-4">
          <div className="h-4 w-40 animate-pulse rounded-lg bg-bg-card border border-border" />
          <div className="h-10 w-3/4 animate-pulse rounded-lg bg-bg-card border border-border" />
          <div className="h-4 w-full animate-pulse rounded-lg bg-bg-card border border-border" />
        </div>
      </div>
    );
  }

  // ── Room not found in config ───────────────────────────────────────────────
  if (!phase || !room) {
    return (
      <div className="min-h-screen bg-bg">
        <div className="mx-auto max-w-4xl px-4 pt-20 md:pt-24">
          <Link
            to={`/bootcamps/${bootcampId}`}
            className="mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-muted hover:text-accent transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Bootcamp
          </Link>
          <div className="rounded-2xl border border-border bg-bg-card p-10 text-center">
            <BookOpen className="mx-auto mb-4 h-10 w-10 text-text-muted opacity-40" />
            <h1 className="mb-2 text-lg font-black text-text-primary">Room Not Found</h1>
            <p className="text-sm text-text-muted">
              This room doesn't exist in the bootcamp config.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Locked ─────────────────────────────────────────────────────────────────
  const isRoomLocked = lockedRooms.has(`${phaseId}:${roomId}`);
  if (isRoomLocked) {
    return (
      <div className="min-h-screen bg-bg">
        <div className="mx-auto max-w-4xl px-4 pt-20 md:pt-24">
          <Link
            to={`/bootcamps/${bootcampId}`}
            className="mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-muted hover:text-accent transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Bootcamp
          </Link>
          <div className="rounded-2xl border border-border bg-bg-card p-10 text-center">
            <Lock className="mx-auto mb-4 h-10 w-10 text-text-muted opacity-40" />
            <h1 className="mb-2 text-lg font-black text-text-primary">{room.title}</h1>
            <p className="text-sm text-text-muted">
              This room is locked. Your instructor will unlock it when it's time.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isRoomComplete = completedRooms.has(`${phaseId}:${roomId}`);

  // ── Find matching API module for quiz ──────────────────────────────────────
  const apiModule = apiCourse?.modules.find(
    (m) => m.title.toLowerCase() === phase.title.toLowerCase()
  );
  const quizModuleId = apiModule ? String(apiModule.moduleId) : '';
  const quizCourseId = apiCourse?.id || bootcampId || '';
  // roomId is 1-based index of the room within the phase
  const quizRoomId = room ? String(phase.rooms.findIndex((r) => r.id === roomId) + 1) : '';

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="bg-bg overflow-x-hidden">
      {/* Quiz gate modal */}
      <AnimatePresence>
        {quizGateOpen && (
          <QuizGateModal
            onClose={() => setQuizGateOpen(false)}
            onTakeQuiz={() => { setQuizGateOpen(false); setQuizOpen(true); }}
          />
        )}
      </AnimatePresence>

      {/* Quiz modal */}
      {quizOpen && quizModuleId && (
        <QuizModal
          moduleId={quizModuleId}
          roomId={quizRoomId}
          courseId={quizCourseId}
          onClose={() => setQuizOpen(false)}
          onPassed={() => {
            setQuizPassed(true);
            setQuizOpen(false);
            if (phaseId && roomId) markRoomComplete(phaseId, roomId);
            setShowCompleteOverlay(true);
          }}
        />
      )}

      {/* Room complete overlay */}
      <AnimatePresence>
        {showCompleteOverlay && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-bg-card p-10 text-center shadow-2xl"
            >
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 400, damping: 20 }}
                className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl border border-accent/30 bg-accent-dim"
              >
                <CheckCircle2 className="h-10 w-10 text-accent" />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <p className="mb-2 text-[11px] font-black uppercase tracking-[0.3em] text-accent">Room Complete</p>
                <h2 className="mb-3 text-2xl font-black text-text-primary">{room.title}</h2>
                <p className="mb-8 text-base text-text-muted">
                  {nextRoom && !lockedRooms.has(`${nextRoom.phaseId}:${nextRoom.roomId}`)
                    ? `Ready for the next room: ${nextRoom.title}`
                    : "You've finished all available rooms in this phase."}
                </p>
                <div className="flex flex-col gap-3">
                  {nextRoom && !lockedRooms.has(`${nextRoom.phaseId}:${nextRoom.roomId}`) && (
                    <button
                      onClick={() => { setShowCompleteOverlay(false); handleNavigate(nextRoom.phaseId, nextRoom.roomId); }}
                      className="btn-primary flex items-center justify-center gap-2 py-4 text-base font-black"
                    >
                      Next Room <ArrowRight className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    onClick={() => { setShowCompleteOverlay(false); navigate(`/bootcamps/${bootcampId}`); }}
                    className="btn-secondary py-4 text-base"
                  >
                    Back to Curriculum
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MAIN SPLIT LAYOUT ── */}
      {/*
        Mobile  (<lg): normal document flow, page scrolls naturally.
        Desktop (lg+):  fixed below the topbar (top-24), full width/height.
                        Each column scrolls independently.
                        Fixed positioning is completely independent of any
                        parent height chain — no h-full / flex-1 juggling needed.
      */}
      <div className="
        lg:fixed lg:inset-0 lg:top-24
        lg:flex lg:flex-row
        lg:overflow-hidden
      ">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex lg:flex-col w-72 xl:w-80 shrink-0 border-r border-border bg-bg-card overflow-y-auto overscroll-contain">
            <nav className="flex flex-col gap-1 p-4 pb-8">
              {/* Back link */}
              <div className="mb-4 px-1">
                <Link
                  to={`/bootcamps/${bootcampId}`}
                  className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-text-muted hover:text-accent transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to Curriculum
                </Link>
              </div>

              {BOOTCAMP_CONFIG.phases.map((phase_) => (
                <div key={phase_.id} className="mb-4">
                  <p className="mb-2 px-2 text-[10px] font-black uppercase tracking-[0.3em] text-accent">
                    {phase_.codename} — {phase_.title}
                  </p>
                  <div className="space-y-0.5 border-l-2 border-border/40 ml-2 pl-3">
                    {phase_.rooms.map((room_) => {
                      const key = `${phase_.id}:${room_.id}`;
                      const isActive = phase_.id === phaseId && room_.id === roomId;
                      const isCompleted = completedRooms.has(key);
                      const isLocked = lockedRooms.has(key);
                      return (
                        <button
                          key={key}
                          onClick={() => { if (!isLocked) handleNavigate(phase_.id, room_.id); }}
                          disabled={isLocked}
                          className={`w-full flex items-center gap-3 rounded-xl px-3 py-3 text-left transition-all min-h-[52px] ${
                            isActive
                              ? 'bg-accent-dim border border-accent/30 text-accent font-bold'
                              : isLocked
                              ? 'opacity-40 cursor-not-allowed text-text-muted'
                              : 'hover:bg-accent-dim/30 text-text-secondary hover:text-text-primary'
                          }`}
                        >
                          <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[10px] font-black font-mono ${
                            isCompleted ? 'border-accent/40 bg-accent text-bg'
                              : isActive ? 'border-accent/40 bg-accent-dim text-accent'
                              : 'border-border bg-bg text-text-muted'
                          }`}>
                            {isCompleted ? <CheckCircle2 className="h-3 w-3" /> : isLocked ? <Lock className="h-3 w-3" /> : null}
                          </span>
                          <span className="truncate text-sm">{room_.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </aside>

          {/* Mobile sidebar drawer */}
          <Sidebar
            phases={BOOTCAMP_CONFIG.phases}
            activePhaseId={phaseId || ''}
            activeRoomId={roomId || ''}
            completedRooms={completedRooms}
            lockedRooms={lockedRooms}
            bootcampId={bootcampId || ''}
            onNavigate={handleNavigate}
            mobileOpen={sidebarOpen}
            onMobileClose={() => setSidebarOpen(false)}
          />

          {/* ── WALKTHROUGH CONTENT — independent scroll on desktop ── */}
          <main className="flex-1 min-h-0 min-w-0 lg:overflow-y-auto lg:overscroll-contain">
            {/* Content area */}
            <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 md:px-10 lg:px-12 py-8 md:py-12 pb-safe-bottom">

              {/* Mobile: curriculum open button — only visible below lg */}
              <div className="mb-6 flex flex-wrap items-center gap-2.5 lg:hidden">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-accent/40 bg-accent-dim px-3.5 py-2.5 text-[11px] font-black uppercase tracking-[0.16em] text-accent"
                  aria-label="Open curriculum"
                >
                  <Menu className="h-4 w-4" /> Curriculum
                </button>
                <span className="min-w-0 flex-1 text-[11px] font-black uppercase tracking-[0.12em] text-text-muted">
                  {phase.codename} — {room.title}
                </span>
              </div>

              {/* Room header */}
              <div className="mb-8">
                <span className="mb-2 block text-xs font-black uppercase tracking-[0.25em] text-accent">
                  {phase.codename} — {phase.title}
                </span>
                <h1 className="mb-4 text-3xl font-black leading-tight text-text-primary sm:text-4xl md:text-5xl break-words">
                  {room.title}
                </h1>
                <p className="border-l-4 border-accent/50 pl-4 text-base md:text-lg leading-relaxed text-text-secondary">
                  {room.overview}
                </p>
                {isRoomComplete && (
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-dim px-4 py-1.5 text-xs font-black uppercase tracking-widest text-accent">
                    <CheckCircle2 className="h-4 w-4" /> Room Complete
                  </div>
                )}
              </div>

              {/* Step progress bar */}
              <div className="mb-8 rounded-2xl border border-border bg-bg-card p-5 md:p-6">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-text-muted">Progress</span>
                  <span className="font-mono text-base font-black text-accent">
                    {viewedSteps.size} / {room.steps.length} steps
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-accent-dim">
                  <div
                    className="h-full rounded-full bg-accent transition-all duration-500"
                    style={{ width: `${(viewedSteps.size / room.steps.length) * 100}%` }}
                  />
                </div>
                <div className="mt-4 flex gap-2 flex-wrap">
                  {room.steps.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => goToStep(idx)}
                      className={`h-3 flex-1 min-w-[24px] max-w-[52px] rounded-full transition-all ${
                        idx === currentStepIdx ? 'bg-accent scale-y-[1.3]'
                          : viewedSteps.has(idx) ? 'bg-accent/45'
                          : 'bg-accent-dim'
                      }`}
                      title={`Step ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Active step card */}
              <div className="mb-10">
                <StepCard
                  key={currentStepIdx}
                  step={room.steps[currentStepIdx]}
                  stepNum={currentStepIdx + 1}
                  total={room.steps.length}
                  phaseId={phaseId || ''}
                  roomId={roomId || ''}
                  isActive
                  isViewed={viewedSteps.has(currentStepIdx)}
                  onClick={() => goToStep(currentStepIdx)}
                />
              </div>

              {/* Step navigation */}
              <div className="flex flex-wrap items-center gap-3 pb-16">
                <button
                  onClick={goPrev}
                  disabled={currentStepIdx === 0}
                  className="btn-secondary inline-flex flex-1 items-center justify-center gap-2 disabled:opacity-30 sm:flex-none"
                >
                  <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                  <span>Prev</span>
                </button>

                <span className="order-3 w-full text-center font-mono text-sm font-bold text-text-muted sm:order-none sm:w-auto">
                  {currentStepIdx + 1} / {room.steps.length}
                </span>

                <button
                  onClick={goNext}
                  className="btn-primary inline-flex flex-1 items-center justify-center gap-2 sm:flex-none"
                >
                  {isLastStep ? (
                    isRoomComplete
                      ? <><span>Done</span><CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" /></>
                      : <><span className="hidden sm:inline">{quizPassed ? 'Complete room' : 'Take quiz & complete'}</span><span className="sm:hidden">{quizPassed ? 'Complete' : 'Take quiz'}</span><CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" /></>
                  ) : (
                    <><span>Next</span><ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" /></>
                  )}
                </button>
              </div>

            </div>
          </main>
        </div>
    </div>
  );
};

export default BootcampRoomPage;
