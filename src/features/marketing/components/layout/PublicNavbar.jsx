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

export function PublicNavbar({ menuOpen, onToggleMenu }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSectionClick = (e, section, onClose) => {
    e.preventDefault()
    if (onClose) onClose()
    const scrollTo = () => {
      const el = document.getElementById(section)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    if (location.pathname === '/') {
      scrollTo()
    } else {
      navigate('/')
      // wait for landing page to mount then scroll
      setTimeout(scrollTo, 300)
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border)]/60 bg-[var(--bg-primary)]/90 backdrop-blur-md shadow-[0_4px_24px_-8px_rgba(0,0,0,0.25)]">
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between" style={{ height: '72px' }}>

        {/* Logo */}
        <Link to="/" className="flex items-center shrink-0">
          <Logo size="nav" className="h-16 w-auto" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label, section }) => (
            section ? (
              <a
                key={label}
                href={href}
                onClick={(e) => handleSectionClick(e, section)}
                className="px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg transition-all cursor-pointer"
              >
                {label}
              </a>
            ) : (
              <NavLink
                key={label}
                to={href}
                end={href === '/'}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                    isActive
                      ? 'text-accent bg-accent/8'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
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
              <Link to="/login" className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] border border-[var(--border)] rounded-lg hover:border-accent/40 hover:text-[var(--text-primary)] transition-all">
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
          className="md:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors"
          onClick={onToggleMenu}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--bg-primary)] px-6 py-5 space-y-1 shadow-xl">
          {NAV_LINKS.map(({ href, label, section }) => (
            section ? (
              <a
                key={label}
                href={href}
                onClick={(e) => handleSectionClick(e, section, onToggleMenu)}
                className="block px-3 py-3 text-base font-medium text-[var(--text-secondary)] hover:text-accent hover:bg-[var(--bg-secondary)] rounded-lg transition-all cursor-pointer"
              >
                {label}
              </a>
            ) : (
              <NavLink
                key={label}
                to={href}
                end={href === '/'}
                onClick={onToggleMenu}
                className={({ isActive }) =>
                  `block px-3 py-3 text-base font-medium rounded-lg transition-all ${
                    isActive ? 'text-accent bg-accent/8' : 'text-[var(--text-secondary)] hover:text-accent hover:bg-[var(--bg-secondary)]'
                  }`
                }
              >
                {label}
              </NavLink>
            )
          ))}
          <div className="pt-3 space-y-2 border-t border-[var(--border)] mt-3">
            {!user ? (
              <>
                <Link to="/login" onClick={onToggleMenu} className="block w-full text-center px-4 py-3 text-sm font-semibold border border-[var(--border)] rounded-xl text-[var(--text-secondary)] hover:border-accent/40 transition-all">
                  Log in
                </Link>
                <Link to="/register" onClick={onToggleMenu} className="block w-full btn-primary text-center py-3 rounded-xl font-bold shadow-lg shadow-accent/20">
                  Start Training
                </Link>
              </>
            ) : (
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} onClick={onToggleMenu} className="block w-full btn-primary text-center py-3 rounded-xl font-bold">
                Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
