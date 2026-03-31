import { Link } from 'react-router-dom'
import { Shield } from 'lucide-react'

export function RegisterHeader() {
  return (
    <div className="text-center mb-8">
      <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
        <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center">
          <Shield size={20} className="text-accent" />
        </div>
        <span className="font-display font-bold text-2xl">H<span className="text-accent">SOCIETY</span></span>
      </Link>
      <p className="font-mono text-accent text-xs uppercase tracking-widest mb-2">// create account</p>
      <h1 className="font-display font-bold text-3xl text-[var(--text-primary)]">Join the Platform</h1>
      <p className="text-[var(--text-secondary)] text-sm mt-2">Begin your offensive security journey.</p>
    </div>
  )
}
