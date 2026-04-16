import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { OWASP_TOP_10 } from '@/features/marketing/data/owaspData'
import { ScrollReveal } from '@/features/marketing/components/ScrollReveal'

function OwaspCard({ item, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div
      id={item.id}
      className={`border transition-colors duration-200 ${open ? `${item.bg}` : 'border-[var(--border)] bg-[var(--bg-primary)] hover:bg-[var(--bg-secondary)]'}`}
    >
      {/* Header row — always visible */}
      <button
        type="button"
        className="w-full flex items-start gap-5 p-6 text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {/* Rank badge */}
        <div className={`w-12 h-12 border flex items-center justify-center shrink-0 ${item.bg}`}>
          <item.icon size={20} className={item.color} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest">{item.rank}</span>
            <span className={`font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 border ${item.bg} ${item.color}`}>
              {item.severity}
            </span>
          </div>
          <h3 className={`font-mono font-black text-lg sm:text-xl text-[var(--text-primary)] leading-snug ${open ? item.color : ''}`}>
            {item.title}
          </h3>
          <p className="text-sm text-[var(--text-secondary)] mt-1 leading-relaxed">{item.short}</p>
        </div>

        <div className={`shrink-0 mt-1 ${item.color}`}>
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {/* Expanded content */}
      {open && (
        <div className="px-6 pb-6 grid grid-cols-1 lg:grid-cols-3 gap-8 border-t border-[var(--border)]">

          {/* Description */}
          <div className="lg:col-span-2 pt-6">
            <p className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-widest mb-3">Description</p>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{item.description}</p>

            <p className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-widest mt-6 mb-3">Real-World Examples</p>
            <ul className="space-y-2">
              {item.examples.map((ex) => (
                <li key={ex} className="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
                  <span className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${item.color.replace('text-', 'bg-')}`} />
                  {ex}
                </li>
              ))}
            </ul>
          </div>

          {/* CWE references */}
          <div className="pt-6">
            <p className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-widest mb-3">CWE References</p>
            <div className="flex flex-wrap gap-2">
              {item.cwe.map((cwe) => (
                <a
                  key={cwe}
                  href={`https://cwe.mitre.org/data/definitions/${cwe.replace('CWE-', '')}.html`}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 border font-mono text-xs hover:opacity-80 transition-opacity ${item.bg} ${item.color}`}
                >
                  {cwe}
                  <ExternalLink size={10} />
                </a>
              ))}
            </div>

            <p className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-widest mt-6 mb-3">Train Against This</p>
            <Link
              to="/register"
              className={`inline-flex items-center gap-2 px-4 py-2.5 border font-mono text-xs uppercase tracking-widest transition-opacity hover:opacity-80 ${item.bg} ${item.color}`}
            >
              Start Training <ArrowLeft size={12} className="rotate-180" />
            </Link>
          </div>

        </div>
      )}
    </div>
  )
}

export default function OwaspPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">

      {/* Hero */}
      <section className="py-24 px-4 sm:px-6 border-b border-accent/10 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 right-0 w-96 h-96 rounded-full bg-red-500/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-accent/5 blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto relative">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] hover:text-accent transition-colors mb-10 uppercase tracking-widest"
          >
            <ArrowLeft size={13} /> Back to Home
          </Link>
          <p className="font-mono text-accent text-xs uppercase tracking-widest mb-4">// security fundamentals</p>
          <h1 className="font-mono font-black text-4xl sm:text-5xl md:text-6xl text-[var(--text-primary)] leading-tight mb-6">
            OWASP Top 10
          </h1>
          <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed max-w-2xl mb-8">
            The ten most critical web application security risks, as defined by the OWASP Foundation. Every HSOCIETY bootcamp module is mapped to one or more of these attack vectors.
          </p>
          <div className="flex flex-wrap gap-4 text-xs font-mono text-[var(--text-muted)] uppercase tracking-widest">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400" /> Critical
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-400" /> High
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-400" /> Medium
            </span>
            <span className="ml-auto">2021 Edition</span>
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-px">
          <ScrollReveal as="div" className="space-y-px" variant="up">
            {OWASP_TOP_10.map((item, i) => (
              <OwaspCard key={item.id} item={item} defaultOpen={i === 0} />
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 px-4 sm:px-6 border-t border-accent/10">
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-mono text-accent text-xs uppercase tracking-widest mb-4">// train against every vector</p>
          <h2 className="font-mono font-black text-3xl sm:text-4xl text-[var(--text-primary)] mb-4">
            Know the risks. Exploit them first.
          </h2>
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-8 max-w-lg mx-auto">
            HSOCIETY bootcamps are built around real attack patterns. Train on live environments, earn CP, and become the operator who finds these before the attacker does.
          </p>
          <Link to="/register" className="btn-primary inline-flex items-center gap-2 px-8 py-4 rounded-none">
            Start Training <ArrowLeft size={16} className="rotate-180" />
          </Link>
        </div>
      </section>

    </div>
  )
}
