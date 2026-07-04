import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, X, List, Lock, Loader2 } from 'lucide-react';
import SEO from '@/shared/components/SEO';
import { getCourseById } from '@/features/student/data/courses/courseData';
import CodeBlockRenderer from '@/features/student/components/bootcamp-room/CodeBlockRenderer';
import api from '@/core/services/api';
import type { Lesson } from '@/features/student/data/courses/types';

const LessonViewer: React.FC<{ lesson: Lesson; number: number }> = ({ lesson, number }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-accent text-bg text-xs font-black">
          {String(number).padStart(2, '0')}
        </span>
        <h2 className="text-xl md:text-2xl font-black text-text-primary tracking-tight">
          {lesson.title}
        </h2>
        {lesson.hasQuiz && (
          <span className="px-2 py-0.5 rounded bg-accent/10 text-[9px] font-black uppercase tracking-widest text-accent">
            Quiz
          </span>
        )}
      </div>
      <div className="prose prose-invert max-w-none">
        <CodeBlockRenderer text={lesson.instruction} />
      </div>
    </div>
  );
};

const STORAGE_KEY = 'qyvora_course_progress';

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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentLessonIdx, totalLessons]);

  const goPrev = useCallback(() => {
    if (currentLessonIdx > 0) {
      setCurrentLessonIdx((i) => i - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentLessonIdx]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
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
          <p className="text-text-muted text-lg">Course not found.</p>
          <Link to="/dashboard/courses" className="text-accent hover:underline mt-4 inline-block">← Back to My Courses</Link>
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
          <h1 className="text-xl font-black text-text-primary">Course Not Unlocked</h1>
          <p className="text-sm text-text-muted leading-relaxed">
            You haven't unlocked {course.title} yet. Purchase it from the course page to start learning.
          </p>
          <Link
            to={`/courses/${course.id}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-bg rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:brightness-110"
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

  return (
    <div className="min-h-screen bg-bg">
      <SEO title={`${course.title} — ${lesson.title}`} description={course.description} />

      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-bg border-b border-border/30">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard/courses"
              className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-accent transition-colors"
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
              className="md:hidden flex items-center gap-1 px-3 py-1.5 rounded-lg bg-bg-elevated text-text-muted text-[10px] font-black uppercase tracking-widest"
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

      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-8">
        <div className="flex gap-8 lg:gap-12">
          {/* Sidebar — lesson list */}
          <aside className={`${sidebarOpen ? 'fixed inset-0 z-40 bg-bg pt-14 px-4' : 'hidden'} md:block md:w-64 lg:w-72 shrink-0 md:sticky md:top-20 md:self-start`}>
            {sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden absolute top-2 right-2 p-2 text-text-muted hover:text-accent"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <div className="space-y-1">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-3 hidden md:block">
                {course.title}
              </h3>
              {course.lessons.map((l, i) => {
                const isActive = i === currentLessonIdx;
                const isComp = completedLessons.has(l.id);
                return (
                  <button
                    key={l.id}
                    onClick={() => { setCurrentLessonIdx(i); setSidebarOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all ${
                      isActive
                        ? 'bg-accent/10 text-accent border border-accent/20'
                        : 'text-text-muted hover:bg-bg-elevated hover:text-text-primary'
                    }`}
                  >
                    {isComp ? (
                      <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                    ) : (
                      <span className="flex items-center justify-center w-4 h-4 shrink-0 text-[10px] font-mono text-text-muted">
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
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0 max-w-3xl">
            <LessonViewer lesson={lesson} number={currentLessonIdx + 1} />

            {/* Complete & Navigation */}
            <div className="mt-10 pt-8 border-t border-border/20 space-y-4">
              {/* Quiz completion message */}
              {allComplete && (
                <div className="p-4 rounded-2xl bg-accent/10 border border-accent/30 text-center space-y-2">
                  <CheckCircle2 className="h-8 w-8 text-accent mx-auto" />
                  <p className="text-sm font-black text-accent">Course Complete!</p>
                  <p className="text-xs text-text-muted">You've completed all lessons in {course.title}.</p>
                  <Link
                    to="/dashboard/courses"
                    className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-accent hover:underline"
                  >
                    Back to My Courses <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                {!isCompleted && !allComplete && (
                  <button
                    onClick={markComplete}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-bg rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-accent/20 transition-all hover:brightness-110 active:scale-[0.98]"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Mark Complete
                  </button>
                )}

                {currentLessonIdx > 0 && (
                  <button
                    onClick={goPrev}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border/30 text-text-muted text-[10px] font-black uppercase tracking-widest transition-all hover:border-accent/30 hover:text-accent"
                  >
                    <ChevronLeft className="h-4 w-4" /> Previous
                  </button>
                )}

                {!isLastLesson && (
                  <button
                    onClick={goNext}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-accent text-bg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-accent/20 transition-all hover:brightness-110 active:scale-[0.98]"
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CourseLessonPage;
