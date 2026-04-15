import { Link } from 'react-router-dom'
import { ArrowRight, Twitter, Linkedin, MessageCircle } from 'lucide-react'
import { TEAM } from '@/features/marketing/data/teamData'

function TeamCard({ member }) {
  return (
    <div className="card group flex flex-col hover:border-accent/50 hover:-translate-y-1 transition-all duration-200">
      {/* Avatar area */}
      <div className="relative h-48 bg-[var(--bg-secondary)] overflow-hidden border-b border-[var(--border)] flex items-center justify-center">
        {member.avatar ? (
          <img src={member.avatar} alt={member.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" decoding="async" />
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 border border-accent/40 bg-accent/10 flex items-center justify-center text-accent">
              <member.icon size={28} />
            </div>
            <span className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest">Photo TBA</span>
          </div>
        )}
        {/* Role badge */}
        <div className="absolute top-3 left-3 px-2 py-0.5 border border-accent/40 bg-black/70 text-accent font-mono text-[10px] uppercase tracking-widest">
          {member.role}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <h3 className="font-mono font-bold text-base text-[var(--text-primary)]">{member.name}</h3>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed flex-1">{member.bio}</p>

        {/* Socials */}
        <div className="flex items-center gap-2 pt-2 border-t border-[var(--border)]">
          {member.social?.x && (
            <a href={member.social.x} target="_blank" rel="noreferrer" className="w-7 h-7 border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-accent hover:border-accent/40 transition-all">
              <Twitter size={12} />
            </a>
          )}
          {member.social?.linkedin && (
            <a href={member.social.linkedin} target="_blank" rel="noreferrer" className="w-7 h-7 border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-accent hover:border-accent/40 transition-all">
              <Linkedin size={12} />
            </a>
          )}
          {member.social?.whatsapp && (
            <a href={member.social.whatsapp} target="_blank" rel="noreferrer" className="w-7 h-7 border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-accent hover:border-accent/40 transition-all">
              <MessageCircle size={12} />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export function TeamSection() {
  return (
    <section className="py-24 px-4 sm:px-6 border-t border-accent/10" id="team">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <p className="font-mono text-accent text-xs uppercase tracking-widest mb-2">// the team</p>
            <h2 className="font-mono font-black text-3xl sm:text-4xl text-[var(--text-primary)]">Meet the Operators</h2>
            <p className="text-[var(--text-secondary)] text-sm mt-2 max-w-md leading-relaxed">
              The people building HSOCIETY and driving the offensive security community forward.
            </p>
          </div>
          <Link to="/team" className="btn-secondary inline-flex items-center gap-2 text-sm shrink-0 self-start sm:self-auto">
            Full Team <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TEAM.map(member => <TeamCard key={member.id} member={member} />)}
        </div>
      </div>
    </section>
  )
}
