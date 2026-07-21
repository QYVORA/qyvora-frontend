import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Video, Users, Loader2 } from 'lucide-react';
import { IconArrowRight, IconClock } from '@/shared/components/icons';
import { motion } from 'motion/react';
import ScrollReveal from '@/shared/components/ScrollReveal';
import SEO from '@/shared/components/SEO';
import { Footer } from '@/shared/components/layout';
import { useAuth } from '@/core/contexts/AuthContext';
import { getActiveEvents, formatEventTime } from '@/features/marketing/content/eventsData';
import { setPendingEventJoin } from '@/shared/utils/eventJoin';
import PublicHeroSection from '@/shared/components/PublicHeroSection';
import { GridBoxedBackground } from '@/shared/components/backgrounds';

const EventsPage: React.FC = () => {
  const { t } = useTranslation();
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
    <div className="relative min-h-screen w-full bg-bg">
      <SEO
        title={t('eventsPage.hero.title')}
        description={t('eventsPage.hero.description')}
      />

      {/* ══ HERO ══ */}
      <PublicHeroSection mask="right" showGlobe>
        <div className="flex items-center gap-3 text-bg/70 text-xs font-black uppercase tracking-[0.3em]">
          <Calendar className="w-4 h-4" />
          {t('eventsPage.hero.badge')}
        </div>
        <h1 className="font-black text-bg leading-[1.08] tracking-tight w-full relative">
          <span className="block whitespace-normal lg:whitespace-nowrap text-[2rem] min-[400px]:text-[2.25rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[2.5rem] xl:text-[3rem] lg:leading-[1.1] xl:leading-[1.05] uppercase">
            {t('eventsPage.hero.title')}
          </span>
        </h1>
        <p className="text-bg/70 text-base sm:text-lg lg:text-base xl:text-lg leading-relaxed max-w-xl animate-fade-in font-mono">
          {t('eventsPage.hero.description')}
        </p>
      </PublicHeroSection>

      {/* ══ EVENTS LIST ══ */}
      <section className="relative w-full overflow-hidden">
        <GridBoxedBackground opacity={0.06} mask="right" />
        <div className="relative z-10 mx-auto max-w-[1600px] px-4 md:px-10 lg:px-12 xl:px-16 py-20 md:py-28 lg:py-36">
          {events.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-border/20 py-20 text-center min-h-[220px] flex flex-col items-center justify-center">
              <p className="text-sm text-text-muted">{t('eventsPage.empty')}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-16 md:gap-24">
              {events.map((event) => (
                <div key={event.id} className="flex flex-col lg:flex-row lg:items-start gap-8 md:gap-12 lg:gap-16">
                  <div className="lg:w-[28%] lg:sticky lg:top-32 shrink-0">
                    <ScrollReveal direction="left" amount={0.1}>
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 border border-accent/30 bg-accent/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-accent mb-4">
                        <Users className="h-3.5 w-3.5" /> {t('eventsPage.badge')}
                      </span>
                      <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter leading-none mb-4 mt-4">
                        {event.title}
                      </h2>
                      <p className="text-sm md:text-base text-text-muted max-w-md leading-relaxed break-words">
                        {event.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 mt-6">
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
                      <div className="mt-8">
                        <button
                          onClick={() => handleJoin(event.id)}
                          disabled={joiningId === event.id}
                          className="btn-primary inline-flex items-center gap-2.5"
                        >
                          {joiningId === event.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <IconArrowRight className="h-4 w-4" />
                          )}
                          {t('button.joinEvent')}
                        </button>
                      </div>
                    </ScrollReveal>
                  </div>

                  <div className="lg:w-[72%] flex justify-center lg:justify-end">
                    <ScrollReveal direction="right" amount={0.1} delay={0.1}>
                      <motion.div
                        className="relative w-full rounded-2xl overflow-hidden border border-border/30 bg-bg-card group"
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <img
                          src={event.flyerUrl}
                          alt={event.title}
                          width={1200}
                          height={675}
                          className="w-full h-auto object-contain"
                        />
                      </motion.div>
                    </ScrollReveal>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <section className="bg-transparent overflow-hidden">
        <Footer />
      </section>
    </div>
  );
};

export default EventsPage;
