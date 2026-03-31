export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {Icon && (
        <div className="p-4 rounded-2xl bg-[var(--bg-card-hover)] mb-4">
          <Icon size={32} className="text-[var(--text-muted)]" />
        </div>
      )}
      <h3 className="font-semibold text-[var(--text-primary)] mb-2">{title}</h3>
      {description && <p className="text-sm text-[var(--text-secondary)] max-w-xs">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
