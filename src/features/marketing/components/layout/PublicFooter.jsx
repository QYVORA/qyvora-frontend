import { Link } from 'react-router-dom'
import { SOCIAL_MEDIA } from '@/features/marketing/data/socialMedia'
import { Logo } from '@/shared/components/brand/Logo'

const FOOTER_LINKS = [
  { label: 'Services', to: '/services' },
  { label: 'Contact', to: '/contact' },
  { label: 'Terms', to: '/terms' },
  { label: 'Privacy', to: '/privacy' },
]

export function PublicFooter() {
  return (
    <footer className="mt-20 overflow-hidden relative bg-[var(--bg-primary)] border-t border-[var(--border)]">
      <div className="cube-noise" />

      <div className="max-w-7xl mx-auto px-6 py-12 relative">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-10">

          {/* Brand */}
          <div className="flex flex-col gap-3">
            <Logo size="md" className="h-9" />
            <p className="text-sm text-[var(--text-secondary)] font-display max-w-xs leading-relaxed">
              Train Like a Hacker. Become a Hacker.
            </p>
            <p className="text-xs font-mono text-[var(--text-muted)]">© 2026 HSOCIETY OFFSEC</p>
          </div>

          {/* Links */}
          <div className="flex flex-col sm:flex-row gap-10">
            <div className="space-y-2">
              <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)] mb-3">Company</p>
              {FOOTER_LINKS.map(({ label, to }) => (
                <Link key={label} to={to} className="block text-sm text-[var(--text-secondary)] hover:text-accent transition-colors">
                  {label}
                </Link>
              ))}
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)] mb-3">Platform</p>
              {[['/#bootcamps', 'Bootcamps'], ['/#rooms', 'Rooms'], ['/#marketplace', 'Marketplace']].map(([href, label]) => (
                <a key={label} href={href} className="block text-sm text-[var(--text-secondary)] hover:text-accent transition-colors">
                  {label}
                </a>
              ))}
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)] mb-3">Follow</p>
              <div className="flex flex-col gap-2">
                {SOCIAL_MEDIA.map(({ key, label, url, icon: Icon }) => (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-accent transition-colors"
                  >
                    <Icon size={14} /> {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Big logo watermark */}
      <div className="max-w-7xl mx-auto px-6 pb-6 flex justify-center overflow-hidden">
        <div className="w-full h-[18vh] sm:h-[22vh] lg:h-[28vh] flex items-center justify-center overflow-hidden">
          <img
            src="/HSOCIETY_LOGO.webp"
            alt="HSOCIETY"
            className="w-[80vw] max-w-[1800px] opacity-60 h-auto object-contain"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </footer>
  )
}
