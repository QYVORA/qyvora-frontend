import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

/* ─── Hex Stream Canvas ─── */
function HexStream() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const HEX = '0123456789ABCDEF'
    let cols, drops

    function resize() {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      cols = Math.floor(canvas.width / 18)
      drops = Array.from({ length: cols }, () => Math.random() * -50)
    }

    function draw() {
      ctx.fillStyle = 'rgba(0,0,0,0.06)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.font = '12px monospace'
      for (let i = 0; i < drops.length; i++) {
        const char = HEX[Math.floor(Math.random() * HEX.length)]
        const bright = Math.random() > 0.96
        ctx.fillStyle = bright ? '#ffffff' : '#88AD7C'
        ctx.globalAlpha = bright ? 0.9 : 0.18 + Math.random() * 0.25
        ctx.fillText(char, i * 18, drops[i] * 18)
        ctx.globalAlpha = 1
        if (drops[i] * 18 > canvas.height && Math.random() > 0.975) drops[i] = 0
        drops[i] += 0.4
      }
    }

    resize()
    window.addEventListener('resize', resize)
    const interval = setInterval(draw, 60)
    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.55 }}
    />
  )
}

/* ─── Typing Effect ─── */
function TypedLine({ text, delay = 0, className = '', style }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    let timeout = setTimeout(() => {
      let i = 0
      const iv = setInterval(() => {
        setDisplayed(text.slice(0, i + 1))
        i++
        if (i >= text.length) { clearInterval(iv); setDone(true) }
      }, 38)
      return () => clearInterval(iv)
    }, delay)
    return () => clearTimeout(timeout)
  }, [text, delay])

  return (
    <span className={className} style={style}>
      {displayed}
      {!done && <span className="animate-pulse">_</span>}
    </span>
  )
}

const formatCount = (value) => Number(value || 0).toLocaleString()

export function HeroSection({ stats, loading = false }) {
  const [ready, setReady] = useState(false)
  const liveStats = [
    { value: `${formatCount(stats?.stats?.studentsCount || stats?.stats?.learnersTrained)}`, label: 'Trained Operators' },
    { value: `${formatCount(stats?.stats?.bootcampsCount)}`, label: 'Bootcamps Live' },
    { value: `${formatCount(stats?.stats?.zeroDayProductsCount)}`, label: 'Zero-Day Products' },
    { value: `${formatCount(stats?.stats?.vulnerabilitiesIdentified)}`, label: 'Validated Findings' },
  ]

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <section
      className="relative isolate min-h-[100svh] flex flex-col justify-center overflow-hidden"
      style={{ background: '#000000' }}
    >
      {/* ── hex stream bg ── */}
      <HexStream />

      {/* ── subtle grid overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(136,173,124,0.04) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(136,173,124,0.04) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }}
      />

      {/* ── accent glow – top-left ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-120px', left: '-80px',
          width: '480px', height: '480px',
          background: 'radial-gradient(circle, rgba(136,173,124,0.10) 0%, transparent 70%)',
        }}
      />

      {/* ── main content ── */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 py-24 lg:py-32">

        {/* ── terminal status bar ── */}
        <div
          className="inline-flex items-center gap-3 mb-10 px-4 py-2 border text-xs font-mono"
          style={{
            borderColor: 'rgba(136,173,124,0.35)',
            background: 'rgba(136,173,124,0.06)',
            color: '#88AD7C',
            letterSpacing: '0.12em',
          }}
        >
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: '#88AD7C', boxShadow: '0 0 6px #88AD7C' }}
          />
          <span>HSOCIETY://OFFSEC — SYSTEM ONLINE</span>
        </div>

        {/* ── logo ── */}
        <div className="mb-8 sm:mb-10">
          <img
            src="/HSOCIETY_LOGO.webp"
            alt="HSOCIETY"
            loading="eager"
            decoding="async"
            style={{
              height: 'clamp(36px, 7vw, 72px)',
              width: 'auto',
              objectFit: 'contain',
              objectPosition: 'left center',
              opacity: 0.82,
            }}
          />
        </div>

        {/* ── headline ── */}
        <div className="mb-6 sm:mb-8">
          <h1
            className="font-mono font-black leading-none tracking-tight"
            style={{
              fontSize: 'clamp(2.4rem, 7.5vw, 6rem)',
              color: '#ffffff',
            }}
          >
            {ready && (
              <>
                <TypedLine
                  text="Train Like a Hacker."
                  delay={0}
                  className="block"
                />
                <TypedLine
                  text="Become a Hacker."
                  delay={900}
                  className="block"
                  style={{ color: '#88AD7C' }}
                />
              </>
            )}
          </h1>
        </div>

        {/* ── sub-headline ── */}
        <p
          className="max-w-2xl font-mono leading-relaxed mb-10 sm:mb-12"
          style={{
            fontSize: 'clamp(0.85rem, 1.8vw, 1.05rem)',
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          The offensive security training platform built for the next generation
          of African security talent.{' '}
          <span style={{ color: 'rgba(136,173,124,0.8)' }}>
            Train. Validate. Earn. Deploy.
          </span>
        </p>

        {/* ── CTA row ── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-16 sm:mb-20">
          <Link
            to="/register"
            className="group inline-flex items-center justify-center gap-2.5 font-mono font-semibold text-sm px-7 py-3.5 transition-all duration-200"
            style={{
              background: '#88AD7C',
              color: '#000000',
              letterSpacing: '0.06em',
              border: '1px solid #88AD7C',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#a0c490'
              e.currentTarget.style.borderColor = '#a0c490'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#88AD7C'
              e.currentTarget.style.borderColor = '#88AD7C'
            }}
          >
            START TRAINING
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-200" />
          </Link>

          <Link
            to="/login"
            className="inline-flex items-center justify-center font-mono font-medium text-sm px-7 py-3.5 transition-all duration-200"
            style={{
              background: 'transparent',
              color: 'rgba(255,255,255,0.55)',
              border: '1px solid rgba(255,255,255,0.15)',
              letterSpacing: '0.06em',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(136,173,124,0.5)'
              e.currentTarget.style.color = '#ffffff'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
              e.currentTarget.style.color = 'rgba(255,255,255,0.55)'
            }}
          >
            LOG IN
          </Link>

          <span
            className="hidden sm:inline font-mono text-xs"
            style={{ color: 'rgba(136,173,124,0.45)', letterSpacing: '0.1em' }}
          >
            — NO PREREQUISITES
          </span>
        </div>

        {/* ── stats row ── */}
        <div
          className="grid grid-cols-2 sm:grid-cols-4 gap-px"
          style={{ borderTop: '1px solid rgba(136,173,124,0.12)' }}
        >
          {(loading ? Array.from({ length: liveStats.length }, () => ({ value: '...', label: 'Loading' })) : liveStats).map(({ value, label }, i) => (
            <div
              key={i}
              className="pt-5 pr-6"
              style={{ borderRight: i < liveStats.length - 1 ? '1px solid rgba(136,173,124,0.08)' : 'none' }}
            >
              <div
                className="font-mono font-black mb-1"
                style={{
                  fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
                  color: '#88AD7C',
                  letterSpacing: '-0.02em',
                }}
              >
                {value}
              </div>
              <div
                className="font-mono text-xs"
                style={{ color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em' }}
              >
                {label.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── bottom scan line ── */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(136,173,124,0.4), transparent)',
        }}
      />

      {/* ── fade to next section ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.85))',
        }}
      />
    </section>
  )
}
