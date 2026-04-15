import { ArrowUpRight } from 'lucide-react'
import { SOCIAL_MEDIA } from '@/features/marketing/data/socialMedia'
import { StaggerReveal } from '@/features/marketing/components/ScrollReveal'

export function SocialSection() {
  return (
    <section className="px-6 py-24 relative border-t border-accent/10">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none" />
      <div className="max-w-6xl mx-auto relative">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 text-center md:text-left items-center">
          <div className="max-w-xl space-y-3">
            <p className="font-mono text-xs uppercase tracking-widest text-accent mb-0">Follow the Ops</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-[var(--text-primary)]">
              Stay Locked In With HSOCIETY
            </h2>
            <p className="text-[var(--text-secondary)] mt-0 text-base leading-relaxed">
              Fresh drops, community briefings, and operator highlights. Follow us across every channel and stay ahead.
            </p>
          </div>
          <div className="text-sm text-[var(--text-muted)] font-mono md:text-right">
            Live channels • 24/7 updates
          </div>
        </div>
        <StaggerReveal className="grid gap-5 md:grid-cols-2 justify-items-center items-stretch" stagger={110} variant="left">
          {SOCIAL_MEDIA.map(({ key, label, handle, url, icon: Icon, description }) => (
            <a
              key={key}
              href={url}
              target="_blank"
              rel="noreferrer"
              className="group card p-5 flex items-center gap-4 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10 hover:-translate-y-0.5 transition-all duration-300 text-left mx-auto w-full max-w-lg h-full"
            >
              <div className="w-12 h-12 shrink-0 bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                <Icon size={22} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-base sm:text-lg font-semibold text-[var(--text-primary)] leading-tight">{label}</p>
                <p className="text-sm text-[var(--text-muted)]">{handle}</p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">{description}</p>
              </div>
              <div className="ml-auto flex items-center gap-2 text-accent font-mono text-xs uppercase tracking-widest">
                Follow
                <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </a>
          ))}
        </StaggerReveal>
      </div>
    </section>
  )
}
