import { Calendar, Video, Users } from 'lucide-react';
import { IconArrowRight, IconClock } from '@/shared/components/icons';
import ScrollReveal from '@/shared/components/ScrollReveal';
import { getActiveEvents, formatEventTime } from '@/features/marketing/content/eventsData';

const LandingEventsSection = () => {
  const events = getActiveEvents();

  if (events.length === 0) return null;

  return (
    <div className="relative bg-bg min-h-dvh md:h-dvh flex flex-col overflow-hidden">
      <div className="relative z-10 w-full h-full px-5 sm:px-6 md:px-16 lg:px-24 py-10 sm:py-8 md:py-12 lg:py-16 flex flex-col lg:flex-row gap-10 sm:gap-10 lg:gap-16 lg:items-stretch">
        {/* Header column */}
        <div className="shrink-0 lg:w-[420px] xl:w-[480px] flex flex-col justify-center">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter leading-none mb-2">
            Upcoming <span className="text-accent">Events</span>
          </h2>
          <p className="text-xs md:text-sm text-text-muted leading-relaxed max-w-xl mb-4">
            Join live hacking sessions, workshops, and community events. Learn offensive security from real operators.
          </p>
          <button
            onClick={() => document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-secondary inline-flex items-center gap-2.5"
          >
            View All Events <IconArrowRight size={14} />
          </button>
        </div>

        {/* Content column */}
        <div className="relative flex-1 min-h-0 min-w-0 overflow-hidden flex items-center">
          <div className="w-full space-y-4">
            {events.slice(0, 2).map((event, idx) => (
              <ScrollReveal key={event.id} direction="up" delay={idx * 0.1}>
                <div className="flex flex-col sm:flex-row gap-4 p-5 rounded-2xl border border-border/30 bg-bg-card hover:border-accent/30 transition-all">
                  <div className="sm:w-1/3 shrink-0">
                    <div className="relative aspect-video sm:aspect-square rounded-xl overflow-hidden border border-border/20">
                      <img
                        src={event.flyerUrl}
                        alt={event.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest text-accent bg-accent/10 border border-accent/20">
                        <Video className="h-3 w-3" /> Live
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest text-text-muted bg-bg-elevated border border-border/30">
                        <Calendar className="h-3 w-3" /> {event.date}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest text-text-muted bg-bg-elevated border border-border/30">
                        <IconClock size={12} /> {formatEventTime(event)}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest text-text-muted bg-bg-elevated border border-border/30">
                        {event.platform}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-text-primary mb-1">
                      {event.title}
                    </h3>
                    <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingEventsSection;
