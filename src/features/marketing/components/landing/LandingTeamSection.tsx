import React from 'react';
import { motion } from 'motion/react';
import { Github, Linkedin, Youtube, Twitter, Quote } from 'lucide-react';
import { teamData } from '@/features/marketing/pages/TeamPage/teamData';

const SOCIAL_ICONS: Record<string, React.ElementType> = {
  github: Github,
  linkedin: Linkedin,
  youtube: Youtube,
  twitter: Twitter,
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const LandingTeamSection: React.FC = () => {
  const members = teamData.slice(0, 2);

  return (
    <div className="w-full h-full flex flex-col justify-center px-4 md:px-12 lg:px-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8 md:mb-12"
      >
        <motion.span className="inline-block text-xs md:text-sm font-black uppercase tracking-[0.35em] text-accent mb-4">
          The Operators
        </motion.span>
        <motion.h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-text-primary tracking-tighter leading-none">
          Built by <span className="text-accent">Hackers</span>
        </motion.h2>
        <motion.p className="mt-4 text-sm md:text-lg text-text-muted max-w-xl mx-auto">
          Two operators, one mission — building Africa's offensive security platform
        </motion.p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10 max-w-5xl mx-auto w-full">
        {members.map((member, i) => (
          <motion.div
            key={member.id}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={cardVariants}
          >
            <div className="group relative rounded-2xl md:rounded-3xl border border-border/30 bg-bg-card overflow-hidden transition-all duration-300 hover:border-accent/25 hover:shadow-xl hover:shadow-accent/5 h-full">
              <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <Quote className="absolute bottom-4 right-4 w-16 h-16 md:w-20 md:h-20 text-accent/[0.04] group-hover:text-accent/[0.08] transition-colors" />

              <div className="relative z-10 p-6 md:p-10 lg:p-12 flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start text-center md:text-left">
                <div className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-2xl md:rounded-3xl overflow-hidden border border-border/20 flex-shrink-0 shadow-md bg-bg-elevated">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-text-primary tracking-tight">
                    {member.name}
                  </h3>
                  <span className="inline-block mt-1.5 px-3 py-1 bg-accent/10 text-accent text-[11px] md:text-xs font-black rounded-lg uppercase tracking-widest">
                    {member.role}
                  </span>
                  <p className="mt-3 md:mt-4 text-sm md:text-base lg:text-lg text-text-muted leading-relaxed">
                    {member.bio}
                  </p>

                  <div className="mt-4 md:mt-5 flex items-center gap-3 justify-center md:justify-start">
                    {Object.entries(member.socials || {}).map(([platform, url]) => {
                      const Icon = SOCIAL_ICONS[platform];
                      if (!Icon) return null;
                      return (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-bg-elevated border border-border/20 flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/30 hover:bg-accent/5 transition-all duration-200"
                        >
                          <Icon className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LandingTeamSection;
