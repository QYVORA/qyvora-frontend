import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, X, List, Lock, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SEO from '@/shared/components/SEO';
import { getCourseById } from '@/features/student/data/courses/courseData';
import CodeBlockRenderer from '@/features/student/components/bootcamp-room/CodeBlockRenderer';
import api from '@/core/services/api';
import type { Lesson } from '@/features/student/data/courses/types';

const STORAGE_KEY = 'qyvora_course_progress';

const LessonViewer: React.FC<{ lesson: Lesson; number: number }> = ({ lesson, number }) => {
  return (
    <div className="border border-border bg-bg-card rounded-sm p-5 md:p-8 space-y-6">
      <div className="flex items-center gap-3">
        <span className="flex items-center justify-center w-8 h-8 rounded-sm bg-accent text-bg text-xs font-black font-mono">
          {String(number).padStart(2, '0')}
        </span>
        <h2 className="text-xl md:text-2xl font-black text-text-primary tracking-tight font-mono">
          {lesson.title}
        </h2>
        {lesson.hasQuiz && (
          <span className="px-2 py-0.5 rounded-sm bg-accent/10 text-[9px] font-black uppercase tracking-widest text-accent border border-accent/20">
            Quiz
          </span>
        )}
      </div>
      <div className="prose prose-invert max-w-none text-sm text-text-secondary leading-relaxed">
        <CodeBlockRenderer text={lesson.instruction} />
      </div>
    </div>
  );
};

const CourseLessonPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const course = getCourseById(courseId || '');

  const [purchased, setPurchased] = useState<boolean | null>(null);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const sidebarHandler = () => setSidebarOpen(true);
    window.addEventListener('course:openSidebar', sidebarHandler);
    return () => {
      window.removeEventListener('course:openSidebar', sidebarHandler);
    };
  }, []);

  useEffect(() => {
    if (!courseId) { setCheckingAccess(false); return; }
    const saved = localStorage.getItem(`${STORAGE_KEY}_${courseId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCompletedLessons(new Set(parsed.completedLessons));
        setCurrentLessonIdx(parsed.lastLesson ?? 0);
      } catch {}
    }
    api.get('/cp/transactions?limit=100').then((r) => {
      const items = Array.isArray(r.data?.items) ? r.data.items : [];
      const purchasedIds = new Set(items.filter((tx: any) => tx.type === 'purchase').map((tx: any) => {
        return tx.metadata?.slug || tx.metadata?.courseId || String(tx.productId);
      }));
      setPurchased(purchasedIds.has(courseId || ''));
    }).catch(() => {
      setPurchased(false);
    }).finally(() => setCheckingAccess(false));
  }, [courseId]);

  const lesson = course?.lessons[currentLessonIdx];
  const totalLessons = course?.lessons.length ?? 0;
  const completedCount = completedLessons.size;
  const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const saveProgress = useCallback((lessons: Set<string>, idx: number) => {
    if (!courseId) return;
    localStorage.setItem(`${STORAGE_KEY}_${courseId}`, JSON.stringify({
      completedLessons: [...lessons],
      lastLesson: idx,
    }));
  }, [courseId]);

  const markComplete = useCallback(() => {
    if (!lesson) return;
    const next = new Set([...completedLessons, lesson.id]);
    setCompletedLessons(next);
    saveProgress(next, currentLessonIdx);
  }, [lesson, completedLessons, currentLessonIdx, saveProgress]);

  const goNext = useCallback(() => {
    if (currentLessonIdx < totalLessons - 1) {
      setCurrentLessonIdx((i) => i + 1);
    }
  }, [currentLessonIdx, totalLessons]);

  const goPrev = useCallback(() => {
    if (currentLessonIdx > 0) {
      setCurrentLessonIdx((i) => i - 1);
    }
  }, [currentLessonIdx]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goNext, goPrev]);

  if (!course || !lesson) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-muted text-lg font-mono">Course not found.</p>
          <Link to="/dashboard/courses" className="text-accent hover:underline mt-4 inline-block font-mono">← Back to My Courses</Link>
        </div>
      </div>
    );
  }

  if (checkingAccess) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-accent animate-spin" />
      </div>
    );
  }

  if (!purchased) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto px-4">
          <Lock className="h-12 w-12 text-text-muted/30 mx-auto" />
          <h1 className="text-xl font-black text-text-primary font-mono">Course Not Unlocked</h1>
          <p className="text-sm text-text-muted leading-relaxed">
            You haven't unlocked {course.title} yet. Purchase it from the course page to start learning.
          </p>
          <Link
            to={`/courses/${course.id}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-bg rounded-sm text-[10px] font-black uppercase tracking-widest transition-all hover:brightness-110 font-mono"
          >
            View Course Details <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  const isCompleted = completedLessons.has(lesson.id);
  const isLastLesson = currentLessonIdx === totalLessons - 1;
  const allComplete = completedCount === totalLessons;

  const lessonsList = (
    <div className="space-y-1">
      <h3 className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-4 font-mono hidden md:block">
        Lessons
      </h3>
      {course.lessons.map((l, i) => {
        const isActive = i === currentLessonIdx;
        const isComp = completedLessons.has(l.id);
        return (
          <button
            key={l.id}
            onClick={() => {
              setCurrentLessonIdx(i);
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-sm text-left transition-all ${
              isActive
                ? 'bg-accent/15 text-accent border border-accent/20'
                : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary border border-transparent'
            }`}
          >
            {isComp ? (
              <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
            ) : (
              <span className="flex items-center justify-center w-4 h-4 shrink-0 text-[10px] font-mono text-text-muted border border-border rounded-sm">
                {String(i + 1).padStart(2, '0')}
              </span>
            )}
            <span className={`text-xs font-bold truncate ${isActive ? 'text-accent' : ''}`}>
              {l.title}
            </span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="bg-bg overflow-hidden h-screen flex flex-col">
      <SEO title={`${course.title} — ${lesson.title}`} description={course.description} />

      {/* Contextual Sub-topbar (fixed below main StudentTopbar) */}
      <div className="fixed top-20 md:top-24 left-0 w-full bg-bg border-b border-border/30 z-30">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard/courses"
              className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-accent transition-colors font-mono"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Courses
            </Link>
            <span className="text-text-muted/30 hidden sm:inline">/</span>
            <span className="text-xs font-bold text-text-primary truncate max-w-[200px] hidden sm:inline">
              {course.title}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-text-muted">
              {currentLessonIdx + 1}/{totalLessons}
            </span>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden flex items-center gap-1 px-3 py-1.5 rounded-sm bg-bg-elevated text-text-muted text-[10px] font-black uppercase tracking-widest border border-border"
            >
              <List className="h-3.5 w-3.5" /> Lessons
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-bg-elevated">
          <div
            className="h-full bg-accent transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Main Dual-Column independent scroll cockpit */}
      <div className="fixed inset-0 top-[calc(5rem+60px)] md:top-[calc(6rem+60px)] flex flex-row overflow-hidden bg-bg">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex md:flex-col shrink-0 bg-bg border-r border-border overflow-hidden transition-all duration-300 w-72 xl:w-80">
          <div className="w-72 xl:w-80 h-full overflow-y-auto overscroll-contain scroll-hover p-4 pb-8">
            {lessonsList}
          </div>
        </aside>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 bg-black/60 z-50 md:hidden"
              />
              {/* Drawer */}
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 w-80 bg-bg border-r border-border p-5 z-50 md:hidden flex flex-col pt-24"
              >
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="absolute top-6 right-6 p-2 text-text-muted hover:text-accent transition-colors"
                  aria-label="Close sidebar"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="overflow-y-auto flex-1 mt-4 scroll-hover">
                  {lessonsList}
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Lesson Walkthrough main scroll area */}
        <main className="flex-1 min-h-0 min-w-0 overflow-y-auto overscroll-contain scroll-hover bg-bg">
          <div className="mx-auto w-full max-w-4xl px-5 sm:px-6 md:px-8 py-8 md:py-12 pb-safe-bottom">
            <LessonViewer lesson={lesson} number={currentLessonIdx + 1} />

            {/* Complete & Navigation buttons */}
            <div className="mt-8 pt-8 border-t border-border/20 space-y-4">
              {allComplete && (
                <div className="p-5 rounded-sm bg-accent/10 border border-accent/20 text-center space-y-2">
                  <CheckCircle2 className="h-8 w-8 text-accent mx-auto" />
                  <p className="text-sm font-black text-accent font-mono">COURSE COMPLETE!</p>
                  <p className="text-xs text-text-muted">You've completed all lessons in {course.title}.</p>
                  <Link
                    to="/dashboard/courses"
                    className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-accent hover:underline font-mono"
                  >
                    Back to My Courses <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                {!isCompleted && !allComplete && (
                  <button
                    onClick={markComplete}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-bg rounded-sm text-[10px] font-black uppercase tracking-widest transition-all hover:brightness-110 active:scale-[0.98] font-mono"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Mark Complete
                  </button>
                )}

                {currentLessonIdx > 0 && (
                  <button
                    onClick={goPrev}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-sm border border-border/30 text-text-muted text-[10px] font-black uppercase tracking-widest transition-all hover:border-accent/30 hover:text-accent font-mono"
                  >
                    <ChevronLeft className="h-4 w-4" /> Previous
                  </button>
                )}

                {!isLastLesson && (
                  <button
                    onClick={goNext}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-sm bg-accent text-bg text-[10px] font-black uppercase tracking-widest transition-all hover:brightness-110 active:scale-[0.98] font-mono"
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CourseLessonPage;
