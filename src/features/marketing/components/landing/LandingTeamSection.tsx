import { Link } from 'react-router-dom';
import { IconArrowRight } from '@/shared/components/icons';
import ScrollReveal from '@/shared/components/ScrollReveal';
import { teamData } from '@/features/marketing/content/teamData';

const LandingTeamSection = () => {
  return (
    <div className="relative bg-bg min-h-dvh md:h-dvh flex flex-col overflow-hidden">
      <div className="relative z-10 w-full h-full px-5 sm:px-6 md:px-16 lg:px-24 py-10 sm:py-8 md:py-12 lg:py-16 flex flex-col lg:flex-row gap-10 sm:gap-10 lg:gap-16 lg:items-stretch">
        {/* Header column */}
        <div className="shrink-0 lg:w-[420px] xl:w-[480px] flex flex-col justify-center">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter leading-none mb-2">
            Meet The <span className="text-accent">Operators</span>
          </h2>
          <p className="text-xs md:text-sm text-text-muted leading-relaxed max-w-xl mb-4">
            The core team behind QYVORA — building Africa's offensive security platform from the ground up.
          </p>
          <Link
            to="/team"
            className="btn-secondary inline-flex items-center gap-2.5"
          >
            View Full Team <IconArrowRight size={14} />
          </Link>
        </div>

        {/* Grid column */}
        <div className="relative flex-1 min-h-0 min-w-0 overflow-hidden flex items-center justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {teamData.map((member, idx) => (
              <ScrollReveal key={member.id} direction="up" delay={idx * 0.1}>
                <Link
                  to={`/ @${member.handle || member.name}`}
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
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/20">
                      {member.socials.github && (
                        <span className="text-[9px] font-black uppercase tracking-widest text-text-muted hover:text-accent transition-colors">
                          GitHub
                        </span>
                      )}
                      {member.socials.linkedin && (
                        <span className="text-[9px] font-black uppercase tracking-widest text-text-muted hover:text-accent transition-colors">
                          LinkedIn
                        </span>
                      )}
                      {member.socials.twitter && (
                        <span className="text-[9px] font-black uppercase tracking-widest text-text-muted hover:text-accent transition-colors">
                          X
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
