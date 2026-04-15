export function FullPageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
      <div
        role="status"
        aria-label="Loading"
        className="spinner"
        style={{ width: 56, height: 56, borderWidth: 3 }}
      />
    </div>
  )
}
