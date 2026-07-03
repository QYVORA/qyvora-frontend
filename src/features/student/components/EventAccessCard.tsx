import React, { useEffect, useState, useCallback } from 'react';
import { Video, Loader2, Check, Clock, Lock, Calendar, MessageSquare, ExternalLink } from 'lucide-react';
import api from '@/core/services/api';
import CpLogo from '@/shared/components/CpLogo';
import { formatEventTime, type EventData } from '@/features/marketing/content/eventsData';

interface EventAccessCardProps {
  event: EventData;
}

type CardStatus = 'loading' | 'reviewed' | 'available';

function parseEventDate(date: string, time: string): Date {
  const match = time.match(/(\d+):(\d+)\s*(AM|PM)\s*GMT/i);
  if (!match) return new Date(date);
  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const ampm = match[3].toUpperCase();
  if (ampm === 'PM' && hours !== 12) hours += 12;
  if (ampm === 'AM' && hours === 12) hours = 0;
  return new Date(`${date}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00.000Z`);
}

const ACCESS_WINDOW_MINUTES = 30;

const EventAccessCard: React.FC<EventAccessCardProps> = ({ event }) => {
  const [status, setStatus] = useState<CardStatus>('loading');
  const [countdown, setCountdown] = useState('');
  const [error, setError] = useState('');

  const checkStatus = useCallback(async () => {
    try {
      const res = await api.get(`/events/access-status/${event.id}`);
      const data = res.data;

      if (!data.reviewed) {
        setStatus('reviewed');
        return;
      }

      if (data.accessWindowStart) {
        const windowStart = new Date(data.accessWindowStart).getTime();
        if (Date.now() >= windowStart) {
          setStatus('available');
        } else {
          setStatus('reviewed');
        }
      } else {
        setStatus('reviewed');
      }
    } catch {
      setStatus('reviewed');
    }
  }, [event.id]);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  useEffect(() => {
    if (status !== 'reviewed' && status !== 'available') return;

    const eventDate = parseEventDate(event.date, event.time);
    const windowStart = eventDate.getTime() - ACCESS_WINDOW_MINUTES * 60 * 1000;

    const updateCountdown = () => {
      const now = Date.now();
      const diff = windowStart - now;

      if (diff <= 0) {
        setStatus('available');
        setCountdown('');
        return;
      }

      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      if (mins > 0) {
        setCountdown(`${mins}m ${secs}s`);
      } else {
        setCountdown(`${secs}s`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [status, event.date, event.time]);

  const handleJoinMeet = async () => {
    setError('');
    try {
      const res = await api.post('/events/request-access', { eventId: event.id });
      const meetLink = String(res.data?.meetLink || '');
      if (meetLink) {
        window.open(meetLink, '_blank', 'noopener,noreferrer');
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Access denied.');
    }
  };

  const eventDate = parseEventDate(event.date, event.time);

  return (
    <div className="overflow-hidden rounded-2xl border border-border/40 bg-bg-card transition-all duration-300">
      <div className="p-5 sm:p-6 space-y-5">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 border border-accent/20 text-accent shrink-0">
            <Video className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-black text-text-primary truncate">{event.title}</h3>
            <p className="text-[11px] text-text-muted font-mono flex flex-wrap gap-x-2">
              <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {event.date}</span>
              <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {formatEventTime(event)}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {status === 'loading' ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-accent-dim/10 text-[9px] font-black uppercase tracking-widest text-text-muted">
              <Loader2 className="h-3 w-3 animate-spin" /> Loading
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-accent/10 border border-accent/20 text-[9px] font-black uppercase tracking-widest text-accent">
              <Check className="h-3 w-3" /> Registered
            </span>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.25em] flex items-center gap-2">
              <Video className="w-3.5 h-3.5" />
              Google Meet
            </span>
          </div>

          {status === 'reviewed' ? (
            <div className="flex flex-col gap-3 p-4 rounded-2xl bg-bg-elevated/40 border border-border/30">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-text-muted/40 shrink-0" />
                <div>
                  <p className="text-xs text-text-muted/70 font-mono">
                    Available {ACCESS_WINDOW_MINUTES} minutes before the event.
                  </p>
                  {countdown && (
                    <p className="text-[11px] text-accent font-mono mt-1">
                      Opens in {countdown}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-bg-elevated border border-border/20">
                <Calendar className="h-4 w-4 text-text-muted/40 shrink-0" />
                <span className="text-[11px] text-text-muted/60 font-mono">
                  {eventDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} &middot; {formatEventTime(event)}
                </span>
              </div>
            </div>
          ) : (
            <button
              onClick={handleJoinMeet}
              className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-accent text-bg text-[10px] font-black uppercase tracking-[0.15em] transition-all hover:brightness-110 active:scale-[0.98]"
            >
              <Video className="h-4 w-4" />
              Join Google Meet
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          )}

          {error && (
            <p className="text-[10px] text-red-400 font-mono">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventAccessCard;
