import { Link } from 'react-router-dom'
import { Terminal, Scan, Shield, Bug, Search, Database, ArrowUp, Flag, Lock, ArrowRight } from 'lucide-react'
import { useSEO } from '@/core/utils/useSEO'

const ICON_MAP = { Terminal, Scan, Shield, Bug, Search, Database, ArrowUp, Flag, Lock }

const PRODUCTS = [
  { id: '1', title: 'Linux Command Line Cheat Sheet', category: 'Cheat Sheet', price: 50, desc: 'Every essential Linux command a beginner needs — file system, permissions, networking, and process management.', icon: 'Terminal', tag: 'Beginner' },
  { id: '2', title: 'Nmap Scanning Guide', category: 'Guide', price: 75, desc: 'Step-by-step Nmap usage from basic host discovery to advanced service enumeration. Includes common flags and output examples.', icon: 'Scan', tag: 'Beginner' },
  { id: '3', title: 'OWASP Top 10 Breakdown', category: 'Guide', price: 100, desc: 'Plain-English breakdown of the OWASP Top 10 web vulnerabilities with real examples and how to test for each one.', icon: 'Shield', tag: 'Beginner' },
  { id: '4', title: 'Burp Suite Starter Pack', category: 'Cheat Sheet', price: 80, desc: 'Quick-reference card for Burp Suite Community — intercepting requests, repeater, intruder basics, and common workflows.', icon: 'Bug', tag: 'Beginner' },
  { id: '5', title: 'Recon Methodology Playbook', category: 'Playbook', price: 120, desc: 'A structured recon workflow covering passive and active reconnaissance — OSINT, subdomain enum, port scanning, and fingerprinting.', icon: 'Search', tag: 'Beginner' },
  { id: '6', title: 'SQL Injection Cheat Sheet', category: 'Cheat Sheet', price: 60, desc: 'Common SQLi payloads, bypass techniques, and detection methods. Covers error-based, blind, and time-based injection.', icon: 'Database', tag: 'Beginner' },
  { id: '7', title: 'Privilege Escalation Checklist', category: 'Checklist', price: 150, desc: 'Linux and Windows privesc checklist — SUID binaries, cron jobs, weak permissions, kernel exploits, and more.', icon: 'ArrowUp', tag: 'Intermediate' },
  { id: '8', title: 'CTF Starter Toolkit', category: 'Toolkit', price: 90, desc: 'Everything a beginner needs to start CTFs — tool list, common challenge types, hints for web, crypto, forensics, and pwn.', icon: 'Flag', tag: 'Beginner' },
]

const HOW_IT_WORKS = [
  { step: '01', label: 'Enroll', desc: 'Sign up and join the HSOCIETY training platform for free.' },
  { step: '02', label: 'Train & Earn CP', desc: 'Complete modules, rooms, and challenges to earn Cyber Points.' },
  { step: '03', label: 'Spend', desc: 'Unlock beginner resources, cheat sheets, and guides in the market.' },
]

function ProductCard({ product }) {
  const Icon = ICON_MAP[product.icon] || Lock
  const isIntermediate = product.tag === 'Intermediate'
  return (
    <div className="card flex flex-col gap-4 p-5 hover:border-accent/50 hover:-translate-y-1 transition-all duration-200">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 border border-[var(--border)] text-[var(--text-muted)]">
          {product.category}
        </span>
        <span className={`font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 border ${isIntermediate ? 'border-accent text-accent' : 'border-accent/30 text-[var(--text-muted)]'}`}>
          {product.tag}
        </span>
      </div>
      <div className="w-10 h-10 border border-accent/30 bg-accent/8 flex items-center justify-center shrink-0">
        <Icon size={18} className="text-accent" />
      </div>
      <div className="flex-1 space-y-2">
        <h3 className="font-mono font-bold text-base text-[var(--text-primary)] leading-snug">{product.title}</h3>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{product.desc}</p>
      </div>
      <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between gap-3">
        <span className="font-mono text-accent font-bold text-base">{product.price} CP</span>
        <Link to="/register" className="btn-primary inline-flex items-center gap-1.5 text-xs px-3 py-1.5">
          <Lock size={11} /> Unlock with CP
        </Link>
      </div>
    </div>
  )
}

export default function ZeroDayMarketPage() {
  useSEO({
    title: 'Zero-Day Market',
    description: 'Earn Cyber Points through security training and spend them on beginner resources — cheat sheets, guides, playbooks, and toolkits.',
    path: '/zero-day-market',
  })

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <section className="relative py-32 px-4 sm:px-6 border-b border-[var(--border)] overflow-hidden">
        <img src="/images/cp-card-background/zeroday-maket-background.webp" alt="" className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none" loading="eager" decoding="async" />
        <div className="absolute inset-0 bg-[var(--bg-primary)]/75 pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p className="font-mono text-accent text-xs uppercase tracking-widest mb-3">// zero-day market</p>
          <h1 className="font-mono font-black text-4xl md:text-6xl text-[var(--text-primary)] mb-5 leading-tight">Zero-Day Market</h1>
          <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
            Earn Cyber Points by completing training modules and challenges. Spend them on beginner security resources built for operators just getting started.
          </p>
        </div>
      </section>

      <section className="border-b border-[var(--border)] py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <p className="font-mono text-accent text-xs uppercase tracking-widest mb-8 text-center">// how cp works</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[var(--border)]">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="flex flex-col gap-2 px-6 py-6 sm:py-4">
                <span className="font-mono text-accent text-xs tracking-widest">{item.step}</span>
                <span className="font-mono font-bold text-base text-[var(--text-primary)]">{item.label}</span>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--text-muted)]">// available resources</p>
            <span className="font-mono text-xs text-[var(--text-muted)]">{PRODUCTS.length} items</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 px-4 sm:px-6 border-t border-[var(--border)] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        <div className="relative z-10 max-w-2xl mx-auto text-center space-y-5">
          <p className="font-mono text-accent text-xs uppercase tracking-widest">// start earning</p>
          <h2 className="font-mono font-bold text-3xl md:text-4xl text-[var(--text-primary)]">Ready to earn your first CP?</h2>
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
            Create a free account, enroll in a training module, and start building your CP balance. Every resource in the market is unlockable through training.
          </p>
          <Link to="/register" className="btn-primary inline-flex items-center gap-2 group px-8 py-3 text-sm">
            Create Free Account <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  )
}
