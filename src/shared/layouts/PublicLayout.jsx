import { Outlet } from 'react-router-dom'
import { PublicNavbar } from '@/features/marketing/components/layout/PublicNavbar'
import { PublicFooter } from '@/features/marketing/components/layout/PublicFooter'

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <PublicNavbar />

      <main className="pt-[72px]">
        <Outlet />
      </main>

      <PublicFooter />
    </div>
  )
}
