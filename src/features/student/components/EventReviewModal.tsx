import React, { useState } from 'react';
import { Heart, Loader2, Check, Copy, Video, Coins, MessageSquare, KeyRound, Shield, Sparkles, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent } from '@/shared/components/ui/Dialog';
import api from '@/core/services/api';
import { useAuth } from '@/core/contexts/AuthContext';
import { getEventById, type EventData } from '@/features/marketing/content/eventsData';
import CpLogo from '@/shared/components/CpLogo';

interface EventReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
}

const REWARD_CP = 50;

const EventReviewModal: React.FC<EventReviewModalProps> = ({ open, onOpenChange, eventId }) => {
  const { refreshMe } = useAuth();
  const event = getEventById(eventId);
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [eventKey, setEventKey] = useState<string | null>(null);
  const [cpAwarded, setCpAwarded] = useState(0);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'review' | 'key'>('review');

  const handleCopyKey = async () => {
    if (!eventKey) return;
    try {
      await navigator.clipboard.writeText(eventKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleSubmitReview = async () => {
    if (!review.trim()) {
      setError('Please share what you like about QYVORA.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const res = await api.post('/events/review', {
        eventId,
        review: review.trim(),
      });
      const key = String(res.data?.key || '');
      const cp = Number(res.data?.cpAwarded || REWARD_CP);
      if (key) {
        setEventKey(key);
        setCpAwarded(cp);
        await refreshMe();
        setStep('key');
      }
    } catch {
      setError('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setReview('');
    setEventKey(null);
    setCopied(false);
    setError('');
    setStep('review');
    onOpenChange(false);
  };

  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        title={step === 'review' ? '[ EVENT REGISTRATION ]' : '[ ACCESS GRANTED ]'}
        maxWidth="max-w-lg"
        hideClose
        className="border-accent/30 shadow-[0_0_40px_rgba(var(--color-accent-rgb),0.12)]"
      >
        {step === 'review' ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4 pb-5 border-b border-border/40">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 border border-accent/20 text-accent shrink-0">
                <Video className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black text-text-primary truncate">{event.title}</p>
                <p className="text-[11px] text-text-muted font-mono">{event.date} &middot; {event.time} &middot; {event.platform}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-4 rounded-2xl bg-accent/5 border border-accent/10">
              <Sparkles className="h-5 w-5 text-accent shrink-0" />
              <p className="text-xs text-text-muted leading-relaxed">
                Submit a quick review to unlock access. You&apos;ll receive your event key and <span className="text-accent font-black">+{REWARD_CP} CP</span>.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.25em] flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5" />
                What do you like about QYVORA?
              </label>
              <textarea
                value={review}
                onChange={(e) => { setReview(e.target.value); setError(''); }}
                placeholder="Share your thoughts about the platform..."
                rows={4}
                className="w-full bg-bg border-2 border-border rounded-2xl py-3.5 px-5 text-text-primary focus:border-accent hover:border-accent/40 outline-none font-mono text-sm resize-none transition-all"
              />
              <p className="text-[10px] text-text-muted/50 font-mono">
                Your feedback helps us improve.
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border-2 border-red-500/30">
                <span className="text-xs text-red-400 font-mono flex-1">{error}</span>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleClose}
                disabled={submitting}
                className="flex-1 py-3.5 rounded-2xl border-2 border-border text-[10px] font-black uppercase tracking-[0.15em] text-text-muted hover:border-accent/40 hover:text-accent transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={submitting || !review.trim()}
                className="flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-2xl bg-accent text-bg text-[10px] font-black uppercase tracking-[0.15em] shadow-lg shadow-accent/20 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Heart className="h-4 w-4" />
                )}
                Submit &amp; Join
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-2">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-accent/20 blur-2xl rounded-full animate-pulse" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-bg-card border-2 border-accent/40 text-accent shadow-[0_0_30px_rgba(var(--color-accent-rgb),0.2)]">
                  <Check className="h-8 w-8" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-black text-text-primary uppercase tracking-tight">You&apos;re In!</h3>
                <p className="text-sm text-text-muted mt-1 max-w-sm">
                  Your event key is ready. Use it to access the meeting link from your dashboard.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                <CpLogo className="h-5 w-5" />
                <span className="text-sm font-black">+{cpAwarded} CP</span>
              </div>
            </div>

            {eventKey && (
              <div className="space-y-2">
                <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.25em] text-center">
                  Your Event Key
                </p>
                <div className="flex items-center justify-center gap-3 p-5 rounded-2xl bg-bg-elevated border-2 border-border/60">
                  <KeyRound className="h-5 w-5 text-accent/60 shrink-0" />
                  <span className="font-mono text-xl font-black text-accent tracking-[0.3em] select-all">
                    {eventKey}
                  </span>
                  <button
                    onClick={handleCopyKey}
                    className="p-2.5 rounded-xl text-text-muted hover:text-accent hover:bg-accent-dim/20 transition-all"
                    aria-label="Copy key"
                  >
                    {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2.5 p-4 rounded-2xl bg-bg-elevated/40 border border-border/30">
              <Shield className="h-4 w-4 text-accent/60 shrink-0" />
              <p className="text-[11px] text-text-muted/70 font-mono leading-relaxed">
                Go to your dashboard &rarr; find the event card &rarr; enter this key to get the meeting link.
              </p>
            </div>

            <button
              onClick={handleClose}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl bg-accent text-bg text-[10px] font-black uppercase tracking-[0.15em] shadow-lg shadow-accent/20 transition-all hover:brightness-110 active:scale-[0.98]"
            >
              <ArrowRight className="h-4 w-4" />
              Go to Dashboard
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EventReviewModal;
