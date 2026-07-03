import React, { useState } from 'react';
import { Heart, Loader2, Check, Video, MessageSquare, Sparkles, Shield } from 'lucide-react';
import { Dialog, DialogContent } from '@/shared/components/ui/Dialog';
import api from '@/core/services/api';
import { useAuth } from '@/core/contexts/AuthContext';
import { getEventById, formatEventTime } from '@/features/marketing/content/eventsData';
import CpLogo from '@/shared/components/CpLogo';

interface EventReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
  onReviewSubmitted: () => void;
}

const REWARD_CP = 50;

const EventReviewModal: React.FC<EventReviewModalProps> = ({ open, onOpenChange, eventId, onReviewSubmitted }) => {
  const { refreshMe } = useAuth();
  const event = getEventById(eventId);
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [cpAwarded, setCpAwarded] = useState(0);
  const [error, setError] = useState('');

  const handleSubmitReview = async () => {
    if (!review.trim()) {
      setError('Please share your thoughts about QYVORA.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const res = await api.post('/events/review', {
        eventId,
        review: review.trim(),
      });
      const cp = Number(res.data?.cpAwarded || REWARD_CP);
      setCpAwarded(cp);
      setSubmitted(true);
      await refreshMe();
      onReviewSubmitted();
      onOpenChange(false);
    } catch (err: any) {
      if (err?.response?.status === 409) {
        setSubmitted(true);
        onReviewSubmitted();
        onOpenChange(false);
      } else {
        setError('Failed to submit review. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen && !submitted) return;
      onOpenChange(isOpen);
    }}>
      <DialogContent
        title="[ EVENT REGISTRATION ]"
        maxWidth="max-w-lg"
        hideClose
        className="border-accent/30"
        onEscapeKeyDown={(e) => { if (!submitted) e.preventDefault(); }}
        onPointerDownOutside={(e) => { if (!submitted) e.preventDefault(); }}
      >
        <div className="space-y-6">
          <div className="flex items-center gap-4 pb-5 border-b border-border/40">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 border border-accent/20 text-accent shrink-0">
              <Video className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-black text-text-primary truncate">{event.title}</p>
              <p className="text-[11px] text-text-muted font-mono">{event.date} &middot; {formatEventTime(event)} &middot; {event.platform}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-4 rounded-2xl bg-accent/5 border border-accent/10">
            <Sparkles className="h-5 w-5 text-accent shrink-0" />
            <p className="text-xs text-text-muted leading-relaxed">
              Submit a quick review to unlock access. You&apos;ll receive <span className="text-accent font-black">+{REWARD_CP} CP</span>.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.25em] flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5" />
              Leave Your Review
            </label>
            <textarea
              value={review}
              onChange={(e) => { setReview(e.target.value); setError(''); }}
              placeholder="Share your thoughts about the platform..."
              rows={4}
              className="w-full bg-bg border-2 border-border rounded-2xl py-3.5 px-5 text-text-primary focus:border-accent hover:border-accent/40 outline-none font-mono text-sm resize-none transition-all"
            />
          </div>

          {error && (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border-2 border-red-500/30">
              <span className="text-xs text-red-400 font-mono flex-1">{error}</span>
            </div>
          )}

          <button
            onClick={handleSubmitReview}
            disabled={submitting || !review.trim()}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl bg-accent text-bg text-[10px] font-black uppercase tracking-[0.15em] transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Heart className="h-4 w-4" />
            )}
            Submit Review (+50 CP)
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventReviewModal;
