import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Clock, BookOpen, Zap, Terminal, Globe, Wifi, Wrench, GraduationCap, Loader2, Sparkles, TrendingUp, Layers } from 'lucide-react';
import { IconArrowLeft, IconArrowRight, IconCode, IconShield, IconLock, IconCheck, IconChevronRight, IconClock } from '@/shared/components/icons';
import SEO from '@/shared/components/SEO';
import ScrollReveal from '@/shared/components/ScrollReveal';
import { Footer } from '@/shared/components/layout';
import { useAuth } from '@/core/contexts/AuthContext';
import { useToast } from '@/core/contexts/ToastContext';
import { getCourseById, getCategoryById, COURSES } from '@/features/student/data/courses/courseData';
import type { CourseCategoryId, SkillLevel } from '@/features/student/data/courses/types';
import { getRelatedContentForCourse } from '@/shared/constants/topicMap';
import RelatedContent from '@/shared/components/RelatedContent';
import api from '@/core/services/api';
import { extractCpBalance } from '@/shared/utils/cpBalance';

const CATEGORY_ICONS: Record<CourseCategoryId, React.ElementType> = {
  terminal: Terminal,
  networking: Globe,
  programming: IconCode,
  'web-security': IconShield,
  wireless: Wifi,
  tools: Wrench,
};

const SKILL_LEVEL_CONFIG: Record<SkillLevel, { label: string; color: string }> = {
  beginner: { label: 'Beginner', color: 'text-accent border-accent/30 bg-accent/10' },
  intermediate: { label: 'Intermediate', color: 'text-blue-400 border-blue-400/30 bg-blue-400/10' },
  advanced: { label: 'Advanced', color: 'text-red-400 border-red-400/30 bg-red-400/10' },
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
        return tx.metadata?.slug || tx.metadata?.courseId || String(tx.productId);
      }));
      setPurchased(purchasedIds.has(courseId || ''));
    }).catch(() => {
      if (courseId) addToast('Could not verify purchase status', 'error');
    });
  }, [user, courseId]);

  const handlePurchase = async () => {
    if (!user) {
      navigate('/register');
      return;
    }
    if (!course) return;
    setPurchasing(true);
    try {
      try { await api.get('/cp/balance'); } catch {}
      await api.post('/cp/purchase-course', { courseId: course.id, cpCost: course.cpCost, courseTitle: course.title });
      addToast(`${course.title} unlocked successfully.`, 'success');
      setPurchased(true);
      const balRes = await api.get('/cp/balance').catch(() => null);
      setBalance(extractCpBalance(balRes?.data) ?? 0);
    } catch (err: any) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.error || '';
      if (status === 401 || (status === 403 && msg === 'Invalid CSRF token')) {
        addToast('Session expired. Please log in again.', 'error');
        navigate('/login');
      } else {
        addToast(msg || 'Purchase failed. Please ensure you have enough CP.', 'error');
      }
    } finally {
      setPurchasing(false);
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-black text-text-primary mb-2">Course not found.</h1>
          <p className="text-text-muted text-sm">The course you're looking for doesn't exist.</p>
          <Link to="/courses" className="text-accent hover:underline mt-4 inline-block">← Back to Courses</Link>
        </div>
      </div>
    );
  }

  const Icon = category ? CATEGORY_ICONS[category.id] : GraduationCap;
  const canAfford = balance !== null && course.cpCost <= balance;
  const isUnlocked = purchased;
  const skillCfg = SKILL_LEVEL_CONFIG[course.skillLevel];

  const relatedCourses = COURSES.filter((c) => c.categoryId === course.categoryId && c.id !== course.id).slice(0, 3);

  const prerequisiteCourses = (course.prerequisites || []).map((preqId) => getCourseById(preqId)).filter(Boolean);

  return (
    <div className="min-h-screen bg-bg flex flex-col pt-[72px]">
      <SEO title={course.title} description={course.description} />

      {/* Hero */}
      <div className="border-b border-border/30">
        <div className="mx-auto max-w-7xl w-full px-4 md:px-8 lg:px-12 py-12 lg:py-16">
          <Link to="/courses" className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-accent transition-colors mb-6 self-start">
            <IconArrowLeft size={12} /> All Courses
          </Link>

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-16 items-center w-full">
            {/* Cover */}
            <div className="w-full lg:w-[40%] shrink-0">
              <div className="aspect-[8/5] rounded-2xl overflow-hidden border border-border/30 bg-bg-elevated">
                <img src={course.coverSvg} alt={course.title} className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Info */}
            <div className="w-full lg:w-[60%] flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-accent/10 rounded-lg text-[9px] font-black uppercase tracking-widest text-accent border border-accent/30">
                  <Icon className="h-3 w-3" /> {category?.name}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${skillCfg.color}`}>
                  <Sparkles className="h-3 w-3" /> {skillCfg.label}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-bg-elevated rounded-lg text-[9px] font-black uppercase tracking-widest text-text-muted border border-border/30">
                  <IconClock size={12} className="text-accent" /> {course.estimatedMinutes} min
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-bg-elevated rounded-lg text-[9px] font-black uppercase tracking-widest text-text-muted border border-border/30">
                  <BookOpen className="h-3 w-3" /> {course.lessons.length} lessons
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-text-primary tracking-tight leading-none mb-4">
                {course.title}
              </h1>

              <p className="text-sm md:text-base text-text-muted leading-relaxed max-w-xl mb-6">
                {course.overview}
              </p>

              {/* Prerequisites */}
              {prerequisiteCourses.length > 0 && (
                <div className="mb-6">
                  <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Recommended Prerequisites</p>
                  <div className="flex flex-wrap gap-2">
                    {prerequisiteCourses.map((preq) => (
                      <Link
                        key={preq!.id}
                        to={`/courses/${preq!.id}`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-bg-elevated border border-border/30 text-[10px] font-mono text-text-muted hover:text-accent hover:border-accent/30 transition-colors"
                      >
                        <Layers className="h-2.5 w-2.5" /> {preq!.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Purchase / Access */}
              {isUnlocked ? (
                <Link
                  to={`/dashboard/courses/${course.id}`}
                  className="self-start inline-flex items-center gap-2.5 px-8 py-3.5 bg-accent text-bg rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:brightness-110 active:scale-[0.98]"
                >
                  Start Learning <IconArrowRight size={16} />
                </Link>
              ) : user ? (
                <div className="flex items-center gap-4">
                  <button
                    onClick={handlePurchase}
                    disabled={purchasing || !canAfford}
                    className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-accent text-bg rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className="self-start inline-flex items-center gap-2.5 px-8 py-3.5 bg-accent text-bg rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:brightness-110 active:scale-[0.98]"
                >
                  <IconLock size={16} /> Sign Up to Unlock
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content sections */}
      <div className="mx-auto max-w-7xl w-full px-4 md:px-8 lg:px-12 py-12 space-y-14">
        {/* Learning Objectives */}
        <section>
          <h2 className="text-lg font-black text-text-primary tracking-tight mb-6 font-mono">
            <span className="text-accent">//</span> What You'll Learn
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {course.learningObjectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-3 px-4 py-3 rounded-xl border border-border/30 bg-bg-card">
                <IconCheck size={16} className="text-accent shrink-0 mt-0.5" />
                <span className="text-sm text-text-secondary leading-relaxed break-words">{obj}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Syllabus Preview */}
        <section>
          <h2 className="text-lg font-black text-text-primary tracking-tight mb-6 font-mono">
            <span className="text-accent">//</span> Course Syllabus
          </h2>
          <ol className="space-y-1 list-none">
            {course.lessons.map((lesson, i) => (
              <li
                key={lesson.id}
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border/20 bg-bg-card/50"
              >
                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-accent/10 text-[10px] font-black font-mono text-accent">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-text-primary">{lesson.title}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {lesson.hasQuiz &&                    <span className="px-1.5 py-0.5 rounded-lg bg-accent/10 text-[8px] font-black text-accent uppercase">Quiz</span>}
                  {lesson.hasTerminal && <span className="px-1.5 py-0.5 rounded-lg bg-blue-400/10 text-[8px] font-black text-blue-400 uppercase">Terminal</span>}
                  {lesson.hasCodePlayground && <span className="px-1.5 py-0.5 rounded-lg bg-purple-400/10 text-[8px] font-black text-purple-400 uppercase">Code</span>}
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Related Courses */}
        {relatedCourses.length > 0 && (
          <section>
            <h2 className="text-lg font-black text-text-primary tracking-tight mb-6 font-mono">
              <span className="text-accent">//</span> Related Courses
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedCourses.map((relCourse) => {
                const relCategory = getCategoryById(relCourse.categoryId);
                const RelIcon = relCategory ? CATEGORY_ICONS[relCategory.id] : GraduationCap;
                return (
                  <ScrollReveal key={relCourse.id} direction="up" amount={0.1}>
                    <Link
                      to={`/courses/${relCourse.id}`}
                       className="group block overflow-hidden rounded-2xl border border-border/30 bg-bg-card transition-all hover:border-accent/30"
                    >
                      <div className="p-4 space-y-2">
                        <div className="flex items-center gap-1.5">
                          <RelIcon className="h-3 w-3 text-accent" />
                          <span className="text-[9px] font-black uppercase tracking-widest text-accent">{relCategory?.name}</span>
                        </div>
                        <h3 className="text-sm font-black text-text-primary group-hover:text-accent transition-colors break-words">{relCourse.title}</h3>
                        <p className="text-[11px] text-text-muted line-clamp-1 break-words">{relCourse.description}</p>
                        <div className="flex items-center gap-2 pt-1">
                           <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-accent/10 text-[9px] font-black text-accent">
                            <Zap className="h-2.5 w-2.5" /> {relCourse.cpCost} CP
                          </span>
                          <span className="flex items-center gap-1 text-[9px] text-text-muted font-mono">
                            <IconClock size={10} /> {relCourse.estimatedMinutes}min
                          </span>
                        </div>
                      </div>
                    </Link>
                  </ScrollReveal>
                );
              })}
            </div>
          </section>
        )}

        {/* Related Content from Topic Map */}
        {(() => {
          const related = getRelatedContentForCourse(course.id);
          const hasRelated = related.labs.length > 0 || related.hpbRooms.length > 0 || related.courses.length > 0;
          return hasRelated ? (
            <RelatedContent
              title="Continue This Topic"
              courses={related.courses}
              labs={related.labs}
              hpbRooms={related.hpbRooms}
            />
          ) : null;
        })()}
      </div>
      <Footer />
    </div>
  );
};

export default CourseInfoPage;
