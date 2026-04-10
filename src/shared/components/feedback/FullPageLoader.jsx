export function FullPageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
      <div className="h-loader" aria-label="Loading">
        {/* Left leg */}
        <div className="h-leg h-leg-left">
          <div className="h-beam" />
        </div>
        {/* Crossbar */}
        <div className="h-crossbar">
          <div className="h-beam" />
        </div>
        {/* Right leg */}
        <div className="h-leg h-leg-right">
          <div className="h-beam" />
        </div>
      </div>
    </div>
  )
}
