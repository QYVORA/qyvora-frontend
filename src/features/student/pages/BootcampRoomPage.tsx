import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Lock, Loader2,
  CheckCircle2, BookOpen, Menu,
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
import RoomCompletionCelebration from '../components/bootcamp-room/RoomCompletionCelebration';
import RoomHeader from '../components/bootcamp-room/RoomHeader';
import RoomProgress from '../components/bootcamp-room/RoomProgress';
import RoomNavigation from '../components/bootcamp-room/RoomNavigation';
import DesktopToolbar from '../components/bootcamp-room/DesktopToolbar';
import { useRoomSession } from '../hooks/useRoomSession';
import type { ApiCourse, RoomQuiz, QuizQuestion } from '../components/bootcamp-room/types';
import { Dialog, DialogContent } from '../../../shared/components/ui/Dialog';
import PageLoader from '../../../shared/components/PageLoader';

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // ── Quiz modal ─────────────────────────────────────────────────────────────
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizGateOpen, setQuizGateOpen] = useState(false);
  // Track whether the quiz for the current room has been passed this session
  const [quizPassed, setQuizPassed] = useState(false);

  // ── Room complete overlay ──────────────────────────────────────────────────
  const [showCompleteOverlay, setShowCompleteOverlay] = useState(false);
  const [completionCpEarned, setCompletionCpEarned] = useState(250);
  const [completing, setCompleting] = useState(false);

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
      
      // ── OPTIMIZATION: Show celebration immediately ──
      // Don't wait for loadCourseData() which performs two more API calls.
      // Show the success overlay right now for a snappier experience.
      setShowCompleteOverlay(true);
      
      // Refetch course data in background to update UI (like sidebar checkmarks)
      loadCourseData();
      
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

  // ── NEW FEATURES: Session timer & Fullscreen (Extracted Hook) ─────────────
  const { timeSpent, fullscreen, toggleFullscreen, resetSession } = useRoomSession();

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

  // ── Reset step index when room changes ────────────────────────────────────
  useEffect(() => {
    setCurrentStepIdx(0);
    setViewedSteps(new Set([0]));
    setQuizPassed(false);
    resetSession();
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
        roomTitle={room?.title || ''}
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
      {!apiLoading && (
        <DesktopToolbar
          setJumpMenuOpen={setJumpMenuOpen}
          toggleFullscreen={toggleFullscreen}
          fullscreen={fullscreen}
          isLastStep={isLastStep}
          isRoomComplete={isRoomComplete}
          nextRoom={nextRoom}
          quizModuleId={quizModuleId}
          completing={completing}
          currentStepIdx={currentStepIdx}
          goToStep={goToStep}
          handleComplete={handleComplete}
        />
      )}

      {/* ── MAIN SPLIT LAYOUT ── */}
      <div className="
        md:fixed md:inset-0 md:top-24
        md:flex md:flex-row
        md:overflow-hidden
      ">
        {/* Desktop sidebar */}
        <aside className={`
          hidden md:flex md:flex-col shrink-0 bg-bg-card border-r border-border overflow-hidden transition-all duration-300 relative
          ${sidebarCollapsed ? 'w-0 border-r-0' : 'w-72 xl:w-80'}
        `}>
          <div className="w-72 xl:w-80 h-full overflow-y-auto overscroll-contain scroll-hover">
            {apiLoading ? (
              <div className="p-4 space-y-6 animate-pulse">
                {[0, 1, 2].map(i => (
                  <div key={i} className="space-y-3">
                    <div className="h-2 w-24 bg-accent-dim/20 rounded" />
                    <div className="space-y-2 pl-4">
                      {[0, 1, 2].map(j => (
                        <div key={j} className="h-10 w-full bg-accent-dim/10 rounded-xl" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <nav className={`flex flex-col gap-1 p-4 pb-8 transition-opacity duration-200 ${sidebarCollapsed ? 'opacity-0' : 'opacity-100'}`}>
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
            )}
          </div>
        </aside>

        {/* Collapse toggle button - Desktop only */}
        {!apiLoading && (
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`
              hidden md:flex absolute top-6 z-50 h-8 w-8 rounded-full border border-border bg-bg-card items-center justify-center text-text-muted hover:text-accent transition-all shadow-xl hover:scale-110 active:scale-95
              ${sidebarCollapsed ? 'left-6 rotate-180' : 'left-[274px] xl:left-[306px]'}
            `}
            title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <Menu className="h-4 w-4" />
          </button>
        )}

          {/* Mobile sidebar drawer */}
          {!apiLoading && (
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
          )}

          {/* ── WALKTHROUGH CONTENT — independent scroll on desktop ── */}
          <main className="flex-1 min-h-0 min-w-0 md:overflow-y-auto md:overscroll-contain scroll-hover">
            {apiLoading ? (
              <div className="mx-auto w-full max-w-6xl md:max-w-7xl px-4 sm:px-6 md:px-8 py-8 md:py-12 animate-pulse space-y-8">
                <div className="space-y-4">
                  <div className="h-3 w-32 bg-accent-dim/20 rounded" />
                  <div className="h-8 w-1/2 bg-accent-dim/20 rounded" />
                </div>
                <div className="h-2 w-full bg-accent-dim/10 rounded-full" />
                <div className="space-y-6">
                  {[0, 1].map(i => (
                    <div key={i} className="h-64 w-full bg-accent-dim/5 rounded-2xl border border-border/40" />
                  ))}
                </div>
              </div>
            ) : !phase || !room ? (
              <div className="mx-auto max-w-4xl px-4 py-12">
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
            ) : isRoomLocked ? (
              <div className="mx-auto max-w-4xl px-4 py-12">
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
            ) : (
              <div className="mx-auto w-full max-w-6xl md:max-w-7xl px-4 sm:px-6 md:px-8 py-8 md:py-12 pb-safe-bottom">

                {/* Mobile: curriculum open button */}
                <div className="mb-6 flex flex-wrap items-center gap-2.5 md:hidden">
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
                <RoomHeader
                  phase={phase}
                  room={room}
                  timeSpent={timeSpent}
                  formatTime={formatTime}
                  isRoomComplete={isRoomComplete}
                />

                {/* Step progress bar */}
                <RoomProgress
                  viewedStepsCount={viewedSteps.size}
                  totalStepsCount={room.steps.length}
                  timeSpent={timeSpent}
                  formatTime={formatTime}
                  currentStepIdx={currentStepIdx}
                  goToStep={goToStep}
                  steps={room.steps}
                  viewedSteps={viewedSteps}
                />

                {/* Desktop: all steps visible */}
                <div className="hidden md:block mb-10 space-y-4">
                  {room.steps.map((step, idx) => {
                    return (
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
                        footer={null}
                        onToggleBookmark={() => toggleBookmark(idx)}
                        onReportIssue={() => { setReportStepIdx(idx); setReportIssueOpen(true); }}
                        onClick={() => goToStep(idx)}
                      />
                    );
                  })}
                </div>

                {/* Mobile: one step at a time */}
                <div className="md:hidden mb-10">
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
                    footer={null}
                    onToggleBookmark={() => toggleBookmark(currentStepIdx)}
                    onReportIssue={() => { setReportStepIdx(currentStepIdx); setReportIssueOpen(true); }}
                    onClick={() => goToStep(currentStepIdx)}
                  />
                </div>

                {/* Step navigation */}
                <RoomNavigation
                  currentStepIdx={currentStepIdx}
                  totalSteps={room.steps.length}
                  isLastStep={isLastStep}
                  isRoomComplete={isRoomComplete}
                  nextRoom={nextRoom}
                  quizPassed={quizPassed}
                  quizModuleId={quizModuleId}
                  completing={completing}
                  fullscreen={fullscreen}
                  goToStep={goToStep}
                  handleComplete={handleComplete}
                  toggleFullscreen={toggleFullscreen}
                  setJumpMenuOpen={setJumpMenuOpen}
                />
              </div>
            )}
          </main>
        </div>
    </div>
  );
};

export default BootcampRoomPage;
