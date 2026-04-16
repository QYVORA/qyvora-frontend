import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { OWASP_TOP_10 } from '@/features/marketing/data/owaspData'

// ── Attack flow diagram ──────────────────────────────────────────
function AttackFlowDiagram({ steps, hex }) {
  return (
    <svg
      viewBox="0 0 520 90"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
      aria-hidden="true"
    >
      {/* Background */}
      <rect width="520" height="90" fill="rgba(0,0,0,0.35)" rx="6" />

      {steps.map((step, i) => {
        const boxW = 100
        const gap = 30
        const totalW = steps.length * boxW + (steps.length - 1) * gap
        const startX = (520 - totalW) / 2
        const x = startX + i * (boxW + gap)
        const isLast = i === steps.length - 1

        return (
          <g key={step.label}>
            {/* Box */}
            <rect
              x={x} y={12} width={boxW} height={66}
              rx="4"
              fill={isLast ? `${hex}22` : 'rgba(255,255,255,0.04)'}
              stroke={isLast ? hex : 'rgba(255,255,255,0.12)'}
              strokeWidth={isLast ? 1.5 : 1}
            />

            {/* Step number */}
            <text
              x={x + boxW / 2} y={28}
              textAnchor="middle"
              fontSize="8"
              fontFamily="monospace"
              fill={hex}
              opacity="0.8"
            >
              {String(i + 1).padStart(2, '0')}
            </text>

            {/* Label */}
            <text
              x={x + boxW / 2} y={46}
              textAnchor="middle"
              fontSize="9"
              fontFamily="monospace"
              fontWeight="bold"
              fill="rgba(255,255,255,0.9)"
            >
              {step.label}
            </text>

            {/* Detail */}
            <text
              x={x + boxW / 2} y={62}
              textAnchor="middle"
              fontSize="7.5"
              fontFamily="monospace"
              fill="rgba(255,255,255,0.45)"
            >
              {step.detail}
            </text>

            {/* Arrow to next */}
            {!isLast && (
              <g>
                <line
                  x1={x + boxW + 2} y1={45}
                  x2={x + boxW + gap - 4} y2={45}
                  stroke={hex} strokeWidth="1" opacity="0.5"
                  strokeDasharray="3 2"
                />
                <polygon
                  points={`${x + boxW + gap - 4},41 ${x + boxW + gap + 2},45 ${x + boxW + gap - 4},49`}
                  fill={hex} opacity="0.6"
                />
              </g>
            )}
          </g>
        )
      })}
    </svg>
  )
}

// ── Visual header card (the "image" for each entry) ──────────────
function AttackVisualCard({ item }) {
  const Icon = item.icon
  return (
    <div
      className="relative overflow-hidden rounded-none border aspect-[16/7] flex items-center justify-center"
      style={{ borderColor: `${item.hex}30`, background: `linear-gradient(135deg, ${item.hex}08 0%, rgba(0,0,0,0) 60%), var(--bg-secondary)` }}
    >
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(${item.hex} 1px, transparent 1px), linear-gradient(90deg, ${item.hex} 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Large faded rank */}
      <span
        className="absolute right-6 top-1/2 -translate-y-1/2 font-mono font-black select-none pointer-events-none"
        style={{ fontSize: 'clamp(48px, 8vw, 96px)', color: item.hex, opacity: 0.06, lineHeight: 1 }}
      >
        {item.id}
      </span>

      {/* Attack flow */}
      <div className="relative z-10 w-full px-6 py-4">
        <AttackFlowDiagram steps={item.attackSteps} hex={item.hex} />
      </div>

      {/* Severity pill */}
      <div
        className="absolute top-3 left-3 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest border"
        style={{ color: item.hex, borderColor: `${item.hex}40`, background: `${item.hex}15` }}
      >
        {item.severity}
      </div>

      {/* Icon */}
      <div
        className="absolute bottom-3 right-3 w-8 h-8 border flex items-center justify-center"
        style={{ borderColor: `${item.hex}40`, background: `${item.hex}15` }}
      >
        <Icon size={14} style={{ color: item.hex }} />
      </div>
    </div>
  )
}

// ── Accordion card ───────────────────────────────────────────────
function OwaspCard({ item, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div
      id={item.id}
      className="border border-[var(--border)] bg-[var(--bg-primary)] transition-colors duration-200"
      style={open ? { borderColor: `${item.hex}30` } : {}}
    >
      {/* Visual header — always visible */}
      <div className="relative">
        <AttackVisualCard item={item} />
      </div>

      {/* Text header row */}
      <button
        type="button"
        className="w-full flex items-start gap-5 px-6 py-5 text-left hover:bg-[var(--bg-secondary)] transition-colors duration-200"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-1.5">
            <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: item.hex }}>{item.rank}</span>
          </div>
          <h3 className="font-mono font-black text-lg text-[var(--text-primary)] leading-snug">
            {item.title}
          </h3>
          <p className="text-sm text-[var(--text-secondary)] mt-1 leading-relaxed">{item.short}</p>
        </div>
        <div className="shrink-0 mt-1" style={{ color: item.hex }}>
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {/* Expanded content */}
      {open && (
        <div className="px-6 pb-6 grid grid-cols-1 lg:grid-cols-3 gap-8 border-t border-[var(--border)]">

          {/* Description + examples */}
          <div className="lg:col-span-2 pt-6">
            <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] mb-3">Description</p>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{item.description}</p>

            <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] mt-6 mb-3">Real-World Examples</p>
            <ul className="space-y-2">
              {item.examples.map((ex) => (
                <li key={ex} className="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
                  <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: item.hex }} />
                  {ex}
                </li>
              ))}
            </ul>
          </div>

          {/* CWE + CTA */}
          <div className="pt-6">
            <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] mb-3">CWE References</p>
            <div className="flex flex-wrap gap-2">
              {item.cwe.map((cwe) => (
                <a
                  key={cwe}
                  href={`https://cwe.mitre.org/data/definitions/${cwe.replace('CWE-', '')}.html`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border font-mono text-xs hover:opacity-80 transition-opacity"
                  style={{ color: item.hex, borderColor: `${item.hex}40`, background: `${item.hex}10` }}
                >
                  {cwe} <ExternalLink size={10} />
                </a>
              ))}
            </div>

            <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] mt-6 mb-3">Train Against This</p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-4 py-2.5 border font-mono text-xs uppercase tracking-widest transition-opacity hover:opacity-80"
              style={{ color: item.hex, borderColor: `${item.hex}40`, background: `${item.hex}10` }}
            >
              Start Training <ArrowLeft size={12} className="rotate-180" />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────
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
            The ten most critical web application security risks. Each entry includes a visual attack flow diagram showing exactly how the exploit happens — step by step.
          </p>
          <div className="flex flex-wrap gap-6 text-xs font-mono text-[var(--text-muted)] uppercase tracking-widest">
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-400" /> Critical</span>
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-orange-400" /> High</span>
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-400" /> Medium</span>
            <span className="ml-auto">2021 Edition</span>
          </div>
        </div>
      </section>

      {/* Cards grid — 2 columns on desktop */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-[var(--border)]">
            {OWASP_TOP_10.map((item, i) => (
              <OwaspCard key={item.id} item={item} defaultOpen={i === 0} />
            ))}
          </div>
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
          <Link to="/register" className="btn-primary inline-flex items-center gap-2 px-8 py-4">
            Start Training <ArrowLeft size={16} className="rotate-180" />
          </Link>
        </div>
      </section>

    </div>
  )
}
