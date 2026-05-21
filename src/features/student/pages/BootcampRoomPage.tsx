import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, ChevronRight, Lock, Loader2,
  CheckCircle2, XCircle, BookOpen, Menu, X,
  ClipboardList, Clock, Bookmark, Timer, Minimize2, List, Maximize2,
  Github, FileText, Send,
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
import QuizModal from '../components/bootcamp-room/QuizModal';
import QuizGateModal from '../components/bootcamp-room/QuizGateModal';
import AssignmentSubmissionModal from '../components/bootcamp-room/AssignmentSubmissionModal';
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

  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);

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

  const loadCourseData = useCallback(async () => {
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
  }, [bootcampId]);

  const markRoomComplete = async (phId: string, rmId: string) => {
    // Call backend API to save completion to database
    try {
      const phaseNum = parseInt(phId.replace('phase', ''), 10);
      const roomNum = parseInt(rmId.replace('room', ''), 10);
      const backendRoomId = phaseNum * 100 + roomNum;
      const response = await api.post(`/student/modules/${phaseNum}/rooms/${backendRoomId}/complete`, {});
      
      // Update completion CP earned for celebration
      if (response.data?.reward?.points) {
        setCompletionCpEarned(response.data.reward.points);
      }
      
      // Refetch course data to get updated completion status
      await loadCourseData();
      
    } catch (err: any) {
      console.error('❌ Failed to complete room in backend:', err?.response?.data || err);
      addToast('Failed to mark room as complete', 'error');
    }
  };

  // ── Load API data ──────────────────────────────────────────────────────────
  useEffect(() => {
    loadCourseData();
  }, [loadCourseData]);

  // ── Call session-open API when room loads ──────────────────────────────────
  useEffect(() => {
    if (!phaseId || !roomId || !bootcampId || apiLoading || bootcampStatus !== 'enrolled') {
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
        await api.post(`/student/modules/${phaseNum}/rooms/${backendRoomId}/session-open`, {});
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
    setAssignmentModalOpen(false);
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

  const currentModule = apiCourse?.modules.find(m => m.title.toLowerCase() === phase?.title.toLowerCase());
  const isAssignmentRoom = room?.isAssignment;
  const assignmentDetails = room?.assignmentDetails;
  
  const assignmentCompleted = currentModule?.assignmentCompleted;
  const ctfCompleted = currentModule?.ctfCompleted;

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

  const handleComplete = async () => {
    const allStepIdxs = room?.steps.map((_, i) => i) || [];
    setViewedSteps(new Set(allStepIdxs));
    
    if (!quizPassed && quizModuleId) {
      setQuizGateOpen(true);
      return;
    }

    // If room is already complete or quiz is passed
    if (phaseId && roomId) await markRoomComplete(phaseId, roomId);

    // If it's an assignment room, prompt for submission
    if (isAssignmentRoom && assignmentDetails && !assignmentCompleted) {
      if (!ctfCompleted) {
        addToast('Complete the Phase CTF on the course page before the assignment.', 'info');
        setShowCompleteOverlay(true);
      } else {
        setAssignmentModalOpen(true);
      }
    } else {
      setShowCompleteOverlay(true);
    }
  };

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

      {/* Desktop Floating Toolbar */}
      <aside
        className="hidden lg:flex fixed right-6 z-30 flex-col items-center gap-3"
        style={{
          top: '6rem',
          bottom: '1.5rem',
          justifyContent: 'center',
        }}
        aria-label="Room actions"
      >
        <button
          onClick={() => setJumpMenuOpen(true)}
          title="Jump to step"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-bg-card text-text-muted hover:border-accent/40 hover:text-accent transition-colors"
        >
          <List className="h-5 w-5" />
        </button>

        <button
          onClick={toggleFullscreen}
          title={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-bg-card text-text-muted hover:border-accent/40 hover:text-accent transition-colors"
        >
          {fullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
        </button>

        <div className="h-px w-6 bg-border/50 my-1" />

        <button
          onClick={async () => {
            if (!isLastStep) {
              goToStep(currentStepIdx + 1);
            } else {
              await handleComplete();
            }
          }}
          title={isLastStep ? "Complete room" : "Next step"}
          className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-all ${
            isLastStep && isAssignmentRoom && !assignmentCompleted && ctfCompleted
              ? 'border-accent bg-accent text-bg shadow-lg shadow-accent/20'
              : 'border-border bg-bg-card text-text-muted hover:border-accent/40 hover:text-accent'
          }`}
        >
          {isLastStep ? (
            isAssignmentRoom && !assignmentCompleted && ctfCompleted ? (
              <Github className="h-5 w-5" />
            ) : (
              <CheckCircle2 className="h-5 w-5" />
            )
          ) : (
            <ArrowRight className="h-5 w-5" />
          )}
        </button>
      </aside>

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
            <div className="mx-auto w-full max-w-6xl lg:max-w-7xl px-4 sm:px-6 md:px-8 py-8 md:py-12 pb-safe-bottom">

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
                    phaseColor={phase.color}
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
                  phaseColor={phase.color}
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
                      await handleComplete();
                    }
                  }}
                  className={`btn-primary inline-flex flex-1 lg:flex-none items-center justify-center gap-2 sm:flex-none ${
                    isLastStep && isAssignmentRoom && !assignmentCompleted && ctfCompleted
                      ? 'bg-accent text-bg shadow-lg shadow-accent/20'
                      : ''
                  }`}
                >
                  {isLastStep ? (
                    isAssignmentRoom && !assignmentCompleted && ctfCompleted ? (
                      <>
                        <Github className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span>Submit Assignment</span>
                        <Send className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 transition-transform group-hover:translate-x-1" />
                      </>
                    ) : isRoomComplete ? (
                      <><span>Done</span><CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" /></>
                    ) : (
                      <><span>{quizPassed ? 'Complete room' : 'Take quiz & complete'}</span><CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" /></>
                    )
                  ) : (
                    <>
                      <span className="lg:hidden">Next</span>
                      <span className="hidden lg:inline">Mark complete & continue</span>
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                    </>
                  )}
                </button>
              </div>

              {/* Phase Assignment Visual Hint for assignment room */}
              {isLastStep && isAssignmentRoom && assignmentDetails && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 mb-16 rounded-2xl border-2 border-accent/20 bg-accent-dim/30 p-6 flex flex-col md:flex-row items-center justify-between gap-6"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-accent mb-1">
                      <FileText className="h-4 w-4" />
                      Final Submission
                    </div>
                    <h4 className="text-xl font-black text-text-primary">{assignmentDetails.title}</h4>
                    <p className="text-sm text-text-muted mt-1 leading-relaxed">{assignmentDetails.description}</p>
                  </div>
                  <div className="shrink-0 flex flex-col items-center gap-3">
                    {assignmentCompleted ? (
                      <div className="flex flex-col items-center gap-2">
                         <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-bg shadow-lg shadow-accent/20">
                           <CheckCircle2 className="h-6 w-6" />
                         </div>
                         <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Submitted</span>
                      </div>
                    ) : (
                      <>
                        <div className="text-[10px] font-bold text-accent uppercase tracking-widest px-3 py-1 bg-accent/10 border border-accent/20 rounded-lg">
                          Required for Badge
                        </div>
                        {!ctfCompleted && (
                          <div className="text-[10px] font-bold text-red-400 uppercase tracking-widest">
                            Finish CTF First
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </motion.div>
              )}

            </div>
          </main>
        </div>

      <AnimatePresence>
        {assignmentModalOpen && assignmentDetails && (
          <AssignmentSubmissionModal
            moduleId={currentModule?.moduleId || 0}
            bootcampId={bootcampId || ''}
            assignment={assignmentDetails}
            onClose={() => setAssignmentModalOpen(false)}
            onSuccess={() => {
              loadCourseData();
              setAssignmentModalOpen(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default BootcampRoomPage;
