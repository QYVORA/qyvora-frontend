import React, { useState } from 'react';
import { Heart, Loader2, Check, Copy, Video, Coins } from 'lucide-react';
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
        title={step === 'review' ? '[ EVENT REGISTRATION ]' : '[ EVENT KEY GENERATED ]'}
        maxWidth="max-w-lg"
        hideClose
        className="border-accent/30 shadow-[0_0_40px_rgba(var(--color-accent-rgb),0.12)]"
      >
        {step === 'review' ? (
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-border">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Video className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-black text-text-primary">{event.title}</p>
                <p className="text-[10px] text-text-muted font-mono">{event.date} &middot; {event.time}</p>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-black uppercase tracking-widest text-text-muted">
                What do you like about QYVORA?
              </p>
              <p className="text-[10px] text-text-muted/60">
                Your feedback helps us improve. This is required to join the event.
              </p>
            </div>

            <textarea
              value={review}
              onChange={(e) => { setReview(e.target.value); setError(''); }}
              placeholder="Share your thoughts..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-bg-elevated border border-border text-sm text-text-primary placeholder:text-text-muted/40 focus:outline-none focus:border-accent/50 resize-none transition-colors"
            />

            {error && (
              <p className="text-xs text-red-400 font-mono">{error}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleClose}
                disabled={submitting}
                className="flex-1 py-3 rounded-xl border border-border text-[10px] font-black uppercase tracking-widest text-text-muted hover:border-accent/30 hover:text-accent transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={submitting || !review.trim()}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-accent text-bg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-accent/20 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Heart className="h-3.5 w-3.5" />
                )}
                Submit &amp; Join
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 border border-accent/30">
                <Check className="h-8 w-8 text-accent" />
              </div>
            </div>

            <div>
              <p className="text-sm font-black text-text-primary mb-1">You're In!</p>
              <p className="text-xs text-text-muted mb-3">
                Here is your event key. Use it in your dashboard to access the meeting link.
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20 text-accent">
                <CpLogo className="h-4 w-4" />
                <span className="text-xs font-black">+{cpAwarded} CP</span>
              </div>
            </div>

            {eventKey && (
              <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-bg-elevated border border-border">
                <span className="font-mono text-lg font-black text-accent tracking-widest select-all">
                  {eventKey}
                </span>
                <button
                  onClick={handleCopyKey}
                  className="p-2 rounded-lg text-text-muted hover:text-accent hover:bg-accent-dim/20 transition-all"
                  aria-label="Copy key"
                >
                  {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            )}

            <p className="text-[10px] text-text-muted/60 font-mono">
              Go to your dashboard &rarr; Event Key card &rarr; Enter this key to get the meeting link.
            </p>

            <button
              onClick={handleClose}
              className="w-full py-3 rounded-xl bg-accent text-bg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-accent/20 transition-all hover:brightness-110 active:scale-[0.98]"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EventReviewModal;
