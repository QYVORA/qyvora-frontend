import { ArrowUpRight } from 'lucide-react'
import { SOCIAL_MEDIA } from '@/features/marketing/data/socialMedia'

export function SocialSection() {
  return (
    <section className="px-6 py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none" />
      <div className="max-w-6xl mx-auto relative">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <p className="font-mono text-xs uppercase tracking-widest text-accent mb-3">Follow the Ops</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-[var(--text-primary)]">
              Stay Locked In With HSOCIETY
            </h2>
            <p className="text-[var(--text-secondary)] mt-3">
              Fresh drops, community briefings, and operator highlights. Follow us across every channel and stay ahead.
            </p>
          </div>
          <div className="text-sm text-[var(--text-muted)] font-mono">
            Live channels • 24/7 updates
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {SOCIAL_MEDIA.map(({ key, label, handle, url, icon: Icon, description }) => (
            <a
              key={key}
              href={url}
              target="_blank"
              rel="noreferrer"
              className="group card p-6 flex items-center justify-between gap-4 hover:border-accent/40 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                  <Icon size={22} />
                </div>
                <div>
                  <p className="font-display font-semibold text-lg text-[var(--text-primary)]">{label}</p>
                  <p className="text-sm text-[var(--text-muted)]">{handle}</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">{description}</p>
                </div>
              </div>
              <div className="flex items-center text-accent font-mono text-xs uppercase tracking-widest gap-2">
                Follow
                <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
