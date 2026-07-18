import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Video } from 'lucide-react';
import { IconArrowRight, IconClock } from '@/shared/components/icons';
import { Carousel } from '@/shared/components/carousel';
import ScrollReveal from '@/shared/components/ScrollReveal';
import { getActiveEvents, formatEventTime, type EventData } from '@/features/marketing/content/eventsData';
import { setPendingEventJoin } from '@/shared/utils/eventJoin';
import { useTranslation } from 'react-i18next';

interface LandingEventsSectionProps {
  user: { uid?: string } | null;
}

interface EventSlideInnerProps {
  event: EventData;
  user: { uid?: string } | null;
}

const EventSlideInner: React.FC<EventSlideInnerProps> = ({ event, user }) => {
  const { t } = useTranslation();
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
    <>
      {/* Mobile: image as border box + content below */}
      <div className="md:hidden flex flex-col gap-4 rounded-2xl border border-border/30 bg-bg-card p-3">
        <div className="relative w-full aspect-[16/10] overflow-hidden rounded-xl border border-border/20">
          <img
            src={event.flyerUrl}
            alt={event.title}
            width={800}
            height={500}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-3 px-1 pb-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent/20 rounded text-[9px] font-black uppercase tracking-widest text-accent border border-accent/30">
              <Video className="h-2.5 w-2.5" /> {t('landing.events.badgeLive')}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-bg-elevated rounded text-[9px] font-black uppercase tracking-widest text-text-muted border border-border/30">
              <Calendar className="h-2.5 w-2.5" /> {event.date}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-bg-elevated rounded text-[9px] font-black uppercase tracking-widest text-text-muted border border-border/30">
               <IconClock size={10} /> {formatEventTime(event)}
            </span>
          </div>
          <h3 className="text-xl font-black text-text-primary tracking-tight leading-tight">
            {event.title}
          </h3>
          <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
            {event.description}
          </p>
          <button
            onClick={handleJoin}
            className="self-start inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-bg rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-accent/20 transition-all hover:brightness-110 active:scale-[0.98]"
          >
            {t('landing.events.joinEvent')} <IconArrowRight size={12} />
          </button>
        </div>
      </div>

      {/* Desktop: full-bleed background with overlay */}
      <div className="hidden md:block relative w-full aspect-[16/7] overflow-hidden rounded-3xl">
        <img
          src={event.flyerUrl}
          alt={event.title}
          width={1200}
          height={525}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-10 lg:p-12">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-accent/20 backdrop-blur-md rounded text-[9px] font-black uppercase tracking-widest text-accent border border-accent/30">
              <Video className="h-3 w-3" /> {t('landing.events.badgeLiveEvent')}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-bg/50 backdrop-blur-md rounded text-[9px] font-black uppercase tracking-widest text-text-primary border border-border/30">
              <Calendar className="h-3 w-3" /> {event.date}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-bg/50 backdrop-blur-md rounded text-[9px] font-black uppercase tracking-widest text-text-primary border border-border/30">
               <IconClock size={12} /> {formatEventTime(event)}
            </span>
          </div>
          <h3 className="text-3xl lg:text-4xl font-black text-white tracking-tight mb-2">
            {event.title}
          </h3>
          <p className="text-sm md:text-base text-white/70 max-w-2xl mb-4 line-clamp-2">
            {event.description}
          </p>
          <button
            onClick={handleJoin}
            className="inline-flex items-center gap-2.5 px-6 py-3 bg-accent text-bg rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-accent/20 transition-all hover:brightness-110 active:scale-[0.98]"
          >
             {t('landing.events.joinEvent')} <IconArrowRight size={14} />
          </button>
        </div>
      </div>
    </>
  );
};

const LandingEventsSection: React.FC<LandingEventsSectionProps> = ({ user }) => {
  const { t } = useTranslation();
  const events = getActiveEvents();
  if (events.length === 0) return null;

  return (
    <div className="w-full px-4 md:px-12 lg:px-16">
      <div className="w-full lg:max-w-6xl lg:mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter leading-none">
              {t('landing.events.heading')}
            </h2>
            <p className="mt-3 text-sm md:text-base text-text-muted max-w-lg">
              {t('landing.events.description')}
            </p>
          </div>
          <Link
            to="/events"
            className="hidden md:inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent hover:underline"
          >
             {t('landing.events.viewAll')} <IconArrowRight size={12} />
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
             {t('landing.events.viewAllEvents')} <IconArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingEventsSection;
