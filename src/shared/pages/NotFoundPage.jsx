import { Link, useLocation } from 'react-router-dom'

export default function NotFoundPage() {
  const location = useLocation()

  return (
    <section className="mx-auto flex min-h-[70vh] w-full max-w-5xl flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="inline-flex items-center gap-3 rounded-none border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2 text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)]">
        Page Not Found
      </div>
      <h1 className="text-4xl font-semibold text-[var(--text-primary)] sm:text-5xl">We can’t find that page</h1>
      <p className="max-w-2xl text-base text-[var(--text-secondary)] sm:text-lg">
        The route <span className="font-mono text-[var(--text-primary)]">{location.pathname}</span> doesn’t exist or has moved.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="btn-primary rounded-none px-5 py-2.5 text-sm"
        >
          Go Home
        </Link>
        <Link
          to="/login"
          className="btn-secondary rounded-none px-5 py-2.5 text-sm font-semibold"
        >
          Login
        </Link>
      </div>
    </section>
  )
}
