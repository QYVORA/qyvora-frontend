import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, ChevronRight, Lock, Loader2,
  CheckCircle2, XCircle, BookOpen, Menu, X,
  ClipboardList, Clock, Bookmark, Timer, Minimize2, List, Maximize2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import api from '../../../core/services/api';
import { useToast } from '../../../core/contexts/ToastContext';
import {
  BOOTCAMP_CONFIG,
  type BootcampPhase,
} from '../constants/bootcampConfig';
import CopyButton from '../components/bootcamp-room/CopyButton';
import StepJumpMenu from '../components/bootcamp-room/StepJumpMenu';
import ReportIssueModal from '../components/bootcamp-room/ReportIssueModal';
import StepCard from '../components/bootcamp-room/StepCard';
import RoomSidebar from '../components/bootcamp-room/RoomSidebar';
import RoomCompletionCelebration from '../../../shared/components/RoomCompletionCelebration';
import type { ApiCourse, RoomQuiz, QuizQuestion } from '../components/bootcamp-room/types';
import { Dialog, DialogContent } from '../../../shared/components/ui/Dialog';

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY: Format time
// ─────────────────────────────────────────────────────────────────────────────
function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

interface StepNote {
  phaseId: string;
  roomId: string;
  stepIdx: number;
  note: string;
  bookmarked: boolean;
  timestamp: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// QUIZ GATE MODAL — shown when student tries to skip the quiz
// ─────────────────────────────────────────────────────────────────────────────
const QuizGateModal: React.FC<{ onClose: () => void; onTakeQuiz: () => void }> = ({ onClose, onTakeQuiz }) => (
  <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
    <DialogContent title="Quiz Required" maxWidth="max-w-sm">
      <div className="text-center py-2">
      <div className="mb-4 flex justify-center">
        <Lock className="h-10 w-10 text-accent" />
      </div>
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
      </div>
    </DialogContent>
  </Dialog>
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
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent title="Room Quiz" maxWidth="max-w-2xl" className="max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-bg-card px-6 py-4 -mx-6 -mt-6 mb-6">
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

        <div>
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
                <div className={`flex items-center justify-center gap-1.5 text-sm font-bold uppercase tracking-widest ${result.passed ? 'text-accent' : 'text-red-400'}`}>
                  {result.passed
                    ? <><CheckCircle2 className="h-4 w-4" /> Passed</>
                    : <><XCircle className="h-4 w-4" /> Not quite — 70% needed</>
                  }
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
                        <span className={`shrink-0 mt-0.5 ${isRight ? 'text-accent' : 'text-red-400'}`}>
                          {isRight
                            ? <CheckCircle2 className="h-4 w-4" />
                            : <XCircle className="h-4 w-4" />
                          }
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
      </DialogContent>
    </Dialog>
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
  const [completionCpEarned, setCompletionCpEarned] = useState(250);

  // ── Completed rooms from API (NOT localStorage) ───────────────────────────────
  // Build a set of completed room keys from the API course data
  const completedRooms = new Set<string>();
  if (apiCourse) {
    apiCourse.modules.forEach((mod) => {
      // Find matching phase by title
      const matchPhase = BOOTCAMP_CONFIG.phases.find(
        (p) => p.title.toLowerCase() === mod.title.toLowerCase()
      );
      if (matchPhase) {
        mod.rooms.forEach((apiRoom) => {
          if (apiRoom.completed) {
            const matchRoom = matchPhase.rooms.find(
              (r) => r.title.toLowerCase() === apiRoom.title.toLowerCase()
            );
            if (matchRoom) {
              completedRooms.add(`${matchPhase.id}:${matchRoom.id}`);
            }
          }
        });
      }
    });
  }

  const markRoomComplete = async (phId: string, rmId: string) => {
    // Call backend API to save completion to database
    try {
      const phaseNum = parseInt(phId.replace('phase', ''), 10);
      const roomNum = parseInt(rmId.replace('room', ''), 10);
      const backendRoomId = phaseNum * 100 + roomNum;
      
      console.log(`🎯 Completing room: moduleId=${phaseNum}, roomId=${backendRoomId}`);
      const response = await api.post(`/student/modules/${phaseNum}/rooms/${backendRoomId}/complete`, {});
      console.log('✅ Room completed in backend:', response.data);
      
      // Update completion CP earned for celebration
      if (response.data?.reward?.points) {
        setCompletionCpEarned(response.data.reward.points);
      }
      
      // Refetch course data to get updated completion status
      const query = bootcampId ? `?bootcampId=${encodeURIComponent(bootcampId)}` : '';
      const courseRes = await api.get(`/student/course${query}`);
      if (courseRes?.data) setApiCourse(courseRes.data as ApiCourse);
      
    } catch (err: any) {
      console.error('❌ Failed to complete room in backend:', err?.response?.data || err);
      addToast('Failed to mark room as complete', 'error');
    }
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

  // ── Call session-open API when room loads ──────────────────────────────────
  useEffect(() => {
    console.log('🔍 Session-open check:', {
      phaseId,
      roomId,
      bootcampId,
      apiLoading,
      bootcampStatus,
      shouldCall: !(!phaseId || !roomId || !bootcampId || apiLoading || bootcampStatus !== 'enrolled')
    });
    
    if (!phaseId || !roomId || !bootcampId || apiLoading || bootcampStatus !== 'enrolled') {
      console.log('⏭️ Skipping session-open call');
      return;
    }
    
    // Map frontend IDs to backend IDs
    // Frontend: phase1, phase2... → Backend: moduleId 1, 2...
    // Frontend: room1, room2, room3... → Backend: roomId 101, 102, 103... (phase1), 201, 202... (phase2)
    const phaseNum = parseInt(phaseId.replace('phase', ''), 10);
    const roomNum = parseInt(roomId.replace('room', ''), 10);
    
    // Backend uses roomId format: moduleId * 100 + roomNum
    // Phase 1: 101, 102, 103
    // Phase 2: 201, 202, 203, 204
    const backendRoomId = phaseNum * 100 + roomNum;
    
    const callSessionOpen = async () => {
      try {
        console.log(`🔄 Calling session-open: moduleId=${phaseNum}, roomId=${backendRoomId}`);
        const response = await api.post(`/student/modules/${phaseNum}/rooms/${backendRoomId}/session-open`, {});
        console.log('✅ Room session opened - progress saved to backend', response.data);
      } catch (err: any) {
        console.error('❌ Failed to open room session:', err?.response?.data || err?.message || err);
      }
    };
    
    callSessionOpen();
  }, [phaseId, roomId, bootcampId, apiLoading, bootcampStatus]);

  // ── Redirect if not enrolled ───────────────────────────────────────────────
  useEffect(() => {
    if (!apiLoading && bootcampStatus === 'not_enrolled') {
      navigate('/dashboard/bootcamps', { replace: true });
    }
  }, [apiLoading, bootcampStatus, navigate]);

  // ── Listen for quiz open event from navbar ────────────────────────────────
  useEffect(() => {
    const handler = () => setQuizOpen(true);
    window.addEventListener('bootcamp:openQuiz', handler);
    return () => window.removeEventListener('bootcamp:openQuiz', handler);
  }, []);

  // ── NEW FEATURES: Session timer ────────────────────────────────────────────
  const [sessionStart, setSessionStart] = useState<number>(Date.now());
  const [timeSpent, setTimeSpent] = useState<number>(0);

  // ── NEW FEATURES: Fullscreen mode ──────────────────────────────────────────
  const [fullscreen, setFullscreen] = useState(false);

  // ── NEW FEATURES: Jump menu ────────────────────────────────────────────────
  const [jumpMenuOpen, setJumpMenuOpen] = useState(false);

  // ── NEW FEATURES: Report issue ─────────────────────────────────────────────
  const [reportIssueOpen, setReportIssueOpen] = useState(false);
  const [reportStepIdx, setReportStepIdx] = useState(0);

  // ── NEW FEATURES: Bookmarks (localStorage) ─────────────────────────────────
  const bookmarksKey = `hpb_bookmarks_${bootcampId || 'hpb'}`;
  const [bookmarkedSteps, setBookmarkedSteps] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(bookmarksKey);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
      return new Set();
    }
  });

  const toggleBookmark = (stepIdx: number) => {
    const key = `${phaseId}:${roomId}:${stepIdx}`;
    setBookmarkedSteps(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      try {
        localStorage.setItem(bookmarksKey, JSON.stringify([...next]));
      } catch (_e) { /* ignore */ }
      return next;
    });
  };

  const isStepBookmarked = (stepIdx: number) => {
    return bookmarkedSteps.has(`${phaseId}:${roomId}:${stepIdx}`);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // ── NEW FEATURES: Session timer effect ─────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(Date.now() - sessionStart);
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionStart]);

  // ── Reset step index when room changes ────────────────────────────────────
  useEffect(() => {
    setCurrentStepIdx(0);
    setViewedSteps(new Set([0]));
    setQuizPassed(false);
    // NEW: Reset session timer on room change
    setSessionStart(Date.now());
    setTimeSpent(0);
  }, [phaseId, roomId]);

  // ── NEW FEATURES: Fullscreen change listener ───────────────────────────────
  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

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
    navigate(`/dashboard/bootcamps/${bootcampId}/phases/${pId}/rooms/${rId}`);
  };

  const goToStep = (idx: number) => {
    setCurrentStepIdx(idx);
    setViewedSteps((prev) => {
      const next = new Set(prev);
      next.add(idx);
      return next;
    });
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
            to={`/dashboard/bootcamps/${bootcampId}`}
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
            to={`/dashboard/bootcamps/${bootcampId}`}
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
            if (phaseId && roomId) markRoomComplete(phaseId, roomId).then(() => {
              setShowCompleteOverlay(true);
            });
          }}
        />
      )}

      {/* NEW: Jump menu */}
      <AnimatePresence>
        {jumpMenuOpen && room && (
          <StepJumpMenu
            steps={room.steps}
            currentStepIdx={currentStepIdx}
            viewedSteps={viewedSteps}
            onJump={goToStep}
            isOpen={jumpMenuOpen}
            onClose={() => setJumpMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* NEW: Report issue modal */}
      <AnimatePresence>
        {reportIssueOpen && phaseId && roomId && (
          <ReportIssueModal
            phaseId={phaseId}
            roomId={roomId}
            stepIdx={reportStepIdx}
            onClose={() => setReportIssueOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Room complete celebration */}
      <RoomCompletionCelebration
        show={showCompleteOverlay}
        roomTitle={room.title}
        cpEarned={completionCpEarned}
        onClose={() => {
          setShowCompleteOverlay(false);
          // Navigate to next room or back to curriculum
          if (nextRoom && !lockedRooms.has(`${nextRoom.phaseId}:${nextRoom.roomId}`)) {
            handleNavigate(nextRoom.phaseId, nextRoom.roomId);
          } else {
            navigate(`/dashboard/bootcamps/${bootcampId}`);
          }
        }}
      />

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
        <aside className="hidden lg:flex lg:flex-col w-72 xl:w-80 shrink-0 bg-bg-card border-r border-border overflow-y-auto overscroll-contain scroll-hover"
          style={{
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0px, black 24px)',
            maskImage: 'linear-gradient(to bottom, transparent 0px, black 24px)',
          }}
        >
            <nav className="flex flex-col gap-1 p-4 pb-8">
              {/* Back link */}
              <div className="mb-4 px-1">
                <Link
                  to={`/dashboard/bootcamps/${bootcampId}`}
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
          <RoomSidebar
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
          <main className="flex-1 min-h-0 min-w-0 lg:overflow-y-auto lg:overscroll-contain scroll-hover"
            style={{
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0px, black 24px)',
              maskImage: 'linear-gradient(to bottom, transparent 0px, black 24px)',
            }}
          >
            {/* Content area */}
            <div className="mx-auto w-full max-w-6xl lg:max-w-7xl px-3 sm:px-4 md:px-5 py-8 md:py-12 pb-safe-bottom">

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
                 <div className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-accent">
                   {phase.codename} — {phase.title}
                 </div>
                 <h1 className="mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-tight text-text-primary break-words">
                   {room.title}
                 </h1>
                <p className="border-l-4 border-accent/50 pl-4 text-sm sm:text-base leading-relaxed text-text-secondary">
                  {room.overview}
                </p>
                {/* NEW: Estimated time and session timer */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted mt-4">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>{room.estimatedMinutes} min</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4" />
                    <span>{room.steps.length} steps</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Timer className="h-4 w-4" />
                    <span>Session: {formatTime(timeSpent)}</span>
                  </div>
                </div>
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
                {/* NEW: Session timer in progress bar */}
                <div className="flex items-center gap-2 text-xs text-text-muted mt-3">
                  <Timer className="h-3.5 w-3.5" />
                  <span>Time in room: {formatTime(timeSpent)}</span>
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

              {/*
                ── STEP RENDERING ──
                Desktop (lg+):
                  ≤5 steps → show ALL steps stacked, no next/prev buttons needed
                  >5 steps → show steps up to currentStepIdx+1 (reveal as student progresses)
                             with Prev/Next navigation at the bottom
                Mobile (<lg):
                  Always show one step at a time with Prev/Next
              */}

              {/* Desktop: all steps visible */}
              <div className="hidden lg:block mb-10 space-y-4">
                {room.steps.map((step, idx) => (
                  <StepCard
                    key={idx}
                    step={step}
                    stepNum={idx + 1}
                    phaseId={phaseId || ''}
                    roomId={roomId || ''}
                    isActive={idx === currentStepIdx}
                    isViewed={viewedSteps.has(idx)}
                    isBookmarked={isStepBookmarked(idx)}
                    onToggleBookmark={() => toggleBookmark(idx)}
                    onReportIssue={() => { setReportStepIdx(idx); setReportIssueOpen(true); }}
                    onClick={() => goToStep(idx)}
                  />
                ))}
              </div>

              {/* Mobile: one step at a time */}
              <div className="lg:hidden mb-10">
                <StepCard
                  key={currentStepIdx}
                  step={room.steps[currentStepIdx]}
                  stepNum={currentStepIdx + 1}
                  phaseId={phaseId || ''}
                  roomId={roomId || ''}
                  isActive
                  isViewed={viewedSteps.has(currentStepIdx)}
                  isBookmarked={isStepBookmarked(currentStepIdx)}
                  onToggleBookmark={() => toggleBookmark(currentStepIdx)}
                  onReportIssue={() => { setReportStepIdx(currentStepIdx); setReportIssueOpen(true); }}
                  onClick={() => goToStep(currentStepIdx)}
                />
              </div>

              {/* Step navigation — mobile always, desktop only when >5 steps */}
              <div className={`flex flex-wrap items-center gap-3 pb-16 ${room.steps.length <= 5 ? 'lg:justify-end' : ''}`}>
                {/* NEW: Jump to step button */}
                <button
                  onClick={() => setJumpMenuOpen(true)}
                  className="btn-secondary inline-flex items-center gap-2"
                >
                  <List className="h-4 w-4" />
                  <span className="hidden sm:inline">Jump</span>
                </button>

                {/* NEW: Fullscreen button */}
                <button
                  onClick={toggleFullscreen}
                  className="btn-secondary inline-flex items-center gap-2"
                  title="Toggle fullscreen (F)"
                >
                  {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  <span className="hidden sm:inline">{fullscreen ? 'Exit' : 'Full'}</span>
                </button>

                {/* Prev — mobile only (desktop shows all steps) */}
                <button
                  onClick={() => { if (currentStepIdx > 0) goToStep(currentStepIdx - 1); }}
                  disabled={currentStepIdx === 0}
                  className="lg:hidden btn-secondary inline-flex flex-1 items-center justify-center gap-2 disabled:opacity-30 sm:flex-none"
                >
                  <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                  <span>Prev</span>
                </button>

                {/* Step counter — mobile only */}
                <span className="lg:hidden order-3 w-full text-center font-mono text-sm font-bold text-text-muted sm:order-none sm:w-auto">
                  {currentStepIdx + 1} / {room.steps.length}
                </span>

                {/* Next / Complete — mobile: always shown; desktop: always shown (marks complete) */}
                <button
                  onClick={async () => {
                    if (!isLastStep) {
                      goToStep(currentStepIdx + 1);
                    } else {
                      const allStepIdxs = room.steps.map((_, i) => i);
                      setViewedSteps(new Set(allStepIdxs));
                      if (!quizPassed && quizModuleId) {
                        setQuizGateOpen(true);
                      } else {
                        if (phaseId && roomId) await markRoomComplete(phaseId, roomId);
                        setShowCompleteOverlay(true);
                      }
                    }
                  }}
                  className="btn-primary inline-flex flex-1 lg:flex-none items-center justify-center gap-2 sm:flex-none"
                >
                  {isLastStep ? (
                    isRoomComplete
                      ? <><span>Done</span><CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" /></>
                      : <><span>{quizPassed ? 'Complete room' : 'Take quiz & complete'}</span><CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" /></>
                  ) : (
                    <>
                      <span className="lg:hidden">Next</span>
                      <span className="hidden lg:inline">Mark complete & continue</span>
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                    </>
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
