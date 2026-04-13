import { NotificationsList } from '@/shared/components/NotificationsList'

export default function AdminNotifications() {
  return (
    <div className="max-w-5xl mx-auto">
      <NotificationsList
        kicker="// admin inbox"
        subtitle="System updates and alerts across the platform."
      />
    </div>
  )
}
