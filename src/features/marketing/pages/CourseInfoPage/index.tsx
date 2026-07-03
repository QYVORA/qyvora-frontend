import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Clock, ArrowLeft, ArrowRight, CheckCircle2, BookOpen, Zap, Terminal, Globe, Code, Shield, Wifi, Wrench, GraduationCap, Loader2, Lock } from 'lucide-react';
import ScrollReveal from '@/shared/components/ScrollReveal';
import SEO from '@/shared/components/SEO';
import { useAuth } from '@/core/contexts/AuthContext';
import { useToast } from '@/core/contexts/ToastContext';
import { getCourseById, getCategoryById } from '@/features/student/data/courses/courseData';
import type { CourseCategoryId } from '@/features/student/data/courses/types';
import api from '@/core/services/api';
import { extractCpBalance } from '@/shared/utils/cpBalance';

const CATEGORY_ICONS: Record<CourseCategoryId, React.ElementType> = {
  terminal: Terminal,
  networking: Globe,
  programming: Code,
  'web-security': Shield,
  wireless: Wifi,
  tools: Wrench,
};

const CourseInfoPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const course = getCourseById(courseId || '');
  const category = course ? getCategoryById(course.categoryId) : undefined;

  const [balance, setBalance] = useState<number | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const [purchased, setPurchased] = useState(false);

  useEffect(() => {
    if (!user) return;
    api.get('/cp/balance').then((r) => {
      setBalance(extractCpBalance(r.data) ?? 0);
    }).catch(() => {});
    api.get('/cp/transactions?limit=100').then((r) => {
      const items = Array.isArray(r.data?.items) ? r.data.items : [];
      const purchasedIds = new Set(items.filter((tx: any) => tx.type === 'purchase').map((tx: any) => {
        return tx.metadata?.slug || String(tx.productId);
      }));
      setPurchased(purchasedIds.has(courseId || ''));
    }).catch(() => {});
  }, [user, courseId]);

  const handlePurchase = async () => {
    if (!user) {
      navigate('/register');
      return;
    }
    if (!course) return;
    setPurchasing(true);
    try {
      await api.post('/cp/purchase', { productId: course.id });
      addToast(`${course.title} unlocked successfully.`, 'success');
      setPurchased(true);
      const balRes = await api.get('/cp/balance').catch(() => null);
      setBalance(extractCpBalance(balRes?.data) ?? 0);
    } catch (err: any) {
      addToast(err?.response?.data?.error || 'Purchase failed.', 'error');
    } finally {
      setPurchasing(false);
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-muted text-lg">Course not found.</p>
          <Link to="/courses" className="text-accent hover:underline mt-4 inline-block">← Back to Courses</Link>
        </div>
      </div>
    );
  }

  const Icon = category ? CATEGORY_ICONS[category.id] : GraduationCap;
  const canAfford = balance !== null && course.cpCost <= balance;
  const isUnlocked = purchased;

  return (
    <div className="min-h-screen bg-bg">
      <SEO title={course.title} description={course.description} />

      {/* Hero */}
      <div className="relative overflow-hidden border-b border-border/30">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent" />
        <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12 pt-28 pb-12 md:pb-20">
          <Link to="/courses" className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-accent transition-colors mb-6">
            <ArrowLeft className="h-3 w-3" /> All Courses
          </Link>

          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
            {/* Cover */}
            <div className="lg:w-[40%] shrink-0">
              <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-border/30 bg-bg-elevated">
                <img src={course.coverSvg} alt={course.title} className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Info */}
            <div className="lg:w-[60%] flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-accent/10 rounded-lg text-[9px] font-black uppercase tracking-widest text-accent border border-accent/30">
                  <Icon className="h-3 w-3" /> {category?.name}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-bg-elevated rounded-lg text-[9px] font-black uppercase tracking-widest text-text-muted border border-border/30">
                  <Clock className="h-3 w-3" /> {course.estimatedMinutes} min
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-bg-elevated rounded-lg text-[9px] font-black uppercase tracking-widest text-text-muted border border-border/30">
                  <BookOpen className="h-3 w-3" /> {course.lessons.length} lessons
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-text-primary tracking-tighter leading-none mb-4">
                {course.title}
              </h1>

              <p className="text-sm md:text-base text-text-muted leading-relaxed max-w-xl mb-6">
                {course.overview}
              </p>

              {/* Purchase / Access */}
              {isUnlocked ? (
                <Link
                  to={`/dashboard/courses/${course.id}`}
                  className="self-start inline-flex items-center gap-2.5 px-8 py-3.5 bg-accent text-bg rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-accent/20 transition-all hover:brightness-110 active:scale-[0.98]"
                >
                  Start Learning <ArrowRight className="h-4 w-4" />
                </Link>
              ) : user ? (
                <div className="flex items-center gap-4">
                  <button
                    onClick={handlePurchase}
                    disabled={purchasing || !canAfford}
                    className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-accent text-bg rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-accent/20 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {purchasing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Zap className="h-4 w-4" />
                    )}
                    {purchasing ? 'Unlocking...' : `Unlock for ${course.cpCost} CP`}
                  </button>
                  {balance !== null && (
                    <span className={`text-xs font-mono ${canAfford ? 'text-text-muted' : 'text-red-400'}`}>
                      Balance: {balance} CP
                    </span>
                  )}
                </div>
              ) : (
                <Link
                  to={`/register?redirect=/courses/${course.id}`}
                  className="self-start inline-flex items-center gap-2.5 px-8 py-3.5 bg-accent text-bg rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-accent/20 transition-all hover:brightness-110 active:scale-[0.98]"
                >
                  <Lock className="h-4 w-4" /> Sign Up to Unlock
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Learning Objectives */}
          <div className="lg:w-[55%]">
            <h2 className="text-xl md:text-2xl font-black text-text-primary tracking-tight mb-6">
              Learning Objectives
            </h2>
            <div className="space-y-3">
              {course.learningObjectives.map((obj, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span className="text-sm text-text-secondary leading-relaxed">{obj}</span>
                </div>
              ))}
            </div>

            {/* Lessons preview */}
            <h2 className="text-xl md:text-2xl font-black text-text-primary tracking-tight mt-12 mb-6">
              Course Lessons
            </h2>
            <div className="space-y-2">
              {course.lessons.map((lesson, i) => (
                <div
                  key={lesson.id}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-bg-elevated/50 border border-border/20"
                >
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-accent/10 text-[10px] font-black text-accent shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="flex-1 text-sm font-bold text-text-primary truncate">
                    {lesson.title}
                  </span>
                  {lesson.hasQuiz && (
                    <span className="text-[9px] font-black uppercase tracking-widest text-accent px-2 py-0.5 rounded bg-accent/10 shrink-0">
                      Quiz
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-[35%] lg:sticky lg:top-32 self-start">
            <div className="p-6 rounded-2xl border border-border/30 bg-bg-card space-y-5">
              <h3 className="text-sm font-black text-text-primary uppercase tracking-wider">
                Course Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-muted">Category</span>
                  <span className="flex items-center gap-1 text-text-primary font-bold">{category?.name}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-muted">Duration</span>
                  <span className="text-text-primary font-bold">{course.estimatedMinutes} minutes</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-muted">Lessons</span>
                  <span className="text-text-primary font-bold">{course.lessons.length}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-muted">Price</span>
                  <span className="flex items-center gap-1 text-accent font-black">
                    <Zap className="h-3 w-3" /> {course.cpCost} CP
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-muted">Difficulty</span>
                  <span className="px-2 py-0.5 rounded bg-accent/10 text-[9px] font-black text-accent">Beginner</span>
                </div>
              </div>

              <div className="pt-3 border-t border-border/20">
                {isUnlocked ? (
                  <Link
                    to={`/dashboard/courses/${course.id}`}
                    className="w-full flex items-center justify-center gap-2.5 px-6 py-3 bg-accent text-bg rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:brightness-110 active:scale-[0.98]"
                  >
                    <BookOpen className="h-4 w-4" /> Start Course
                  </Link>
                ) : user ? (
                  <button
                    onClick={handlePurchase}
                    disabled={purchasing || !canAfford}
                    className="w-full flex items-center justify-center gap-2.5 px-6 py-3 bg-accent text-bg rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-accent/20 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
                  >
                    {purchasing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Zap className="h-4 w-4" />
                    )}
                    {purchasing ? 'Unlocking...' : `Unlock for ${course.cpCost} CP`}
                  </button>
                ) : (
                  <Link
                    to="/register"
                    className="w-full flex items-center justify-center gap-2.5 px-6 py-3 bg-accent text-bg rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:brightness-110 active:scale-[0.98]"
                  >
                    <Lock className="h-4 w-4" /> Sign Up to Unlock
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseInfoPage;
