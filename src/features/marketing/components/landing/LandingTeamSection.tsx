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
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const LandingTeamSection: React.FC = () => {
  const members = teamData.slice(0, 2);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col justify-center h-full">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8 md:mb-12"
      >
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block text-xs font-black uppercase tracking-[0.35em] text-accent mb-3"
        >
          The Operators
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter"
        >
          Built by <span className="text-accent">Hackers</span>
        </motion.h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-3xl mx-auto w-full">
        {members.map((member, i) => (
          <motion.div
            key={member.id}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={cardVariants}
          >
            <div className="group relative rounded-2xl border border-border/40 bg-bg-card p-5 md:p-6 transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 overflow-hidden">
              {/* Decorative quote icon */}
              <Quote className="absolute top-3 right-3 w-8 h-8 text-accent/5 group-hover:text-accent/10 transition-colors" />

              <div className="relative z-10 flex items-start gap-4">
                {/* Avatar */}
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border border-border/30 flex-shrink-0 shadow-sm bg-bg-elevated">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base md:text-lg font-black text-text-primary tracking-tight">
                    {member.name}
                  </h3>
                  <span className="inline-block mt-0.5 px-2.5 py-0.5 bg-accent/10 text-accent text-[10px] font-black rounded uppercase tracking-widest">
                    {member.role}
                  </span>
                  <p className="mt-2 text-xs md:text-sm text-text-muted leading-relaxed line-clamp-2">
                    {member.bio}
                  </p>

                  {/* Socials */}
                  <div className="mt-3 flex items-center gap-2">
                    {Object.entries(member.socials || {}).map(([platform, url]) => {
                      const Icon = SOCIAL_ICONS[platform];
                      if (!Icon) return null;
                      return (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-7 h-7 rounded-lg bg-bg-elevated border border-border/20 flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/30 transition-all duration-200"
                        >
                          <Icon className="w-3.5 h-3.5" />
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
