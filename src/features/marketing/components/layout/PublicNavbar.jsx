import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown, BookOpen, Target, ShoppingBag, Users, FileText, ArrowRight, Globe } from 'lucide-react'
import { useAuth } from '@/core/contexts/AuthContext'
import { Logo } from '@/shared/components/brand/Logo'

// Nav structure — items with `children` get a dropdown
const NAV_ITEMS = [
  {
    label: 'Platform',
    children: [
      { label: 'Bootcamps', href: '/#bootcamps', section: 'bootcamps', icon: BookOpen, desc: 'Phase-based offensive security tracks' },
      { label: 'Rooms', href: '/#rooms', section: 'rooms', icon: Target, desc: 'Self-paced hands-on labs' },
      { label: 'Marketplace', href: '/#marketplace', section: 'marketplace', icon: ShoppingBag, desc: 'Zero-Day Market — spend your CP' },
      { label: 'Zero-Day Market', href: '/zero-day-market', icon: ArrowRight, desc: 'Browse beginner resources & guides' },
      { label: 'Domain Recon', href: '/recon', icon: Globe, desc: 'Live DNS & IP geolocation globe' },
      { label: 'Field Playbooks', href: '/playbooks', icon: FileText, desc: 'Step-by-step hacking walkthroughs' },
    ],
  },
  { label: 'Services', href: '/services' },
  {
    label: 'Company',
    children: [
      { label: 'Team', href: '/team', icon: Users, desc: 'Meet the operators behind HSOCIETY' },
      { label: 'Blog', href: '/blog', icon: FileText, desc: 'Guides, updates, and intel drops' },
      { label: 'Contact', href: '/contact', icon: ArrowRight, desc: 'Get in touch or request a quote' },
    ],
  },
]

function DropdownMenu({ items, onClose, onSectionClick }) {
  return (
    <div
      className="absolute top-full left-0 mt-0 w-80 bg-[var(--bg-primary)] border border-[var(--border)] shadow-2xl shadow-black/40 z-50"
      style={{ animation: 'dropdown-in 0.18s cubic-bezier(0.22,1,0.36,1) both' }}
    >
      {items.map((item) => (
        item.section ? (
          <a
            key={item.label}
            href={item.href}
            onClick={(e) => { onSectionClick(e, item.section); onClose() }}
            className="flex items-start gap-3 px-4 py-3 border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer group"
          >
            <div className="w-7 h-7 border border-accent/30 bg-accent/8 flex items-center justify-center text-accent shrink-0 mt-0.5">
              <item.icon size={13} />
            </div>
            <div>
              <p className="font-mono text-sm text-[var(--text-primary)] group-hover:text-accent transition-colors">{item.label}</p>
              <p className="font-mono text-[10px] text-[var(--text-muted)] mt-0.5 leading-snug">{item.desc}</p>
            </div>
          </a>
        ) : (
          <Link
            key={item.label}
            to={item.href}
            onClick={onClose}
            className="flex items-start gap-3 px-4 py-3 border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--bg-secondary)] transition-colors group"
          >
            <div className="w-7 h-7 border border-accent/30 bg-accent/8 flex items-center justify-center text-accent shrink-0 mt-0.5">
              <item.icon size={13} />
            </div>
            <div>
              <p className="font-mono text-sm text-[var(--text-primary)] group-hover:text-accent transition-colors">{item.label}</p>
              <p className="font-mono text-[10px] text-[var(--text-muted)] mt-0.5 leading-snug">{item.desc}</p>
            </div>
          </Link>
        )
      ))}
    </div>
  )
}

export function PublicNavbar() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const [mobileExpanded, setMobileExpanded] = useState(null)
  const closeTimer = useRef(null)

  const handleSectionClick = (e, section) => {
    e.preventDefault()
    const scrollTo = () => {
      const el = document.getElementById(section)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    if (location.pathname === '/') { scrollTo() }
    else { navigate('/'); setTimeout(scrollTo, 300) }
  }

  const openMenu = (label) => {
    clearTimeout(closeTimer.current)
    setOpenDropdown(label)
  }

  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 120)
  }

  useEffect(() => () => clearTimeout(closeTimer.current), [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border)]/60 bg-[var(--bg-primary)]/95 backdrop-blur-md shadow-[0_4px_24px_-8px_rgba(0,0,0,0.3)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between" style={{ height: '72px' }}>

        {/* Logo */}
        <Link to="/" className="flex items-center shrink-0" onClick={() => setMenuOpen(false)}>
          <Logo size="nav" className="w-auto" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-0">
          {NAV_ITEMS.map((item) => (
            item.children ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => openMenu(item.label)}
                onMouseLeave={scheduleClose}
              >
                <button
                  type="button"
                  className={`flex items-center gap-1 px-3 py-2 text-sm font-mono transition-all ${openDropdown === item.label ? 'text-accent' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                >
                  {item.label}
                  <ChevronDown size={13} className={`transition-transform duration-200 ${openDropdown === item.label ? 'rotate-180 text-accent' : ''}`} />
                </button>
                {openDropdown === item.label && (
                  <DropdownMenu
                    items={item.children}
                    onClose={() => setOpenDropdown(null)}
                    onSectionClick={handleSectionClick}
                  />
                )}
              </div>
            ) : (
              <NavLink
                key={item.label}
                to={item.href}
                end={item.href === '/'}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-mono transition-all ${isActive ? 'text-accent' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`
                }
              >
                {item.label}
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
              <Link to="/register" className="btn-primary text-sm">Start Training</Link>
            </>
          ) : (
            <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="btn-primary text-sm">Dashboard</Link>
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
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--bg-primary)] shadow-xl max-h-[80vh] overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            item.children ? (
              <div key={item.label} className="border-b border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-mono text-[var(--text-secondary)] hover:text-accent hover:bg-[var(--bg-secondary)] transition-all"
                >
                  {item.label}
                  <ChevronDown size={14} className={`transition-transform duration-200 ${mobileExpanded === item.label ? 'rotate-180 text-accent' : ''}`} />
                </button>
                {mobileExpanded === item.label && (
                  <div className="border-t border-[var(--border)] bg-[var(--bg-secondary)]">
                    {item.children.map((child) => (
                      child.section ? (
                        <a
                          key={child.label}
                          href={child.href}
                          onClick={(e) => { handleSectionClick(e, child.section); setMenuOpen(false) }}
                          className="flex items-center gap-3 px-6 py-3 text-sm font-mono text-[var(--text-secondary)] hover:text-accent border-b border-[var(--border)] last:border-b-0 transition-colors cursor-pointer"
                        >
                          <child.icon size={13} className="text-accent shrink-0" />
                          {child.label}
                        </a>
                      ) : (
                        <Link
                          key={child.label}
                          to={child.href}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-6 py-3 text-sm font-mono text-[var(--text-secondary)] hover:text-accent border-b border-[var(--border)] last:border-b-0 transition-colors"
                        >
                          <child.icon size={13} className="text-accent shrink-0" />
                          {child.label}
                        </Link>
                      )
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                key={item.label}
                to={item.href}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 text-sm font-mono border-b border-[var(--border)] transition-all ${isActive ? 'text-accent bg-accent/8' : 'text-[var(--text-secondary)] hover:text-accent hover:bg-[var(--bg-secondary)]'}`
                }
              >
                {item.label}
              </NavLink>
            )
          ))}
          <div className="p-4 space-y-2">
            {!user ? (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="block w-full text-center px-4 py-3 text-sm font-mono border border-[var(--border)] text-[var(--text-secondary)] hover:border-accent/40 transition-all">Log in</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="block w-full btn-primary text-center py-3 font-mono">Start Training</Link>
              </>
            ) : (
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} onClick={() => setMenuOpen(false)} className="block w-full btn-primary text-center py-3 font-mono">Dashboard</Link>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes dropdown-in {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </nav>
  )
}
