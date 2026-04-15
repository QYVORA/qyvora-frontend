import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative isolate min-h-[92vh] flex items-center overflow-hidden bg-[var(--bg-primary)]">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-accent/8 rounded-full blur-[120px] pointer-events-none -translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/6 rounded-full blur-[100px] pointer-events-none translate-x-1/4 translate-y-1/4" />
      <div className="cube-noise" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-28 lg:py-32">
        <div className="flex flex-col items-center text-center gap-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/40 bg-accent/8 text-accent text-xs font-mono tracking-widest backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            HSOCIETY OFFSEC
          </div>

          <div className="w-full px-2 sm:px-4 py-4 sm:py-6">
            <div className="w-full h-[16vh] sm:h-[22vh] lg:h-[30vh] flex items-center justify-center overflow-hidden">
              <img
                src="/HSOCIETY_LOGO.webp"
                alt="HSOCIETY"
                className="w-[92vw] max-w-[1800px] opacity-75 h-auto object-contain"
                loading="eager"
                decoding="async"
              />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="font-display font-black text-4xl md:text-5xl lg:text-6xl text-[var(--text-primary)] leading-[1.0] tracking-tight">
              Train Like a <span className="text-accent">Hacker.</span>
            </h1>
            <h2 className="font-display font-black text-4xl md:text-5xl lg:text-6xl text-[var(--text-primary)] leading-[1.0] tracking-tight">
              Become a <span className="text-accent">Hacker.</span>
            </h2>
          </div>

          <p className="text-[var(--text-secondary)] text-base md:text-lg max-w-3xl leading-relaxed">
              The offensive security training platform built for the next generation of African security talent.
              Train, validate, earn, and deploy.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <Link
              to="/register"
              className="btn-primary text-base px-8 py-4 rounded-xl flex items-center justify-center gap-2 group shadow-lg shadow-accent/25"
            >
              Start Training
              <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="text-base px-8 py-4 rounded-xl flex items-center justify-center font-semibold border border-[var(--border)] text-[var(--text-secondary)] hover:border-accent/40 hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-all"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--bg-primary)] to-transparent pointer-events-none" />
    </section>
  )
}
