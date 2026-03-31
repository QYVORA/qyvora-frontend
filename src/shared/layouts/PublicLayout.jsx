import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import { useTheme } from '@/core/contexts/ThemeContext'
import { PublicNavbar } from '@/features/marketing/components/layout/PublicNavbar'
import { PublicFooter } from '@/features/marketing/components/layout/PublicFooter'

export default function PublicLayout() {
  const { isDark, toggleTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <PublicNavbar
        isDark={isDark}
        onToggleTheme={toggleTheme}
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen(o => !o)}
      />

      <main className="pt-16">
        <Outlet />
      </main>

      <PublicFooter />
    </div>
  )
}
