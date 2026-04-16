import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { OWASP_TOP_10 } from '@/features/marketing/data/owaspData'
import { ScrollReveal } from '@/features/marketing/components/ScrollReveal'

export function OwaspSection() {
  return (
    <section className="py-24 px-4 sm:px-6 relative border-t border-accent/10 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute -top-20 left-1/4 w-96 h-96 rounded-full bg-red-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
          <div>
            <p className="font-mono text-accent text-xs uppercase tracking-widest mb-3">// security fundamentals</p>
            <h2 className="font-mono font-black text-3xl sm:text-4xl text-[var(--text-primary)]">OWASP Top 10</h2>
            <p className="text-[var(--text-secondary)] text-sm mt-3 max-w-xl leading-relaxed">
              The ten most critical web application security risks. Every operator trains against these vectors.
            </p>
          </div>
          <Link
            to="/owasp-top-10"
            className="btn-primary inline-flex items-center gap-2 self-start lg:self-auto shrink-0"
          >
            Explore All 10 <ArrowRight size={15} />
          </Link>
        </div>

        {/* Grid — numbered cards */}
        <ScrollReveal
          as="div"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-[var(--border)]"
          variant="fade"
        >
          {OWASP_TOP_10.map((item, i) => (
            <Link
              key={item.id}
              to={`/owasp-top-10#${item.id}`}
              className={`group relative flex flex-col gap-4 p-5 bg-[var(--bg-primary)] hover:bg-[var(--bg-secondary)] transition-colors duration-200 ${i >= 5 ? 'lg:col-span-1' : ''}`}
            >
              {/* Rank + severity */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest">{item.rank}</span>
                <span className={`font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 border ${item.bg} ${item.color}`}>
                  {item.severity}
                </span>
              </div>

              {/* Icon */}
              <div className={`w-9 h-9 border flex items-center justify-center ${item.bg}`}>
                <item.icon size={16} className={item.color} />
              </div>

              {/* Title */}
              <div>
                <p className="font-mono font-bold text-sm text-[var(--text-primary)] leading-snug group-hover:text-accent transition-colors duration-200">
                  {item.title}
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-1.5 leading-relaxed line-clamp-2">
                  {item.short}
                </p>
              </div>

              {/* Hover arrow */}
              <ArrowRight
                size={14}
                className={`absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${item.color}`}
              />
            </Link>
          ))}
        </ScrollReveal>

        {/* Bottom bar */}
        <div className="mt-px border border-[var(--border)] bg-[var(--bg-secondary)] px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs text-[var(--text-muted)] font-mono">
            Source: OWASP Foundation — owasp.org/Top10 — 2021 Edition
          </p>
          <Link to="/owasp-top-10" className="text-xs text-accent font-mono hover:underline flex items-center gap-1 shrink-0">
            Full breakdown <ArrowRight size={11} />
          </Link>
        </div>

      </div>
    </section>
  )
}
