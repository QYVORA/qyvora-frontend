import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { PLAYBOOKS } from '@/features/marketing/data/playbooksData'

const PREVIEW = PLAYBOOKS.slice(0, 4)

export function PlaybooksTeaser() {
  return (
    <section className="py-24 px-4 sm:px-6 border-t border-accent/10" id="playbooks">
      <div className="max-w-6xl mx-auto">

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <p className="font-mono text-accent text-xs uppercase tracking-widest mb-2">// operator playbooks</p>
            <h2 className="font-mono font-black text-3xl sm:text-4xl text-[var(--text-primary)]">Field Playbooks</h2>
            <p className="text-[var(--text-secondary)] text-sm mt-2 max-w-md leading-relaxed">
              Step-by-step offensive security walkthroughs with real Linux commands you can copy and run.
            </p>
          </div>
          <Link to="/playbooks" className="btn-secondary inline-flex items-center gap-2 text-sm shrink-0 self-start sm:self-auto">
            All Playbooks <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PREVIEW.map((pb) => (
            <Link
              key={pb.slug}
              to={`/playbooks/${pb.slug}`}
              className="card group flex flex-col hover:border-accent/50 hover:-translate-y-1 transition-all duration-200"
            >
              {/* Cover */}
              <div className="relative h-36 overflow-hidden border-b border-[var(--border)]">
                <img
                  src={pb.img}
                  alt={pb.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute top-2 left-2 px-2 py-0.5 border border-accent/40 bg-black/70 font-mono text-[10px] uppercase tracking-widest text-accent">
                  {pb.tag}
                </div>
                <div className="absolute bottom-2 right-2 w-8 h-8 border border-accent/30 bg-black/60 flex items-center justify-center text-accent">
                  <pb.icon size={14} />
                </div>
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col gap-2 flex-1">
                <h3 className="font-mono font-bold text-sm text-[var(--text-primary)] leading-snug">{pb.title}</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed flex-1 line-clamp-2">{pb.desc}</p>
                <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
                  <span className="font-mono text-[10px] text-[var(--text-muted)]">{pb.difficulty} · {pb.time}</span>
                  <span className="font-mono text-[10px] text-accent flex items-center gap-1">
                    Read <ArrowRight size={10} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
