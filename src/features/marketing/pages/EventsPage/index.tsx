import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Video, Users, Loader2 } from 'lucide-react';
import { IconArrowRight, IconClock } from '@/shared/components/icons';
import { motion } from 'motion/react';
import ScrollReveal from '@/shared/components/ScrollReveal';
import SEO from '@/shared/components/SEO';
import { Footer } from '@/shared/components/layout';
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

      {/* Hero */}
      <section id="events-hero" className="relative w-full min-h-dvh md:h-dvh md:overflow-hidden">
        <div className="relative w-full h-full bg-accent overflow-hidden" data-nav-invert>

          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }} />
          </div>

          <div className="relative z-10 flex flex-col items-start justify-center h-full px-4 sm:px-8 md:px-12 lg:pl-16 xl:pl-20 lg:pr-8 xl:pr-12 pt-16 sm:pt-20 lg:pt-24 pb-14 sm:pb-16 lg:pb-16 w-full">
            <div className="space-y-5 sm:space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 border border-bg/20 bg-bg/10 rounded-lg max-w-full">
                <span className="w-1.5 h-1.5 rounded-full bg-bg/60 animate-pulse flex-none" />
                <span className="font-mono text-[9px] min-[380px]:text-[10px] sm:text-[11px] font-black uppercase tracking-[0.12em] min-[380px]:tracking-[0.14em] sm:tracking-[0.3em] text-bg whitespace-normal">
                  <Calendar className="h-3 w-3 inline-block -mt-0.5 mr-1.5" /> Live Operations
                </span>
              </div>

              <h1 className="font-black text-bg leading-[1.08] tracking-tight w-full">
                <span className="block text-[2rem] min-[400px]:text-[2.25rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[2.5rem] xl:text-[3rem] lg:leading-[1.1] xl:leading-[1.05] uppercase">
                  Events
                </span>
              </h1>

              <p className="text-bg/70 text-sm sm:text-base lg:text-sm xl:text-base leading-relaxed max-w-xl animate-fade-in font-mono">
                Join QYVORA live events — offensive security sessions, hacking challenges, and community meetups.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Events list */}
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12 py-16 md:py-24">
        {events.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-text-muted">No upcoming events.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-16 md:gap-24">
            {events.map((event, i) => (
              <div key={event.id} className="flex flex-col lg:flex-row lg:items-start gap-8 md:gap-12 lg:gap-40">
                <div className="lg:w-[28%] lg:sticky lg:top-32 shrink-0">
                  <ScrollReveal direction="left" amount={0.1}>
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 border border-accent/30 bg-accent/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-accent mb-4">
                      <Users className="h-3.5 w-3.5" /> Live Operations
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter leading-none mb-4 mt-4">
                      {event.title}
                    </h1>
                    <p className="text-sm md:text-base text-text-muted max-w-md leading-relaxed break-words">
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
                        <IconClock size={12} /> {formatEventTime(event)}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-bg-elevated rounded-lg text-[9px] font-black uppercase tracking-widest text-text-muted border border-border/30">
                        {event.platform}
                      </span>
                    </div>
                    <div className="mt-8 flex gap-3">
                      <button
                        onClick={() => handleJoin(event.id)}
                        disabled={joiningId === event.id}
                        className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-accent text-bg rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-accent/20 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
                      >
                        {joiningId === event.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                           <IconArrowRight className="h-4 w-4" />
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

      <section id="footer" className="w-full bg-bg">
        <Footer />
      </section>
    </div>
  );
};

export default EventsPage;
