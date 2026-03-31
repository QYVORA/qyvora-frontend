import { Link } from 'react-router-dom'
import { SOCIAL_MEDIA } from '@/features/marketing/data/socialMedia'

export function PublicFooter() {
  return (
    <footer className="mt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <p className="text-[var(--text-muted)] text-sm font-mono">© 2026 HSOCIETY. Train Like a Hacker. Become a Hacker.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-[var(--text-muted)]">
          <div className="flex items-center gap-3">
            {SOCIAL_MEDIA.map(({ key, label, url, icon: Icon }) => (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="w-9 h-9 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-accent hover:border-accent/50 transition-colors"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
          <div className="flex gap-4 text-sm text-[var(--text-muted)]">
            <Link to="/terms" className="hover:text-accent transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-accent transition-colors">Privacy</Link>
          </div>
        </div>
      </div>
      <div>
        <div className="max-w-7xl mx-auto px-6 py-10">
          <p className="font-display font-black text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] tracking-tight leading-[0.8] text-center text-[var(--text-primary)]/15">
            <span className="text-accent/70">H</span>
            <span className="text-[var(--text-primary)]/20">SOCIETY</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
