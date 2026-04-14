import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const PREVIEW_IMG = '/images/previews/phone-dashbord-visual.png'

export function PlatformPreviewSection() {
  return (
    <section className="relative py-24 px-6 overflow-hidden border-t border-accent/10">
      {/* Ambient glow — sits behind the image side */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-accent/8 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left — text content */}
          <div className="flex flex-col gap-6 text-center lg:text-left items-center lg:items-start">
            <p className="font-mono text-xs uppercase tracking-widest text-accent">// platform preview</p>
            <h2 className="font-display font-black text-4xl sm:text-5xl text-[var(--text-primary)] leading-[1.05]">
              Built for the<br />
              <span className="text-accent">Operator</span>
            </h2>
            <p className="text-[var(--text-secondary)] text-base leading-relaxed max-w-md">
              A clean, focused interface designed around how operators actually work — fast, precise, and distraction-free. Train on mobile or desktop, anywhere, anytime.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link
                to="/register"
                className="btn-primary px-7 py-3.5 rounded-xl inline-flex items-center justify-center gap-2 group shadow-lg shadow-accent/25"
              >
                Start Training
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            {/* Small trust indicators */}
            <div className="flex items-center gap-6 text-xs font-mono text-[var(--text-muted)] uppercase tracking-widest">
              <span>Mobile-first</span>
              <span className="w-1 h-1 rounded-full bg-accent/40" />
              <span>Dark mode</span>
              <span className="w-1 h-1 rounded-full bg-accent/40" />
              <span>Live data</span>
            </div>
          </div>

          {/* Right — 3D phone mockup */}
          <div className="flex justify-center lg:justify-end">
            <div className="platform-preview-wrapper">
              <div className="platform-preview-device">
                <img
                  src={PREVIEW_IMG}
                  alt="HSOCIETY platform on mobile"
                  className="platform-preview-img"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
