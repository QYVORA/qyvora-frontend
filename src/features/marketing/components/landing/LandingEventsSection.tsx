import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Calendar, Clock, Video } from 'lucide-react';
import { Carousel } from '@/shared/components/carousel';
import ScrollReveal from '@/shared/components/ScrollReveal';
import { getActiveEvents, formatEventTime, type EventData } from '@/features/marketing/content/eventsData';
import { setPendingEventJoin } from '@/shared/utils/eventJoin';

interface LandingEventsSectionProps {
  user: { uid?: string } | null;
}

interface EventSlideInnerProps {
  event: EventData;
  user: { uid?: string } | null;
}

const EventSlideInner: React.FC<EventSlideInnerProps> = ({ event, user }) => {
  const navigate = useNavigate();

  const handleJoin = () => {
    setPendingEventJoin(event.id);
    if (!user) {
      navigate('/register');
      return;
    }
    navigate('/dashboard');
  };

  return (
    <div className="relative w-full aspect-[4/3] md:aspect-[16/7] overflow-hidden rounded-2xl md:rounded-3xl">
      <img
        src={event.flyerUrl}
        alt={event.title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 lg:p-12">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-accent/20 backdrop-blur-md rounded text-[9px] font-black uppercase tracking-widest text-accent border border-accent/30">
            <Video className="h-3 w-3" /> Live Event
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-bg/50 backdrop-blur-md rounded text-[9px] font-black uppercase tracking-widest text-text-primary border border-border/30">
            <Calendar className="h-3 w-3" /> {event.date}
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-bg/50 backdrop-blur-md rounded text-[9px] font-black uppercase tracking-widest text-text-primary border border-border/30">
            <Clock className="h-3 w-3" /> {formatEventTime(event)}
          </span>
        </div>
        <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight mb-2">
          {event.title}
        </h3>
        <p className="text-sm md:text-base text-white/70 max-w-2xl mb-4 line-clamp-2">
          {event.description}
        </p>
        <button
          onClick={handleJoin}
          className="inline-flex items-center gap-2.5 px-6 py-3 bg-accent text-bg rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-accent/20 transition-all hover:brightness-110 active:scale-[0.98]"
        >
          Join Event <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

const LandingEventsSection: React.FC<LandingEventsSectionProps> = ({ user }) => {
  const events = getActiveEvents();
  if (events.length === 0) return null;

  return (
    <div className="w-full px-4 md:px-12 lg:px-16">
      <div className="w-full lg:max-w-6xl lg:mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter leading-none">
              Live <span className="text-accent">Events</span>
            </h2>
            <p className="mt-3 text-sm md:text-base text-text-muted max-w-lg">
              Join live offensive security sessions and compete in real-time challenges.
            </p>
          </div>
          <Link
            to="/events"
            className="hidden md:inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent hover:underline"
          >
            View All <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <ScrollReveal direction="up" amount={0.1}>
          <Carousel
            slides={events}
            renderCard={(event) => <EventSlideInner event={event} user={user} />}
            autoPlayInterval={6000}
          />
        </ScrollReveal>

        <div className="mt-6 text-center md:hidden">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent hover:underline"
          >
            View All Events <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingEventsSection;
