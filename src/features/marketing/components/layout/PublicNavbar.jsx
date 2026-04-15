import { useState } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useAuth } from '@/core/contexts/AuthContext'
import { Logo } from '@/shared/components/brand/Logo'

const NAV_LINKS = [
  { href: '/', label: 'Home', exact: true },
  { href: '/#bootcamps', label: 'Bootcamps', section: 'bootcamps' },
  { href: '/#rooms', label: 'Rooms', section: 'rooms' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contact' },
]

export function PublicNavbar() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSectionClick = (e, section, close = false) => {
    e.preventDefault()
    if (close) setMenuOpen(false)
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
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border)]/60 bg-[var(--bg-primary)]/90 backdrop-blur-md shadow-[0_4px_24px_-8px_rgba(0,0,0,0.25)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between" style={{ height: '72px' }}>

        {/* Logo */}
        <Link to="/" className="flex items-center shrink-0">
          <Logo size="nav" className="w-auto" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label, section }) => (
            section ? (
              <a
                key={label}
                href={href}
                onClick={(e) => handleSectionClick(e, section)}
                className="px-3 py-2 text-sm font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-all cursor-pointer"
              >
                {label}
              </a>
            ) : (
              <NavLink
                key={label}
                to={href}
                end={href === '/'}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-mono transition-all ${
                    isActive ? 'text-accent bg-accent/8' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                  }`
                }
              >
                {label}
              </NavLink>
            )
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          {!user ? (
            <>
              <Link to="/login" className="px-4 py-2 text-sm font-mono text-[var(--text-secondary)] border border-[var(--border)] hover:border-accent/40 hover:text-[var(--text-primary)] transition-all">
                Log in
              </Link>
              <Link to="/register" className="btn-primary text-sm">
                Start Training
              </Link>
            </>
          ) : (
            <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="btn-primary text-sm">
              Dashboard
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden flex items-center justify-center w-10 h-10 border border-[var(--border)] text-[var(--text-secondary)] hover:border-accent/40 hover:text-accent transition-all"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--bg-primary)] px-4 py-4 space-y-1 shadow-xl">
          {NAV_LINKS.map(({ href, label, section }) => (
            section ? (
              <a
                key={label}
                href={href}
                onClick={(e) => handleSectionClick(e, section, true)}
                className="block px-3 py-3 text-sm font-mono text-[var(--text-secondary)] hover:text-accent hover:bg-[var(--bg-secondary)] transition-all cursor-pointer"
              >
                {label}
              </a>
            ) : (
              <NavLink
                key={label}
                to={href}
                end={href === '/'}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-3 text-sm font-mono transition-all ${
                    isActive ? 'text-accent bg-accent/8' : 'text-[var(--text-secondary)] hover:text-accent hover:bg-[var(--bg-secondary)]'
                  }`
                }
              >
                {label}
              </NavLink>
            )
          ))}
          <div className="pt-3 space-y-2 border-t border-[var(--border)] mt-2">
            {!user ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block w-full text-center px-4 py-3 text-sm font-mono border border-[var(--border)] text-[var(--text-secondary)] hover:border-accent/40 transition-all"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="block w-full btn-primary text-center py-3 font-mono"
                >
                  Start Training
                </Link>
              </>
            ) : (
              <Link
                to={user.role === 'admin' ? '/admin' : '/dashboard'}
                onClick={() => setMenuOpen(false)}
                className="block w-full btn-primary text-center py-3 font-mono"
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
