import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, X, Lock, Loader2, Target, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SEO from '@/shared/components/SEO';
import { getCourseById } from '@/features/student/data/courses/courseData';
import CodeBlockRenderer from '@/features/student/components/bootcamp-room/CodeBlockRenderer';
import InlineQuiz from '@/shared/components/courses/InlineQuiz';
import { SimulatedTerminal } from '@/features/student/components/SimulatedTerminal';
import CodePlayground from '@/shared/components/courses/CodePlayground';
import api from '@/core/services/api';
import type { Lesson } from '@/features/student/data/courses/types';

const STORAGE_KEY = 'qyvora_course_progress';

const LessonViewer: React.FC<{ lesson: Lesson; number: number; courseId?: string }> = ({ lesson, number, courseId }) => {
  return (
    <div className="w-full border-t border-border/10 first:border-t-0 py-12 md:py-16">
      <div className="mb-8 md:mb-12 flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border font-mono text-lg font-black bg-accent border-accent text-bg">
          {String(number).padStart(2, '0')}
        </div>
        <div className="flex-1 min-w-0 flex items-center gap-3 flex-wrap">
          <span className="block font-black uppercase tracking-[0.25em] text-accent text-xs">
            {lesson.title}
          </span>
          {lesson.hasQuiz && (
            <span className="px-1.5 py-0.5 rounded bg-accent/10 text-[8px] font-black uppercase tracking-widest text-accent">QUIZ</span>
          )}
          {lesson.hasTerminal && (
            <span className="px-1.5 py-0.5 rounded bg-accent/10 text-[8px] font-black uppercase tracking-widest text-accent">TERM</span>
          )}
          {lesson.hasCodePlayground && (
            <span className="px-1.5 py-0.5 rounded bg-accent/10 text-[8px] font-black uppercase tracking-widest text-accent">CODE</span>
          )}
        </div>
      </div>

      <div className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap overflow-x-auto text-text-primary w-full mb-10 md:mb-14">
        <CodeBlockRenderer text={lesson.instruction} />
      </div>

      {lesson.hasTerminal && (
        <div className="mt-10 md:mt-14">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-4 w-4 text-accent" />
            <span className="text-[10px] font-black uppercase tracking-widest text-accent">Try It Yourself</span>
          </div>
          <SimulatedTerminal
            open
            onOpenChange={() => {}}
            mode="inline"
            context={{ type: 'course', courseId: courseId || '', lessonId: lesson.id }}
            initialCommands={lesson.terminalCommands || []}
            title={lesson.terminalTitle || 'lesson-terminal'}
          />
        </div>
      )}

      {lesson.hasCodePlayground && (
        <div className="mt-10 md:mt-14">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-4 w-4 text-accent" />
            <span className="text-[10px] font-black uppercase tracking-widest text-accent">Code Playground</span>
          </div>
          <CodePlayground
            initialCode={lesson.codePlaygroundInitial || ''}
            language={lesson.codePlaygroundLanguage || 'python'}
            expectedOutput={lesson.codePlaygroundExpectedOutput}
            title={lesson.title}
          />
        </div>
      )}

      {lesson.quiz && lesson.quiz.length > 0 && (
        <div className="mt-10 md:mt-14">
          <InlineQuiz
            questions={lesson.quiz}
            title={`Lesson Quiz: ${lesson.title}`}
          />
        </div>
      )}
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

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('course:updateMeta', {
      detail: {
        currentLessonIdx,
        totalLessons,
        progress,
        lesson: lesson ? {
          hasTerminal: lesson.hasTerminal,
          hasCodePlayground: lesson.hasCodePlayground,
          quiz: lesson.quiz,
        } : null,
      },
    }));
  }, [currentLessonIdx, totalLessons, progress, lesson]);

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
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-bg rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:brightness-110 font-mono"
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
    <nav className="flex flex-col gap-1 p-3 pb-6">
      <div className="mb-3 px-1">
        <Link
          to="/dashboard/courses"
          className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-accent transition-colors"
        >
          <ArrowLeft className="h-3 w-3" /> Back to Courses
        </Link>
      </div>
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
            className={`w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
              isActive
                ? 'text-accent font-semibold bg-accent-dim/20'
                : 'text-text-secondary hover:text-accent hover:bg-accent-dim/10'
            }`}
          >
            <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[8px] font-bold font-mono ${
              isComp
                ? 'border-accent/40 text-accent'
                : isActive
                ? 'border-accent/40 text-accent'
                : 'border-border text-text-muted'
            }`}>
              {isComp ? (
                <CheckCircle2 className="h-2 w-2" />
              ) : null}
              {!isComp && String(i + 1).padStart(2, '0')}
            </span>
            <span className="truncate text-xs flex-1">{l.title}</span>
          </button>
        );
      })}
    </nav>
  );

  return (
    <div className="bg-bg">
      <SEO title={`${course.title} — ${lesson.title}`} description={course.description} />

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-[60] bg-black/65 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              className="fixed left-0 top-0 bottom-0 z-[70] w-[92vw] max-w-[360px] flex flex-col bg-bg md:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-border px-4 py-3.5 bg-bg/95 backdrop-blur-md shrink-0">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-accent">Course</p>
                  <p className="text-xs font-black text-text-primary">Lesson Navigator</p>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:text-accent hover:bg-accent-dim/10 transition-colors"
                  aria-label="Close sidebar"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto scroll-hover">
                {lessonsList}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-5xl px-4 md:px-6 lg:px-8 pt-8 pb-20 lg:pb-24 space-y-8">
            <div className="mb-8 rounded-2xl border border-border bg-bg-card p-5 md:p-6">
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-text-muted">Progress</span>
                <span className="font-mono text-base font-black text-accent">
                  {completedCount} / {totalLessons} lessons
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-md bg-accent-dim border border-border/40">
                <div
                  className="h-full bg-accent transition-all duration-700 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <LessonViewer lesson={lesson} number={currentLessonIdx + 1} courseId={courseId} />

            <div className="flex flex-wrap items-center gap-3 pb-16 mt-10 md:mt-14 border-t border-border/5 pt-6">
              {currentLessonIdx > 0 && (
                <button
                  onClick={goPrev}
                  className="md:hidden bg-bg-card border border-border text-text-muted hover:text-accent hover:border-accent/30 font-semibold uppercase tracking-[0.08em] rounded-lg px-3.5 py-2 transition-colors inline-flex flex-1 items-center justify-center gap-1.5 sm:flex-none text-xs"
                >
                  <ChevronLeft className="h-3.5 w-3.5 shrink-0" />
                  <span>Prev</span>
                </button>
              )}

              <span className="md:hidden order-3 w-full text-center font-mono text-xs font-semibold text-text-muted sm:order-none sm:w-auto">
                {currentLessonIdx + 1} / {totalLessons}
              </span>

              {!isCompleted && !allComplete && (
                <button
                  onClick={markComplete}
                  className="inline-flex items-center gap-1.5 bg-bg-card border border-border text-text-muted hover:text-accent hover:border-accent/30 font-semibold uppercase tracking-[0.08em] rounded-lg px-3.5 py-2 transition-colors text-xs"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Complete</span>
                </button>
              )}

              {!isLastLesson ? (
                <button
                  onClick={goNext}
                  className="inline-flex flex-1 md:flex-none items-center justify-center gap-1.5 sm:flex-none font-semibold uppercase tracking-[0.08em] rounded-lg border border-accent/20 bg-accent text-bg hover:brightness-110 px-5 py-2.5 transition-colors text-xs"
                >
                  <span className="md:hidden">Next</span>
                  <span className="hidden md:inline">Next Lesson</span>
                  <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                </button>
              ) : allComplete ? (
                <Link
                  to="/dashboard/courses"
                  className="inline-flex flex-1 md:flex-none items-center justify-center gap-1.5 sm:flex-none font-semibold uppercase tracking-[0.08em] rounded-lg border border-accent/20 bg-accent text-bg hover:brightness-110 px-5 py-2.5 transition-colors text-xs"
                >
                  <span>Back to Courses</span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                </Link>
              ) : null}
            </div>
      </div>
    </div>
  );
};

export default CourseLessonPage;
