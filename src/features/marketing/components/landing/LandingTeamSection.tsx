import { Link } from 'react-router-dom';
import { IconArrowRight, BrandGithubIcon, BrandLinkedinIcon, BrandXIcon } from '@/shared/components/icons';
import ScrollReveal from '@/shared/components/ScrollReveal';
import { teamData } from '@/features/marketing/content/teamData';
import { useTranslation } from 'react-i18next';

const LandingTeamSection = () => {
  const { t } = useTranslation();
  return (
    <div className="relative bg-bg min-h-dvh lg:h-dvh flex flex-col overflow-hidden">
      <div className="relative z-10 w-full h-full px-3 md:px-4 lg:px-6 py-12 sm:py-10 md:py-16 lg:py-20 flex flex-col gap-8 sm:gap-10 lg:gap-12">
        {/* Header */}
        <div className="flex flex-col">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-text-primary tracking-tighter leading-none mb-6">
            {t('landing.teamLanding.title')} <span className="text-accent">{t('landing.teamLanding.titleAccent')}</span>
          </h2>
          <p className="text-xs md:text-sm text-text-muted leading-relaxed max-w-xl mb-8">
            {t('landing.teamLanding.description')}
          </p>
          <Link
            to="/team"
            className="btn-secondary inline-flex items-center gap-2.5 w-fit"
          >
            {t('landing.teamLanding.viewAll')} <IconArrowRight size={14} />
          </Link>
        </div>

        {/* Responsive Grid */}
        <div className="relative flex-1 min-h-0 min-w-0 overflow-hidden flex items-start lg:justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {teamData.map((member, idx) => (
              <ScrollReveal key={member.id} direction="up" delay={idx * 0.1}>
                <Link
                  to={member.handle ? `/@${member.handle}` : undefined}
                  className="group relative flex flex-col rounded-2xl border border-border/30 bg-bg-card p-5 transition-all duration-300 hover:border-accent/30 h-full"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border border-border/30 shrink-0">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-black uppercase tracking-tight text-text-primary group-hover:text-accent transition-colors truncate">
                        {member.name}
                      </h3>
                      <span className="inline-block px-2 py-0.5 rounded-lg bg-accent/10 text-[10px] font-black uppercase tracking-widest text-accent mt-1">
                        {member.role}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-text-muted line-clamp-3 leading-relaxed">
                    {member.bio}
                  </p>
                  {Object.keys(member.socials).length > 0 && (
                    <div className="flex items-center gap-3 mt-4">
                      {member.socials.github && (
                        <span className="text-text-muted hover:text-accent transition-colors">
                          <BrandGithubIcon className="w-4 h-4" />
                        </span>
                      )}
                      {member.socials.linkedin && (
                        <span className="text-text-muted hover:text-accent transition-colors">
                          <BrandLinkedinIcon className="w-4 h-4" />
                        </span>
                      )}
                      {member.socials.twitter && (
                        <span className="text-text-muted hover:text-accent transition-colors">
                          <BrandXIcon className="w-4 h-4" />
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingTeamSection;
