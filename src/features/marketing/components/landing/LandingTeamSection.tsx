import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useReducedMotion } from 'motion/react';
import { IconArrowRight, IconProfile, BrandGithubIcon, BrandLinkedinIcon, BrandXIcon, BrandMediumIcon } from '@/shared/components/icons';
import { teamData, type TeamMember } from '@/features/marketing/content/teamData';
import DragMarquee from '@/shared/components/carousel/DragMarquee';
import { useTranslation } from 'react-i18next';

const TeamCard = ({ member }: { member: TeamMember }) => (
  <Link
    to={member.handle ? `/@${member.handle}` : undefined}
    className="group relative block h-[340px] sm:h-[400px] w-[min(85vw,360px)] sm:w-[min(52vw,380px)] md:w-[min(42vw,430px)] lg:w-[min(36vw,470px)] xl:w-[min(31vw,520px)] shrink-0 mr-4 md:mr-5 card-accent bg-bg-card overflow-hidden transition-all duration-300 hover:shadow-[var(--card-shadow)]"
  >
    {/* Member photo as the card background */}
    <img
      src={member.image}
      alt=""
      aria-hidden
      width={member.width}
      height={member.height}
      className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
      loading="lazy"
    />
    {/* Legibility overlay — theme-neutral dark scrim so it never washes out the photo in light mode */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

    {/* Top header — tiny profile icon */}
    <div className="relative z-10 flex items-center justify-end p-4 md:p-5 pb-0">
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-white/20 bg-black/40 backdrop-blur-md text-white/85">
        <IconProfile className="w-4 h-4" />
      </span>
    </div>

    {/* Content pinned to the bottom */}
    <div className="relative z-10 mt-auto flex flex-col p-5 md:p-6 pt-3">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="text-sm md:text-base font-black uppercase tracking-tight text-white group-hover:text-accent transition-colors truncate">
          {member.name}
        </h3>
        <span className="shrink-0 inline-block px-2.5 py-1 rounded-lg bg-accent/10 text-[9px] font-black uppercase tracking-widest text-accent backdrop-blur-sm">
          {member.role}
        </span>
      </div>
      <p className="text-[11px] md:text-xs text-white/75 leading-relaxed line-clamp-2 min-h-[3.25em]">
        {member.bio}
      </p>
      {Object.keys(member.socials).length > 0 && (
        <div className="flex items-center gap-3 mt-4 pt-4">
          {member.socials.github && (
            <span className="text-white/70 hover:text-accent transition-colors" aria-hidden="true">
              <BrandGithubIcon className="w-4 h-4" />
            </span>
          )}
          {member.socials.linkedin && (
            <span className="text-white/70 hover:text-accent transition-colors" aria-hidden="true">
              <BrandLinkedinIcon className="w-4 h-4" />
            </span>
          )}
          {member.socials.medium && (
            <span className="text-white/70 hover:text-accent transition-colors" aria-hidden="true">
              <BrandMediumIcon className="w-4 h-4" />
            </span>
          )}
          {member.socials.twitter && (
            <span className="text-white/70 hover:text-accent transition-colors" aria-hidden="true">
              <BrandXIcon className="w-4 h-4" />
            </span>
          )}
        </div>
      )}
    </div>
  </Link>
);

const LandingTeamSection = () => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative bg-bg min-h-dvh lg:h-dvh flex flex-col overflow-x-clip overflow-hidden">
      <div className="relative z-10 w-full h-full px-3 md:px-4 lg:px-6 py-12 sm:py-10 md:py-16 lg:py-20 flex flex-col gap-10 sm:gap-12 lg:gap-14">
        {/* Header — heading on the left, CTA aligned horizontally on the right */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-text-primary tracking-tighter leading-none">
            {t('landing.teamLanding.title')} <span className="text-accent">{t('landing.teamLanding.titleAccent')}</span>
          </h2>
          <Link
            to="/team"
            className="btn-secondary inline-flex items-center gap-2.5 w-fit shrink-0"
          >
            {t('landing.teamLanding.viewAll')} <IconArrowRight size={14} />
          </Link>
        </div>

        {shouldReduceMotion ? (
          /* Reduced motion — static responsive grid (natural card height) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {teamData.map((member) => (
              <TeamCard key={member.id} member={member} />
            ))}
          </div>
        ) : (
          /* Large card infinite carousel — grabbable strip, cards fill it fully */
          <div className="relative -mx-3 md:-mx-4 lg:-mx-6 flex-1 min-h-[400px] sm:min-h-0 min-w-0 overflow-x-hidden overflow-y-visible flex items-center py-3">
            <DragMarquee speed={24} trackClassName="mr-4 md:mr-5" className="w-full">
              {teamData.map((member) => (
                <TeamCard key={member.id} member={member} />
              ))}
            </DragMarquee>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(LandingTeamSection);
