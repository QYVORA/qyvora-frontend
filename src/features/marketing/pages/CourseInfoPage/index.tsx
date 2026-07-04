import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Clock, ArrowLeft, ArrowRight, BookOpen, Zap, Terminal, Globe, Code, Shield, Wifi, Wrench, GraduationCap, Loader2, Lock } from 'lucide-react';
import SEO from '@/shared/components/SEO';
import { Footer } from '@/shared/components/layout';
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
        return tx.metadata?.slug || tx.metadata?.courseId || String(tx.productId);
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
    <div className="min-h-screen bg-bg flex flex-col pt-[72px]">
      <SEO title={course.title} description={course.description} />

      {/* Hero */}
      <div className="border-b border-border/30 flex-1 flex flex-col justify-center lg:min-h-[calc(100dvh-72px)]">
        <div className="mx-auto max-w-7xl w-full px-4 md:px-8 lg:px-12 py-12 lg:py-0 flex flex-col justify-center flex-1">
          <Link to="/courses" className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-accent transition-colors mb-6 self-start">
            <ArrowLeft className="h-3 w-3" /> All Courses
          </Link>

          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center w-full">
            {/* Cover */}
            <div className="w-full lg:w-[40%] shrink-0">
              <div className="aspect-[8/5] rounded-sm overflow-hidden border border-border/30 bg-bg-elevated">
                <img src={course.coverSvg} alt={course.title} className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Info */}
            <div className="w-full lg:w-[60%] flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-accent/10 rounded-sm text-[9px] font-black uppercase tracking-widest text-accent border border-accent/30">
                  <Icon className="h-3 w-3" /> {category?.name}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-bg-elevated rounded-sm text-[9px] font-black uppercase tracking-widest text-text-muted border border-border/30">
                  <Clock className="h-3 w-3" /> {course.estimatedMinutes} min
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-bg-elevated rounded-sm text-[9px] font-black uppercase tracking-widest text-text-muted border border-border/30">
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
                  className="self-start inline-flex items-center gap-2.5 px-8 py-3.5 bg-accent text-bg rounded-sm text-xs font-black uppercase tracking-widest transition-all hover:brightness-110 active:scale-[0.98]"
                >
                  Start Learning <ArrowRight className="h-4 w-4" />
                </Link>
              ) : user ? (
                <div className="flex items-center gap-4">
                  <button
                    onClick={handlePurchase}
                    disabled={purchasing || !canAfford}
                    className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-accent text-bg rounded-sm text-xs font-black uppercase tracking-widest transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className="self-start inline-flex items-center gap-2.5 px-8 py-3.5 bg-accent text-bg rounded-sm text-xs font-black uppercase tracking-widest transition-all hover:brightness-110 active:scale-[0.98]"
                >
                  <Lock className="h-4 w-4" /> Sign Up to Unlock
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CourseInfoPage;
