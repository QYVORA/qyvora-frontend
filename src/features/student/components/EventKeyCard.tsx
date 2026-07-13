import React, { useState } from 'react';
import { KeyRound, Loader2, ExternalLink, Video } from 'lucide-react';
import { IconCheck, IconX } from '@/shared/components/icons';
import api from '@/core/services/api';
import ScrollReveal from '@/shared/components/ScrollReveal';

interface EventKeyCardProps {
  eventId: string;
  eventTitle: string;
}

const EventKeyCard: React.FC<EventKeyCardProps> = ({ eventId, eventTitle }) => {
  const [keyInput, setKeyInput] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [meetLink, setMeetLink] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);

  const handleVerifyKey = async () => {
    if (!keyInput.trim()) {
      setError('Enter your event key.');
      return;
    }
    setError('');
    setVerifying(true);
    try {
      const res = await api.post('/events/verify-key', {
        eventId,
        key: keyInput.trim(),
      });
      const link = String(res.data?.meetLink || '');
      if (link) {
        setMeetLink(link);
        setVerified(true);
      } else {
        setError('Invalid key. Please check and try again.');
      }
    } catch {
      setError('Invalid key or key already used. Please check and try again.');
    } finally {
      setVerifying(false);
    }
  };

  const handleClear = () => {
    setKeyInput('');
    setMeetLink(null);
    setError('');
    setVerified(false);
  };

  return (
    <ScrollReveal direction="up" amount={0.1}>
      <div className="overflow-hidden rounded-2xl border border-border/40 bg-bg-card transition-all duration-300 group hover:border-accent/30">
        <div className="p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-text-primary">{eventTitle}</h3>
              <p className="text-[10px] text-text-muted font-mono">Event Access</p>
            </div>
          </div>

          {!verified ? (
            <div className="space-y-3">
              <p className="text-[10px] text-text-muted/70 font-mono">
                Enter your event key to access the meeting link.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={keyInput}
                  onChange={(e) => { setKeyInput(e.target.value); setError(''); }}
                  placeholder="XXXX-XXXX"
                  className="flex-1 px-3 py-2.5 rounded-xl bg-bg-elevated border border-border text-xs font-mono text-text-primary placeholder:text-text-muted/30 focus:outline-none focus:border-accent/50 uppercase tracking-widest transition-colors"
                />
                <button
                  onClick={handleVerifyKey}
                  disabled={verifying || !keyInput.trim()}
                  className="px-4 py-2.5 rounded-xl bg-accent text-bg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-accent/20 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  {verifying ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <IconCheck size={12} />
                  )}
                  Unlock
                </button>
              </div>
              {error && (
                <p className="text-[10px] text-red-400 font-mono flex items-center gap-1">
                  <IconX size={12} /> {error}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-accent/5 border border-accent/20">
                <IconCheck size={16} className="text-accent shrink-0" />
                <span className="text-[11px] text-text-primary font-mono">Key verified successfully</span>
              </div>
              {meetLink && (
                <a
                  href={meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-accent text-bg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-accent/20 transition-all hover:brightness-110 active:scale-[0.98]"
                >
                  <Video className="h-3.5 w-3.5" />
                  Join Google Meet <ExternalLink className="h-3 w-3" />
                </a>
              )}
              <button
                onClick={handleClear}
                className="w-full text-[9px] font-mono text-text-muted/40 hover:text-text-muted/70 uppercase tracking-widest transition-colors"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>
    </ScrollReveal>
  );
};

export default EventKeyCard;
