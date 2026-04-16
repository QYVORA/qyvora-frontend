import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ChevronDown, ChevronUp, ExternalLink, ZoomIn, X } from 'lucide-react'
import { OWASP_TOP_10 } from '@/features/marketing/data/owaspData'
import { StaggerReveal } from '@/features/marketing/components/ScrollReveal'

function AttackFlowDiagram({ steps, hex, large = false }) {
  const h = large ? 140 : 96
  const boxW = large ? 160 : 112
  const gap = large ? 44 : 24
  const vw = large ? 840 : 620
  return (
    <svg viewBox={`0 0 ${vw} ${h}`} xmlns="http://www.w3.org/2000/svg" className={`${large ? 'w-full' : 'w-[620px] sm:w-full'} h-auto`} aria-hidden="true">
      <rect width={vw} height={h} fill="rgba(0,0,0,0.5)" rx="8" />
      {Array.from({ length: 8 }).map((_, i) => (
        <line key={i} x1={i * (vw / 8)} y1="0" x2={i * (vw / 8)} y2={h} stroke={hex} strokeWidth="0.3" opacity="0.08" />
      ))}
      {steps.map((step, i) => {
        const totalW = steps.length * boxW + (steps.length - 1) * gap
        const startX = (vw - totalW) / 2
        const x = startX + i * (boxW + gap)
        const isLast = i === steps.length - 1
        const cy = h / 2
        return (
          <g key={step.label}>
            {isLast && <ellipse cx={x + boxW / 2} cy={cy} rx={boxW * 0.7} ry={h * 0.4} fill={hex} opacity="0.06" />}
            <rect x={x} y={large ? 18 : 12} width={boxW} height={large ? 104 : 66} rx="6"
              fill={isLast ? `${hex}20` : 'rgba(255,255,255,0.04)'}
              stroke={isLast ? hex : 'rgba(255,255,255,0.14)'}
              strokeWidth={isLast ? 1.8 : 1} />
            <text x={x + boxW / 2} y={large ? 36 : 28} textAnchor="middle" fontSize={large ? 11 : 8} fontFamily="monospace" fill={hex} opacity="0.9">{String(i + 1).padStart(2, '0')}</text>
            <text x={x + boxW / 2} y={large ? 62 : 46} textAnchor="middle" fontSize={large ? 13 : 9} fontFamily="monospace" fontWeight="bold" fill="rgba(255,255,255,0.95)">{step.label}</text>
            <text x={x + boxW / 2} y={large ? 84 : 62} textAnchor="middle" fontSize={large ? 10 : 7.5} fontFamily="monospace" fill="rgba(255,255,255,0.5)">{step.detail}</text>
            {!isLast && (
              <g>
                <line x1={x + boxW + 3} y1={cy} x2={x + boxW + gap - 5} y2={cy} stroke={hex} strokeWidth={large ? 1.5 : 1} opacity="0.6" strokeDasharray={large ? '4 3' : '3 2'} />
                <polygon points={`${x + boxW + gap - 5},${cy - 5} ${x + boxW + gap + 2},${cy} ${x + boxW + gap - 5},${cy + 5}`} fill={hex} opacity="0.7" />
              </g>
            )}
          </g>
        )
      })}
    </svg>
  )
}

function AttackVisualCard({ item, onZoom }) {
  const Icon = item.icon
  return (
    <div className="relative overflow-hidden border aspect-[16/8] sm:aspect-[16/6] flex items-center justify-center group"
      style={{ borderColor: `${item.hex}35`, background: `linear-gradient(135deg, ${item.hex}10 0%, rgba(0,0,0,0) 60%), var(--bg-secondary)` }}>
      <div className="absolute inset-0 opacity-[0.05]"
        style={{ backgroundImage: `linear-gradient(${item.hex} 1px, transparent 1px), linear-gradient(90deg, ${item.hex} 1px, transparent 1px)`, backgroundSize: '28px 28px' }} />
      <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono font-black select-none pointer-events-none"
        style={{ fontSize: 'clamp(52px, 9vw, 100px)', color: item.hex, opacity: 0.07, lineHeight: 1 }}>{item.id}</span>
      <div className="relative z-10 w-full overflow-x-auto overflow-y-hidden px-3 sm:px-5 py-3">
        <AttackFlowDiagram steps={item.attackSteps} hex={item.hex} />
      </div>
      <div className="absolute top-3 left-3 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest border"
        style={{ color: item.hex, borderColor: `${item.hex}40`, background: `${item.hex}18` }}>{item.severity}</div>
      <div className="absolute bottom-3 right-12 w-8 h-8 border flex items-center justify-center"
        style={{ borderColor: `${item.hex}40`, background: `${item.hex}18` }}><Icon size={14} style={{ color: item.hex }} /></div>
      <button type="button" onClick={onZoom}
        className="absolute bottom-3 right-3 w-8 h-8 border flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200"
        style={{ borderColor: `${item.hex}60`, background: `${item.hex}25`, color: item.hex }} aria-label="View full diagram">
        <ZoomIn size={13} />
      </button>
    </div>
  )
}

function DiagramModal({ item, onClose }) {
  if (!item) return null
  const Icon = item.icon
  return (
    <div className="fixed inset-0 z-[200] bg-black/92 flex items-center justify-center p-4" onClick={onClose}>
      <button type="button" onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 border border-white/20 text-white flex items-center justify-center hover:border-accent/60 hover:text-accent transition-all z-10"
        aria-label="Close"><X size={18} /></button>
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 border flex items-center justify-center"
            style={{ borderColor: `${item.hex}50`, background: `${item.hex}18` }}><Icon size={20} style={{ color: item.hex }} /></div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: item.hex }}>{item.rank}</p>
            <h3 className="font-mono font-black text-xl text-white">{item.title}</h3>
          </div>
          <div className="ml-auto px-3 py-1 border font-mono text-xs uppercase tracking-widest"
            style={{ color: item.hex, borderColor: `${item.hex}40`, background: `${item.hex}15` }}>{item.severity}</div>
        </div>
        <div className="relative overflow-x-auto overflow-y-hidden border p-4 sm:p-6"
          style={{ borderColor: `${item.hex}30`, background: `linear-gradient(135deg, ${item.hex}08, rgba(0,0,0,0) 60%), rgba(0,0,0,0.6)` }}>
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: `linear-gradient(${item.hex} 1px, transparent 1px), linear-gradient(90deg, ${item.hex} 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />
          <div className="relative z-10"><AttackFlowDiagram steps={item.attackSteps} hex={item.hex} large /></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          {item.attackSteps.map((step, i) => (
            <div key={step.label} className="border p-3" style={{ borderColor: `${item.hex}25`, background: `${item.hex}08` }}>
              <p className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: item.hex }}>Step {String(i + 1).padStart(2, '0')}</p>
              <p className="font-mono font-bold text-sm text-white">{step.label}</p>
              <p className="font-mono text-xs mt-1" style={{ color: `${item.hex}cc` }}>{step.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function OwaspCard({ item, defaultOpen = false, onZoom }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div id={item.id} className="border bg-[var(--bg-primary)] transition-all duration-300"
      style={{ borderColor: open ? `${item.hex}35` : 'var(--border)' }}>
      <AttackVisualCard item={item} onZoom={() => onZoom(item)} />
      <button type="button"
        className="w-full flex items-start gap-4 sm:gap-5 px-4 sm:px-6 py-5 text-left hover:bg-[var(--bg-secondary)] transition-colors duration-200"
        onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <div className="flex-1 min-w-0">
          <span className="font-mono text-[10px] uppercase tracking-widest block mb-1.5" style={{ color: item.hex }}>{item.rank}</span>
          <h3 className="font-mono font-black text-lg sm:text-xl text-[var(--text-primary)] leading-snug">{item.title}</h3>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] mt-1 leading-relaxed">{item.short}</p>
        </div>
        <div className="shrink-0 mt-1" style={{ color: item.hex }}>
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>
      {open && (
        <div className="px-4 sm:px-6 pb-6 grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 border-t" style={{ borderColor: `${item.hex}20` }}>
          <div className="lg:col-span-2 pt-5 sm:pt-6">
            <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] mb-3">Description</p>
            <p className="text-base text-[var(--text-secondary)] leading-relaxed">{item.description}</p>
            <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] mt-6 mb-3">Real-World Examples</p>
            <ul className="space-y-2">
              {item.examples.map((ex) => (
                <li key={ex} className="flex items-start gap-3 text-sm sm:text-base text-[var(--text-secondary)]">
                  <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: item.hex }} />{ex}
                </li>
              ))}
            </ul>
          </div>
          <div className="pt-1 sm:pt-6">
            <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] mb-3">CWE References</p>
            <div className="flex flex-wrap gap-2">
              {item.cwe.map((cwe) => (
                <a key={cwe} href={`https://cwe.mitre.org/data/definitions/${cwe.replace('CWE-', '')}.html`}
                  target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border font-mono text-sm hover:opacity-80 transition-opacity"
                  style={{ color: item.hex, borderColor: `${item.hex}40`, background: `${item.hex}10` }}>
                  {cwe} <ExternalLink size={10} />
                </a>
              ))}
            </div>
            <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] mt-6 mb-3">Train Against This</p>
            <Link to="/register"
              className="inline-flex items-center gap-2 px-4 py-2.5 border font-mono text-xs uppercase tracking-widest hover:opacity-80 transition-opacity"
              style={{ color: item.hex, borderColor: `${item.hex}40`, background: `${item.hex}10` }}>
              Start Training <ArrowLeft size={12} className="rotate-180" />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default function OwaspPage() {
  const [modalItem, setModalItem] = useState(null)
  const openModal = useCallback((item) => setModalItem(item), [])
  const closeModal = useCallback(() => setModalItem(null), [])
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <section className="py-20 sm:py-24 px-4 sm:px-6 border-b border-accent/10 relative overflow-hidden">
        <img
          src="/images/how-it-works-section/Findings-Identified.webp"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-[0.10] pointer-events-none"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 right-0 w-96 h-96 rounded-full bg-red-500/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-accent/5 blur-3xl" />
        </div>
        <div className="absolute inset-0 bg-[var(--bg-primary)]/70 pointer-events-none" />
        <div className="max-w-4xl mx-auto relative">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] hover:text-accent transition-colors mb-10 uppercase tracking-widest">
            <ArrowLeft size={13} /> Back to Home
          </Link>
          <p className="font-mono text-accent text-xs uppercase tracking-widest mb-4">// security fundamentals</p>
          <h1 className="font-mono font-black text-4xl sm:text-5xl md:text-6xl text-[var(--text-primary)] leading-tight mb-6">OWASP Top 10</h1>
          <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed max-w-3xl mb-8">
            The ten most critical web application security risks. Each card has a visual attack flow diagram — hover and click the zoom icon to view it full size.
          </p>
          <div className="flex flex-wrap gap-6 text-xs font-mono text-[var(--text-muted)] uppercase tracking-widest">
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-400" /> Critical</span>
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-orange-400" /> High</span>
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-400" /> Medium</span>
            <span className="ml-auto">2021 Edition</span>
          </div>
        </div>
      </section>
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <StaggerReveal className="grid grid-cols-1 lg:grid-cols-2 gap-6" stagger={80} variant="up">
            {OWASP_TOP_10.map((item, i) => (
              <OwaspCard key={item.id} item={item} defaultOpen={i === 0} onZoom={openModal} />
            ))}
          </StaggerReveal>
        </div>
      </section>
      <section className="py-20 px-4 sm:px-6 border-t border-accent/10">
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-mono text-accent text-xs uppercase tracking-widest mb-4">// train against every vector</p>
          <h2 className="font-mono font-black text-3xl sm:text-4xl text-[var(--text-primary)] mb-4">Know the risks. Exploit them first.</h2>
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-8 max-w-lg mx-auto">
            HSOCIETY bootcamps are built around real attack patterns. Train on live environments, earn CP, and become the operator who finds these before the attacker does.
          </p>
          <Link to="/register" className="btn-primary inline-flex items-center gap-2 px-8 py-4">
            Start Training <ArrowLeft size={16} className="rotate-180" />
          </Link>
        </div>
      </section>
      <DiagramModal item={modalItem} onClose={closeModal} />
    </div>
  )
}
