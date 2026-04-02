import { Link, useLocation } from 'react-router-dom'

export default function NotFoundPage() {
  const location = useLocation()

  return (
    <section className="mx-auto flex min-h-[70vh] w-full max-w-5xl flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/70">
        Page Not Found
      </div>
      <h1 className="text-4xl font-semibold text-white sm:text-5xl">We can’t find that page</h1>
      <p className="max-w-2xl text-base text-white/70 sm:text-lg">
        The route <span className="font-mono text-white/90">{location.pathname}</span> doesn’t exist or has moved.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
        >
          Go Home
        </Link>
        <Link
          to="/login"
          className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-white/40"
        >
          Login
        </Link>
      </div>
    </section>
  )
}
