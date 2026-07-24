import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, BookOpen, Clock, Loader2, Terminal, Globe, Wifi, Wrench, GraduationCap, Sparkles } from 'lucide-react';
import { IconCode, IconShield, IconCheck, IconLock } from '@/shared/components/icons';
import { Dialog, DialogContent, DialogClose } from '@/shared/components/ui/Dialog';
import { useAuth } from '@/core/contexts/AuthContext';
import { useToast } from '@/core/contexts/ToastContext';
import { getCourseById, getCategoryById } from '@/features/student/data/courses/courseData';
import type { CourseCategoryId, SkillLevel } from '@/features/student/data/courses/types';
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

interface CoursePurchaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseId: string;
}

const CoursePurchaseModal: React.FC<CoursePurchaseModalProps> = ({ open, onOpenChange, courseId }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const course = getCourseById(courseId);
  const category = course ? getCategoryById(course.categoryId) : undefined;

  const [balance, setBalance] = useState<number | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const [purchased, setPurchased] = useState(false);

  useEffect(() => {
    if (!open || !user || !courseId) return;
    setPurchased(false);
    setBalance(null);

    api.get('/cp/balance').then((r) => {
      setBalance(extractCpBalance(r.data) ?? 0);
    }).catch(() => {});

    api.get('/cp/transactions?limit=100').then((r) => {
      const items = Array.isArray(r.data?.items) ? r.data.items : [];
      const purchasedIds = new Set(items.filter((tx: any) => tx.type === 'purchase').map((tx: any) => {
        return tx.metadata?.slug || tx.metadata?.courseId || String(tx.productId);
      }));
      setPurchased(purchasedIds.has(courseId));
    }).catch(() => {});
  }, [open, user, courseId]);

  const handlePurchase = async () => {
    if (!user) {
      onOpenChange(false);
      navigate(`/login?redirect=/`);
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
        onOpenChange(false);
        navigate('/login');
      } else {
        addToast(msg || 'Purchase failed. Please ensure you have enough CP.', 'error');
      }
    } finally {
      setPurchasing(false);
    }
  };

  const handleContinue = () => {
    onOpenChange(false);
    navigate(`/dashboard/courses/${courseId}`);
  };

  const handleSignUp = () => {
    onOpenChange(false);
    navigate(`/login?redirect=/`);
  };

  if (!course) return null;

  const Icon = category ? CATEGORY_ICONS[category.id] : GraduationCap;
  const canAfford = balance !== null && course.cpCost <= balance;
  const skillCfg = SKILL_LEVEL_CONFIG[course.skillLevel];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title={course.title} maxWidth="max-w-lg">
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-accent/10 rounded-lg text-[9px] font-black uppercase tracking-widest text-accent border border-accent/30">
              <Icon className="h-3 w-3" /> {category?.name}
            </span>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${skillCfg.color}`}>
              <Sparkles className="h-3 w-3" /> {skillCfg.label}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-bg-elevated rounded-lg text-[9px] font-black uppercase tracking-widest text-text-muted border border-border/30">
              <Clock size={12} className="text-accent" /> {course.estimatedMinutes} min
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-bg-elevated rounded-lg text-[9px] font-black uppercase tracking-widest text-text-muted border border-border/30">
              <BookOpen className="h-3 w-3" /> {course.lessons.length} lessons
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-text-muted leading-relaxed">
            {course.overview}
          </p>

          {/* Learning Objectives */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">
              What You'll Learn
            </h3>
            <ul className="space-y-1.5">
              {course.learningObjectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                  <IconCheck size={14} className="text-accent shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="pt-2 border-t border-border/30">
            {purchased ? (
              <button
                onClick={handleContinue}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                Start Learning
              </button>
            ) : user ? (
              <div className="space-y-3">
                <button
                  onClick={handlePurchase}
                  disabled={purchasing || !canAfford}
                  className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {purchasing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Zap className="h-4 w-4" />
                  )}
                  {purchasing ? 'Unlocking...' : `Unlock for ${course.cpCost} CP`}
                </button>
                {balance !== null && (
                  <p className={`text-xs font-mono text-center ${canAfford ? 'text-text-muted' : 'text-red-400'}`}>
                    Balance: {balance} CP
                  </p>
                )}
              </div>
            ) : (
              <button
                onClick={handleSignUp}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                <IconLock size={16} /> Sign Up to Unlock
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CoursePurchaseModal;
