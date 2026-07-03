import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Video, ArrowRight, Users, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import ScrollReveal from '@/shared/components/ScrollReveal';
import SEO from '@/shared/components/SEO';
import { useAuth } from '@/core/contexts/AuthContext';
import { getActiveEvents, formatEventTime } from '@/features/marketing/content/eventsData';
import { setPendingEventJoin } from '@/shared/utils/eventJoin';

const EventsPage: React.FC = () => {
  const { user } = useAuth();
  const events = getActiveEvents();
  const navigate = useNavigate();
  const [joiningId, setJoiningId] = useState<string | null>(null);

  const handleJoin = (eventId: string) => {
    setJoiningId(eventId);
    setPendingEventJoin(eventId);
    if (!user) {
      navigate('/register');
      return;
    }
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-bg">
      <SEO
        title="Events"
        description="Join QYVORA live events - offensive security sessions, hacking challenges, and community meetups."
      />

      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12 pt-28 pb-16 md:py-28 lg:py-40">
        {events.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-text-muted">No upcoming events.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-16 md:gap-24">
            {events.map((event, i) => (
              <div key={event.id} className="flex flex-col lg:flex-row lg:items-start gap-12 lg:gap-40">
                <div className="lg:w-[28%] lg:sticky lg:top-32 shrink-0">
                  <ScrollReveal direction="left" amount={0.1}>
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 border border-accent/30 bg-accent/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-accent mb-4">
                      <Users className="h-3.5 w-3.5" /> Live Operations
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter leading-none mb-4 mt-4">
                      {event.title}
                    </h1>
                    <p className="text-sm md:text-base text-text-muted max-w-md leading-relaxed">
                      {event.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-6">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent/20 rounded-lg text-[9px] font-black uppercase tracking-widest text-accent border border-accent/30">
                        <Video className="h-3 w-3" /> Live
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-bg-elevated rounded-lg text-[9px] font-black uppercase tracking-widest text-text-muted border border-border/30">
                        <Calendar className="h-3 w-3" /> {event.date}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-bg-elevated rounded-lg text-[9px] font-black uppercase tracking-widest text-text-muted border border-border/30">
                        <Clock className="h-3 w-3" /> {formatEventTime(event)}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-bg-elevated rounded-lg text-[9px] font-black uppercase tracking-widest text-text-muted border border-border/30">
                        {event.platform}
                      </span>
                    </div>
                    <div className="mt-8 flex gap-3">
                      <button
                        onClick={() => handleJoin(event.id)}
                        disabled={joiningId === event.id}
                        className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-accent text-bg rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-accent/20 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
                      >
                        {joiningId === event.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <ArrowRight className="h-4 w-4" />
                        )}
                        Join Event
                      </button>
                    </div>
                  </ScrollReveal>
                </div>

                <div className="lg:w-[72%] flex justify-center lg:justify-end">
                  <ScrollReveal direction="right" amount={0.1} delay={0.1}>
                    <motion.div
                      className="relative w-full md:w-[90%] lg:w-[85%] rounded-3xl overflow-hidden border border-border/30 group"
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <img
                        src={event.flyerUrl}
                        alt={event.title}
                        className="w-full md:w-auto h-auto max-w-full object-contain"
                      />
                    </motion.div>
                  </ScrollReveal>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
