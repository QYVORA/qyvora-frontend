import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Copy, Check, Clock, Tag, ChevronRight, Terminal } from 'lucide-react'
import { PLAYBOOKS } from '@/features/marketing/data/playbooksData'
import { PLAYBOOK_CONTENT } from '@/features/marketing/data/playbookContent'
import { useSEO } from '@/core/utils/useSEO'

/* ─── Copy button ─────────────────────────────────────────────── */
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const handle = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <button
      type="button"
      onClick={handle}
      className="flex items-center gap-1.5 px-2 py-1 border border-[var(--border)] text-[var(--text-muted)] hover:text-accent hover:border-accent/40 transition-all font-mono text-[10px] uppercase tracking-widest shrink-0"
      aria-label="Copy command"
    >
      {copied ? <Check size={11} className="text-accent" /> : <Copy size={11} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

/* ─── Command block ───────────────────────────────────────────── */
function CommandBlock({ commands }) {
  const all = commands.join('\n')
  return (
    <div className="border border-[var(--border)] bg-black/60 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="flex items-center gap-2 text-[var(--text-muted)]">
          <Terminal size={12} />
          <span className="font-mono text-[10px] uppercase tracking-widest">Terminal</span>
        </div>
        <CopyButton text={all} />
      </div>
      <div className="p-4 space-y-1.5 overflow-x-auto">
        {commands.map((cmd, i) => (
          <div key={i} className="flex items-start gap-2 group">
            <span className="text-accent font-mono text-xs shrink-0 select-none mt-0.5">$</span>
            <code className="font-mono text-xs text-[var(--text-primary)] break-all leading-relaxed flex-1">{cmd}</code>
            <CopyButton text={cmd} />
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Individual walkthrough ──────────────────────────────────── */
function PlaybookDetail({ slug }) {
  const pb = PLAYBOOKS.find(p => p.slug === slug)
  const content = PLAYBOOK_CONTENT[slug]

  useSEO(pb ? {
    title: pb.title,
    description: pb.desc,
    path: `/playbooks/${slug}`,
  } : { title: 'Playbook Not Found', path: '/playbooks' })

  if (!pb || !content) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <p className="font-mono text-[var(--text-muted)] text-sm">Playbook not found.</p>
        <Link to="/playbooks" className="btn-primary text-sm inline-flex items-center gap-2">
          <ArrowLeft size={14} /> Back to Playbooks
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">

      {/* Hero */}
      <div className="relative h-56 sm:h-72 overflow-hidden border-b border-[var(--border)]">
        <img src={pb.img} alt={pb.title} className="w-full h-full object-cover" style={{ filter: 'brightness(0.25)' }} loading="eager" decoding="async" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-4 sm:px-6 pb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-[10px] uppercase tracking-widest text-accent border border-accent/40 px-2 py-0.5 bg-black/60">{pb.tag}</span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] border border-[var(--border)] px-2 py-0.5 bg-black/60">{pb.difficulty}</span>
          </div>
          <h1 className="font-mono font-black text-2xl sm:text-4xl text-white leading-tight">{pb.title}</h1>
          <p className="text-white/60 text-sm mt-2 leading-relaxed max-w-xl">{pb.subtitle}</p>
          <div className="flex items-center gap-4 mt-3">
            <span className="flex items-center gap-1 text-xs font-mono text-white/40"><Clock size={11} /> {pb.time}</span>
            <span className="flex items-center gap-1 text-xs font-mono text-white/40"><Tag size={11} /> {pb.tag}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <Link to="/playbooks" className="inline-flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] hover:text-accent transition-colors mb-8">
          <ArrowLeft size={12} /> All Playbooks
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10 items-start">

          {/* Sticky sidebar */}
          <aside className="hidden lg:block sticky top-24 space-y-6">
            {/* Setup */}
            <div className="border border-[var(--border)] p-4 space-y-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">// setup</p>
              <p className="font-mono font-bold text-xs text-[var(--text-primary)]">{content.setup.title}</p>
              <ul className="space-y-1.5">
                {content.setup.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[var(--text-secondary)] font-mono">
                    <ChevronRight size={10} className="text-accent shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Steps nav */}
            <div className="border border-[var(--border)] p-4 space-y-2">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-3">// steps</p>
              {content.steps.map((step, i) => (
                <a key={i} href={`#step-${i}`} className="flex items-center gap-2 text-xs font-mono text-[var(--text-secondary)] hover:text-accent transition-colors py-1 border-l-2 border-[var(--border)] hover:border-accent pl-2">
                  <span className="text-accent text-[10px]">{String(i + 1).padStart(2, '0')}</span>
                  {step.title}
                </a>
              ))}
            </div>
          </aside>

          {/* Main steps */}
          <main className="space-y-8">
            {/* Mobile setup */}
            <div className="lg:hidden border border-[var(--border)] p-4 space-y-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">// {content.setup.title}</p>
              <ul className="space-y-1.5">
                {content.setup.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[var(--text-secondary)] font-mono">
                    <ChevronRight size={10} className="text-accent shrink-0 mt-0.5" /> {item}
                  </li>
                ))}
              </ul>
            </div>

            {content.steps.map((step, i) => (
              <div key={i} id={`step-${i}`} className="scroll-mt-24 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 border border-accent/40 bg-accent/8 flex items-center justify-center font-mono text-xs text-accent shrink-0 mt-0.5">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <h2 className="font-mono font-bold text-base text-[var(--text-primary)]">{step.title}</h2>
                    <p className="text-sm text-[var(--text-secondary)] mt-1 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
                <CommandBlock commands={step.commands} />
              </div>
            ))}

            {/* Next playbook */}
            {(() => {
              const idx = PLAYBOOKS.findIndex(p => p.slug === slug)
              const next = PLAYBOOKS[idx + 1]
              if (!next) return null
              return (
                <div className="border-t border-[var(--border)] pt-8 mt-8">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-3">// next playbook</p>
                  <Link to={`/playbooks/${next.slug}`} className="card group flex items-center gap-4 p-4 hover:border-accent/50 transition-all duration-200">
                    <div className="w-10 h-10 border border-accent/30 bg-accent/8 flex items-center justify-center text-accent shrink-0">
                      <next.icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono font-bold text-sm text-[var(--text-primary)]">{next.title}</p>
                      <p className="font-mono text-xs text-[var(--text-muted)] mt-0.5">{next.difficulty} · {next.time}</p>
                    </div>
                    <ArrowRight size={16} className="text-accent shrink-0 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              )
            })()}
          </main>
        </div>
      </div>
    </div>
  )
}

/* ─── Playbooks index ─────────────────────────────────────────── */
function PlaybooksIndex() {
  useSEO({
    title: 'Field Playbooks — Offensive Security Walkthroughs',
    description: 'Step-by-step ethical hacking walkthroughs with real Linux commands. WiFi hacking, web app testing, privilege escalation, OSINT, and more.',
    path: '/playbooks',
  })

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">

      {/* Hero */}
      <section className="relative py-28 px-4 sm:px-6 border-b border-[var(--border)] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-64 pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(136,173,124,0.07) 0%, transparent 70%)' }} />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p className="font-mono text-accent text-xs uppercase tracking-widest mb-3">// operator playbooks</p>
          <h1 className="font-mono font-black text-4xl md:text-6xl text-[var(--text-primary)] mb-4 leading-tight">Field Playbooks</h1>
          <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
            Real offensive security walkthroughs with step-by-step instructions and Linux commands you can copy and run.
            No fluff — just the methodology.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--text-muted)]">// {PLAYBOOKS.length} walkthroughs</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {PLAYBOOKS.map((pb) => (
              <Link
                key={pb.slug}
                to={`/playbooks/${pb.slug}`}
                className="card group flex flex-col hover:border-accent/50 hover:-translate-y-1 transition-all duration-200"
              >
                <div className="relative h-40 overflow-hidden border-b border-[var(--border)]">
                  <img src={pb.img} alt={pb.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" decoding="async" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute top-2 left-2 px-2 py-0.5 border border-accent/40 bg-black/70 font-mono text-[10px] uppercase tracking-widest text-accent">{pb.tag}</div>
                  <div className="absolute bottom-2 right-2 w-8 h-8 border border-accent/30 bg-black/60 flex items-center justify-center text-accent">
                    <pb.icon size={14} />
                  </div>
                </div>
                <div className="p-4 flex flex-col gap-2 flex-1">
                  <h2 className="font-mono font-bold text-sm text-[var(--text-primary)] leading-snug">{pb.title}</h2>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed flex-1 line-clamp-2">{pb.desc}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
                    <span className="font-mono text-[10px] text-[var(--text-muted)]">{pb.difficulty} · {pb.time}</span>
                    <span className="font-mono text-[10px] text-accent flex items-center gap-1">Read <ArrowRight size={10} /></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

/* ─── Router entry ────────────────────────────────────────────── */
export default function PlaybooksPage() {
  const { slug } = useParams()
  if (slug) return <PlaybookDetail slug={slug} />
  return <PlaybooksIndex />
}
