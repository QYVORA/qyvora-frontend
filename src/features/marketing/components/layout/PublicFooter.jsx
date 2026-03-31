import { Shield } from 'lucide-react'
import { SOCIAL_MEDIA } from '@/features/marketing/data/socialMedia'

export function PublicFooter() {
  return (
    <footer className="border-t border-[var(--border)] mt-20">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <Shield size={16} className="text-accent" />
          <span className="font-display font-bold">H<span className="text-accent">SOCIETY</span></span>
        </div>
        <p className="text-[var(--text-muted)] text-sm font-mono">© 2024 HSOCIETY. For educational purposes only.</p>
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
            <a href="#" className="hover:text-accent transition-colors">Terms</a>
            <a href="#" className="hover:text-accent transition-colors">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
