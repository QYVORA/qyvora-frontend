import { Link } from 'react-router-dom'
import { SOCIAL_MEDIA } from '@/features/marketing/data/socialMedia'
import { Logo } from '@/shared/components/brand/Logo'

export function PublicFooter() {
  return (
    <footer className="mt-20 overflow-hidden relative bg-[var(--bg-primary)] border-t border-[var(--border)]">
      <div className="cube-noise" />
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row justify-between items-center gap-8 relative">
        <div className="flex flex-col items-center lg:items-start gap-2 text-center lg:text-left">
          <p className="text-[var(--text-muted)] text-sm font-mono">© 2026 HSOCIETY</p>
          <p className="text-[var(--text-secondary)] text-base font-display">Train Like a Hacker. Become a Hacker.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-5 text-sm text-[var(--text-muted)]">
          <div className="flex items-center gap-3">
            {SOCIAL_MEDIA.map(({ key, label, url, icon: Icon }) => (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="w-10 h-10 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-accent hover:border-accent/50 transition-colors"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
          <div className="flex gap-5 text-sm text-[var(--text-muted)]">
            <Link to="/terms" className="hover:text-accent transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-accent transition-colors">Privacy</Link>
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="max-w-7xl mx-auto px-6 pb-6 flex justify-center overflow-hidden">
          <div className="w-full h-[18vh] sm:h-[24vh] lg:h-[30vh] flex items-center justify-center overflow-hidden">
            <img
              src="/HSOCIETY_LOGO.png"
              alt="HSOCIETY"
              className="w-[80vw] max-w-[1800px] opacity-70 h-auto object-contain"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </footer>
  )
}
