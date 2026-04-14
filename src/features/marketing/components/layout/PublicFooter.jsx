import { Link, useNavigate, useLocation } from 'react-router-dom'
import { SOCIAL_MEDIA } from '@/features/marketing/data/socialMedia'

const FOOTER_LINKS = [
  { label: 'Services', to: '/services' },
  { label: 'Contact', to: '/contact' },
  { label: 'Terms', to: '/terms' },
  { label: 'Privacy', to: '/privacy' },
]

const PLATFORM_LINKS = [
  { label: 'Bootcamps', section: 'bootcamps' },
  { label: 'Rooms', section: 'rooms' },
  { label: 'Marketplace', section: 'marketplace' },
]

export function PublicFooter() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleSectionClick = (e, section) => {
    e.preventDefault()
    const scrollTo = () => {
      const el = document.getElementById(section)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    if (location.pathname === '/') {
      scrollTo()
    } else {
      navigate('/')
      setTimeout(scrollTo, 300)
    }
  }
  return (
    <footer className="mt-16 overflow-hidden relative bg-[var(--bg-primary)] border-t border-[var(--border)]">
      <div className="cube-noise" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 relative">

        {/* Top: tagline + links */}
        <div className="flex flex-col gap-8 lg:flex-row lg:justify-between lg:items-start">

          {/* Brand tagline */}
          <p className="text-sm text-[var(--text-secondary)] font-display leading-relaxed text-center lg:text-left lg:max-w-xs">
            Train Like a Hacker. Become a Hacker.
          </p>

          {/* Link columns */}
          <div className="grid grid-cols-3 gap-6 sm:gap-10">
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
              {PLATFORM_LINKS.map(({ label, section }) => (
                <a
                  key={label}
                  href={`/#${section}`}
                  onClick={(e) => handleSectionClick(e, section)}
                  className="block text-sm text-[var(--text-secondary)] hover:text-accent transition-colors cursor-pointer"
                >
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
                    <Icon size={14} />
                    <span className="hidden sm:inline">{label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: copyright */}
        <p className="mt-8 text-center text-xs font-mono text-[var(--text-muted)]">© 2026 HSOCIETY OFFSEC</p>
      </div>

      {/* Big logo watermark */}
      <div className="w-full px-4 pb-4 flex justify-center overflow-hidden">
        <div className="w-full h-[14vh] sm:h-[20vh] lg:h-[26vh] flex items-center justify-center overflow-hidden">
          <img
            src="/HSOCIETY_LOGO.webp"
            alt="HSOCIETY"
            className="w-[90vw] max-w-[1800px] opacity-60 h-auto object-contain"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </footer>
  )
}
