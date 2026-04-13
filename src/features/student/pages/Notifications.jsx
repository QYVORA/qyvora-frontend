import { NotificationsList } from '@/shared/components/NotificationsList'

export default function NotificationsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <NotificationsList
        subtitle="Updates and alerts tied to your operator account."
      />
    </div>
  )
}
