import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, ChevronRight, Lock, Loader2,
  CheckCircle2, BookOpen, ImageOff, Menu, X, ChevronDown,
} from 'lucide-react';
import api from '../../../core/services/api';
import { useToast } from '../../../core/contexts/ToastContext';
import {
  BOOTCAMP_CONFIG,
  buildStepImagePath,
  type BootcampPhase,
  type BootcampRoom,
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
// STEP IMAGE — loading + error fallback
// ─────────────────────────────────────────────────────────────────────────────
const StepImage: React.FC<{ src: string; alt: string; stepNum: number }> = ({ src, alt, stepNum }) => {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  return (
    <div className="mt-4 w-full overflow-hidden rounded-xl border border-border bg-bg">
      {status === 'loading' && (
        <div className="flex items-center justify-center py-12 text-text-muted">
          <Loader2 className="h-5 w-5 animate-spin opacity-40" />
        </div>
      )}
      {status === 'error' && (
        <div className="flex flex-col items-center justify-center gap-2 py-10 text-text-muted">
          <ImageOff className="h-6 w-6 opacity-30" />
          <span className="text-[11px] font-bold uppercase tracking-widest opacity-40">
            Step {stepNum} image not available
          </span>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
        className={`w-full object-contain transition-opacity duration-300 ${
          status === 'loaded' ? 'opacity-100' : 'opacity-0 h-0'
        }`}
        loading="lazy"
      />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STEP PLACEHOLDER (no image defined in config)
// ─────────────────────────────────────────────────────────────────────────────
const StepPlaceholder: React.FC<{ stepNum: number }> = ({ stepNum }) => (
  <div className="mt-4 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-bg py-10 text-text-muted">
    <ImageOff className="h-6 w-6 opacity-25" />
    <span className="text-[11px] font-bold uppercase tracking-widest opacity-35">
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
}> = ({ step, stepNum, total, phaseId, roomId, isActive, isViewed }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isActive]);

  return (
    <div
      ref={ref}
      className={`relative rounded-2xl border-2 p-6 md:p-8 transition-all duration-200 ${
        isActive
          ? 'border-accent/50 bg-bg-card shadow-[0_0_24px_rgba(183,255,153,0.06)]'
          : isViewed
          ? 'border-border bg-bg-card/60'
          : 'border-border/50 bg-bg-card/40'
      }`}
    >
      {/* Step header */}
      <div className="mb-5 flex items-center gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 font-mono text-xs font-black transition-colors ${
            isViewed && !isActive
              ? 'border-accent/40 bg-accent text-bg'
              : isActive
              ? 'border-accent bg-accent-dim text-accent'
              : 'border-border bg-bg text-text-muted'
          }`}
        >
          {isViewed && !isActive ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            String(stepNum).padStart(2, '0')
          )}
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">
            {step.title}
          </span>
          <span className="ml-3 text-[10px] text-text-muted opacity-50">
            {stepNum} / {total}
          </span>
        </div>
        {isActive && (
          <span className="rounded-full border border-accent/30 bg-accent-dim px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-accent">
            Current
          </span>
        )}
      </div>

      {/* Instruction */}
      <p
        className={`text-base leading-relaxed transition-colors ${
          isActive ? 'text-text-primary' : 'text-text-secondary'
        }`}
      >
        {step.instruction}
      </p>

      {/* Image */}
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
// SIDEBAR ITEM
// ─────────────────────────────────────────────────────────────────────────────
const SidebarRoomItem: React.FC<{
  phase: BootcampPhase;
  room: BootcampRoom;
  isActive: boolean;
  isCompleted: boolean;
  isLocked: boolean;
  bootcampId: string;
  onClick: () => void;
}> = ({ phase, room, isActive, isCompleted, isLocked, onClick }) => (
  <button
    onClick={onClick}
    disabled={isLocked}
    className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-all ${
      isActive
        ? 'bg-accent-dim border border-accent/30 text-accent font-bold'
        : isLocked
        ? 'opacity-40 cursor-not-allowed text-text-muted'
        : 'hover:bg-accent-dim/30 text-text-secondary hover:text-text-primary'
    }`}
  >
    <span
      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[10px] font-black font-mono ${
        isCompleted
          ? 'border-accent/40 bg-accent text-bg'
          : isActive
          ? 'border-accent/40 bg-accent-dim text-accent'
          : isLocked
          ? 'border-border bg-bg text-text-muted'
          : 'border-border bg-bg text-text-muted'
      }`}
    >
      {isCompleted ? <CheckCircle2 className="h-3 w-3" /> : isLocked ? <Lock className="h-3 w-3" /> : null}
    </span>
    <span className="truncate">{room.title}</span>
  </button>
);


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
  const [expandedPhase, setExpandedPhase] = useState<string>(activePhaseId);

  const content = (
    <nav className="flex flex-col gap-1 p-4">
      <div className="mb-4 px-1">
        <Link
          to={`/bootcamps/${bootcampId}`}
          className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-accent transition-colors"
          onClick={onMobileClose}
        >
          <ArrowLeft className="h-3 w-3" /> Curriculum
        </Link>
      </div>

      {phases.map((phase) => {
        const isExpanded = expandedPhase === phase.id;
        return (
          <div key={phase.id} className="mb-1">
            {/* Phase header */}
            <button
              onClick={() => setExpandedPhase(isExpanded ? '' : phase.id)}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left transition-colors hover:bg-accent-dim/20"
            >
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-accent flex-1">
                {phase.codename} — {phase.title}
              </span>
              <ChevronDown
                className={`h-3.5 w-3.5 shrink-0 text-text-muted transition-transform duration-200 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Rooms */}
            {isExpanded && (
              <div className="ml-2 mt-1 space-y-0.5 border-l border-border/50 pl-3">
                {phase.rooms.map((room) => {
                  const key = `${phase.id}:${room.id}`;
                  return (
                    <SidebarRoomItem
                      key={key}
                      phase={phase}
                      room={room}
                      isActive={phase.id === activePhaseId && room.id === activeRoomId}
                      isCompleted={completedRooms.has(key)}
                      isLocked={lockedRooms.has(key)}
                      bootcampId={bootcampId}
                      onClick={() => {
                        if (!lockedRooms.has(key)) {
                          onNavigate(phase.id, room.id);
                          onMobileClose();
                        }
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 xl:w-72 shrink-0 sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-border bg-bg-card">
        {content}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onMobileClose}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-72 overflow-y-auto bg-bg-card border-r border-border shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="text-xs font-black uppercase tracking-widest text-text-primary">
                Curriculum
              </span>
              <button
                onClick={onMobileClose}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-text-muted hover:text-text-primary transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {content}
          </aside>
        </div>
      )}
    </>
  );
};


// ─────────────────────────────────────────────────────────────────────────────
// QUIZ PANEL
// ─────────────────────────────────────────────────────────────────────────────
const QuizPanel: React.FC<{
  moduleId: string;
  courseId: string;
  bootcampId: string;
}> = ({ moduleId, courseId, bootcampId }) => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState<RoomQuiz | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{ score: number; passed: boolean; reward?: number } | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    setQuiz(null);
    setAnswers({});
    setResult(null);
    setError('');
    api
      .post('/student/quiz', { moduleId, courseId })
      .then((res) => {
        const q = res?.data as RoomQuiz;
        if (Array.isArray(q?.questions) && q.questions.length > 0) {
          setQuiz(q);
        } else {
          setError('No questions available for this module yet.');
        }
      })
      .catch((err: any) => {
        if (err?.response?.status !== 403) {
          setError(String(err?.response?.data?.error || '') || 'Could not load quiz.');
        }
      })
      .finally(() => setLoading(false));
  }, [moduleId, courseId]);

  const submit = async () => {
    if (!quiz) return;
    if (Object.keys(answers).length < quiz.questions.length) {
      addToast('Answer all questions before submitting.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post('/student/quiz', { moduleId, courseId, answers });
      const score = Number(res?.data?.score || 0);
      const passed = Boolean(res?.data?.passed);
      const reward = Number(res?.data?.reward?.points || 0);
      setResult({ score, passed, reward });
      addToast(
        passed ? `Quiz passed! ${score}% — +${reward} CP` : `Score: ${score}%`,
        passed ? 'success' : 'info'
      );
    } catch (err: any) {
      addToast(err?.response?.data?.error || 'Could not submit quiz.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-bg-card p-6">
      <h2 className="mb-5 text-sm font-black uppercase tracking-widest text-text-primary">
        Module Quiz
      </h2>

      {loading && (
        <div className="flex items-center gap-2 py-6 text-sm text-text-muted">
          <Loader2 className="h-4 w-4 animate-spin text-accent" />
          Loading quiz…
        </div>
      )}

      {!loading && !quiz && !result && (
        <p className={`py-4 text-center text-xs ${error ? 'text-red-400' : 'text-text-muted'}`}>
          {error || 'Quiz not available for this module yet.'}
        </p>
      )}

      {!loading && result && (
        <div className="space-y-4 py-4 text-center">
          <div className={`text-5xl font-black ${result.passed ? 'text-accent' : 'text-text-primary'}`}>
            {result.score}%
          </div>
          <div className={`text-sm font-bold uppercase tracking-widest ${result.passed ? 'text-accent' : 'text-text-muted'}`}>
            {result.passed ? '✓ Passed' : 'Keep going'}
          </div>
          {result.passed && result.reward && result.reward > 0 && (
            <div className="text-xs text-text-muted">+{result.reward} CP earned</div>
          )}
          {!result.passed && (
            <button
              onClick={() => { setResult(null); setAnswers({}); }}
              className="btn-secondary text-xs"
            >
              Try Again
            </button>
          )}
        </div>
      )}

      {!loading && quiz && !result && (
        <>
          {/* Progress bar */}
          <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-accent-dim">
            <div
              className="h-full rounded-full bg-accent transition-all duration-300"
              style={{ width: `${(Object.keys(answers).length / quiz.questions.length) * 100}%` }}
            />
          </div>

          <div className="space-y-6">
            {quiz.questions.map((q, idx) => (
              <div key={q.id || idx} className="space-y-3">
                <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                  Q{idx + 1} of {quiz.questions.length}
                </div>
                <p className="text-sm font-bold leading-snug text-text-primary">{q.text}</p>
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

          <div className="mt-6">
            <button
              onClick={submit}
              disabled={submitting || Object.keys(answers).length < quiz.questions.length}
              className="btn-primary inline-flex w-full items-center justify-center gap-2 py-3 text-sm disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Submitting…
                </>
              ) : (
                'Submit Quiz'
              )}
            </button>
            {Object.keys(answers).length < quiz.questions.length && (
              <p className="mt-2 text-center text-[10px] text-text-muted">
                Answer all {quiz.questions.length} questions to submit
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};


// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
const BootcampRoomPage: React.FC = () => {
  const { bootcampId, phaseId, roomId } = useParams<{
    bootcampId?: string;
    phaseId?: string;
    roomId?: string;
  }>();
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
      try { localStorage.setItem(storageKey, JSON.stringify([...next])); } catch {}
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

  // ── Reset step index when room changes ────────────────────────────────────
  useEffect(() => {
    setCurrentStepIdx(0);
    setViewedSteps(new Set([0]));
  }, [phaseId, roomId]);

  // ── Resolve config data ────────────────────────────────────────────────────
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
      // All steps viewed — mark room complete
      if (phaseId && roomId) markRoomComplete(phaseId, roomId);
      addToast('Room complete!', 'success');
    }
  };

  const goPrev = () => {
    if (currentStepIdx > 0) goToStep(currentStepIdx - 1);
  };

  const allStepsViewed = room ? viewedSteps.size >= room.steps.length : false;
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

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-bg pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 md:pt-24">

        {/* ── Mobile topbar ── */}
        <div className="mb-6 flex items-center gap-3 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-bg-card text-text-muted hover:text-text-primary transition-colors"
          >
            <Menu className="h-4 w-4" />
          </button>
          <nav className="flex min-w-0 flex-1 items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-text-muted">
            <Link to={`/bootcamps/${bootcampId}`} className="hover:text-accent transition-colors shrink-0">
              Bootcamp
            </Link>
            <ChevronRight className="h-3 w-3 opacity-40 shrink-0" />
            <span className="text-[9px] text-accent shrink-0">{phase.codename}</span>
            <ChevronRight className="h-3 w-3 opacity-40 shrink-0" />
            <span className="truncate text-text-primary">{room.title}</span>
          </nav>
        </div>

        {/* ── Main layout: sidebar + content ── */}
        <div className="flex gap-8 xl:gap-10 items-start">

          {/* LEFT SIDEBAR */}
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

          {/* MAIN CONTENT */}
          <div className="min-w-0 flex-1">

            {/* Desktop breadcrumb */}
            <nav className="mb-8 hidden items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-text-muted lg:flex">
              <Link to="/bootcamps" className="hover:text-accent transition-colors">Bootcamps</Link>
              <ChevronRight className="h-3 w-3 opacity-40" />
              <Link to={`/bootcamps/${bootcampId}`} className="hover:text-accent transition-colors">
                {apiCourse?.title || 'Bootcamp'}
              </Link>
              <ChevronRight className="h-3 w-3 opacity-40" />
              <span className="text-accent">{phase.codename} — {phase.title}</span>
              <ChevronRight className="h-3 w-3 opacity-40" />
              <span className="text-text-primary">{room.title}</span>
            </nav>

            {/* Room header */}
            <div className="mb-8">
              <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.3em] text-accent">
                {phase.codename} — {phase.title}
              </span>
              <h1 className="mb-3 text-3xl font-black leading-tight text-text-primary md:text-4xl">
                {room.title}
              </h1>
              <p className="border-l-2 border-accent pl-4 text-base leading-relaxed text-text-secondary">
                {room.overview}
              </p>
              {isRoomComplete && (
                <div className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent">
                  <CheckCircle2 className="h-4 w-4" /> Room Complete
                </div>
              )}
            </div>

            {/* Step progress bar */}
            <div className="mb-6 rounded-2xl border border-border bg-bg-card p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                  Progress
                </span>
                <span className="font-mono text-sm font-black text-accent">
                  {viewedSteps.size} / {room.steps.length} steps
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-accent-dim">
                <div
                  className="h-full rounded-full bg-accent transition-all duration-500"
                  style={{ width: `${(viewedSteps.size / room.steps.length) * 100}%` }}
                />
              </div>
              {/* Step dots */}
              <div className="mt-3 flex gap-2 flex-wrap">
                {room.steps.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToStep(idx)}
                    className={`h-2 flex-1 min-w-[20px] max-w-[40px] rounded-full transition-all ${
                      idx === currentStepIdx
                        ? 'bg-accent'
                        : viewedSteps.has(idx)
                        ? 'bg-accent/40'
                        : 'bg-accent-dim'
                    }`}
                    title={`Step ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-4 mb-8">
              {room.steps.map((step, idx) => (
                <StepCard
                  key={idx}
                  step={step}
                  stepNum={idx + 1}
                  total={room.steps.length}
                  phaseId={phaseId || ''}
                  roomId={roomId || ''}
                  isActive={idx === currentStepIdx}
                  isViewed={viewedSteps.has(idx)}
                />
              ))}
            </div>

            {/* Step navigation buttons */}
            <div className="mb-10 flex items-center justify-between gap-4">
              <button
                onClick={goPrev}
                disabled={currentStepIdx === 0}
                className="btn-secondary inline-flex items-center gap-2 text-sm disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" /> Previous
              </button>

              <span className="text-xs font-bold text-text-muted">
                Step {currentStepIdx + 1} of {room.steps.length}
              </span>

              <button
                onClick={goNext}
                className={`inline-flex items-center gap-2 text-sm font-black uppercase tracking-wide ${
                  isLastStep && allStepsViewed
                    ? 'btn-primary'
                    : 'btn-primary'
                } disabled:opacity-40`}
              >
                {isLastStep ? (
                  isRoomComplete ? (
                    <>Done <CheckCircle2 className="h-4 w-4" /></>
                  ) : (
                    <>Complete Room <CheckCircle2 className="h-4 w-4" /></>
                  )
                ) : (
                  <>Next <ArrowRight className="h-4 w-4" /></>
                )}
              </button>
            </div>

            {/* Session info */}
            <div className="mb-8 rounded-2xl border border-border bg-bg-card p-5">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-text-muted">
                Live Session
              </p>
              <p className="text-sm leading-relaxed text-text-secondary">
                Your instructor will share the session link in the bootcamp WhatsApp group. Attend the live session, then complete the module quiz below to earn your CP reward.
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs font-bold text-accent">
                <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                Check WhatsApp group for session link
              </div>
            </div>

            {/* Quiz */}
            {quizModuleId && (
              <div className="mb-10">
                <QuizPanel
                  moduleId={quizModuleId}
                  courseId={quizCourseId}
                  bootcampId={bootcampId || ''}
                />
              </div>
            )}

            {/* Prev / Next room navigation */}
            <div className="flex items-stretch gap-4">
              {prevRoom ? (
                <button
                  onClick={() => handleNavigate(prevRoom.phaseId, prevRoom.roomId)}
                  className="flex flex-1 items-center gap-3 rounded-2xl border border-border bg-bg-card p-4 text-left transition-all hover:border-accent/30 hover:bg-accent-dim/20"
                >
                  <ArrowLeft className="h-5 w-5 shrink-0 text-text-muted" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Previous</p>
                    <p className="truncate text-sm font-bold text-text-primary">{prevRoom.title}</p>
                  </div>
                </button>
              ) : (
                <div className="flex-1" />
              )}
              {nextRoom && !lockedRooms.has(`${nextRoom.phaseId}:${nextRoom.roomId}`) ? (
                <button
                  onClick={() => handleNavigate(nextRoom.phaseId, nextRoom.roomId)}
                  className="flex flex-1 items-center justify-end gap-3 rounded-2xl border border-border bg-bg-card p-4 text-right transition-all hover:border-accent/30 hover:bg-accent-dim/20"
                >
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Next</p>
                    <p className="truncate text-sm font-bold text-text-primary">{nextRoom.title}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 shrink-0 text-text-muted" />
                </button>
              ) : (
                <div className="flex-1" />
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default BootcampRoomPage;
