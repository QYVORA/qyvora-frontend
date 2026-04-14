import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import { PublicNavbar } from '@/features/marketing/components/layout/PublicNavbar'
import { PublicFooter } from '@/features/marketing/components/layout/PublicFooter'

export default function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <PublicNavbar
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen(o => !o)}
      />

      <main className="pt-[72px]">
        <Outlet />
      </main>

      <PublicFooter />
    </div>
  )
}
