import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Twitter, Linkedin, MessageCircle, ArrowRight, Users } from 'lucide-react'
import { useSEO } from '@/core/utils/useSEO'
import api from '@/core/services/api'

const SOCIAL_ICON_BY_PLATFORM = {
  x: Twitter,
  twitter: Twitter,
  linkedin: Linkedin,
  whatsapp: MessageCircle,
}

export default function TeamPage() {
  const [members, setMembers] = useState([])

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const res = await api.get('/public/content/team')
        if (!mounted) return
        const source = Array.isArray(res.data?.team?.leadership?.members) ? res.data.team.leadership.members : []
        const mapped = source
          .map((member, index) => ({
            id: String(member?.name || `member-${index + 1}`).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            role: String(member?.role || '').trim(),
            name: String(member?.name || '').trim(),
            bio: String(member?.focus || '').trim(),
            avatar: String(member?.image || '').trim() || null,
            socials: Array.isArray(member?.socials) ? member.socials : [],
          }))
          .filter((member) => member.name)
        setMembers(mapped)
      } catch {
        if (mounted) setMembers([])
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const visibleMembers = useMemo(() => members, [members])

  useSEO({
    title: 'Meet the Team',
    description: 'Meet the operators behind HSOCIETY OFFSEC — the team building Africa\'s premier offensive security training platform.',
    path: '/team',
  })
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">

      {/* Hero */}
      <section className="relative py-28 px-4 sm:px-6 border-b border-[var(--border)] overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '48px 48px' }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 bg-accent/6 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p className="font-mono text-accent text-xs uppercase tracking-widest mb-3">// the team</p>
          <h1 className="font-mono font-black text-4xl md:text-6xl text-[var(--text-primary)] mb-4 leading-tight">Meet the Operators</h1>
          <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed">
            The people behind HSOCIETY OFFSEC — building the platform, growing the community, and driving the mission forward.
          </p>
        </div>
      </section>

      {/* Team grid */}
      <section className="py-16 px-4 sm:px-6">
        {visibleMembers.length === 0 ? (
          <div className="max-w-5xl mx-auto card p-6 text-sm text-[var(--text-secondary)] text-center">
            Team profiles will appear here once published.
          </div>
        ) : (
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-5">
            {visibleMembers.map((member) => (
              <div key={member.id} className="card group flex flex-col sm:flex-row hover:border-accent/50 transition-all duration-200">
                {/* Avatar */}
                <div className="relative w-full sm:w-48 h-48 sm:h-auto shrink-0 bg-[var(--bg-secondary)] border-b sm:border-b-0 sm:border-r border-[var(--border)] flex items-center justify-center overflow-hidden">
                  {member.avatar ? (
                    <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 border border-accent/40 bg-accent/10 flex items-center justify-center text-accent">
                        <Users size={28} />
                      </div>
                      <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest">Photo TBA</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-col gap-3 p-6 flex-1">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-accent">{member.role}</span>
                    <h2 className="font-mono font-bold text-lg text-[var(--text-primary)] mt-1">{member.name}</h2>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed flex-1">{member.bio}</p>
                  <div className="flex items-center gap-2 pt-3 border-t border-[var(--border)]">
                    {(member.socials || []).map((social) => {
                      const platform = String(social.platform || '').toLowerCase()
                      const Icon = SOCIAL_ICON_BY_PLATFORM[platform]
                      if (!Icon || !social.url) return null
                      return (
                        <a key={`${member.id}-${platform}`} href={social.url} target="_blank" rel="noreferrer" className="w-8 h-8 border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-accent hover:border-accent/40 transition-all">
                          <Icon size={13} />
                        </a>
                      )
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Join CTA */}
      <section className="py-16 px-4 sm:px-6 border-t border-[var(--border)]">
        <div className="max-w-2xl mx-auto text-center space-y-5">
          <p className="font-mono text-accent text-xs uppercase tracking-widest">// join us</p>
          <h2 className="font-mono font-bold text-2xl sm:text-3xl text-[var(--text-primary)]">Want to be part of the team?</h2>
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
            We're always looking for passionate operators, creators, and security professionals to grow the HSOCIETY community.
          </p>
          <Link to="/contact" className="btn-primary inline-flex items-center gap-2 text-sm">
            Get in Touch <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  )
}
