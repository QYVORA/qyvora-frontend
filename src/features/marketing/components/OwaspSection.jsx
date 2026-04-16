import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { OWASP_TOP_10 } from '@/features/marketing/data/owaspData'
import { ScrollReveal } from '@/features/marketing/components/ScrollReveal'

function MiniFlowDiagram({ steps, hex }) {
  const boxW = 64
  const gap = 14
  const totalW = steps.length * boxW + (steps.length - 1) * gap
  const svgW = totalW + 16
  return (
    <svg viewBox={`0 0 ${svgW} 52`} xmlns="http://www.w3.org/2000/svg" className="w-[420px] sm:w-full h-auto" aria-hidden="true">
      <rect width={svgW} height="48" fill="rgba(0,0,0,0.3)" rx="4" />
      {steps.map((step, i) => {
        const x = 8 + i * (boxW + gap)
        const isLast = i === steps.length - 1
        return (
          <g key={step.label}>
            <rect x={x} y={6} width={boxW} height={36} rx="3"
              fill={isLast ? `${hex}20` : 'rgba(255,255,255,0.04)'}
              stroke={isLast ? hex : 'rgba(255,255,255,0.1)'}
              strokeWidth={isLast ? 1.2 : 0.8}
            />
            <text x={x + boxW / 2} y={20} textAnchor="middle" fontSize="7" fontFamily="monospace" fontWeight="bold" fill="rgba(255,255,255,0.85)">{step.label}</text>
            <text x={x + boxW / 2} y={33} textAnchor="middle" fontSize="6" fontFamily="monospace" fill="rgba(255,255,255,0.4)">{step.detail}</text>
            {!isLast && (
              <g>
                <line x1={x + boxW + 1} y1={24} x2={x + boxW + gap - 2} y2={24} stroke={hex} strokeWidth="0.8" opacity="0.5" strokeDasharray="2 1.5" />
                <polygon points={`${x + boxW + gap - 2},21 ${x + boxW + gap + 2},24 ${x + boxW + gap - 2},27`} fill={hex} opacity="0.6" />
              </g>
            )}
          </g>
        )
      })}
    </svg>
  )
}

export function OwaspSection() {
  return (
    <section className="py-20 sm:py-24 px-4 sm:px-6 relative border-t border-accent/10 overflow-hidden">
      <div className="absolute -top-20 left-1/4 w-96 h-96 rounded-full bg-red-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
          <div>
            <p className="font-mono text-accent text-xs uppercase tracking-widest mb-3">// security fundamentals</p>
            <h2 className="font-mono font-black text-3xl sm:text-4xl text-[var(--text-primary)]">OWASP Top 10</h2>
            <p className="text-[var(--text-secondary)] text-base mt-3 max-w-2xl leading-relaxed">
              The ten most critical web application security risks — each with a visual attack flow. Every operator trains against these vectors.
            </p>
          </div>
          <Link to="/owasp-top-10" className="btn-primary inline-flex items-center gap-2 self-start lg:self-auto shrink-0">
            Explore All 10 <ArrowRight size={15} />
          </Link>
        </div>

        {/* Grid */}
        <ScrollReveal as="div" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4" variant="fade">
          {OWASP_TOP_10.map((item) => (
            <Link
              key={item.id}
              to={`/owasp-top-10#${item.id}`}
              className="group flex flex-col border border-[var(--border)] bg-[var(--bg-primary)] hover:bg-[var(--bg-secondary)] hover:border-accent/40 transition-colors duration-200"
            >
              {/* Mini attack flow visual */}
              <div
                className="relative overflow-x-auto overflow-y-hidden p-3 border-b"
                style={{ borderColor: `${item.hex}20`, background: `linear-gradient(135deg, ${item.hex}08, transparent 70%)` }}
              >
                <MiniFlowDiagram steps={item.attackSteps} hex={item.hex} />
                {/* Faded rank watermark */}
                <span
                  className="absolute right-2 top-1/2 -translate-y-1/2 font-mono font-black pointer-events-none select-none"
                  style={{ fontSize: 28, color: item.hex, opacity: 0.08, lineHeight: 1 }}
                >
                  {item.id}
                </span>
              </div>

              {/* Card body */}
              <div className="p-4 flex flex-col gap-2 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: item.hex }}>{item.rank}</span>
                  <span
                    className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 border"
                    style={{ color: item.hex, borderColor: `${item.hex}40`, background: `${item.hex}12` }}
                  >
                    {item.severity}
                  </span>
                </div>
                <div className="w-7 h-7 border flex items-center justify-center" style={{ borderColor: `${item.hex}40`, background: `${item.hex}12` }}>
                  <item.icon size={13} style={{ color: item.hex }} />
                </div>
                <p className="font-mono font-bold text-sm text-[var(--text-primary)] leading-snug group-hover:underline" style={{ textDecorationColor: item.hex }}>
                  {item.title}
                </p>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed line-clamp-2">{item.short}</p>
              </div>
            </Link>
          ))}
        </ScrollReveal>

        {/* Bottom bar */}
        <div className="mt-px border border-[var(--border)] bg-[var(--bg-secondary)] px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs text-[var(--text-muted)] font-mono">Source: OWASP Foundation — owasp.org/Top10 — 2021 Edition</p>
          <Link to="/owasp-top-10" className="text-xs text-accent font-mono hover:underline flex items-center gap-1 shrink-0">
            Full breakdown <ArrowRight size={11} />
          </Link>
        </div>

      </div>
    </section>
  )
}
